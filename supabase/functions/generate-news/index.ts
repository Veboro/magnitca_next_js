import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const UA_TRANSLIT: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",
  ї:"yi",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",
  ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya","'":"",ʼ:"",
};

function slugify(text: string): string {
  const lower = text.toLowerCase();
  let result = "";
  for (const ch of lower) {
    if (UA_TRANSLIT[ch] !== undefined) {
      result += UA_TRANSLIT[ch];
    } else if (/[a-z0-9]/.test(ch)) {
      result += ch;
    } else {
      result += " ";
    }
  }
  return result.trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

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

  // Auth: protected by Supabase's built-in JWT verification

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch NOAA data
    const [scalesRes, kpRes, solarWindRes, kpForecastRes] = await Promise.all([
      fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
      fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`),
      fetch(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`),
    ]);

    const scales = await scalesRes.json();
    const kpData = await kpRes.json();
    const solarWindRaw: string[][] = await solarWindRes.json();
    const kpForecastRaw: string[][] = await kpForecastRes.json();

    const latestKp = kpData.length > 0
      ? parseFloat(kpData[kpData.length - 1].estimated_kp ?? kpData[kpData.length - 1].kp_index ?? "0")
      : 0;

    const lastWind = solarWindRaw.length > 1 ? solarWindRaw[solarWindRaw.length - 1] : null;
    const windSpeed = lastWind ? parseFloat(lastWind[2]) || 0 : 0;
    const windDensity = lastWind ? parseFloat(lastWind[1]) || 0 : 0;

    // Build per-day Kp forecast from the actual forecast endpoint
    const todayStr = new Date().toISOString().slice(0, 10);
    const dayKpMap: Record<string, number[]> = {};
    for (const row of kpForecastRaw.slice(1)) {
      const [timeTag, kpVal, observed] = row;
      if (observed === "observed") continue;
      const day = timeTag.slice(0, 10);
      const kp = parseFloat(kpVal);
      if (!isNaN(kp)) {
        if (!dayKpMap[day]) dayKpMap[day] = [];
        dayKpMap[day].push(kp);
      }
    }

    const forecast = Object.entries(dayKpMap).slice(0, 3).map(([date, kps]) => ({
      date,
      maxKp: Math.max(...kps).toFixed(1),
      avgKp: (kps.reduce((a, b) => a + b, 0) / kps.length).toFixed(1),
      gScale: Math.max(...kps) >= 5 ? Math.min(Math.floor(Math.max(...kps) - 4), 5) : 0,
    }));

    const currentG = parseInt(scales["-1"]?.G?.Scale ?? "0");

    const today = new Date();
    const dateStr = today.toLocaleDateString("uk-UA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 2. Generate article with AI — two separate calls for reliability
    const contentPrompt = `Ти — журналіст українського новинного порталу про космічну погоду. Напиши новину українською мовою на основі реальних даних NOAA.

Дані на ${dateStr}:
- Поточний Kp-індекс: ${latestKp.toFixed(1)}, G-шкала: G${currentG}
- Сонячний вітер: швидкість ${windSpeed.toFixed(0)} км/с, густина ${windDensity.toFixed(1)} p/cm³
- Прогноз Kp-індексу на найближчі дні:
${forecast.map(f => `  ${f.date}: макс Kp=${f.maxKp}, середній Kp=${f.avgKp}, G-шкала: G${f.gScale}${f.gScale >= 1 ? " (магнітна буря)" : " (без бурі)"}`).join("\n")}

Стиль і структура — як у реальних українських новинних порталах:

1. Перший абзац: головна новина дня — який K-індекс, який рівень (зелений/жовтий/помаранчевий/червоний), чи очікується магнітна буря. 2-3 речення.

2. Другий абзац: деталі — швидкість сонячного вітру, густина плазми, що відбувалося на Сонці за останню добу. Якщо G0 — зазнач що суттєвих спалахів не зафіксовано. 2-3 речення.

3. Третій абзац: прогноз на найближчі 1-2 дні з конкретними значеннями K-індексу з даних прогнозу. Можна згадати "за даними NOAA". 2-3 речення.

4. Четвертий абзац: короткий дисклеймер що прогнози можуть змінюватися, бо дані оновлюються що три години, і найточніші прогнози — на один день наперед. Якщо K-індекс ≥ 4, додай пораду для метеозалежних. 1-2 речення.

Критичні вимоги:
- Поверни ТІЛЬКИ текст новини, без заголовка, без JSON, без markdown
- Абзаци розділені подвійним переносом рядка
- Загальна довжина: 800-1200 символів
- Стиль: стриманий, інформативний, журналістський
- НЕ використовуй емодзі, markdown, списки
- НЕ вигадуй дані — використовуй ТІЛЬКИ надані числа
- НЕ згадуй сайт magnitca.com
- НЕ посилайся на інші джерела крім NOAA — ми самі є джерелом`;

    const titlePrompt = `Придумай стислий заголовок для новини про магнітні бурі на ${dateStr}. Kp=${latestKp.toFixed(1)}, G${currentG}.
Приклади: "Магнітні бурі 20 лютого: прогноз геомагнітної активності", "Сонячна активність 20 лютого: чого очікувати".
Поверни ТІЛЬКИ заголовок, 50-80 символів, без лапок, без markdown.`;

    // Fire both requests in parallel
    const [contentRes, titleRes] = await Promise.all([
      fetch(AI_GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: contentPrompt }], max_tokens: 2000 }),
      }),
      fetch(AI_GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-flash-lite", messages: [{ role: "user", content: titlePrompt }], max_tokens: 200 }),
      }),
    ]);

    if (!contentRes.ok) throw new Error(`AI content error [${contentRes.status}]: ${await contentRes.text()}`);
    if (!titleRes.ok) throw new Error(`AI title error [${titleRes.status}]: ${await titleRes.text()}`);

    const [contentData, titleData] = await Promise.all([contentRes.json(), titleRes.json()]);
    
    const articleContent = contentData.choices?.[0]?.message?.content?.trim();
    const articleTitle = titleData.choices?.[0]?.message?.content?.trim()?.replace(/^["«]|["»]$/g, "") || `Прогноз магнітних бур — ${dateStr}`;
    
    if (!articleContent || articleContent.length < 200) {
      throw new Error(`AI returned insufficient content (${articleContent?.length || 0} chars)`);
    }

    const article = { title: articleTitle, content: articleContent };

    // 3. Generate cover image
    let imageUrl: string | null = null;
    try {
      const imagePrompt = `Generate an image: a wide social media card (1200x600, landscape 2:1 aspect ratio). Background: smooth dark gradient with subtle aurora/northern lights and cosmic effects. Large bold white centered text: "${article.title}". Bottom right corner small text: "magnitca.com". Minimalist, space-themed, no faces, no photos of people. The text must be in Ukrainian language exactly as provided.`;

      const imgRes = await fetch(AI_GATEWAY, {
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

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        const base64Image = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (base64Image) {
          const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          // Convert to WebP for smaller file size
          const fileName = `${slugify(article.title)}-${Date.now()}.webp`;

          const { error: uploadErr } = await supabase.storage
            .from("news-images")
            .upload(fileName, binaryData, { contentType: "image/webp", upsert: true });

          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
          } else {
            console.error("Upload error:", uploadErr);
          }
        }
      }
    } catch (imgErr) {
      console.error("Image generation error:", imgErr);
    }

    // 4. Save to DB
    const baseSlug = slugify(article.title);
    const { count } = await supabase.from("news").select("id", { count: "exact", head: true }).like("slug", `${baseSlug}%`);
    const slug = count && count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

    const { data: inserted, error: dbError } = await supabase.from("news").insert({
      title: article.title,
      content: article.content,
      slug,
      image_url: imageUrl,
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
