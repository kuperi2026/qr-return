"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export function SupportMessageText({ text }: { text: string }) {
  const parts=text.split(/(https:\/\/www\.google\.com\/maps\?q=-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)/g);
  return <div style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",lineHeight:1.7}}>{parts.map((part,i)=>/^https:\/\/www\.google\.com\/maps\?q=/.test(part)?<a key={i} href={part} target="_blank" rel="noreferrer" style={{color:"inherit",textDecoration:"underline",textUnderlineOffset:3}}>📍 {part}</a>:part)}</div>;
}
export function SupportAttachment({ path, name, type, ka = true }: { path:string; name:string; type:string|null; ka?:boolean }) {
  const [url,setUrl]=useState("");
  const [error,setError]=useState(false);
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    let alive=true;setUrl("");setError(false);
    supabase.storage.from("support-attachments").createSignedUrl(path,3600).then(({data,error})=>{if(alive){setUrl(data?.signedUrl||"");setError(Boolean(error));}}).catch(()=>{if(alive)setError(true);});
    return()=>{alive=false;};
  },[path,attempt]);
  if(!url) return <div style={{marginTop:8,fontSize:13}}>{error?<button type="button" onClick={()=>setAttempt(x=>x+1)}>{ka?"ფაილის ხელახლა ჩატვირთვა":"Retry attachment"}</button>:(ka?"ფაილი იტვირთება…":"Loading attachment…")}</div>;
  if(type?.startsWith("audio/"))return <audio controls preload="metadata" src={url} aria-label={ka?"ხმოვანი შეტყობინება":"Voice message"} style={{display:"block",width:280,maxWidth:"100%",marginTop:8}}/>;
  if(type?.startsWith("image/"))return <a href={url} target="_blank" rel="noreferrer"><img src={url} alt={name} style={{display:"block",maxWidth:"100%",maxHeight:260,borderRadius:12,marginTop:8,objectFit:"contain"}}/></a>;
  return <a href={url} target="_blank" rel="noreferrer" style={{display:"block",marginTop:8,color:"inherit",overflowWrap:"anywhere"}}>📎 {name}</a>;
}
