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

function formatKyivDate(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getKyivDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getKyivHour(date: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    hour12: false,
  }).format(date));
}

function gScaleToColor(g: number) {
  if (g >= 4) return "intense crimson red";
  if (g >= 3) return "deep orange";
  if (g >= 2) return "amber yellow";
  if (g >= 1) return "soft yellow-green";
  return "calm emerald green";
}

function gScaleToLabel(g: number) {
  if (g >= 4) return "сильна магнітна буря";
  if (g >= 3) return "помірна магнітна буря";
  if (g >= 2) return "слабка магнітна буря";
  if (g >= 1) return "незначне геомагнітне збурення";
  return "спокійна геомагнітна обстановка";
}

function kpToEmoji(kp: number) {
  if (kp >= 7) return "🔴";
  if (kp >= 5) return "🟠";
  if (kp >= 4) return "🟡";
  return "🟢";
}

function kpLegendLine() {
  return "🟢🟡🟠🔴";
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapSvgText(text: string, maxLineLength = 26) {
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

function clampTelegramCaption(text: string) {
  if (text.length <= 1024) return text;
  return `${text.slice(0, 1020).trimEnd()}…`;
}

function pngChunk(type: string, data: Uint8Array) {
  const typeBytes = new TextEncoder().encode(type);
  const length = data.length;
  const out = new Uint8Array(12 + length);
  const view = new DataView(out.buffer);
  view.setUint32(0, length);
  out.set(typeBytes, 4);
  out.set(data, 8);
  view.setUint32(8 + length, crc32(out.subarray(4, 8 + length)));
  return out;
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let j = 0; j < 8; j += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function deflate(data: Uint8Array) {
  const stream = new Blob([data]).stream().pipeThrough(new CompressionStream("deflate"));
  const compressed = await new Response(stream).arrayBuffer();
  return new Uint8Array(compressed);
}

function accentColor(currentG: number) {
  if (currentG >= 4) return [239, 68, 68] as const;
  if (currentG >= 3) return [249, 115, 22] as const;
  if (currentG >= 2) return [245, 158, 11] as const;
  if (currentG >= 1) return [234, 179, 8] as const;
  return [34, 197, 94] as const;
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

function buildTodayForecast(kpForecastRaw: ForecastRow[], todayKey: string) {
  return kpForecastRaw
    .filter((row) => row.time_tag?.startsWith(todayKey))
    .map((row) => ({
      timeTag: row.time_tag,
      kp: parseFloat(String(row.kp)) || 0,
      observed: row.observed === "observed",
    }));
}

function buildUpcomingDays(kpForecastRaw: ForecastRow[], todayKey: string) {
  const map = new Map<string, number[]>();

  for (const row of kpForecastRaw) {
    const timeTag = row.time_tag;
    const day = timeTag?.slice(0, 10);
    const kp = parseFloat(String(row.kp));
    const observed = row.observed === "observed";

    if (!day || observed || Number.isNaN(kp) || day < todayKey) continue;
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

function formatKyivShortDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "numeric",
    month: "long",
  }).format(date);
}

function buildForecastEmojiLines(
  todayLabel: string,
  todayMaxKp: number,
  upcoming: Array<{ date: string; maxKp: number; avgKp: number; gScale: number }>,
) {
  const lines = [`${todayLabel}: ${kpToEmoji(todayMaxKp)} Kp ${todayMaxKp.toFixed(1)}`];
  for (const item of upcoming.slice(0, 2)) {
    lines.push(`${formatKyivShortDate(item.date)}: ${kpToEmoji(item.maxKp)} Kp ${item.maxKp.toFixed(1)}`);
  }
  return lines.join("; ");
}

function summarizeTodayWindows(todayForecast: Array<{ timeTag: string; kp: number; observed: boolean }>) {
  if (!todayForecast.length) {
    return {
      strongestStart: null as string | null,
      strongestEnd: null as string | null,
      strongestWindowLabel: null as string | null,
      strongestMaxKp: 0,
      strongestG: 0,
      windowsText: "прогноз на добу поки обмежений",
    };
  }

  const windows = [
    { key: "night", label: "00:00–06:00", hours: [0, 3, 6] },
    { key: "morning", label: "06:00–12:00", hours: [6, 9, 12] },
    { key: "day", label: "12:00–18:00", hours: [12, 15, 18] },
    { key: "evening", label: "18:00–24:00", hours: [18, 21, 24] },
  ];

  const dataByHour = new Map<number, number>();
  for (const item of todayForecast) {
    const kyivHour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Kyiv",
        hour: "2-digit",
        hour12: false,
      }).format(new Date(item.timeTag)),
    );
    dataByHour.set(kyivHour, item.kp);
  }

  const summarized = windows.map((window) => {
    const values = window.hours
      .map((hour) => dataByHour.get(hour))
      .filter((value): value is number => typeof value === "number");
    const maxKp = values.length ? Math.max(...values) : 0;
    return {
      ...window,
      maxKp,
      gScale: maxKp >= 5 ? Math.min(Math.floor(maxKp - 4), 5) : 0,
    };
  });

  const strongest = summarized.reduce((best, item) => (item.maxKp > best.maxKp ? item : best), summarized[0]);
  const windowsText = summarized
    .filter((item) => item.maxKp > 0)
    .map((item) => `${item.label} — до Kp ${item.maxKp.toFixed(1)} (G${item.gScale})`)
    .join("; ");

  return {
    strongestStart: strongest?.hours?.[0] !== undefined ? `${String(strongest.hours[0]).padStart(2, "0")}:00` : null,
    strongestEnd: strongest?.hours?.[1] !== undefined ? `${String(strongest.hours[1]).padStart(2, "0")}:00` : null,
    strongestWindowLabel: strongest?.label ?? null,
    strongestMaxKp: strongest?.maxKp ?? 0,
    strongestG: strongest?.gScale ?? 0,
    windowsText,
  };
}

