import { inflateRawSync } from "node:zlib";

const HUNGAROMET_WARNINGS_INDEX_URL = "https://odp.met.hu/weather/warnings/wbhx/";
const HUNGAROMET_SOURCE_URL = "https://www.met.hu/idojaras/veszelyjelzes/figyelmezteto_elorejelzes_mara/";

export type HungaroMetWarningSummary = {
  status: "none" | "active";
  updatedAt: string | null;
  level: number | null;
  types: string[];
  periods: string[];
  details: string[];
  summary: string;
  sourceUrl: string;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : null;
}

function readIssuedAt(xml: string) {
  const issuedMatch = xml.match(/<issued[^>]*code="([^"]+)"/i);
  return issuedMatch?.[1] ?? readTag(xml, "issued");
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatSummary(types: string[], level: number | null) {
  if (types.length === 0) return "Nincs figyelmeztetés";
  return level ? `${types.join(", ")} · ${level}. szint` : types.join(", ");
}

function latestWarningZipUrl(indexHtml: string) {
  const files = Array.from(indexHtml.matchAll(/href="(wbhx\d{8}_\d{4}\.xml\.zip)"/g))
    .map((match) => match[1])
    .sort();
  const latest = files.at(-1);
  return latest ? `${HUNGAROMET_WARNINGS_INDEX_URL}${latest}` : null;
}

function unzipFirstXml(buffer: Buffer) {
  const signature = 0x04034b50;

  for (let offset = 0; offset < buffer.length - 30; offset += 1) {
    if (buffer.readUInt32LE(offset) !== signature) continue;

    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const dataStart = offset + 30 + fileNameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    const payload = buffer.subarray(dataStart, dataEnd);

    if (method === 0) return payload.toString("utf8");
    if (method === 8) return inflateRawSync(payload).toString("utf8");
  }

  throw new Error("HungaroMet zip has no readable XML entry");
}

function parseCountyWarning(xml: string, county: string): HungaroMetWarningSummary {
  const areaBlocks = Array.from(xml.matchAll(/<area>([\s\S]*?)<\/area>/gi)).map((match) => match[1]);
  const area = areaBlocks.find((block) => readTag(block, "areadesc") === county);
  const updatedAt = readIssuedAt(xml);

  if (!area) {
    return {
      status: "none",
      updatedAt,
      level: null,
      types: [],
      periods: [],
      details: [],
      summary: "Nincs figyelmeztetés",
      sourceUrl: HUNGAROMET_SOURCE_URL,
    };
  }

  const infoBlocks = Array.from(area.matchAll(/<info>([\s\S]*?)<\/info>/gi)).map((match) => match[1]);
  const warnings = infoBlocks.map((block) => ({
    event: readTag(block, "event") ?? "Időjárási veszély",
    level: Number(readTag(block, "level")) || null,
    description: readTag(block, "description") ?? "",
    web: readTag(block, "web") ?? HUNGAROMET_SOURCE_URL,
  }));
  const types = dedupe(warnings.map((warning) => warning.event));
  const details = dedupe(warnings.map((warning) => warning.description));
  const maxLevel = warnings.reduce<number | null>((max, warning) => {
    if (!warning.level) return max;
    return max === null ? warning.level : Math.max(max, warning.level);
  }, null);

  return {
    status: types.length > 0 ? "active" : "none",
    updatedAt,
    level: maxLevel,
    types,
    periods: [],
    details,
    summary: formatSummary(types, maxLevel),
    sourceUrl: warnings[0]?.web?.replace(/^http:\/\//, "https://") ?? HUNGAROMET_SOURCE_URL,
  };
}

export async function fetchHungaroMetWarning(county: string): Promise<HungaroMetWarningSummary> {
  const indexResponse = await fetch(HUNGAROMET_WARNINGS_INDEX_URL, { cache: "no-store" });

  if (!indexResponse.ok) {
    throw new Error(`HungaroMet warnings index request failed: ${indexResponse.status}`);
  }

  const zipUrl = latestWarningZipUrl(await indexResponse.text());
  if (!zipUrl) {
    throw new Error("HungaroMet warnings index has no XML zip files");
  }

  const zipResponse = await fetch(zipUrl, { cache: "no-store" });
  if (!zipResponse.ok) {
    throw new Error(`HungaroMet warnings zip request failed: ${zipResponse.status}`);
  }

  const xml = unzipFirstXml(Buffer.from(await zipResponse.arrayBuffer()));
  return parseCountyWarning(xml, county);
}
