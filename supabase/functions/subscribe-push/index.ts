import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isValidUrl(str: string): boolean {
  try { new URL(str); return true; } catch { return false; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse JSON safely
    let body: any;
    try {
      const text = await req.text();
      if (text.length > 10_000) throw new Error("Payload too large");
      body = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Invalid or oversized JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, subscription } = body;

    if (action === "subscribe") {
      const endpoint = subscription?.endpoint;
      const p256dh = subscription?.keys?.p256dh;
      const auth = subscription?.keys?.auth;

      if (!endpoint || !p256dh || !auth) {
        throw new Error("Invalid subscription object");
      }
      if (typeof endpoint !== "string" || endpoint.length > 500 || !isValidUrl(endpoint)) {
        throw new Error("Invalid endpoint URL");
      }
      if (typeof p256dh !== "string" || p256dh.length > 200) {
        throw new Error("Invalid p256dh key");
      }
      if (typeof auth !== "string" || auth.length > 200) {
        throw new Error("Invalid auth key");
      }

      const { error } = await supabase.from("push_subscriptions").upsert(
        { endpoint, p256dh, auth },
        { onConflict: "endpoint" }
      );
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "unsubscribe") {
      const endpoint = subscription?.endpoint;
      if (!endpoint || typeof endpoint !== "string" || endpoint.length > 500) {
        throw new Error("Invalid endpoint");
      }

      const { error } = await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", endpoint);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
