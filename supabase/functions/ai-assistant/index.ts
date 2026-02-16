import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile.credits <= 0) {
      return new Response(JSON.stringify({ error: "no_credits", credits: 0 }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, history } = await req.json();
    if (!message) throw new Error("Message is required");

    // Fetch user's test results and current weather data in parallel

    const [testRes, kpRes, scalesRes, solarWindRes, forecastRes] = await Promise.all([
      serviceClient.from("test_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
      fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`),
      fetch(`${SWPC_BASE}/text/27-day-outlook.txt`),
    ]);

    // Parse NOAA data
    const kpData = await kpRes.json();
    const scales = await scalesRes.json();
    const solarWindRaw: string[][] = await solarWindRes.json();

    const latestKp = kpData.length > 0
      ? parseFloat(kpData[kpData.length - 1].estimated_kp ?? kpData[kpData.length - 1].kp_index ?? "0")
      : 0;
    const lastWind = solarWindRaw.length > 1 ? solarWindRaw[solarWindRaw.length - 1] : null;
    const windSpeed = lastWind ? parseFloat(lastWind[2]) || 0 : 0;
    const windDensity = lastWind ? parseFloat(lastWind[1]) || 0 : 0;
    const currentG = parseInt(scales["-1"]?.G?.Scale ?? "0");

    // Parse 27-day forecast
    const forecastText = await forecastRes.text();
    const forecastLines = forecastText.split("\n")
      .filter((line: string) => /^\d{4}\s/.test(line.trim()))
      .slice(0, 14) // next 2 weeks
      .map((line: string) => {
        const parts = line.trim().split(/\s+/);
        return `${parts[0]} ${parts[1]} ${parts[2]}: Kp до ${parts[5]}, A=${parts[4]}`;
      })
      .join("\n");

    const testResult = testRes.data?.[0];
    let userContext = "";
    if (testResult) {
      userContext = `
Дані користувача з тесту на метеозалежність:
- Ім'я: ${testResult.name}
- Вік: ${testResult.age}
- Стать: ${testResult.gender}
- Хронічні захворювання: ${testResult.has_chronic ? "так" : "ні"}
- Рівень метеозалежності: ${testResult.score}%
- Відповіді на тест: ${JSON.stringify(testResult.answers)}`;
    } else {
      userContext = "\nКористувач ще не пройшов тест на метеозалежність.";
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString("uk-UA", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const systemPrompt = `Ти — ШІ-асистент порталу «Магнітка» про космічну погоду та її вплив на здоров'я людей. Відповідай виключно українською мовою.

Актуальні дані космічної погоди (${dateStr}):
- Kp-індекс: ${latestKp.toFixed(1)}
- G-шкала: G${currentG}
- Швидкість сонячного вітру: ${windSpeed.toFixed(0)} км/с
- Густина сонячного вітру: ${windDensity.toFixed(1)} p/cm³

Прогноз на найближчі 14 днів (NOAA 27-Day Outlook):
${forecastLines}
${userContext}

Правила:
1. Надавай персоналізовані відповіді з урахуванням рівня метеозалежності користувача
2. Посилайся на актуальні дані NOAA, не вигадуй цифри
3. Пояснюй вплив магнітних бур на здоров'я залежно від рівня метеозалежності (якщо тест пройдено)
4. Давай практичні поради щодо самопочуття
5. Будь стислим але інформативним, 2-4 абзаци
6. Якщо питання не стосується космічної погоди чи здоров'я — ввічливо поясни свою спеціалізацію
7. Не використовуй markdown-заголовки (#), але можеш використовувати жирний текст (**) та списки
8. Звертайся до користувача на "ви"`;

    // Build messages for AI
    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (last 10 messages)
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-10)) {
        messages.push({ role: h.role, content: h.content });
      }
    }

    messages.push({ role: "user", content: message });

    const aiRes = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 1000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI error [${aiRes.status}]: ${errText}`);
    }

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("AI returned empty response");

    // Deduct 1 credit
    const newCredits = profile.credits - 1;
    await serviceClient
      .from("profiles")
      .update({ credits: newCredits })
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({ reply, credits: newCredits }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
