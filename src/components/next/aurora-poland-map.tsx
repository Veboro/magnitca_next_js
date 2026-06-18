"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AuroraRegion } from "@/lib/aurora-forecast";

const chanceColors = {
  veryHigh: "hsl(16 92% 53%)",
  high: "hsl(34 96% 52%)",
  medium: "hsl(48 94% 52%)",
  low: "hsl(145 64% 46%)",
  none: "hsl(215 26% 24%)",
};

type RegionTone = keyof typeof chanceColors;
type MapCenter = [number, number];

export type AuroraCountryMapProps = {
  boundariesUrl: string;
  center: MapCenter;
  regions: AuroraRegion[];
  labels: AuroraMapConfig["labels"];
  legend: AuroraMapConfig["legend"];
  regionLinks?: AuroraMapConfig["regionLinks"];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
};

type BoundaryFeature = {
  properties?: {
    shapeISO?: string;
    shapeName?: string;
  };
};

type StyleableLayer = {
  setStyle: (style: {
    color?: string;
    weight?: number;
    fillOpacity?: number;
  }) => void;
};

type AuroraMapConfig = {
  boundariesUrl: string;
  center: MapCenter;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  regions: AuroraRegion[];
  regionLinks?: Record<string, { href: string; label: string }>;
  legend: Array<{ label: string; tone: RegionTone }>;
  labels: {
    legend: string;
    chance: string;
    boundariesError: string;
  };
};

function escapePopupHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRegionPopup(region: AuroraRegion, config: AuroraMapConfig) {
  const regionLink = config.regionLinks?.[region.iso];
  const linkHtml = regionLink
    ? `<a href="${escapePopupHtml(regionLink.href)}" class="aurora-map-popup-link">${escapePopupHtml(regionLink.label)}</a>`
    : "";

  return [
    `<strong>${escapePopupHtml(region.name)}</strong>`,
    `${escapePopupHtml(config.labels.chance)}: ${region.chance}%`,
    escapePopupHtml(region.note),
    linkHtml,
  ].filter(Boolean).join("<br/>");
}

const polandRegions: AuroraRegion[] = [
  {
    id: "zachodniopomorskie",
    iso: "PL-ZP",
    name: "Zachodniopomorskie",
    chance: 74,
    tone: "high",
    note: "dobry północny horyzont nad Bałtykiem",
  },
  {
    id: "pomorskie",
    iso: "PL-PM",
    name: "Pomorskie",
    chance: 82,
    tone: "veryHigh",
    note: "najlepsze warunki przy czystym wybrzeżu",
  },
  {
    id: "warminsko-mazurskie",
    iso: "PL-WN",
    name: "Warmińsko-Mazurskie",
    chance: 86,
    tone: "veryHigh",
    note: "ciemne niebo i wysoka szerokość geograficzna",
  },
  {
    id: "podlaskie",
    iso: "PL-PD",
    name: "Podlaskie",
    chance: 77,
    tone: "high",
    note: "bardzo dobre ciemne miejsca poza miastami",
  },
  {
    id: "lubuskie",
    iso: "PL-LB",
    name: "Lubuskie",
    chance: 42,
    tone: "low",
    note: "możliwe tylko przy silniejszej burzy",
  },
  {
    id: "wielkopolskie",
    iso: "PL-WP",
    name: "Wielkopolskie",
    chance: 51,
    tone: "medium",
    note: "lepiej szukać ciemnych miejsc na północy regionu",
  },
  {
    id: "kujawsko-pomorskie",
    iso: "PL-KP",
    name: "Kujawsko-Pomorskie",
    chance: 61,
    tone: "medium",
    note: "umiarkowana szansa przy północnym horyzoncie",
  },
  {
    id: "mazowieckie",
    iso: "PL-MZ",
    name: "Mazowieckie",
    chance: 49,
    tone: "medium",
    note: "poza Warszawą i przy niskim zachmurzeniu",
  },
  {
    id: "lodzkie",
    iso: "PL-LD",
    name: "Łódzkie",
    chance: 37,
    tone: "low",
    note: "raczej tylko przy intensywnej aktywności",
  },
  {
    id: "lubelskie",
    iso: "PL-LU",
    name: "Lubelskie",
    chance: 38,
    tone: "low",
    note: "najlepiej przy bardzo czystym północnym niebie",
  },
  {
    id: "dolnoslaskie",
    iso: "PL-DS",
    name: "Dolnośląskie",
    chance: 24,
    tone: "none",
    note: "niska szansa, południowe położenie ogranicza widoczność",
  },
  {
    id: "opolskie",
    iso: "PL-OP",
    name: "Opolskie",
    chance: 19,
    tone: "none",
    note: "widoczność mało prawdopodobna",
  },
  {
    id: "slaskie",
    iso: "PL-SL",
    name: "Śląskie",
    chance: 21,
    tone: "none",
    note: "duże zanieczyszczenie światłem utrudnia obserwację",
  },
  {
    id: "swietokrzyskie",
    iso: "PL-SK",
    name: "Świętokrzyskie",
    chance: 31,
    tone: "low",
    note: "możliwy słaby łuk przy bardzo mocnej burzy",
  },
  {
    id: "malopolskie",
    iso: "PL-MA",
    name: "Małopolskie",
    chance: 18,
    tone: "none",
    note: "niska szansa, ale góry mogą pomóc przy czystym niebie",
  },
  {
    id: "podkarpackie",
    iso: "PL-PK",
    name: "Podkarpackie",
    chance: 20,
    tone: "none",
    note: "najczęściej zbyt daleko na południe dla słabej zorzy",
  },
];

