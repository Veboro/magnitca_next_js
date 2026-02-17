import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { to, title, body } = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 24px; color: #e0e0e0;">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-size: 28px;">⚡</span>
            <h1 style="color: #ffd700; font-size: 20px; margin: 8px 0 4px;">${title}</h1>
          </div>
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; margin: 16px 0; line-height: 1.6; font-size: 14px;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <div style="text-align: center; margin-top: 16px;">
            <a href="https://magnetic-storm-hub.lovable.app/profile" style="display: inline-block; background: #4a6cf7; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Відкрити кабінет
            </a>
          </div>
          <p style="text-align: center; color: #666; font-size: 11px; margin-top: 16px;">
            Магнітка — моніторинг космічної погоди
          </p>
        </div>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Магнітка <onboarding@resend.dev>",
        to: [to],
        subject: `⚡ ${title}`,
        html: emailBody,
      }),
    });

    const result = await emailRes.json();
    if (!emailRes.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: result }), {
        status: emailRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
