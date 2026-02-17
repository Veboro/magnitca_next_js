import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Check if we already sent a notification today
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("user_notifications")
      .select("id")
      .gte("created_at", `${today}T00:00:00Z`)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "Already sent today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch NOAA data — use same sources as main page
    const [scalesRes, kpRes] = await Promise.all([
      fetch("https://services.swpc.noaa.gov/products/noaa-scales.json"),
      fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"),
    ]);

    const scalesData = await scalesRes.json();
    const kpData = await kpRes.json();

    // Get current G-scale from NOAA (same as main page)
    let stormLevel = 0;
    if (scalesData?.["-1"]?.G?.Scale != null) {
      stormLevel = parseInt(scalesData["-1"].G.Scale) || 0;
    }

    // Get current Kp from latest measurement
    let maxKp = 0;
    if (Array.isArray(kpData) && kpData.length > 0) {
      const latest = kpData[kpData.length - 1];
      maxKp = parseFloat(latest.estimated_kp ?? latest.kp_index ?? latest.kp ?? 0);
    }

    // 3. Skip if no significant storm
    if (stormLevel < 1 && maxKp < 5) {
      return new Response(JSON.stringify({ message: "No storm detected", maxKp, stormLevel }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Generate AI message
    const gLabels: Record<number, string> = {
      1: "G1 — Слабка магнітна буря",
      2: "G2 — Помірна магнітна буря",
      3: "G3 — Сильна магнітна буря",
      4: "G4 — Дуже сильна магнітна буря",
      5: "G5 — Екстремальна магнітна буря",
    };

    const title = gLabels[stormLevel] || `Kp=${maxKp} — Підвищена геомагнітна активність`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: "Ти — асистент з космічної погоди. Пиши коротко, зрозуміло, українською. Повідомлення 100-200 слів. Включай опис ситуації та практичні рекомендації для здоров'я метеозалежних людей.",
          },
          {
            role: "user",
            content: `Створи сповіщення про магнітну бурю. Рівень: ${title}. Максимальний Kp-індекс: ${maxKp}. Дата: ${today}. Включи: 1) Короткий опис ситуації 2) Можливі симптоми для метеозалежних 3) Практичні рекомендації (вода, відпочинок, ліки, сон). Не використовуй markdown форматування.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI error:", aiRes.status, errText);
      throw new Error(`AI gateway error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const body = aiData.choices?.[0]?.message?.content || `Очікується магнітна буря рівня G${stormLevel}. Kp-індекс: ${maxKp}. Рекомендуємо бути уважними до свого самопочуття, пити більше води та уникати стресових ситуацій.`;

    // 5. Get all users with emails
    const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id");

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: "No users to notify" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Insert notifications for all users
    const rows = profiles.map((p: { user_id: string }) => ({
      user_id: p.user_id,
      title,
      body,
      storm_level: stormLevel,
    }));

    const { error: insertError } = await supabase
      .from("user_notifications")
      .insert(rows);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(insertError.message);
    }

    // 7. Send emails via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let emailsSent = 0;

    if (resendApiKey && authUsers?.users) {
      const emailMap = new Map<string, string>();
      for (const u of authUsers.users) {
        if (u.email) emailMap.set(u.id, u.email);
      }

      const emailBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 24px; color: #e0e0e0;">
            <div style="text-align: center; margin-bottom: 16px;">
              <span style="font-size: 28px;">⚡</span>
              <h1 style="color: #ffd700; font-size: 20px; margin: 8px 0 4px;">${title}</h1>
              <p style="color: #888; font-size: 12px; margin: 0;">${today}</p>
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

      // Send emails in batches
      for (const profile of profiles) {
        const email = emailMap.get(profile.user_id);
        if (!email) continue;

        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Магнітка <onboarding@resend.dev>",
              to: [email],
              subject: `⚡ ${title}`,
              html: emailBody,
            }),
          });

          if (emailRes.ok) {
            emailsSent++;
          } else {
            const errText = await emailRes.text();
            console.error(`Email error for ${email}:`, errText);
          }
        } catch (emailErr) {
          console.error(`Email send error:`, emailErr);
        }
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping emails");
    }

    return new Response(
      JSON.stringify({ message: "Alerts sent", users: profiles.length, emailsSent, stormLevel, maxKp }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
