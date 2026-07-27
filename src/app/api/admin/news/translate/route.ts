import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { SiteLocale } from "@/lib/locale";

type TranslateFields = {
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
};

const DEEPL_LANG: Record<SiteLocale, string> = {
  uk: "UK",
  ru: "RU",
  pl: "PL",
  ro: "RO",
  hu: "HU",
  bg: "BG",
  en: "EN-US",
};

const ALLOWED_LOCALES = new Set<SiteLocale>(["uk", "ru", "pl", "ro", "hu", "bg", "en"]);

function normalizeLocale(value: unknown): SiteLocale | null {
  return typeof value === "string" && ALLOWED_LOCALES.has(value as SiteLocale)
    ? (value as SiteLocale)
    : null;
}

async function translateTexts({
  apiKey,
  apiUrl,
  sourceLocale,
  targetLocale,
  texts,
  html,
}: {
  apiKey: string;
  apiUrl: string;
  sourceLocale: SiteLocale;
  targetLocale: SiteLocale;
  texts: string[];
  html?: boolean;
}) {
  if (texts.length === 0) return [];

  const params = new URLSearchParams();
  for (const text of texts) {
    params.append("text", text);
  }
  params.set("source_lang", DEEPL_LANG[sourceLocale]);
  params.set("target_lang", DEEPL_LANG[targetLocale]);
  if (html) {
    params.set("tag_handling", "html");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `DeepL returned ${response.status}`);
  }

  const data = (await response.json()) as { translations?: Array<{ text?: string }> };
  return (data.translations ?? []).map((translation) => translation.text ?? "");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sourceLocale = normalizeLocale(body?.sourceLocale);
    const targetLocale = normalizeLocale(body?.targetLocale);
    const fields = (body?.fields ?? {}) as TranslateFields;

    if (!sourceLocale || !targetLocale || sourceLocale === targetLocale) {
      return NextResponse.json({ error: "Invalid translation languages." }, { status: 400 });
    }

    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DEEPL_API_KEY is not configured." }, { status: 500 });
    }

    const apiUrl =
      process.env.DEEPL_API_URL ??
      (apiKey.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate");

    const plainKeys = ["title", "meta_title", "meta_description"] as const;
    const plainValues = plainKeys.map((key) => fields[key]?.trim() ?? "");
    const plainIndexes = plainValues
      .map((value, index) => ({ value, index }))
      .filter((item) => item.value.length > 0);

    const translatedPlain = await translateTexts({
      apiKey,
      apiUrl,
      sourceLocale,
      targetLocale,
      texts: plainIndexes.map((item) => item.value),
    });

    const content = fields.content?.trim() ?? "";
    const translatedContent = content
      ? (
          await translateTexts({
            apiKey,
            apiUrl,
            sourceLocale,
            targetLocale,
            texts: [content],
            html: true,
          })
        )[0]
      : "";

    const result: TranslateFields = {
      content: translatedContent,
    };

    plainIndexes.forEach((item, translatedIndex) => {
      result[plainKeys[item.index]] = translatedPlain[translatedIndex] ?? "";
    });

    return NextResponse.json({ translation: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to translate news." },
      { status: 500 },
    );
  }
}
