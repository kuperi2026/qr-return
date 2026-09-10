import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    const consent = form.get("consent") === "true";

    if (!consent) {
      return NextResponse.json({ error: "AI დამუშავებისთვის საჭიროა თანხმობა." }, { status: 400 });
    }

    if (!(audio instanceof File) || !audio.size) {
      return NextResponse.json({ error: "ხმოვანი ჩანაწერი ვერ მოიძებნა." }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "ხმოვანი ჩანაწერის მაქსიმალური ზომაა 10 MB." }, { status: 413 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI ხმოვანი ფუნქცია მალე ჩაირთვება." },
        { status: 503 }
      );
    }

    const payload = new FormData();
    payload.set("file", audio, audio.name || "finder-voice.webm");
    payload.set("model", process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
    payload.set("response_format", "json");
    payload.set(
      "prompt",
      "This is a QR finder safety message. Preserve the spoken language and accurately transcribe Georgian names, locations, vehicle details, pets, luggage, keys, wallets, bags, and emergency context."
    );

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: payload,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "ხმის ამოცნობა დროებით ვერ შესრულდა." }, { status: 502 });
    }

    const result = (await response.json()) as { text?: string };
    const text = result.text?.trim().slice(0, 1000) || "";
    if (!text) {
      return NextResponse.json({ error: "ჩანაწერში სიტყვები ვერ ამოვიცანით." }, { status: 422 });
    }

    return NextResponse.json({ text, source: "openai" });
  } catch {
    return NextResponse.json({ error: "ხმოვანი AI დროებით მიუწვდომელია." }, { status: 500 });
  }
}