const ukraineRegions: AuroraRegion[] = [
  {
    id: "chernihivska",
    iso: "UA-74",
    name: "Чернігівська область",
    chance: 56,
    tone: "medium",
    note: "найкращий сценарій для півночі України за умови темного неба",
  },
  {
    id: "volynska",
    iso: "UA-07",
    name: "Волинська область",
    chance: 53,
    tone: "medium",
    note: "шукайте відкритий північний горизонт подалі від міст",
  },
  {
    id: "rivnenska",
    iso: "UA-56",
    name: "Рівненська область",
    chance: 51,
    tone: "medium",
    note: "можлива слабка дуга на півночі області при високому Kp",
  },
  {
    id: "sumska",
    iso: "UA-59",
    name: "Сумська область",
    chance: 50,
    tone: "medium",
    note: "краще спостерігати за містом і без засвітки на півночі",
  },
  {
    id: "zhytomyrska",
    iso: "UA-18",
    name: "Житомирська область",
    chance: 44,
    tone: "low",
    note: "шанси нижчі, але північні райони можуть спрацювати під час сильної бурі",
  },
  {
    id: "kyivska",
    iso: "UA-32",
    name: "Київська область",
    chance: 38,
    tone: "low",
    note: "уникайте засвітки Києва, обирайте відкриті місця на півночі області",
  },
  {
    id: "kyiv",
    iso: "UA-30",
    name: "Київ",
    chance: 24,
    tone: "none",
    note: "міська засвітка сильно знижує видимість навіть при високому Kp",
  },
  {
    id: "lvivska",
    iso: "UA-46",
    name: "Львівська область",
    chance: 34,
    tone: "low",
    note: "потрібна сильна буря, чисте небо і мінімум засвітки",
  },
  {
    id: "ternopilska",
    iso: "UA-61",
    name: "Тернопільська область",
    chance: 28,
    tone: "low",
    note: "ймовірність невисока, але можлива слабка видимість при G3+",
  },
  {
    id: "khmelnytska",
    iso: "UA-68",
    name: "Хмельницька область",
    chance: 27,
    tone: "low",
    note: "краще спостерігати лише під час піків активності",
  },
  {
    id: "poltavska",
    iso: "UA-53",
    name: "Полтавська область",
    chance: 32,
    tone: "low",
    note: "слабке світіння можливе ближче до північного горизонту",
  },
  {
    id: "kharkivska",
    iso: "UA-63",
    name: "Харківська область",
    chance: 30,
    tone: "low",
    note: "потрібне чисте небо і дуже темний горизонт",
  },
  {
    id: "cherkaska",
    iso: "UA-71",
    name: "Черкаська область",
    chance: 25,
    tone: "low",
    note: "переважно слабкий шанс, видимість можлива лише при сильній бурі",
  },
  {
    id: "vinnytska",
    iso: "UA-05",
    name: "Вінницька область",
    chance: 23,
    tone: "none",
    note: "для більшості ночей шанс низький через південніше розташування",
  },
  {
    id: "kirovohradska",
    iso: "UA-35",
    name: "Кіровоградська область",
    chance: 20,
    tone: "none",
    note: "видимість малоймовірна без дуже сильної геомагнітної бурі",
  },
  {
    id: "dnipropetrovska",
    iso: "UA-12",
    name: "Дніпропетровська область",
    chance: 18,
    tone: "none",
    note: "потрібна винятково сильна активність і прозора атмосфера",
  },
  {
    id: "zakarpatska",
    iso: "UA-21",
    name: "Закарпатська область",
    chance: 17,
    tone: "none",
    note: "гори допомагають з темрявою, але широта знижує шанс",
  },
  {
    id: "ivano-frankivska",
    iso: "UA-26",
    name: "Івано-Франківська область",
    chance: 16,
    tone: "none",
    note: "низька ймовірність, можливі лише рідкісні сильні спалахи",
  },
  {
    id: "chernivetska",
    iso: "UA-77",
    name: "Чернівецька область",
    chance: 14,
    tone: "none",
    note: "найчастіше занадто південне розташування для слабкої зорі",
  },
  {
    id: "odeska",
    iso: "UA-51",
    name: "Одеська область",
    chance: 12,
    tone: "none",
    note: "видимість малоймовірна, окрім дуже сильних геомагнітних подій",
  },
  {
    id: "mykolaivska",
    iso: "UA-48",
    name: "Миколаївська область",
    chance: 11,
    tone: "none",
    note: "шанс низький, спостереження мають сенс лише при екстремальній активності",
  },
  {
    id: "khersonska",
    iso: "UA-65",
    name: "Херсонська область",
    chance: 10,
    tone: "none",
    note: "переважно поза зоною реалістичної видимості слабкої зорі",
  },
  {
    id: "zaporizka",
    iso: "UA-23",
    name: "Запорізька область",
    chance: 12,
    tone: "none",
    note: "потрібна дуже сильна буря і повністю відкритий північний горизонт",
  },
  {
    id: "donetska",
    iso: "UA-14",
    name: "Донецька область",
    chance: 13,
    tone: "none",
    note: "видимість малоймовірна без екстремального Kp",
  },
  {
    id: "luhanska",
    iso: "UA-09",
    name: "Луганська область",
    chance: 15,
    tone: "none",
    note: "шанс низький, але трохи вищий на півночі області",
  },
  {
    id: "crimea",
    iso: "UA-43",
    name: "АР Крим",
    chance: 8,
    tone: "none",
    note: "для більшості подій занадто південне розташування",
  },
  {
    id: "sevastopol",
    iso: "UA-40",
    name: "Севастополь",
    chance: 7,
    tone: "none",
    note: "видимість практично можлива лише під час екстремальних подій",
  },
];

