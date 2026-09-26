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
    <div className="supportShell"><header className="supportIntro"><div><span className="supportEyebrow">QR RETURN · SUPPORT</span><h1>{ka?"ონლაინ ჩათი":"Online chat"}</h1><p>{ka?"მოგვწერეთ — ჩვენი გუნდი დაგეხმარებათ.":"Send us a message. Our team will help."}</p></div><div className="supportLanguages"><button type="button" aria-pressed={ka} onClick={()=>setKa(true)}>ქარ</button><button type="button" aria-pressed={!ka} onClick={()=>setKa(false)}>ENG</button></div></header>
    <section className="supportConversation" aria-label={ka?"მხარდაჭერის მიმოწერა":"Support conversation"}>
      <header className="supportChatHead"><span className="supportAvatar"><InterfaceIcon name="chat" size={24}/></span><div><strong>{ka?"QR RETURN მხარდაჭერა":"QR RETURN Support"}</strong><small>{ka?"თქვენი შეტყობინებები ერთ სივრცეში":"Your messages in one place"}</small></div><Link href="/book-call" title={ka?"ზარის დაჯავშნა":"Book a call"} aria-label={ka?"ზარის დაჯავშნა":"Book a call"}><InterfaceIcon name="phone"/></Link></header>
      <div className="supportMessages" role="log" aria-label={ka?"შეტყობინებები":"Messages"} aria-live="polite" aria-busy={loading}>
        {loading?<div className="supportEmpty" role="status">{ka?"ჩათი იტვირთება…":"Loading chat…"}</div>:messages.length===0?<div className="supportEmpty"><span><InterfaceIcon name="chat" size={30}/></span><h2>{ka?"რით შეგვიძლია დაგეხმაროთ?":"How can we help?"}</h2><p>{ka?"გამოგვიგზავნეთ შეტყობინება, ფოტო ან ხმოვანი ჩანაწერი.":"Send a message, photo or voice note."}</p></div>:null}
        {messages.map(message=><div key={message.id} className={`supportMessageRow ${message.sender==="user"?"isMine":""}`}><article className="supportBubble"><small className="messageSender">{message.sender==="user"?(ka?"თქვენ":"You"):"QR RETURN"}</small>{message.message&&<SupportMessageText text={message.message}/>} {message.attachment_path&&<SupportAttachment path={message.attachment_path} name={message.attachment_name||"File"} type={message.attachment_type} ka={ka}/>}<time dateTime={message.created_at}>{new Date(message.created_at).toLocaleTimeString(ka?"ka-GE":"en-US",{hour:"2-digit",minute:"2-digit"})}</time></article></div>)}<div ref={bottom}/>
      </div>
      {error&&<div className="supportError" role="alert">{error==="connect"?(ka?"ჩათთან დაკავშირება ვერ მოხერხდა.":"Could not connect to chat."):(ka?"გაგზავნა ვერ მოხერხდა. თქვენი ტექსტი და ფაილი შენახულია — სცადეთ თავიდან.":"Sending failed. Your draft is kept; please try again.")}{error==="connect"&&<button type="button" onClick={()=>{initial.current=null;setRetry(x=>x+1);}}>{ka?"ხელახლა ცდა":"Retry"}</button>}</div>}
      {conversation?.status==="closed"?<div className="supportError">{ka?"ეს მიმოწერა დასრულებულია.":"This conversation is closed."}<button type="button" onClick={()=>{initial.current=null;setConversation(null);setRetry(x=>x+1);}}>{ka?"ახალი ჩათი":"New chat"}</button></div>:<SupportComposer ka={ka} disabled={loading||!conversation} onSend={send}/>}
    </section><p className="supportFootnote">{ka?"მდებარეობა და ხმოვანი ჩანაწერი მხოლოდ თქვენი არჩევანით იგზავნება.":"Location and voice notes are shared only when you choose to send them."}</p><a className="supportEmail" href="mailto:hello@qrreturn.com">hello@qrreturn.com</a></div>
    <style jsx>{`
      .supportEmail{display:block;text-align:center;margin-top:8px;color:#55758f;font-size:13px;text-decoration:underline;text-underline-offset:3px}.supportWorkspace{min-height:calc(100svh - 56px);padding:34px 20px 48px;background:#f3f6fa;color:#193951;font-family:var(--font-georgian),Arial,sans-serif}.supportWorkspace *{box-sizing:border-box}.supportShell{max-width:800px;margin:auto}.supportIntro{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.supportEyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;color:#637e98}.supportIntro h1{margin:9px 0;font-size:28px;line-height:1.5;font-weight:600}.supportIntro p{margin:0;font-size:14px;line-height:1.7;color:#63788b}.supportLanguages{display:flex;gap:4px;background:#e7edf4;padding:4px;border-radius:10px}.supportLanguages button{border:0;min-width:40px;min-height:34px;font-size:12px;border-radius:7px;color:#607489;background:transparent;cursor:pointer}.supportLanguages button[aria-pressed=true]{background:#fff;color:#244c71;box-shadow:0 2px 4px #1635520b}.supportConversation{overflow:hidden;border:1px solid #dbe5ef;border-radius:22px;background:#fff;box-shadow:0 16px 40px #1539530b}.supportChatHead{padding:20px 24px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #e4ebf2}.supportAvatar{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:#eaf2f9;color:#315c81}.supportChatHead>div{flex:1;min-width:0}.supportChatHead strong{font-size:15px;font-weight:600;line-height:1.6}.supportChatHead small{display:block;font-size:12px;color:#72869a;margin-top:3px}.supportChatHead :global(a){width:40px;height:40px;display:grid;place-items:center;border-radius:10px;color:#315c81;background:#f3f6fa}.supportMessages{height:clamp(260px,43vh,460px);padding:24px;overflow-y:auto;overscroll-behavior:contain;background:#fafcfe}.supportEmpty{height:100%;min-height:210px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;color:#6f8396}.supportEmpty>span{height:64px;width:64px;display:grid;place-items:center;border:1px solid #e1e9f1;background:#fff;border-radius:20px;color:#8096aa}.supportEmpty h2{margin:20px 0 8px;color:#35556e;font-size:18px;font-weight:600;line-height:1.6}.supportEmpty p{max-width:340px;font-size:14px;line-height:1.8;margin:0}.supportMessageRow{display:flex;margin:0 0 14px}.supportMessageRow.isMine{justify-content:flex-end}.supportBubble{max-width:85%;min-width:100px;padding:13px 16px;background:#fff;border:1px solid #e1e8ef;border-radius:15px 15px 15px 4px;font-size:14px;overflow:hidden}.isMine .supportBubble{background:#eaf2f9;border-color:#dbe7f1;border-radius:15px 15px 4px 15px}.messageSender{display:block;color:#617c93;font-size:11px;margin-bottom:5px}.supportBubble time{display:block;text-align:right;font-size:10px;color:#70869a;margin-top:8px}.supportError{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:12px 20px;color:#a33c4b;background:#fff3f4;font-size:13px;line-height:1.7}.supportError button{padding:8px 12px;background:#fff;border:1px solid #e7c8ce;border-radius:8px;color:inherit;font:inherit;cursor:pointer}.supportFootnote{font-size:12px;line-height:1.8;text-align:center;color:#73889a;margin:16px 12px 0}@media(max-width:540px){.supportWorkspace{padding:23px 12px 30px}.supportIntro{margin-bottom:18px}.supportIntro h1{font-size:24px}.supportIntro p{font-size:13px}.supportLanguages{align-self:flex-start}.supportChatHead{padding:16px 14px;gap:11px}.supportChatHead strong{font-size:13px}.supportChatHead small{font-size:11px}.supportMessages{padding:16px 12px;height:40svh;min-height:240px}.supportBubble{max-width:92%}.supportConversation{border-radius:18px}.supportEyebrow{font-size:10px}}
    `}</style>
  </main>;
}
