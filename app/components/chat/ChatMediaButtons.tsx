"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  const discardRecordingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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

  async function startRecording() {
    if (recording || disabled || uploading) return;
    discardRecordingRef.current = false;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { onError("ამ ბრაუზერში ხმოვანი შეტყობინება არ არის მხარდაჭერილი."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setRecording(false); setRecordingSeconds(0);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        if (!discardRecordingRef.current && blob.size) {
          await upload(blob, "audio", `ხმოვანი-${Date.now()}.webm`);
        }
      };
      recorder.start(); setRecording(true); setRecordingSeconds(0); onError("");
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch { onError("მიკროფონზე წვდომა ვერ მივიღეთ. ბრაუზერში მიკროფონის ნებართვა ჩართეთ."); }
  }

  function stopRecording(send: boolean) {
    discardRecordingRef.current = !send;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  function formatRecordingTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  }

  const busy = disabled || uploading;
  return <>
    <input ref={photoRef} className="chatMediaInput" type="file" accept="image/*" onChange={choosePhoto} />
    <button type="button" className="mediaButton" disabled={busy || recording} onClick={() => photoRef.current?.click()} aria-label="ფოტოს გაგზავნა">{uploading ? "…" : "📷"}</button>
    {!recording ? (
      <button
        type="button"
        className="mediaButton"
        disabled={busy}
        onClick={() => void startRecording()}
        aria-label="ხმოვანი შეტყობინების ჩაწერა"
        title="დააჭირეთ ერთხელ ჩაწერის დასაწყებად"
      >🎙️</button>
    ) : (
      <div className="voiceRecordingControls" role="status" aria-label="ხმოვანი შეტყობინება იწერება">
        <span className="voiceRecordingTime">● {formatRecordingTime(recordingSeconds)}</span>
        <button type="button" className="voiceCancelButton" onClick={() => stopRecording(false)} aria-label="ჩაწერის გაუქმება">✕</button>
        <button type="button" className="voiceSendButton" onClick={() => stopRecording(true)} aria-label="ხმოვანი შეტყობინების გაგზავნა">➤</button>
      </div>
    )}
    <style jsx>{`
      .voiceRecordingControls { min-height: 48px; padding: 5px 6px 5px 12px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #fecaca; border-radius: 999px; background: #fff1f2; }
      .voiceRecordingTime { min-width: 52px; color: #dc2626; font-size: 13px; font-weight: 900; font-variant-numeric: tabular-nums; }
      .voiceRecordingControls button { width: 38px; min-height: 38px; padding: 0; display: grid; place-items: center; border: 0; border-radius: 50%; cursor: pointer; font-size: 16px; font-weight: 900; }
      .voiceCancelButton { background: #ffffff; color: #64748b; }
      .voiceSendButton { background: #1266e9; color: #ffffff; }
    `}</style>
  </>;
}