const polandConfig: AuroraMapConfig = {
  boundariesUrl: "/geo/poland-voivodeships.geojson",
  center: [52.15, 19.25],
  zoom: 6,
  minZoom: 5,
  maxZoom: 8,
  regions: polandRegions,
  legend: [
    { label: "bardzo wysoka", tone: "veryHigh" },
    { label: "wysoka", tone: "high" },
    { label: "umiarkowana", tone: "medium" },
    { label: "niska", tone: "low" },
    { label: "brak / mała", tone: "none" },
  ],
  labels: {
    legend: "Szansa zobaczenia zorzy polarnej",
    chance: "Szansa",
    boundariesError: "Nie udało się wczytać granic województw.",
  },
};

const ukraineConfig: AuroraMapConfig = {
  boundariesUrl: "/geo/ukraine-oblasts.geojson",
  center: [49.2, 31.4],
  zoom: 6,
  minZoom: 5,
  maxZoom: 8,
  regions: ukraineRegions,
  legend: [
    { label: "дуже висока", tone: "veryHigh" },
    { label: "висока", tone: "high" },
    { label: "помірна", tone: "medium" },
    { label: "низька", tone: "low" },
    { label: "майже немає", tone: "none" },
  ],
  labels: {
    legend: "Шанс побачити північне / полярне сяйво",
    chance: "Шанс",
    boundariesError: "Не вдалося завантажити межі областей.",
  },
};

