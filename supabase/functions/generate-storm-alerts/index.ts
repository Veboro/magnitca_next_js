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

    // 2. Fetch NOAA data
    const [kpRes, alertRes] = await Promise.all([
      fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json"),
      fetch("https://services.swpc.noaa.gov/products/alerts.json"),
    ]);

    const kpData = await kpRes.json();
    const alerts = await alertRes.json();

    // Find max Kp from forecast
    let maxKp = 0;
    let stormLevel = 0;

    if (Array.isArray(kpData)) {
      for (const row of kpData.slice(1)) {
        const kp = parseFloat(row[1]);
        if (!isNaN(kp) && kp > maxKp) maxKp = kp;
      }
    }

    // Determine G-scale from Kp
    if (maxKp >= 9) stormLevel = 5;
    else if (maxKp >= 8) stormLevel = 4;
    else if (maxKp >= 7) stormLevel = 3;
    else if (maxKp >= 6) stormLevel = 2;
    else if (maxKp >= 5) stormLevel = 1;

    // Check NOAA alerts for G-scale mentions
    if (Array.isArray(alerts)) {
      for (const alert of alerts) {
        const msg = alert.message || "";
        const gMatch = msg.match(/G([1-5])/);
        if (gMatch) {
          const g = parseInt(gMatch[1]);
          if (g > stormLevel) stormLevel = g;
        }
      }
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

    // 5. Get all user IDs
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

    return new Response(
      JSON.stringify({ message: "Alerts sent", users: profiles.length, stormLevel, maxKp }),
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
