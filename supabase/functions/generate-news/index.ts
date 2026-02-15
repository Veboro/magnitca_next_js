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

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch NOAA data
    const [scalesRes, kpRes, solarWindRes] = await Promise.all([
      fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
      fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`),
    ]);

    const scales = await scalesRes.json();
    const kpData = await kpRes.json();
    const solarWindRaw: string[][] = await solarWindRes.json();

    const latestKp = kpData.length > 0
      ? parseFloat(kpData[kpData.length - 1].estimated_kp ?? kpData[kpData.length - 1].kp_index ?? "0")
      : 0;

    const lastWind = solarWindRaw.length > 1 ? solarWindRaw[solarWindRaw.length - 1] : null;
    const windSpeed = lastWind ? parseFloat(lastWind[2]) || 0 : 0;
    const windDensity = lastWind ? parseFloat(lastWind[1]) || 0 : 0;

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

    const currentG = parseInt(scales["-1"]?.G?.Scale ?? "0");

    const today = new Date();
    const dateStr = today.toLocaleDateString("uk-UA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 2. Generate article with AI
    const prompt = `Ти — досвідчений журналіст-науковець, який пише для українського сайту "Магнітка" (magnitca.com) про космічну погоду та її вплив на здоров'я. Напиши статтю-прогноз українською мовою.

Дані NOAA на ${dateStr}:
- Поточний Kp-індекс: ${latestKp.toFixed(1)}
- G-шкала: G${currentG}
- Швидкість сонячного вітру: ${windSpeed.toFixed(0)} км/с
- Густота плазми: ${windDensity.toFixed(1)} p/cm³
- Прогноз на 3 дні: ${JSON.stringify(forecast)}

Напиши статтю в такому форматі (повертай ТІЛЬКИ JSON, без markdown):
{
  "title": "Заголовок статті (цікавий, журналістський, 60-80 символів)",
  "content": "Повний текст статті"
}

Вимоги до статті:
- Заголовок має бути цікавим, як у новинному порталі, наприклад: "Магнітна буря наближається: чого очікувати українцям у понеділок" або "Спокійний день для метеозалежних: прогноз на 16 лютого"
- Текст 800-1200 символів
- Пиши як справжній автор, не як бот — живою українською мовою
- Структура: вступ про ситуацію → конкретні дані (Kp, G-шкала, сонячний вітер) → прогноз на найближчі дні → вплив на здоров'я → поради
- Використовуй абзаци для читабельності
- Не використовуй емодзі та markdown
- Згадай що дані оновлюються на magnitca.com в реальному часі
- Тон: інформативний, дружній, трохи турботливий`;

    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI error [${aiRes.status}]: ${errText}`);
    }

    const aiData = await aiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content?.trim();
    if (!rawContent) throw new Error("AI returned empty response");

    // Parse JSON from AI response
    let article: { title: string; content: string };
    try {
      // Remove possible markdown code fences
      const cleaned = rawContent.replace(/^```json?\s*/, "").replace(/\s*```$/, "");
      article = JSON.parse(cleaned);
    } catch {
      // Fallback: use raw text
      article = {
        title: `Прогноз магнітних бур — ${dateStr}`,
        content: rawContent,
      };
    }

    // 3. Save to DB
    const { data: inserted, error: dbError } = await supabase.from("news").insert({
      title: article.title,
      content: article.content,
      source: "ai",
      telegram_sent: false,
    }).select().single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      throw new Error(`DB error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, article: inserted }),
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