function describeTimeRelation({
  currentHour,
  strongestStart,
  strongestEnd,
  strongestWindowLabel,
}: {
  currentHour: number;
  strongestStart: string | null;
  strongestEnd: string | null;
  strongestWindowLabel: string | null;
}) {
  if (!strongestStart || !strongestEnd || !strongestWindowLabel) {
    return "Немає достатньо даних, щоб визначити, чи піковий відрізок уже минув, триває зараз чи ще попереду.";
  }

  const startHour = Number(strongestStart.slice(0, 2));
  const endHour = Number(strongestEnd.slice(0, 2));

  if (currentHour >= endHour) {
    return `Найсильніший відрізок сьогодні вже минув: ${strongestWindowLabel}. Якщо згадуєш його в тексті, використовуй тільки минулий час: "був", "спостерігався", "припав на", "у перші години доби фон був вищим". Не пиши "очікується".`;
  }

  if (currentHour >= startHour && currentHour < endHour) {
    return `Найсильніший відрізок триває зараз: ${strongestWindowLabel}. Якщо згадуєш його в тексті, використовуй теперішній час: "триває", "зараз активність вища", "у проміжку ${strongestWindowLabel} фон підвищений".`;
  }

  return `Найсильніший відрізок ще попереду: ${strongestWindowLabel}. Якщо згадуєш його в тексті, можна використовувати майбутній час: "очікується", "можливе посилення", "найвищий фон прогнозується у проміжку ${strongestWindowLabel}".`;
}

