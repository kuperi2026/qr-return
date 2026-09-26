"use client";
import { useEffect, useRef, useState } from "react";
import InterfaceIcon from "../ui/InterfaceIcon";
const EMOJIS = ["😊", "🙂", "👋", "👍", "❤️", "🙏", "👏", "🎉", "✅", "🤔", "😔", "📍", "🐶", "🐱", "🔑", "🧳"];
const TYPES = ["image/jpeg","image/png","image/webp","image/gif","application/pdf","text/plain","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export default function SupportComposer({ ka, disabled, onSend }: { ka: boolean; disabled?: boolean; onSend: (text: string, file: File | null) => Promise<boolean> }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [locating, setLocating] = useState(false);
  const [recording, setRecording] = useState(false);
  const [requestingMic, setRequestingMic] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const alive = useRef(true);
  const discard = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; discard.current = true; if (timer.current) clearInterval(timer.current); if (recorder.current?.state === "recording") recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); };
  }, []);
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const busy = Boolean(disabled || sending || recording || requestingMic || locating);
  function chooseFile(next: File) {
    if (next.size > 5 * 1024 * 1024) { setError(ka ? "ფაილის მაქსიმალური ზომაა 5 MB." : "Maximum file size is 5 MB."); return; }
    if (!TYPES.includes(next.type) && !next.type.startsWith("audio/")) { setError(ka ? "აირჩიეთ JPG, PNG, WEBP, GIF, PDF ან დოკუმენტი." : "Choose a JPG, PNG, WEBP, GIF, PDF or document."); return; }
    setFile(next); setError("");
  }
  function stopRecording(keep: boolean) { discard.current = !keep; if (recorder.current?.state === "recording") recorder.current.stop(); }
  async function startRecording() {
    if (busy) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setError(ka ? "ამ ბრაუზერს ხმოვანი ჩაწერის მხარდაჭერა არ აქვს." : "Voice recording is unavailable in this browser."); return; }
    setRequestingMic(true);setError("");setEmojiOpen(false);
    try {
      const audio = await navigator.mediaDevices.getUserMedia({audio:true});
      if (!alive.current) { audio.getTracks().forEach(t=>t.stop()); return; }
      stream.current = audio; discard.current = false;
      const mimeType = ["audio/webm;codecs=opus","audio/mp4","audio/ogg;codecs=opus"].find(t=>MediaRecorder.isTypeSupported(t));
      const next = new MediaRecorder(audio, mimeType ? {mimeType} : undefined);
      recorder.current = next;
      const chunks: Blob[] = [];
      let bytes = 0;
      next.ondataavailable = e => { if (e.data.size) { chunks.push(e.data); bytes += e.data.size; if (bytes > 4.8 * 1024 * 1024 && next.state === "recording") next.stop(); } };
      next.onstop = () => {
        if (timer.current) clearInterval(timer.current);
        audio.getTracks().forEach(t=>t.stop());
        if (!alive.current) return;
        setRecording(false);setSeconds(0);
        if (!discard.current && chunks.length) {
          const mime = next.mimeType || "audio/webm";
          const extension = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
          chooseFile(new File(chunks, `voice-${Date.now()}.${extension}`, {type:mime}));
        }
      };
      next.onerror = () => { discard.current = true; stopRecording(false); audio.getTracks().forEach(t=>t.stop()); if(timer.current) clearInterval(timer.current);setRecording(false);setError(ka ? "ხმის ჩაწერა ვერ მოხერხდა. სცადეთ თავიდან." : "Recording failed. Please try again."); };
      next.start(1000); setRecording(true);setSeconds(0);
      let elapsed=0; timer.current=setInterval(()=>{elapsed++;setSeconds(elapsed);if(elapsed>=120) stopRecording(true);},1000);
    } catch { stream.current?.getTracks().forEach(t=>t.stop()); setError(ka ? "მიკროფონზე წვდომა ვერ მივიღეთ. შეამოწმეთ ბრაუზერის ნებართვა." : "Microphone access was denied. Check your browser permissions."); }
    finally { if(alive.current) setRequestingMic(false); }
  }
  function shareLocation() {
    if (busy) return;
    if (!navigator.geolocation) { setError(ka ? "ბრაუზერს მდებარეობის გაზიარება არ შეუძლია." : "Location is unavailable in this browser."); return; }
    setLocating(true);setError("");setEmojiOpen(false);
    navigator.geolocation.getCurrentPosition(position=>{
      if(!alive.current) return;
      const {latitude,longitude}=position.coords;
      const draft = `${ka ? "ჩემი მდებარეობა" : "My location"}: https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
      if (text.length + draft.length + 1 > 2000) { setError(ka ? "მდებარეობის დასამატებლად შეამოკლეთ შეტყობინება." : "Shorten your message before adding a location."); } else { setText(current => `${current}\n${draft}`.trim()); } setLocating(false);
    },()=>{if(alive.current){setError(ka ? "მდებარეობა ვერ განისაზღვრა. შეამოწმეთ ნებართვა და სცადეთ თავიდან." : "Could not get your location. Check permission and try again.");setLocating(false);}}, {enableHighAccuracy:true,timeout:12000,maximumAge:0});
  }
  async function submit() {
    if(busy || (!text.trim() && !file)) return;
    setSending(true);setError("");
    try { if(await onSend(text.trim(),file)){setText("");setFile(null);setEmojiOpen(false);textarea.current?.focus();} }
    catch { setError(ka ? "გაგზავნა ვერ მოხერხდა. შეტყობინება შენახულია — სცადეთ თავიდან." : "Sending failed. Your draft is kept; please try again."); }
    finally { if(alive.current) setSending(false); }
  }
  return <form className="supportComposer" onSubmit={e=>{e.preventDefault();void submit();}}>
    {file && <div className="draftAttachment">
      {file.type.startsWith("image/") && preview ? <img src={preview} alt={ka ? "არჩეული ფოტო" : "Selected photo"}/> : file.type.startsWith("audio/") && preview ? <audio src={preview} controls aria-label={ka ? "ხმოვანი შეტყობინების მოსმენა" : "Preview voice message"}/> : <span>{file.name}</span>}
      <button type="button" disabled={sending} onClick={()=>setFile(null)} aria-label={ka ? "ფაილის წაშლა" : "Remove attachment"}><InterfaceIcon name="close" size={18}/></button>
    </div>}
    {error && <p className="composerError" role="alert">{error}</p>}
    {recording ? <div className="recording" role="status"><span><i/>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</span><small>{ka ? "მიმდინარეობს ჩაწერა" : "Recording"}</small><button type="button" onClick={()=>stopRecording(false)} aria-label={ka ? "ჩაწერის გაუქმება" : "Cancel recording"}><InterfaceIcon name="close"/></button><button type="button" onClick={()=>stopRecording(true)} aria-label={ka ? "ჩაწერის დასრულება" : "Finish recording"}><InterfaceIcon name="stop"/></button></div> : <textarea ref={textarea} value={text} maxLength={2000} disabled={sending} rows={2} aria-label={ka ? "შეტყობინება" : "Message"} placeholder={ka ? "დაწერეთ შეტყობინება…" : "Write a message…"} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void submit();}if(e.key==="Escape")setEmojiOpen(false);}}/>}
    {emojiOpen && <div className="emojiPicker" aria-label={ka ? "სმაილები" : "Emojis"}>{EMOJIS.map(emoji=><button key={emoji} type="button" aria-label={emoji} onClick={()=>{const at=textarea.current?.selectionStart??text.length;const end=textarea.current?.selectionEnd??at;const next=(text.slice(0,at)+emoji+text.slice(end)).slice(0,2000);setText(next);setEmojiOpen(false);requestAnimationFrame(()=>{textarea.current?.focus();textarea.current?.setSelectionRange(at+emoji.length,at+emoji.length);});}}>{emoji}</button>)}</div>}
    <div className="composerToolbar"><div className="composerTools">
      <input ref={input} type="file" accept={TYPES.join(",")} hidden onChange={e=>{const next=e.target.files?.[0];e.target.value="";if(next)chooseFile(next);}}/>
      <button type="button" disabled={busy} title={ka ? "ფოტო / ფაილი" : "Photo / file"} aria-label={ka ? "ფოტოს ატვირთვა" : "Upload photo"} onClick={()=>input.current?.click()}><InterfaceIcon name="image"/></button>
      <button type="button" disabled={busy} title={ka ? "ხმოვანი შეტყობინება" : "Voice message"} aria-label={ka ? "ხმოვანი შეტყობინების ჩაწერა" : "Record voice message"} onClick={()=>void startRecording()}><InterfaceIcon name="mic"/></button>
      <button type="button" disabled={busy} title={ka ? "მდებარეობა" : "Location"} aria-label={ka ? "მდებარეობის გაზიარება" : "Share location"} onClick={shareLocation}><InterfaceIcon name="pin"/></button>
      <button type="button" disabled={busy} title={ka ? "სმაილები" : "Emojis"} aria-label={ka ? "სმაილები" : "Emojis"} aria-expanded={emojiOpen} onClick={()=>setEmojiOpen(!emojiOpen)}><InterfaceIcon name="smile"/></button>
    </div><button className="sendMessage" type="submit" disabled={busy||(!text.trim()&&!file)} aria-label={ka ? "გაგზავნა" : "Send"}><span>{sending ? (ka ? "იგზავნება…" : "Sending…") : (ka ? "გაგზავნა" : "Send")}</span><InterfaceIcon name="send" size={18}/></button></div>
    {(locating||requestingMic) && <p className="pending" role="status">{locating ? (ka ? "მდებარეობის განსაზღვრა…" : "Getting location…") : (ka ? "მიკროფონის ნებართვის მოლოდინი…" : "Waiting for microphone permission…")}</p>}
    <style jsx>{`
      .supportComposer{padding:18px 20px 16px;background:#fff;border-top:1px solid #e1e9f1;font-family:var(--font-georgian),Arial,sans-serif}.supportComposer *{box-sizing:border-box}.supportComposer textarea{display:block;width:100%;resize:vertical;min-height:76px;max-height:180px;padding:12px 14px;border:1px solid #dce5ef;border-radius:13px;background:#f8fafc;font:inherit;font-size:15px;line-height:1.6;color:#193951;outline:none}.supportComposer textarea:focus{border-color:#648bad;box-shadow:0 0 0 3px #e9f1f8}.composerToolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}.composerTools{display:flex;gap:4px}.supportComposer button{font:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:10px;min-height:40px;min-width:40px;background:#f2f6fa;color:#43637e}.supportComposer button:hover{background:#e7eff7}.supportComposer button:focus-visible{outline:2px solid #245da1;outline-offset:2px}.supportComposer button:disabled{opacity:.45;cursor:not-allowed}.supportComposer .sendMessage{gap:9px;padding:0 16px;background:#174c78;color:#fff;font-size:14px;min-height:42px}.supportComposer .sendMessage:hover{background:#123b60}.emojiPicker{margin-top:12px;padding:10px;display:grid;grid-template-columns:repeat(8,1fr);gap:3px;border:1px solid #e1e9f1;border-radius:13px;background:#fbfcfe}.emojiPicker button{font-size:23px;min-width:0;background:transparent}.draftAttachment{margin-bottom:12px;padding:10px;display:flex;gap:10px;align-items:center;justify-content:space-between;border:1px solid #dce5ef;border-radius:12px;overflow:hidden}.draftAttachment img{max-height:110px;max-width:calc(100% - 50px);border-radius:8px;object-fit:contain}.draftAttachment audio{width:calc(100% - 50px);min-width:0}.draftAttachment span{min-width:0;overflow-wrap:anywhere;font-size:13px}.composerError{margin:0 0 12px;color:#a83445;background:#fff3f4;padding:10px 12px;border-radius:9px;font-size:13px;line-height:1.6}.recording{display:flex;align-items:center;gap:9px;min-height:76px;padding:10px;background:#fff5f5;border-radius:12px;color:#a43141}.recording span{display:flex;gap:8px;align-items:center;font-variant-numeric:tabular-nums}.recording i{width:8px;height:8px;border-radius:50%;background:#c44a5a}.recording small{flex:1;font-size:12px}.pending{margin:10px 0 0;color:#637c93;font-size:12px}@media(max-width:500px){.supportComposer{padding:14px 12px}.composerToolbar{gap:6px}.composerTools{gap:2px}.supportComposer .sendMessage{padding:0 12px}.sendMessage span{display:none}.emojiPicker{grid-template-columns:repeat(8,1fr)}.emojiPicker button{font-size:21px;min-height:36px}}
    `}</style>
  </form>;
}
