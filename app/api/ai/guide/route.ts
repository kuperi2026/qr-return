import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const suspiciousPatterns = [
  /send (me )?money/i,
  /bank|card number|password|verification code|otp/i,
  /გადმომირიცხ|ბარათის ნომერ|პაროლ|ერთჯერადი კოდ/i,
  /crypto|bitcoin|gift card/i,
];

function fallbackAnalysis(message: string, category: string) {
  const lower = message.toLowerCase();
  const emergency = /112|unconscious|not breathing|bleeding|seizure|უგონ|არ სუნთქავს|სისხლ|კრუნჩხვ/.test(lower);
  const high = emergency || /urgent|immediately|blocked|accident|სასწრაფ|დაუყოვნებლივ|მიშლის ხელს|ავარია/.test(lower);
  const suspicious = suspiciousPatterns.some((pattern) => pattern.test(message));

  return {
    detected_language: /[ა-ჰ]/.test(message) ? "ka" : "unknown",
    urgency: emergency ? "emergency" : high ? "high" : "medium",
    intent: category === "parking" ? "vehicle_issue" : category === "emergency" ? "emergency_help" : "found_item",
    summary_ka: message.slice(0, 220),
    recommended_action_ka: emergency
      ? "დარეკეთ 112-ზე და შემდეგ დაუკავშირდით Emergency კონტაქტს."
      : suspicious
      ? "არ გააზიაროთ ფინანსური მონაცემები, პაროლი ან ერთჯერადი კოდი. გამოიყენეთ მხოლოდ დაცული ჩათი."
      : "დაუკავშირდით მფლობელს დაცული ჩათით და საჭიროების შემთხვევაში გაუზიარეთ მდებარეობა.",
    suggested_message_ka: message,
    suspicious,
    safety_warning_ka: suspicious
      ? "შეტყობინება შესაძლოა საეჭვო იყოს. არ გააზიაროთ ფული, პაროლი ან საბანკო ინფორმაცია."
      : null,
    source: "safe-fallback",
  };
}

function extractOutputText(data: {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
}) {
  if (data.output_text) return data.output_text;
  for (const item of data.output || []) {
    for (const part of item.content || []) {
      if (part.type === "output_text" && part.text) return part.text;
    }
  }
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : "";
    const category = typeof body?.category === "string" ? body.category.trim().toLowerCase().slice(0, 40) : "item";
    const lostMode = body?.lostMode === true;

    if (message.length < 2) {
      return NextResponse.json({ error: "აღწერეთ სიტუაცია." }, { status: 400 });
    }

    const fallback = fallbackAnalysis(message, category);
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-5-mini";

    if (!apiKey) return NextResponse.json(fallback);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions: `You are QR RETURN's safety routing engine. Analyze a finder's message for a ${category} QR profile. Lost Mode is ${lostMode ? "active" : "inactive"}. Never reveal or request private data, passwords, verification codes, financial details, or hidden medical data. Do not diagnose or give medical treatment. For immediate danger or medical emergencies, recommend local emergency services (112 in the US) first. Return concise Georgian output and preserve the original meaning in any translation.`,
        input: message,
        text: {
          format: {
            type: "json_schema",
            name: "qr_return_safety_analysis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                detected_language: { type: "string" },
                urgency: { type: "string", enum: ["low", "medium", "high", "emergency"] },
                intent: { type: "string" },
                summary_ka: { type: "string" },
                recommended_action_ka: { type: "string" },
                suggested_message_ka: { type: "string" },
                suspicious: { type: "boolean" },
                safety_warning_ka: { type: ["string", "null"] },
              },
              required: ["detected_language", "urgency", "intent", "summary_ka", "recommended_action_ka", "suggested_message_ka", "suspicious", "safety_warning_ka"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) return NextResponse.json(fallback);

    const data = await response.json();
    const outputText = extractOutputText(data);
    if (!outputText) return NextResponse.json(fallback);

    return NextResponse.json({ ...JSON.parse(outputText), source: "openai" });
  } catch {
    return NextResponse.json({ error: "AI ანალიზი დროებით მიუწვდომელია." }, { status: 500 });
  }
}