async function generateAiText({
  openAiApiKey,
  dateLabel,
  dateKey,
  latestKp,
  currentG,
  todayMaxKp,
  windSpeed,
  windDensity,
  upcoming,
  todayWindowsText,
  strongestStart,
  strongestEnd,
  strongestWindowLabel,
  strongestMaxKp,
  strongestG,
  strongestTimeRelationHint,
}: {
  openAiApiKey: string;
  dateLabel: string;
  dateKey: string;
  latestKp: number;
  currentG: number;
  todayMaxKp: number;
  windSpeed: number;
  windDensity: number;
  upcoming: Array<{ date: string; maxKp: number; avgKp: number; gScale: number }>;
  todayWindowsText: string;
  strongestStart: string | null;
  strongestEnd: string | null;
  strongestWindowLabel: string | null;
  strongestMaxKp: number;
  strongestG: number;
  strongestTimeRelationHint: string;
}) {
  const forecastEmojiLines = buildForecastEmojiLines(dateLabel, todayMaxKp, upcoming);
  const likelyBodyImpact =
    todayMaxKp >= 5
      ? "можливий відчутніший вплив на самопочуття, особливо в чутливих людей"
      : todayMaxKp >= 4
        ? "у чутливих людей можливі втома, головний біль або коливання тиску"
        : "помітного впливу на самопочуття для більшості людей не очікується";

  const titlePrompt = `Ти пишеш заголовок для Telegram-поста українською в стилі інформаційного каналу про магнітні бурі.

Дані:
- Дата: ${dateLabel}
- Поточний Kp: ${latestKp.toFixed(1)}
- Максимум на сьогодні: ${todayMaxKp.toFixed(1)}
- Найпомітніший відрізок доби: ${strongestStart && strongestEnd ? `${strongestStart}–${strongestEnd}, до Kp ${strongestMaxKp.toFixed(1)}` : "даних недостатньо"}
- Коротко по добі: ${todayWindowsText}

Вимоги:
- один заголовок
- українська мова
- 55-95 символів
- стиль: телеграм-канал / новинний канал, але без клікбейту
- має відображати не лише ранок, а загальну картину дня
- якщо суттєве посилення очікується пізніше, це можна винести в заголовок
- без лапок, без markdown, без емодзі

Поверни тільки готовий заголовок.`;

  const textPrompt = `Ти — редактор українського Telegram-каналу про магнітні бурі. Напиши інформативний пост у стилі живого каналу: коротко, чітко, по-людськи, без канцеляриту, з акцентом на об'єктивний прогноз на весь день.

Дані NOAA на сьогодні (${dateLabel}, ключ дати ${dateKey}):
- Поточний Kp-індекс: ${latestKp.toFixed(1)}
- Максимальний прогноз Kp на сьогодні: ${todayMaxKp.toFixed(1)}
- Сонячний вітер: ${windSpeed.toFixed(0)} км/с
- Густина сонячного вітру: ${windDensity.toFixed(1)} p/cm³
- Картина по відрізках доби: ${todayWindowsText}
- Найпомітніший відрізок: ${strongestStart && strongestEnd ? `${strongestStart}–${strongestEnd}, до Kp ${strongestMaxKp.toFixed(1)}` : "даних недостатньо"}
- Готова підказка щодо часу: ${strongestTimeRelationHint}
- Наступні дні: ${upcoming.map((item) => `${formatKyivShortDate(item.date)}: max Kp ${item.maxKp.toFixed(1)}, avg Kp ${item.avgKp.toFixed(1)}`).join("; ")}
- Ймовірний висновок по самопочуттю: ${likelyBodyImpact}
- Формат блоку прогнозу по днях: ${forecastEmojiLines}

Вимоги:
- тільки українська мова
- без markdown
- 2-5 доречних емодзі, але стримано
- текст має бути об'єктивним і враховувати весь день
- не вигадуй фактів поза цими даними
- якщо день загалом спокійний, але ввечері можливе посилення, скажи це прямо
- окремо коротко поясни, чи можливий вплив на самопочуття і в які години це ймовірніше
- не перебільшуй загрозу, якщо дані цього не підтверджують
- довжина: 550-900 символів
- не використовуй сухі фрази типу "ми спостерігаємо", "ситуація характеризується", "відбуватиметься"
- не пиши як пресреліз або машинний звіт
- стиль має бути близьким до телеграм-поста з прикладу
- не допускай логічних суперечностей у часових формулюваннях
- не використовуй розмиті часові слова без прив'язки: "вночі", "вранці", "вдень", "увечері", якщо поруч немає конкретних годин або дати
- основний варіант — писати через інтервали годин: "з 00:00 до 03:00", "у проміжку 06:00–12:00", "після 18:00"
- якщо згадуєш ніч після 07:00 ранку, це може бути тільки минула ніч або "ніч на [дата]"
- якщо найсильніший відрізок припадає на 00:00–06:00, прямо пиши, що це було в перші години доби або з 00:00 до 06:00
- не подавай ніч як майбутній відрізок після публікації поста, якщо не вказана точна дата "у ніч на ..."
- якщо є ризик двозначності, завжди обирай формулювання з годинами, а не з частиною доби
- обов'язково дотримуйся підказки "Готова підказка щодо часу" і не супереч їй
- не повторюй ті самі числа і висновки кілька разів у різних реченнях
- якщо значення низькі й день спокійний, не драматизуй і не розтягуй пояснення
- не пиши суперечливих пар на кшталт "день загалом спокійний", а далі "найспокійнішими будуть лише кілька годин", якщо дані цього не показують
- не дублюй однакове значення Kp в кількох сусідніх реченнях без потреби
- пиши так, ніби це живий короткий щоденний апдейт каналу: щільно, ясно, без води
- тон: живий, але стриманий; ніби канал пояснює ситуацію своїм читачам
- речення мають бути короткими або середніми, без перевантажених конструкцій
- якщо день загалом неважкий, прямо скажи про це: без драматизації, але й без сухості
- блок про самопочуття пиши м'яко і практично: що можуть відчути метеочутливі люди і що краще зробити
- завершення коротке, природне, без рекламного пафосу

Структура:
1. Короткий лід з оцінкою ситуації на день
2. Абзац про те, як розподіляється активність упродовж доби
3. Блок "📊 Показники:" з короткими цифрами на окремих рядках
4. Блок "📅 Прогноз (${kpLegendLine()}):" на 2-3 найближчі дні, де кожен день на новому рядку у форматі "17 квітня: 🟠 Kp 5.7"
5. Короткий висновок про самопочуття і завершення зі згадкою magnitca.com

Орієнтир по тону:
- близько до формату "сьогодні так, вдень так, увечері так, ось показники, ось прогноз"
- текст має читатися як пост каналу, а не як машинна довідка
- припустимі конструкції: "сьогодні магнітних бур не очікується", "увечері можливе посилення", "найнапруженіший відрізок доби", "можна трохи видихнути"
- якщо згадуєш ніч, формулюй це в минулому часі: "уночі був пік", "ніч минула спокійніше", "основний стрибок уже залишився позаду"
- добрий орієнтир стилю: "день загалом не виглядає важким, але повністю тихим його теж не назвеш"
- ще один орієнтир: "для більшості людей це буде цілком нормальний день"
- не використовуй надто офіційні слова на кшталт "суттєвих відхилень", якщо є простіший варіант

Поверни тільки готовий текст поста.`;

  const [titleRes, textRes] = await Promise.all([
    fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: titlePrompt }],
        max_completion_tokens: 200,
      }),
    }),
    fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: textPrompt }],
        max_completion_tokens: 1500,
      }),
    }),
  ]);

  if (!titleRes.ok) {
    throw new Error(`AI title error [${titleRes.status}]: ${await titleRes.text()}`);
  }

  if (!textRes.ok) {
    throw new Error(`AI text error [${textRes.status}]: ${await textRes.text()}`);
  }

  const [titleData, textData] = await Promise.all([titleRes.json(), textRes.json()]);
  const title = titleData.choices?.[0]?.message?.content?.trim()?.replace(/^["«]|["»]$/g, "");
  const text = textData.choices?.[0]?.message?.content?.trim();

  if (!title) throw new Error("AI returned empty title");
  if (!text || text.length < 250) throw new Error("AI returned insufficient Telegram text");

  return { title, text };
}

