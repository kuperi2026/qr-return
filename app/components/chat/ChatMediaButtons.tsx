"use client";

import { ChangeEvent, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { encodeChatMedia } from "@/lib/chatMedia";

const BUCKET = "chat-media";
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_AUDIO = 10 * 1024 * 1024;

export default function ChatMediaButtons({ tagCode, sessionId, disabled, onSend, onError }: {
  tagCode: string; sessionId: string; disabled?: boolean;
  onSend: (encodedMessage: string) => Promise<boolean>;
  onError: (message: string) => void;
}) {
  const photoRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);

  async function upload(file: File | Blob, type: "image" | "audio", name: string) {
    const limit = type === "image" ? MAX_IMAGE : MAX_AUDIO;
    if (file.size > limit) { onError(type === "image" ? "ფოტოს მაქსიმალური ზომაა 5 MB." : "ხმოვანი შეტყობინების მაქსიმალური ზომაა 10 MB."); return; }
    setUploading(true); onError("");
    const ext = name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || (type === "image" ? "jpg" : "webm");
    const safeTag = tagCode.replace(/[^a-z0-9_-]/gi, "-");
    const safeSession = sessionId.replace(/[^a-z0-9_-]/gi, "-");
    const path = `${safeTag}/${safeSession}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (error) { onError(`ფაილი ვერ გაიგზავნა: ${error.message}`); setUploading(false); return; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const sent = await onSend(encodeChatMedia({ type, url: data.publicUrl, name }));
    if (!sent) await supabase.storage.from(BUCKET).remove([path]);
    setUploading(false);
  }

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError("აირჩიეთ ფოტოს ფაილი."); return; }
    await upload(file, "image", file.name);
  }

  async function toggleRecording() {
    if (recording) { recorderRef.current?.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { onError("ამ ბრაუზერში ხმოვანი შეტყობინება არ არის მხარდაჭერილი."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        setRecording(false); streamRef.current?.getTracks().forEach((track) => track.stop());
        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        if (blob.size) await upload(blob, "audio", `ხმოვანი-${Date.now()}.webm`);
      };
      recorder.start(); setRecording(true); onError("");
    } catch { onError("მიკროფონზე წვდომა ვერ მივიღეთ. ბრაუზერში მიკროფონის ნებართვა ჩართეთ."); }
  }

  const busy = disabled || uploading;
  return <>
    <input ref={photoRef} className="chatMediaInput" type="file" accept="image/*" onChange={choosePhoto} />
    <button type="button" className="mediaButton" disabled={busy || recording} onClick={() => photoRef.current?.click()} aria-label="ფოტოს გაგზავნა">{uploading ? "…" : "📷"}</button>
    <button type="button" className={`mediaButton ${recording ? "recording" : ""}`} disabled={busy && !recording} onClick={() => void toggleRecording()} aria-label={recording ? "ჩაწერის დასრულება" : "ხმოვანი შეტყობინება"}>{recording ? "■" : "🎙️"}</button>
  </>;
}
