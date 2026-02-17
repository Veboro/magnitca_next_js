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
    const prompt = `Ти — журналіст українського новинного порталу. Напиши новину про магнітні бурі українською мовою на основі даних NOAA.

Дані на ${dateStr}:
- Kp-індекс: ${latestKp.toFixed(1)}, G-шкала: G${currentG}
- Сонячний вітер: ${windSpeed.toFixed(0)} км/с, густина: ${windDensity.toFixed(1)} p/cm³
- Прогноз: ${JSON.stringify(forecast)}

Повертай ТІЛЬКИ JSON без markdown:
{"title": "заголовок 50-70 символів", "content": "текст новини"}

Вимоги:
- Заголовок як у новинах: "Магнітна буря 15 лютого: чого очікувати українцям"
- Рівно 4 абзаци, розділені \\n\\n
- Абзац 1: дата, рівень бурі (G-шкала), Kp-індекс, чи є загроза. 2-3 речення.
- Абзац 2: причина — швидкість сонячного вітру, густина, прогноз на найближчі дні з G-шкалою. 2-3 речення.
- Абзац 3: що означає цей рівень для техніки, зв'язку, супутників, енергомереж. 2-3 речення.
- Абзац 4: вплив на здоров'я метеозалежних, порада від лікарів. 2-3 речення.
- Загальна довжина тексту: 800-1000 символів
- Стиль: стримано, інформативно, по-журналістськи, як у новинному порталі
- Без емодзі, без markdown, без списків
- НЕ згадуй сайт magnitca.com`;

    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
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
