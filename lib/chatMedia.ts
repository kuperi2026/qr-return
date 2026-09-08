export type ChatMedia = {
  type: "image" | "audio";
  url: string;
  name?: string;
};

const PREFIX = "[[QR_RETURN_MEDIA:";

export function encodeChatMedia(media: ChatMedia) {
  return `${PREFIX}${media.type}:${encodeURIComponent(media.url)}:${encodeURIComponent(media.name || "") }]]`;
}

export function parseChatMedia(value: string): ChatMedia | null {
  const match = value.match(/^\[\[QR_RETURN_MEDIA:(image|audio):([^:]+):(.*?)\]\]$/);
  if (!match) return null;
  try {
    return { type: match[1] as ChatMedia["type"], url: decodeURIComponent(match[2]), name: decodeURIComponent(match[3] || "") };
  } catch {
    return null;
  }
}
