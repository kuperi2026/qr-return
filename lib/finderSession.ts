export function getFinderSession(tagCode: string) {
  const normalizedTag = tagCode.trim().toUpperCase();
  const key = `qr-return-chat-finder-${normalizedTag}`;
  let sessionId = window.localStorage.getItem(key);

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, sessionId);
  }

  return sessionId;
}
