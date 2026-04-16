import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_BASE = "https://api.openai.com/v1";
const SWPC_BASE = "https://services.swpc.noaa.gov";

const UA_TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z", и: "y", і: "i",
  ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya", "'": "", "ʼ": "",
};

function slugify(text: string) {
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

  return result.trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90);
}

function formatDate(date: Date, locale: "uk-UA" | "ru-RU") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function dateKeyKyiv(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function kyivHour(date: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    hour12: false,
  }).format(date));
}

function parseLatestKp(kpData: any[]) {
  if (!kpData.length) return 0;
  const latest = kpData[kpData.length - 1];
  return parseFloat(latest.estimated_kp ?? latest.kp_index ?? latest.kp ?? 0) || 0;
}

type ForecastRow = {
  time_tag: string;
  kp: number | string;
  observed?: string | null;
  noaa_scale?: string | null;
};

function buildUpcomingDays(kpForecastRaw: ForecastRow[], todayKey: string) {
  const map = new Map<string, number[]>();

  for (const row of kpForecastRaw) {
    const timeTag = row.time_tag;
    const day = timeTag?.slice(0, 10);
    const kp = parseFloat(String(row.kp));
    const observed = row.observed;

    if (!day || observed === "observed" || Number.isNaN(kp) || day < todayKey) continue;
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(kp);
  }

  return Array.from(map.entries()).slice(0, 3).map(([date, values]) => {
    const maxKp = Math.max(...values);
    return {
      date,
      maxKp,
      avgKp: values.reduce((sum, value) => sum + value, 0) / values.length,
      gScale: maxKp >= 5 ? Math.min(Math.floor(maxKp - 4), 5) : 0,
    };
  });
}

function forecastSummary(days: Array<{ date: string; maxKp: number; avgKp: number; gScale: number }>) {
  return days
    .map((day) => `${day.date}: max Kp ${day.maxKp.toFixed(1)}, avg Kp ${day.avgKp.toFixed(1)}, G${day.gScale}`)
    .join("; ");
}