function AuroraRegionMap({ config }: { config: AuroraMapConfig }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<{ remove: () => void } | null>(null);

  const regionByIso = useMemo(
    () => new Map(config.regions.map((region) => [region.iso, region])),
    [config.regions],
  );

  useEffect(() => {
    let cancelled = false;

    const ensureLeafletCss = () => {
      if (document.querySelector('link[data-leaflet-css="true"]')) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      link.dataset.leafletCss = "true";
      document.head.appendChild(link);
    };

    async function initMap() {
      if (!mapRef.current || leafletMapRef.current) return;
      ensureLeafletCss();

      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: config.center,
        zoom: config.zoom,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      map.attributionControl.addAttribution(
        'Boundaries: <a href="https://www.geoboundaries.org/">geoBoundaries</a>',
      );

      const boundariesResponse = await fetch(config.boundariesUrl);
      if (!boundariesResponse.ok) {
        throw new Error(config.labels.boundariesError);
      }
      if (cancelled || !mapRef.current) return;

      const boundaries = await boundariesResponse.json();
      const regionLayer = L.geoJSON(boundaries, {
        style: (feature) => {
          const region = regionByIso.get((feature as BoundaryFeature | undefined)?.properties?.shapeISO ?? "");
          const tone = region?.tone ?? "none";

          return {
            color: "rgba(255,255,255,0.86)",
            weight: 1.25,
            fillColor: chanceColors[tone],
            fillOpacity: tone === "none" ? 0.42 : 0.72,
            opacity: 0.92,
          };
        },
        onEachFeature: (feature, layer) => {
          const boundary = feature as BoundaryFeature;
          const region = regionByIso.get(boundary.properties?.shapeISO ?? "");
          if (!region) return;
          const styleableLayer = layer as typeof layer & StyleableLayer;

          layer.on("mouseover", () => {
            styleableLayer.setStyle({
              color: "rgba(255,255,255,0.98)",
              weight: 2.5,
              fillOpacity: region.tone === "none" ? 0.56 : 0.88,
            });
          });

          layer.on("mouseout", () => {
            styleableLayer.setStyle({
              color: "rgba(255,255,255,0.86)",
              weight: 1.25,
              fillOpacity: region.tone === "none" ? 0.42 : 0.72,
            });
          });

          layer.on("click", () => {
            layer
              .bindPopup(buildRegionPopup(region, config))
              .openPopup();
          });
        },
      }).addTo(map);

      map.fitBounds(regionLayer.getBounds(), {
        padding: [24, 24],
      });

      leafletMapRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [config, regionByIso]);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
      <div className="space-y-4">
        <div className="relative isolate z-0 overflow-hidden rounded-xl border border-border/50 bg-background/40 p-2">
          <div ref={mapRef} className="h-[560px] min-h-[460px] w-full overflow-hidden rounded-lg bg-muted/30" />
        </div>

        <div className="flex flex-col items-stretch gap-2 rounded-xl border border-border/50 bg-background/40 p-3 lg:flex-row lg:items-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:mr-2 lg:shrink-0 lg:whitespace-nowrap">{config.labels.legend}</p>
          {config.legend.map((item) => (
            <div key={item.tone} className="flex items-center gap-2 rounded-full border border-border/40 bg-card px-2.5 py-1.5 text-sm font-medium text-muted-foreground lg:shrink-0">
              <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: chanceColors[item.tone] }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuroraPolandMap({
  regions = polandRegions,
}: {
  regions?: AuroraRegion[];
}) {
  const config = useMemo(
    () => ({
      ...polandConfig,
      regions,
    }),
    [regions],
  );

  return <AuroraRegionMap config={config} />;
}

export function AuroraUkraineMap({
  regions = ukraineRegions,
}: {
  regions?: AuroraRegion[];
}) {
  const config = useMemo(
    () => ({
      ...ukraineConfig,
      regions,
    }),
    [regions],
  );

  return <AuroraRegionMap config={config} />;
}

export function AuroraCountryMap({
  boundariesUrl,
  center,
  regions,
  labels,
  legend,
  regionLinks,
  zoom = 7,
  minZoom = 5,
  maxZoom = 9,
}: AuroraCountryMapProps) {
  const config = useMemo(
    () => ({
      boundariesUrl,
      center,
      zoom,
      minZoom,
      maxZoom,
      regions,
      labels,
      legend,
      regionLinks,
    }),
    [boundariesUrl, center, labels, legend, maxZoom, minZoom, regionLinks, regions, zoom],
  );

  return <AuroraRegionMap config={config} />;
}
