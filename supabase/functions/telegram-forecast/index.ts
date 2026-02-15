import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const SWPC_BASE = "https://services.swpc.noaa.gov";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not configured");

    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!TELEGRAM_CHAT_ID) throw new Error("TELEGRAM_CHAT_ID not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch NOAA data
    const [scalesRes, kpRes] = await Promise.all([
      fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
    ]);

    const scales = await scalesRes.json();
    const kpData = await kpRes.json();

    // Current Kp
    const latestKp = kpData.length > 0
      ? parseFloat(kpData[kpData.length - 1].estimated_kp ?? kpData[kpData.length - 1].kp_index ?? "0")
      : 0;

    // 3-day forecast
    const forecast = ["1", "2", "3"].map((key) => {
      const d = scales[key];
      if (!d) return null;
      return {
        date: d.DateStamp,
        gScale: parseInt(d.G?.Scale ?? "0"),
        rMinor: d.R?.MinorProb,
        rMajor: d.R?.MajorProb,
        sProb: d.S?.Prob,
      };
    }).filter(Boolean);

    // Current conditions
    const currentG = parseInt(scales["-1"]?.G?.Scale ?? "0");

    // 2. Generate text with AI
    const today = new Date();
    const dateStr = today.toLocaleDateString("uk-UA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const prompt = `Ти — експерт з космічної погоди. Напиши короткий прогноз магнітних бур українською мовою для Telegram-каналу.

Дані NOAA на ${dateStr}:
- Поточний Kp-індекс: ${latestKp.toFixed(1)}
- Поточна G-шкала: G${currentG}
- Прогноз на 3 дні: ${JSON.stringify(forecast)}

Формат:
🌍 Магнітні бурі — прогноз на ${dateStr}

Коротко опиши поточну ситуацію (1-2 речення).
Потім прогноз на кожен день (використовуй емодзі для рівнів: 🟢 спокійно, 🟡 слабка, 🟠 помірна, 🔴 сильна).
В кінці додай коротку пораду для метеозалежних людей.

Не використовуй markdown-форматування, тільки емодзі та простий текст. Максимум 500 символів.`;

    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI Gateway error [${aiRes.status}]: ${errText}`);
    }

    const aiData = await aiRes.json();
    const messageText = aiData.choices?.[0]?.message?.content?.trim();
    if (!messageText) throw new Error("AI returned empty response");

    // 3. Save to DB
    const title = `Прогноз магнітних бур — ${dateStr}`;
    const { error: dbError } = await supabase.from("news").insert({
      title,
      content: messageText,
      source: "ai",
      telegram_sent: true,
    });
    if (dbError) console.error("DB insert error:", dbError);

    // 4. Send to Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "HTML",
        }),
      }
    );

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      throw new Error(`Telegram error: ${JSON.stringify(tgData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: messageText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
