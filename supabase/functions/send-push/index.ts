import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  generateVapidKeys,
  exportVapidKeys,
  importVapidKeys,
  PushSubscriber,
  exportApplicationServerKey,
} from "jsr:@negrel/webpush@0.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Auth: only service role can call this function
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!authHeader || !serviceRoleKey || !authHeader.includes(serviceRoleKey)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  
  // Special endpoint to generate new VAPID keys in the library's format
  if (url.pathname.endsWith("/generate-keys")) {
    try {
      const keys = await generateVapidKeys({ extractable: true });
      const exported = await exportVapidKeys(keys);
      const appServerKey = await exportApplicationServerKey(keys);
      return new Response(JSON.stringify({ 
        vapidKeysJson: JSON.stringify(exported),
        applicationServerKey: appServerKey,
        instructions: "Save vapidKeysJson as VAPID_KEYS secret, and applicationServerKey goes in frontend"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    const VAPID_KEYS = Deno.env.get("VAPID_KEYS");
    if (!VAPID_KEYS) throw new Error("VAPID_KEYS not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { title, body, url: pushUrl, tag } = await req.json();
    if (!title || !body) throw new Error("title and body are required");

    const vapidKeys = await importVapidKeys(JSON.parse(VAPID_KEYS));

    // Get all subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");
    if (error) throw error;

    const payload = JSON.stringify({ title, body, url: pushUrl || "/", tag: tag || "magnetka" });

    let sent = 0;
    let failed = 0;
    const staleEndpoints: string[] = [];

    for (const sub of subscriptions || []) {
      try {
        const subscriber = new PushSubscriber(vapidKeys, {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        });

        await subscriber.pushTextMessage(payload, {});
        sent++;
      } catch (err: any) {
        failed++;
        if (err?.isGone && err.isGone()) {
          staleEndpoints.push(sub.endpoint);
        }
        console.error(`Push error for ${sub.endpoint}:`, err?.message || err);
      }
    }

    if (staleEndpoints.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", staleEndpoints);
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, cleaned: staleEndpoints.length, total: subscriptions?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-push error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
