import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const SWPC_BASE = "https://services.swpc.noaa.gov";

function gScaleToColor(g: number): string {
  if (g >= 4) return "intense red-crimson";
  if (g >= 3) return "deep orange";
  if (g >= 2) return "amber-yellow";
  if (g >= 1) return "soft yellow-green";
  return "calm green";
}

function gScaleToLabel(g: number): string {
  if (g >= 4) return "Сильна буря";
  if (g >= 3) return "Помірна буря";
  if (g >= 2) return "Слабка буря";
  if (g >= 1) return "Незначна буря";
  return "Спокійно";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Auth: require valid Supabase JWT (anon or service_role)
  // The function is protected by Supabase's built-in JWT verification
  // Only valid project JWTs can reach this point

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

    // 1. Fetch NOAA data (including solar wind like the news function)
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

    // 2. Generate forecast image with AI — focus on TODAY's level
    const bgColor = gScaleToColor(currentG);
    const stormLabel = gScaleToLabel(currentG);

    const imagePrompt = `Generate an image: a clean social media card (landscape 16:9). Background: smooth gradient in ${bgColor} tones with subtle aurora/northern lights effects. Large bold white centered text: "Прогноз магнітних бур". Below: "${dateStr}". Below that: "G${currentG} — ${stormLabel}". Bottom right corner small text: "magnitca.com". Minimalist, space-themed, no faces, no photos of people.`;

    const imageRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!imageRes.ok) {
      const errText = await imageRes.text();
      console.error(`AI image error [${imageRes.status}]: ${errText}`);
    }

    const imageData = await imageRes.json();
    console.log("AI image response keys:", JSON.stringify(Object.keys(imageData)));
    console.log("AI image choices:", JSON.stringify(imageData.choices?.[0]?.message ? {
      hasImages: !!imageData.choices[0].message.images,
      imagesCount: imageData.choices[0].message.images?.length,
      contentPreview: imageData.choices[0].message.content?.substring(0, 100),
    } : "no message"));
    const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // 3. Generate text with AI (same model and data quality as news)
    const textPrompt = `Ти — журналіст українського новинного порталу. Напиши стислий прогноз магнітних бур українською для Telegram-каналу на основі даних NOAA.

Дані на ${dateStr}:
- Kp-індекс: ${latestKp.toFixed(1)}, G-шкала: G${currentG}
- Сонячний вітер: ${windSpeed.toFixed(0)} км/с, густина: ${windDensity.toFixed(1)} p/cm³
- Прогноз: ${JSON.stringify(forecast)}

Формат (без привітань, одразу до справи):

🌍 Магнітні бурі — ${dateStr}

Абзац 1 (2-3 речення): сьогоднішній рівень бурі G${currentG}, Kp-індекс ${latestKp.toFixed(1)}, чи є загроза. Якщо G0 — чітко скажи що бур не очікується. Якщо G1+ — поясни що це означає.

Абзац 2 (2 речення): сонячний вітер ${windSpeed.toFixed(0)} км/с, прогноз на найближчі дні.

📊 Показники:
K-index: ${latestKp.toFixed(1)}
Сонячний вітер: ${windSpeed.toFixed(0)} км/с

Прогноз (🟢🟡🟠🔴):
[дата]: [емодзі] G[рівень]

🤕 Коротко (1 речення) про вплив на самопочуття.

🔗 magnitca.com

ВАЖЛИВО: Картинка показує G${currentG} — текст ПОВИНЕН відповідати цьому рівню. Не суперечити!
Без markdown, тільки емодзі. СТРОГО до 950 символів.`;

    const textRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: textPrompt }],
        max_tokens: 1500,
      }),
    });

    if (!textRes.ok) {
      const errText = await textRes.text();
      throw new Error(`AI text error [${textRes.status}]: ${errText}`);
    }

    const textData = await textRes.json();
    const messageText = textData.choices?.[0]?.message?.content?.trim();
    if (!messageText) throw new Error("AI returned empty text");

    // 4. Save to DB
    const title = `Прогноз магнітних бур — ${dateStr}`;
    const { error: dbError } = await supabase.from("news").insert({
      title,
      content: messageText,
      source: "ai",
      telegram_sent: true,
    });
    if (dbError) console.error("DB insert error:", dbError);

    // 5. Send to Telegram — image with caption, fallback to text only
    let tgSuccess = false;

    if (base64Image) {
      try {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        const formData = new FormData();
        formData.append("chat_id", TELEGRAM_CHAT_ID);
        formData.append("caption", messageText);
        formData.append("photo", new Blob([binaryData], { type: "image/png" }), "forecast.png");

        const tgRes = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
          { method: "POST", body: formData }
        );
        const tgData = await tgRes.json();
        tgSuccess = tgData.ok;
        if (!tgSuccess) console.error("Telegram photo error:", tgData);
      } catch (imgErr) {
        console.error("Image send failed:", imgErr);
      }
    }

    if (!tgSuccess) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: messageText }),
        }
      );
      const tgData = await tgRes.json();
      if (!tgData.ok) throw new Error(`Telegram error: ${JSON.stringify(tgData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, hasImage: !!base64Image, message: messageText }),
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