async function generateFallbackPng(currentG: number) {
  const width = 1200;
  const height = 630;
  const [ar, ag, ab] = accentColor(currentG);
  const bgTop = [7, 16, 25];
  const bgBottom = [3, 7, 18];
  const cyan = [56, 189, 248];

  const raw = new Uint8Array(height * (1 + width * 3));
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0;
    offset += 1;
    const ty = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const baseR = bgTop[0] * (1 - ty) + bgBottom[0] * ty;
      const baseG = bgTop[1] * (1 - ty) + bgBottom[1] * ty;
      const baseB = bgTop[2] * (1 - ty) + bgBottom[2] * ty;

      const dWarm = Math.hypot(x - 900, y - 120);
      const warmGlow = Math.max(0, 1 - dWarm / 210) ** 2 * 0.62;

      const dCool = Math.hypot(x - 170, y - 520);
      const coolGlow = Math.max(0, 1 - dCool / 260) ** 2 * 0.22;

      const curveY = 405 + 42 * Math.sin((x / width) * Math.PI * 2.2) - 26 * Math.sin((x / width) * Math.PI * 5.1);
      const band = Math.exp(-Math.pow((y - curveY) / 24, 2)) * 0.34;

      const curveY2 = 470 + 24 * Math.sin((x / width) * Math.PI * 3.4 + 0.8);
      const band2 = Math.exp(-Math.pow((y - curveY2) / 18, 2)) * 0.18;

      let r = baseR + ar * warmGlow + cyan[0] * coolGlow + ar * band + cyan[0] * band2;
      let g = baseG + ag * warmGlow + cyan[1] * coolGlow + ag * band + cyan[1] * band2;
      let b = baseB + ab * warmGlow + cyan[2] * coolGlow + ab * band + cyan[2] * band2;

      if ((x * 92821 + y * 68917) % 12011 === 0) {
        r += 70;
        g += 70;
        b += 70;
      }

      raw[offset] = Math.max(0, Math.min(255, Math.round(r)));
      raw[offset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      raw[offset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      offset += 3;
    }
  }

  const compressed = await deflate(raw);
  const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  const ihdrView = new DataView(ihdr.buffer);
  ihdrView.setUint32(0, width);
  ihdrView.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const parts = [
    pngSignature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", new Uint8Array()),
  ];
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const png = new Uint8Array(total);
  let cursor = 0;
  for (const part of parts) {
    png.set(part, cursor);
    cursor += part.length;
  }

  return png;
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram message error: ${JSON.stringify(data)}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not configured");
    if (!TELEGRAM_CHAT_ID) throw new Error("TELEGRAM_CHAT_ID not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env is not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const force = body?.force === true;

    const now = new Date();
    const kyivDateKey = getKyivDateKey(now);
    const kyivHour = getKyivHour(now);
    const dateLabel = formatKyivDate(now);
    const slugUk = `mahnitni-buri-sogodni-${kyivDateKey}`;

    if (!force && kyivHour !== 7) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Outside 07:00 Europe/Kyiv publishing window" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: existingPost, error: existingError } = await supabase
      .from("news")
      .select("id, slug_uk, slug_ru, telegram_sent, source, title_ru, content_ru, image_url")
      .eq("slug_uk", slugUk)
      .maybeSingle();

    if (existingError) throw new Error(existingError.message);

    if (existingPost && existingPost.telegram_sent && !force) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Post already sent today", news_id: existingPost.id }),
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
    const todayForecast = buildTodayForecast(kpForecastRaw, kyivDateKey);
    const todayMaxKp = todayForecast.length ? Math.max(...todayForecast.map((item) => item.kp)) : latestKp;
    const upcoming = buildUpcomingDays(kpForecastRaw, kyivDateKey);
    const todayWindows = summarizeTodayWindows(todayForecast);
    const strongestTimeRelationHint = describeTimeRelation({
      currentHour: kyivHour,
      strongestStart: todayWindows.strongestStart,
      strongestEnd: todayWindows.strongestEnd,
      strongestWindowLabel: todayWindows.strongestWindowLabel,
    });

    const { title, text } = await generateAiText({
      openAiApiKey: OPENAI_API_KEY,
      dateLabel,
      dateKey: kyivDateKey,
      latestKp,
      currentG,
      todayMaxKp,
      windSpeed,
      windDensity,
      upcoming,
      todayWindowsText: todayWindows.windowsText,
      strongestStart: todayWindows.strongestStart,
      strongestEnd: todayWindows.strongestEnd,
      strongestWindowLabel: todayWindows.strongestWindowLabel,
      strongestMaxKp: todayWindows.strongestMaxKp,
      strongestG: todayWindows.strongestG,
      strongestTimeRelationHint,
    });
    const telegramCaption = clampTelegramCaption(text);

    const binaryData = await generateFallbackPng(currentG);
    const fileName = `${slugify(title)}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

    if (uploadError) throw new Error(`Image upload error: ${uploadError.message}`);

    const { data: imagePublic } = supabase.storage.from("news-images").getPublicUrl(fileName);
    const imageUrl = imagePublic.publicUrl;

    let newsId = existingPost?.id ?? null;

    if (existingPost?.id) {
      const hasLocalizedSiteContent = Boolean(existingPost.slug_ru && existingPost.title_ru && existingPost.content_ru);
      const updatePayload = hasLocalizedSiteContent
        ? {
            telegram_sent: true,
            image_url: existingPost.image_url || imageUrl,
          }
        : {
            title,
            slug: slugUk,
            content: text,
            source: "telegram_ai",
            image_url: imageUrl,
            meta_title: title,
            meta_description: telegramCaption.replace(/\s+/g, " ").slice(0, 160),
            status: "published",
            telegram_sent: true,
            title_uk: title,
            slug_uk: slugUk,
            content_uk: text,
            meta_title_uk: title,
            meta_description_uk: telegramCaption.replace(/\s+/g, " ").slice(0, 160),
            published_at: now.toISOString(),
          };

      const { data: updatedNews, error: updateError } = await supabase
        .from("news")
        .update(updatePayload)
        .eq("id", existingPost.id)
        .select("id")
        .single();

      if (updateError) throw new Error(updateError.message);
      newsId = updatedNews.id;
    } else {
      const payload = {
        title,
        slug: slugUk,
        content: text,
        source: "telegram_ai",
        image_url: imageUrl,
        meta_title: title,
        meta_description: telegramCaption.replace(/\s+/g, " ").slice(0, 160),
        status: "published",
        telegram_sent: true,
        title_uk: title,
        slug_uk: slugUk,
        content_uk: text,
        meta_title_uk: title,
        meta_description_uk: telegramCaption.replace(/\s+/g, " ").slice(0, 160),
        published_at: now.toISOString(),
      };

      const { data: insertedNews, error: insertError } = await supabase
        .from("news")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);
      newsId = insertedNews.id;
    }

    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("caption", telegramCaption);
    formData.append("photo", new Blob([binaryData], { type: "image/png" }), fileName);

    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData,
    });

    const telegramData = await telegramRes.json();
    if (!telegramData.ok) {
      console.warn("Telegram photo send failed, falling back to text:", telegramData);
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, telegramCaption);
    }

    return new Response(
      JSON.stringify({
        success: true,
        news_id: newsId,
        slug_uk: slugUk,
        title,
        image_url: imageUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("telegram-forecast error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
