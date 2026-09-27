"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import InterfaceIcon from "@/app/components/ui/InterfaceIcon";
import SupportComposer from "@/app/components/support/SupportComposer";
import { SupportAttachment, SupportMessageText } from "@/app/components/support/SupportMessageContent";
type Conversation = { id:string; user_id:string; status:"open"|"closed"; auto_welcome_sent:boolean };
type Message = { id:number; conversation_id:string; sender:"user"|"support"|"auto"; message:string|null; attachment_path:string|null; attachment_name:string|null; attachment_type:string|null; created_at:string };
const FIELDS="id,conversation_id,sender,message,attachment_path,attachment_name,attachment_type,created_at";
export default function SupportPage(){
  const [ka,setKa]=useState(true);
  const [conversation,setConversation]=useState<Conversation|null>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [retry,setRetry]=useState(0);
  const bottom=useRef<HTMLDivElement>(null);
  const initial=useRef<Promise<{conversation:Conversation;messages:Message[]}>|null>(null);
  const addMessage=(message:Message)=>setMessages(current=>current.some(m=>m.id===message.id)?current:[...current,message]);
  useEffect(()=>{
    let alive=true;setLoading(true);setError("");
    async function open(){
      const {data:{session}}=await supabase.auth.getSession();
      let user=session?.user;
      if(!user){const {data,error}=await supabase.auth.signInAnonymously();if(error)throw error;user=data.user||undefined;}
      if(!user)throw new Error("No support session");
      const {data:existing,error:findError}=await supabase.from("support_conversations").select("id,user_id,status,auto_welcome_sent").eq("user_id",user.id).eq("status","open").order("created_at",{ascending:false}).limit(1).maybeSingle();
      if(findError)throw findError;
      let current=existing as Conversation|null;
      if(!current){const {data,error}=await supabase.from("support_conversations").insert({user_id:user.id}).select("id,user_id,status,auto_welcome_sent").single();if(error)throw error;current=data as Conversation;}
      const {data,error}=await supabase.from("support_messages").select(FIELDS).eq("conversation_id",current.id).order("created_at",{ascending:true});
      if(error)throw error;
      return {conversation:current,messages:(data||[]) as Message[]};
    }
    // Reuse the initialization promise across React's development effect replay.
    if(!initial.current)initial.current=open();
    initial.current.then(result=>{if(alive){setConversation(result.conversation);setMessages(result.messages);}}).catch(()=>{initial.current=null;if(alive)setError("connect");}).finally(()=>{if(alive)setLoading(false);});
    return()=>{alive=false;};
  },[retry]);
  useEffect(()=>{
    if(!conversation)return;
    const channel=supabase.channel(`support-${conversation.id}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"support_messages",filter:`conversation_id=eq.${conversation.id}`},payload=>addMessage(payload.new as Message)).on("postgres_changes",{event:"UPDATE",schema:"public",table:"support_conversations",filter:`id=eq.${conversation.id}`},payload=>setConversation(payload.new as Conversation)).subscribe(status=>{
      if(status==="SUBSCRIBED") void supabase.from("support_messages").select(FIELDS).eq("conversation_id",conversation.id).order("created_at",{ascending:true}).then(({data})=>{for(const message of data||[])addMessage(message as Message);});
    });
    return()=>{void supabase.removeChannel(channel);};
  },[conversation?.id]);
  useEffect(()=>{bottom.current?.scrollIntoView({block:"nearest"});},[messages]);
  async function send(text:string,file:File|null){
    if(!conversation||conversation.status!=="open")return false;
    setError("");
    let attachmentPath:string|null=null;
    try{
      if(file){
        const safeName=file.name.normalize("NFKD").replace(/[^\w.\-]+/g,"_").slice(-100);
        attachmentPath=`${conversation.user_id}/${conversation.id}/${crypto.randomUUID()}-${safeName}`;
        const {error}=await supabase.storage.from("support-attachments").upload(attachmentPath,file,{contentType:file.type.split(";")[0],upsert:false});
        if(error)throw error;
      }
      const {data,error}=await supabase.from("support_messages").insert({conversation_id:conversation.id,sender:"user",message:text||null,attachment_path:attachmentPath,attachment_name:file?.name||null,attachment_type:file?.type.split(";")[0]||null}).select(FIELDS).single();
      if(error)throw error;
      if(data)addMessage(data as Message);
      try { if(!conversation.auto_welcome_sent){
        const {data:claimed}=await supabase.from("support_conversations").update({auto_welcome_sent:true,updated_at:new Date().toISOString()}).eq("id",conversation.id).eq("auto_welcome_sent",false).select("id").maybeSingle();
        if(claimed){
          setConversation(current=>current?{...current,auto_welcome_sent:true}:current);
          const {data:welcome}=await supabase.from("support_messages").insert({conversation_id:conversation.id,sender:"auto",message:ka?"მოგესალმებით! მადლობა, რომ დაგვიკავშირდით. ჩვენი წარმომადგენელი მალე გიპასუხებთ.":"Hello! Thank you for contacting us. Our representative will respond shortly."}).select(FIELDS).single();
          if(welcome)addMessage(welcome as Message);
        }
      } } catch { /* The user message was saved even if the optional welcome fails. */ }
      return true;
    }catch{setError("send");return false;}
  }
  return <main className="supportWorkspace">
    <div className="supportShell"><header className="supportIntro"><div><span className="supportEyebrow">{ka?"მხარდაჭერის ცენტრი":"Support center"}</span><h1>{ka?"ონლაინ ჩათი":"Online chat"}</h1></div><div className="supportLanguages"><button type="button" aria-pressed={ka} onClick={()=>setKa(true)}>ქარ</button><button type="button" aria-pressed={!ka} onClick={()=>setKa(false)}>ENG</button></div></header>
    <section className="supportConversation" aria-label={ka?"მხარდაჭერის მიმოწერა":"Support conversation"}>
      <header className="supportChatHead"><span className="supportAvatar"><InterfaceIcon name="chat" size={24}/></span><div><strong>QR RETURN</strong><small>{ka?"მხარდაჭერის გუნდი":"Support team"}</small></div><Link href="/book-call" title={ka?"ზარის დაჯავშნა":"Book a call"} aria-label={ka?"ზარის დაჯავშნა":"Book a call"}><InterfaceIcon name="phone" size={18}/><span>{ka?"ზარის დაჯავშნა":"Book a call"}</span></Link></header>
      <div className="supportMessages" role="log" aria-label={ka?"შეტყობინებები":"Messages"} aria-live="polite" aria-busy={loading}>
        {loading?<div className="supportLoading" role="status">{ka?"ჩათი იტვირთება…":"Loading chat…"}</div>:messages.length===0?<div className="supportEmpty"><div className="emptyCard"><span><InterfaceIcon name="chat" size={30}/></span><h2>{ka?"მოგესალმებით!":"Welcome!"}</h2><p>{ka?"რით შეგვიძლია დაგეხმაროთ? მოგვწერეთ, გამოგვიგზავნეთ ფოტო ან ხმოვანი შეტყობინება.":"How can we help? Send us a message, photo or voice note."}</p></div></div>:null}
        {messages.map(message=><div key={message.id} className={`supportMessageRow ${message.sender==="user"?"isMine":""}`}><article className="supportBubble"><small className="messageSender">{message.sender==="user"?(ka?"თქვენ":"You"):"QR RETURN"}</small>{message.message&&<SupportMessageText text={message.message}/>} {message.attachment_path&&<SupportAttachment path={message.attachment_path} name={message.attachment_name||"File"} type={message.attachment_type} ka={ka}/>}<time dateTime={message.created_at}>{new Date(message.created_at).toLocaleTimeString(ka?"ka-GE":"en-US",{hour:"2-digit",minute:"2-digit"})}</time></article></div>)}<div ref={bottom}/>
      </div>
      {error&&<div className="supportError" role="alert">{error==="connect"?(ka?"ჩათთან დაკავშირება ვერ მოხერხდა.":"Could not connect to chat."):(ka?"გაგზავნა ვერ მოხერხდა. თქვენი ტექსტი და ფაილი შენახულია — სცადეთ თავიდან.":"Sending failed. Your draft is kept; please try again.")}{error==="connect"&&<button type="button" onClick={()=>{initial.current=null;setRetry(x=>x+1);}}>{ka?"ხელახლა ცდა":"Retry"}</button>}</div>}
      {conversation?.status==="closed"?<div className="supportError">{ka?"ეს მიმოწერა დასრულებულია.":"This conversation is closed."}<button type="button" onClick={()=>{initial.current=null;setConversation(null);setRetry(x=>x+1);}}>{ka?"ახალი ჩათი":"New chat"}</button></div>:<SupportComposer ka={ka} disabled={loading||!conversation} onSend={send}/>}
    </section><a className="supportEmail" href="mailto:hello@qrreturn.com">hello@qrreturn.com</a></div>
    <style jsx>{`
      .supportWorkspace{box-sizing:border-box;min-height:calc(100svh - 56px);padding:35px 24px 40px;background:#f3f6f9;color:#17354c;font-family:var(--font-georgian),Arial,sans-serif}.supportWorkspace *{box-sizing:border-box}.supportShell{max-width:840px;margin:auto}.supportIntro{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.supportEyebrow{font-size:10px;line-height:1.7;color:#537286;font-weight:500}.supportIntro h1{font-size:26px;line-height:1.6;font-weight:600;letter-spacing:-.4px;margin:4px 0 0}.supportLanguages{display:flex;gap:3px;padding:4px;border:1px solid #dce5ec;border-radius:10px;background:#ebf0f4}.supportLanguages button{border:0;background:transparent;border-radius:7px;min-width:39px;min-height:31px;font:inherit;font-size:10px;color:#698091;cursor:pointer}.supportLanguages button[aria-pressed=true]{background:#fff;color:#23475f;box-shadow:0 2px 5px #183a4f0c}
      .supportConversation{border:1px solid #d7e2eb;border-radius:22px;background:#fff;box-shadow:0 16px 45px #1d426011;overflow:hidden}.supportChatHead{display:flex;align-items:center;gap:13px;padding:20px 24px;background:#143650;color:#fff;border-bottom:1px solid #143650}.supportAvatar{display:grid;place-items:center;width:43px;height:43px;flex:0 0 43px;background:#ffffff10;border:1px solid #ffffff1d;border-radius:13px;color:#aae0ce}.supportChatHead>div{flex:1;min-width:0}.supportChatHead strong{font-family:Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:.035em;line-height:1.6}.supportChatHead small{display:block;color:#bed0dd;font-size:10px;line-height:1.7;margin-top:2px}.supportChatHead :global(a){box-sizing:border-box;display:flex;align-items:center;gap:9px;min-height:37px;padding:8px 12px;border:1px solid #ffffff2e;border-radius:9px;background:#ffffff09;color:#deecef;text-decoration:none;font-size:10px;line-height:1.6}.supportChatHead :global(a:hover){background:#ffffff16}.supportMessages{height:clamp(290px,37vh,370px);padding:24px;overflow-y:auto;overscroll-behavior:contain;background:#f7f9fb;background-image:radial-gradient(#c9d7e440 .8px,transparent .8px);background-size:18px 18px}.supportLoading{height:100%;display:grid;place-items:center;font-size:13px;color:#647d91}.supportEmpty{height:100%;min-height:225px;display:flex;align-items:center;justify-content:center;text-align:center}.emptyCard{width:100%;max-width:340px;border:1px solid #e5edf3;border-radius:18px;padding:26px 24px;background:#ffffffed;box-shadow:0 8px 22px #20415d05}.emptyCard>span{height:50px;width:50px;display:grid;place-items:center;margin:auto;border-radius:15px;background:#e4f2eb;color:#377e64}.emptyCard h2{font-size:18px;font-weight:600;line-height:1.6;margin:18px 0 8px;color:#23445d}.emptyCard p{font-size:12px;line-height:1.9;margin:0;color:#6b8192}
      .supportMessageRow{display:flex;margin:0 0 14px}.supportMessageRow.isMine{justify-content:flex-end}.supportBubble{max-width:85%;min-width:100px;padding:13px 16px;background:#fff;border:1px solid #e1e8ef;border-radius:15px 15px 15px 4px;font-size:14px;overflow:hidden}.isMine .supportBubble{background:#e6f3ec;border-color:#d0e7db;border-radius:15px 15px 4px 15px}.messageSender{display:block;color:#617c93;font-size:10px;margin-bottom:5px}.supportBubble time{display:block;text-align:right;font-size:10px;color:#70869a;margin-top:8px}.supportError{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:12px 20px;color:#a33c4b;background:#fff3f4;font-size:12px;line-height:1.8}.supportError button{padding:8px 12px;background:#fff;border:1px solid #e7c8ce;border-radius:8px;color:inherit;font:inherit;cursor:pointer}.supportEmail{display:block;width:max-content;max-width:100%;margin:19px auto 0;text-align:center;font-family:Arial,sans-serif;color:#72889a;font-size:12px;text-decoration:none;line-height:1.6}.supportEmail:hover{text-decoration:underline}.supportLanguages button:focus-visible,.supportError button:focus-visible,.supportWorkspace :global(a:focus-visible){outline:2px solid #74bca5;outline-offset:3px}
      @media(max-width:540px){.supportWorkspace{padding:20px 12px 25px}.supportIntro{margin:0 4px 17px}.supportIntro h1{font-size:23px;margin-top:2px}.supportLanguages button{min-width:33px;min-height:29px}.supportChatHead{padding:16px;gap:11px}.supportChatHead :global(a){width:37px;padding:8px;justify-content:center}.supportChatHead :global(a span){display:none}.supportMessages{padding:18px 15px;height:clamp(270px,36svh,360px)}.emptyCard{max-width:285px;padding:23px 20px}.emptyCard h2{font-size:17px}.emptyCard p{font-size:11px;line-height:1.9}.supportEmpty{min-height:230px}.supportBubble{max-width:92%}.supportConversation{border-radius:18px}.supportEmail{font-size:11px;margin-top:16px}}
    `}</style>
  </main>;
}
