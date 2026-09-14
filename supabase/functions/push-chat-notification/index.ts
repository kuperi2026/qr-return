import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

type PushSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return new Response("Server configuration missing", { status: 500 });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: configRows, error: configError } = await admin.rpc("get_push_config");
  const config = Array.isArray(configRows) ? configRows[0] : configRows;
  if (configError || !config) return new Response("Push configuration unavailable", { status: 500 });
  if (request.headers.get("x-push-secret") !== config.push_webhook_secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const messageId = Number(body?.message_id);
  if (!Number.isSafeInteger(messageId)) return new Response("Invalid message", { status: 400 });

  const { data: message } = await admin
    .from("chat_messages")
    .select("id,item_id,sender_role,message_text,message")
    .eq("id", messageId)
    .eq("sender_role", "finder")
    .maybeSingle();
  if (!message) return new Response("Ignored", { status: 202 });

  const { data: item } = await admin
    .from("item")
    .select("owner_id,tag_code,item_type,pet_type,item_name")
    .eq("id", message.item_id)
    .maybeSingle();
  if (!item?.owner_id) return new Response("No owner", { status: 202 });

  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .eq("user_id", item.owner_id);
  if (!subscriptions?.length) return new Response("No subscriptions", { status: 202 });

  webpush.setVapidDetails(
    "mailto:notifications@qr-return.app",
    config.vapid_public_key,
    config.vapid_private_key,
  );

  const type = item.item_type || item.pet_type || "item";
  const payload = JSON.stringify({
    title: `${item.item_name || "QR პროფილი"}: ახალი შეტყობინება`,
    body: message.message_text || message.message || "მპოვნელი დაგიკავშირდათ ჩატში.",
    url: `/app/chat?profile=${encodeURIComponent(String(item.tag_code || ""))}`,
    tag: `chat-${message.item_id}`,
    type,
  });

  await Promise.allSettled((subscriptions as PushSubscriptionRow[]).map(async (subscription) => {
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      }, payload, { TTL: 86400, urgency: "high" });
    } catch (error) {
      const statusCode = Number((error as { statusCode?: number })?.statusCode);
      if (statusCode === 404 || statusCode === 410) {
        await admin.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
      } else {
        console.error("Push delivery failed", statusCode || error);
      }
    }
  }));

  return Response.json({ delivered: true });
});