async function askAi(openAiApiKey: string, prompt: string, model: string, maxTokens: number) {
  const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI error [${response.status}]: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("AI returned empty content");
  }

  return content;
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapSvgText(text: string, maxLineLength = 28) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function generateFallbackImage(_titleUk: string, _dateUk: string, currentG: number) {
  const color = currentG >= 4 ? "#ef4444" : currentG >= 3 ? "#f97316" : currentG >= 1 ? "#eab308" : "#22c55e";

  const svg = `
  <svg width="1536" height="1024" viewBox="0 0 1536 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#071019"/>
        <stop offset="55%" stop-color="#0b1d2b"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>
      <radialGradient id="aurora" cx="0.15" cy="0.12" r="0.95">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.05"/>
        <stop offset="50%" stop-color="${color}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.06"/>
      </linearGradient>
    </defs>
    <rect width="1536" height="1024" fill="url(#bg)"/>
    <rect width="1536" height="1024" fill="url(#aurora)"/>
    <circle cx="1230" cy="170" r="200" fill="${color}" fill-opacity="0.14"/>
    <circle cx="250" cy="790" r="260" fill="#38bdf8" fill-opacity="0.08"/>
    <path d="M-40 760 C220 590, 430 860, 720 710 S1260 450, 1576 700 L1576 1024 L-40 1024 Z" fill="${color}" fill-opacity="0.10"/>
    <path d="M-20 680 C220 520, 420 740, 690 610 S1180 380, 1560 620" stroke="url(#beam)" stroke-width="120" stroke-linecap="round" fill="none"/>
    <path d="M40 310 C260 210, 510 440, 800 310 S1230 120, 1480 250" stroke="${color}" stroke-opacity="0.18" stroke-width="36" stroke-linecap="round" fill="none"/>
    <rect x="72" y="120" width="1392" height="784" rx="36" fill="rgba(6, 12, 20, 0.18)" stroke="rgba(125, 211, 252, 0.12)"/>
  </svg>`;

  return svg.trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env is not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const force = body?.force === true;

    const now = new Date();
    const todayKey = dateKeyKyiv(now);
    const hour = kyivHour(now);
    const dateUk = formatDate(now, "uk-UA");
    const dateRu = formatDate(now, "ru-RU");
    const slugUk = `mahnitni-buri-sogodni-${todayKey}`;
    const slugRu = `magnitnye-buri-segodnya-${todayKey}`;

    if (!force && hour !== 7) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Outside 07:00 Europe/Kyiv publishing window" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: existingNews, error: existingError } = await supabase
      .from("news")
      .select("id, slug_uk")
      .eq("slug_uk", slugUk)
      .maybeSingle();

    if (existingError) throw new Error(existingError.message);
    if (existingNews && !force) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Site news already generated today", news_id: existingNews.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const [scalesRes, kpRes, solarWindRes, kpForecastRes] = await Promise.all([
      fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
      fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`),
      fetch(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`),
    ]);

    if (!scalesRes.ok || !kpRes.ok || !solarWindRes.ok || !kpForecastRes.ok) {
      throw new Error("Failed to fetch NOAA data");
    }

    const [scales, kpData, solarWindRaw, kpForecastRaw] = await Promise.all([
      scalesRes.json(),
      kpRes.json(),
      solarWindRes.json(),
      kpForecastRes.json(),
    ]);

    const latestKp = parseLatestKp(kpData);
    const currentG = parseInt(scales["-1"]?.G?.Scale ?? "0") || 0;
    const lastWind = solarWindRaw.length > 1 ? solarWindRaw[solarWindRaw.length - 1] : null;
    const windSpeed = lastWind ? parseFloat(lastWind[2]) || 0 : 0;
    const windDensity = lastWind ? parseFloat(lastWind[1]) || 0 : 0;
    const upcoming = buildUpcomingDays(kpForecastRaw, todayKey);
    const forecastText = forecastSummary(upcoming);

    const titleUkPrompt = `Ти — редактор українського новинного сайту про космічну погоду.

Напиши ОДИН заголовок українською для новини про магнітні бурі на сьогодні на основі реальних даних NOAA.

Вхідні дані:
- Дата: ${dateUk}
- Поточний Kp-індекс: ${latestKp.toFixed(1)}
- Поточний рівень G: G${currentG}
- Максимальний прогноз Kp на сьогодні: ${Math.max(latestKp, upcoming[0]?.maxKp ?? latestKp).toFixed(1)}
- Прогноз на найближчі дні: ${forecastText}

Завдання:
Створи заголовок у стилі українських новинних медіа. Він має звучати як реальний редакторський хедлайн, який можна побачити на головній сторінці новинного сайту, а не як SEO-шаблон або технічний опис.

Вимоги:
- тільки українська мова
- один заголовок
- довжина 55-95 символів
- без лапок
- без markdown
- без емодзі
- природний новинний стиль
- більш медійне, живе формулювання
- можна використовувати дату, слова "прогноз", "очікуються", "якою буде активність", "що відомо"
- якщо активність слабка, не перебільшуй
- якщо прогноз передбачає посилення найближчими днями, це можна відобразити
- не вигадуй нових фактів
- не використовуй канцеляризми
- не використовуй штучні SEO-фрази

Уникай таких шаблонів:
- "Сьогодні магнітні бурі:"
- "Магнітні бурі сьогодні: прогноз та вплив на здоров'я..."
- "Актуальні прогнози..."
- "Що треба знати..."
- "Рівні KP..."
- "Вплив на здоров'я" без реальної потреби
- занадто загальних або рекламних формулювань
- сухих формулювань на кшталт "активність залишається на низькому рівні", якщо можна сказати живіше

Орієнтуйся на такі патерни:
- Магнітні бурі 15 квітня: якою буде сонячна активність сьогодні
- Прогноз магнітних бур на 15 квітня: що очікується сьогодні
- Сонячна активність 15 квітня: чи прогнозують магнітні бурі
- Магнітні бурі 15 квітня: що показує прогноз NOAA
- Магнітні бурі 15 квітня: чи буде відчутною сонячна активність
- Прогноз магнітних бур на сьогодні: чого чекати 15 квітня

Поверни тільки один готовий заголовок.`;

    const contentUkPrompt = `Ти — редактор українського новинного сайту про космічну погоду. Напиши повну новину українською на основі реальних даних NOAA.

Дані:
- Дата: ${dateUk}
- Поточний Kp-індекс: ${latestKp.toFixed(1)}
- Поточна G-шкала: G${currentG}
- Сонячний вітер: ${windSpeed.toFixed(0)} км/с
- Густина плазми: ${windDensity.toFixed(1)} p/cm³
- Прогноз на найближчі дні: ${forecastText}

Вимоги:
- Тільки українська
- Стиль: новинний, людяний, природний, але точний
- Без markdown і списків
- 4-6 абзаців
- Довжина: 1400-2200 символів
- Не дублюй телеграм-формат, це повна новина для сайту
- Не вигадуй цифри поза даними
- Згадуй NOAA як джерело прогнозу
- Зроби помітний, але не клікбейтний акцент на тому, як геомагнітна активність може позначитися на самопочутті метеочутливих людей
- Якщо активність слабка, поясни це спокійно і без перебільшення
- Якщо є ризик погіршення самопочуття, опиши його простою людською мовою: головний біль, втома, дратівливість, порушення сну, коливання тиску
- Один із центральних абзаців має бути саме про можливий вплив на самопочуття, але без медичних страшилок
- Наприкінці коротко вкажи, що ситуація може оновлюватися протягом дня

Поверни тільки текст новини.`;

    const [titleUk, contentUk] = await Promise.all([
      askAi(OPENAI_API_KEY, titleUkPrompt, "gpt-4o-mini", 200),
      askAi(OPENAI_API_KEY, contentUkPrompt, "gpt-4o-mini", 2600),
    ]);

    const cleanTitleUk = titleUk.replace(/^["«]|["»]$/g, "").trim();
    const translateTitleRuPrompt = `Переведи этот украинский SEO-заголовок на русский язык максимально близко по смыслу и тону.

Украинский заголовок:
${cleanTitleUk}

Требования:
- Только русский язык
- Сохрани смысл, тон и SEO-характер заголовка
- Без кавычек и markdown
- Не добавляй новых фактов

Верни только готовый заголовок.`;

    const translateContentRuPrompt = `Переведи эту украинскую новость на русский язык максимально близко к оригиналу.

Украинский текст:
${contentUk}

Требования:
- Только русский язык
- Сохрани структуру, смысл, факты, числа и тон оригинала
- Не сокращай и не расширяй материал заметно
- Не добавляй новых фактов от себя
- Используй естественный грамотный русский язык без украинских слов, англицизмов и технических артефактов
- Не используй markdown

Верни только готовый перевод.`;

    const [titleRu, contentRu] = await Promise.all([
      askAi(OPENAI_API_KEY, translateTitleRuPrompt, "gpt-4o-mini", 220),
      askAi(OPENAI_API_KEY, translateContentRuPrompt, "gpt-4o-mini", 3000),
    ]);

    const cleanTitleRu = titleRu.replace(/^["«]|["»]$/g, "").trim();

    const svgMarkup = generateFallbackImage(cleanTitleUk, dateUk, currentG);
    const binaryData = new TextEncoder().encode(svgMarkup);
    const fileName = `${slugify(cleanTitleUk)}-${Date.now()}.svg`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(fileName, binaryData, { contentType: "image/svg+xml", upsert: true });

    if (uploadError) throw new Error(`Image upload error: ${uploadError.message}`);

    const { data: publicImage } = supabase.storage.from("news-images").getPublicUrl(fileName);
    const imageUrl = publicImage.publicUrl;

    const payload = {
      title: cleanTitleUk,
      slug: slugUk,
      content: contentUk,
      source: "daily_ai",
      image_url: imageUrl,
      meta_title: cleanTitleUk,
      meta_description: contentUk.replace(/\s+/g, " ").slice(0, 160),
      status: "published",
      telegram_sent: false,
      title_uk: cleanTitleUk,
      slug_uk: slugUk,
      content_uk: contentUk,
      meta_title_uk: cleanTitleUk,
      meta_description_uk: contentUk.replace(/\s+/g, " ").slice(0, 160),
      title_ru: cleanTitleRu,
      slug_ru: slugRu,
      content_ru: contentRu,
      meta_title_ru: cleanTitleRu,
      meta_description_ru: contentRu.replace(/\s+/g, " ").slice(0, 160),
      published_at: now.toISOString(),
    };

    let newsId = existingNews?.id ?? null;

    if (existingNews?.id) {
      const { data: updated, error: updateError } = await supabase
        .from("news")
        .update(payload)
        .eq("id", existingNews.id)
        .select("id")
        .single();

      if (updateError) throw new Error(updateError.message);
      newsId = updated.id;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("news")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);
      newsId = inserted.id;
    }

    return new Response(
      JSON.stringify({
        success: true,
        news_id: newsId,
        slug_uk: slugUk,
        slug_ru: slugRu,
        image_url: imageUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("generate-news error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
