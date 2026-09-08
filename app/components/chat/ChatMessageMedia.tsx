"use client";

import { parseChatMedia } from "@/lib/chatMedia";

export default function ChatMessageMedia({ message }: { message: string }) {
  const media = parseChatMedia(message);
  if (!media) return <div>{message}</div>;
  if (media.type === "image") {
    return <a className="chatMediaLink" href={media.url} target="_blank" rel="noreferrer"><img className="chatMediaImage" src={media.url} alt={media.name || "ჩათში გამოგზავნილი ფოტო"} /></a>;
  }
  return <audio className="chatMediaAudio" controls preload="metadata" src={media.url}>თქვენი ბრაუზერი ხმოვან შეტყობინებას ვერ უკრავს.</audio>;
}
