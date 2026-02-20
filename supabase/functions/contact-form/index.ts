import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Усі поля обов'язкові" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (name.length > 100 || email.length > 255 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Перевищено максимальну довжину полів" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Магнітка <onboarding@resend.dev>",
        to: ["golovne@gmail.com"],
        subject: "Магнітка",
        reply_to: email,
        html: `<h2>Нове повідомлення з форми зворотного зв'язку</h2>
<p><strong>Ім'я:</strong> ${name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
<p><strong>Email:</strong> ${email.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
<p><strong>Повідомлення:</strong></p>
<p>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
      throw new Error(`Email send failed: ${res.status}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
