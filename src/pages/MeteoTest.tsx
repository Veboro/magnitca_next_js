import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, ArrowRight, Loader2, Activity, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";

// ─── Personal info step types ───
interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  hasChronic: boolean;
  chronicDetails: string;
  physicalActivity: string;
}

// ─── Questions ───
const questions = [
  "Чи відчуваєте ви головний біль під час магнітних бур?",
  "Чи буває у вас підвищена втомлюваність у дні геомагнітних збурень?",
  "Чи маєте проблеми зі сном напередодні або під час магнітних бур?",
  "Чи помічаєте різкі зміни настрою, пов'язані з сонячною активністю?",
  "Чи відчуваєте коливання артеріального тиску під час бур?",
  "Чи буває у вас запаморочення під час геомагнітної активності?",
  "Чи відчуваєте біль у суглобах або м'язах під час магнітних бур?",
  "Чи з'являється тривожність або неспокій під час магнітних бур?",
  "Чи маєте проблеми з концентрацією під час геомагнітних збурень?",
  "Чи помічаєте порушення серцевого ритму під час бур?",
  "Чи відчуваєте зміни погоди ще до того, як вони настають?",
  "Чи погіршуються хронічні захворювання під час магнітних бур?",
];

const answerOptions = [
  { label: "Ніколи", value: 0 },
  { label: "Рідко", value: 1 },
  { label: "Іноді", value: 2 },
  { label: "Часто", value: 3 },
  { label: "Завжди", value: 4 },
];

const genderOptions = ["Чоловіча", "Жіноча", "Інше"];
const activityOptions = ["Низька", "Помірна", "Висока"];

function calculateScore(answers: number[], info: PersonalInfo): number {
  const maxRaw = questions.length * 4;
  let raw = answers.reduce((a, b) => a + b, 0);

  // Age modifier: older people are more sensitive
  const age = parseInt(info.age) || 30;
  if (age > 50) raw += 3;
  else if (age > 40) raw += 2;
  else if (age > 30) raw += 1;

  // Chronic conditions modifier
  if (info.hasChronic) raw += 4;

  // Low physical activity modifier
  if (info.physicalActivity === "Низька") raw += 2;
  else if (info.physicalActivity === "Помірна") raw += 1;

  const adjusted = Math.min(raw, maxRaw + 10);
  return Math.round((adjusted / (maxRaw + 10)) * 100);
}

function getResultLabel(score: number) {
  if (score >= 75) return { label: "Висока метеозалежність", color: "text-red-400", description: "Ви значно реагуєте на геомагнітну активність. Рекомендуємо уважно стежити за прогнозами магнітних бур та коригувати режим дня." };
  if (score >= 50) return { label: "Помірна метеозалежність", color: "text-orange-400", description: "Ви помірно чутливі до змін космічної погоди. Варто звертати увагу на дні підвищеної активності." };
  if (score >= 25) return { label: "Слабка метеозалежність", color: "text-yellow-400", description: "Ви мало чутливі до магнітних бур. Зазвичай вони не впливають на ваше самопочуття суттєво." };
  return { label: "Метеостійкість", color: "text-green-400", description: "Чудово! Геомагнітна активність практично не впливає на ваш організм." };
}

type Step = "info" | "questions" | "calculating" | "result";

const PENDING_TEST_KEY = "meteo_test_pending";

interface PendingTest {
  score: number;
  personalInfo: PersonalInfo;
  answers: number[];
}

const MeteoTest = () => {
  usePageMeta(
    "Тест на метеозалежність — Магнітка",
    "Безкоштовний тест на метеочутливість. Дізнайтесь, наскільки ваш організм чутливий до магнітних бур та геомагнітної активності."
  );

  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    age: "",
    gender: "",
    hasChronic: false,
    chronicDetails: "",
    physicalActivity: "",
  });
  const [saving, setSaving] = useState(false);
  const [restored, setRestored] = useState(false);

  // Restore pending test after auth
  useEffect(() => {
    if (!user || restored) return;
    const raw = localStorage.getItem(PENDING_TEST_KEY);
    if (!raw) return;

    try {
      const pending: PendingTest = JSON.parse(raw);
      localStorage.removeItem(PENDING_TEST_KEY);
      setPersonalInfo(pending.personalInfo);
      setAnswers(pending.answers);
      setScore(pending.score);
      setRestored(true);
      setStep("result");

      // Save to DB
      setSaving(true);
      supabase
        .from("test_results")
        .insert({
          user_id: user.id,
          score: pending.score,
          name: pending.personalInfo.name,
          age: parseInt(pending.personalInfo.age),
          gender: pending.personalInfo.gender,
          has_chronic: pending.personalInfo.hasChronic,
          answers: pending.answers,
        })
        .then(() => setSaving(false));
    } catch {
      localStorage.removeItem(PENDING_TEST_KEY);
    }
  }, [user, restored]);

  // Calculating animation
  useEffect(() => {
    if (step !== "calculating") return;
    const computed = calculateScore(answers, personalInfo);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        setCalcProgress(100);
        setScore(computed);
        clearInterval(interval);
        setTimeout(() => setStep("result"), 600);
      } else {
        setCalcProgress(Math.round(progress));
      }
    }, 120);
    return () => clearInterval(interval);
  }, [step, answers, personalInfo]);

  // Save result when user is already authed
  useEffect(() => {
    if (step === "result" && user && score > 0 && !saving && !restored) {
      setSaving(true);
      supabase
        .from("test_results")
        .insert({
          user_id: user.id,
          score,
          name: personalInfo.name,
          age: parseInt(personalInfo.age),
          gender: personalInfo.gender,
          has_chronic: personalInfo.hasChronic,
          answers,
        })
        .then(() => setSaving(false));
    }
  }, [step, user, score, restored]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("calculating");
    }
  };

  const isInfoValid =
    personalInfo.name.trim() &&
    personalInfo.age.trim() &&
    parseInt(personalInfo.age) > 0 &&
    parseInt(personalInfo.age) < 120 &&
    personalInfo.gender &&
    personalInfo.physicalActivity;

  const result = getResultLabel(score);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-2xl p-6 space-y-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На головну
        </a>

        {/* ─── Personal Info ─── */}
        {step === "info" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <Activity className="h-8 w-8 text-primary mx-auto" />
              <h1 className="font-display text-2xl font-bold text-foreground">
                Тест на метеозалежність
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Дізнайтесь, наскільки ваш організм чутливий до магнітних бур. Тест займе 2-3 хвилини.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ваше ім'я</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Введіть ім'я"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Вік</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Вік"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Стать</label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPersonalInfo({ ...personalInfo, gender: g })}
                      className={cn(
                        "rounded-md border px-2 py-2.5 font-mono text-xs transition-colors text-center",
                        personalInfo.gender === g
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Рівень фізичної активності</label>
                <div className="flex gap-2">
                  {activityOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setPersonalInfo({ ...personalInfo, physicalActivity: a })}
                      className={cn(
                        "flex-1 rounded-md border px-3 py-2.5 font-mono text-xs transition-colors",
                        personalInfo.physicalActivity === a
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={personalInfo.hasChronic}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, hasChronic: e.target.checked })}
                    className="rounded border-border/50"
                  />
                  Маю хронічні захворювання (серцево-судинні, неврологічні та ін.)
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep("questions")}
              disabled={!isInfoValid}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-mono text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Почати тест
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── Questions ─── */}
        {step === "questions" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-8 space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Питання {currentQ + 1} з {questions.length}</span>
                <span>{Math.round(((currentQ) / questions.length) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentQ) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-lg font-medium text-foreground leading-relaxed">
              {questions[currentQ]}
            </h2>

            <div className="grid gap-2">
              {answerOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 px-4 py-3 text-left font-mono text-sm text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Calculating Animation ─── */}
        {step === "calculating" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="relative">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" strokeOpacity="0.3" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - calcProgress / 100)}`}
                  className="transition-all duration-150"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-primary">
                {calcProgress}%
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="font-display text-lg font-bold text-foreground">Аналізуємо ваші відповіді...</p>
              <p className="text-xs text-muted-foreground">
                {calcProgress < 30
                  ? "Обробка персональних даних..."
                  : calcProgress < 60
                  ? "Порівняння з базою метеоданих..."
                  : calcProgress < 90
                  ? "Обрахунок індексу чутливості..."
                  : "Формування результату..."}
              </p>
            </div>
          </div>
        )}

        {/* ─── Result ─── */}
        {step === "result" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-lg border border-border/50 bg-card p-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Ваш результат
              </h2>

              <div className="flex flex-col items-center gap-4 py-6 text-center animate-scale-in">
                <div className="relative">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" strokeOpacity="0.3" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-3xl font-bold text-primary">
                    {score}%
                  </span>
                </div>
                <p className={cn("font-display text-xl font-bold", result.color)}>{result.label}</p>
                <p className="text-sm text-muted-foreground max-w-md">{result.description}</p>

                {saving && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Зберігаємо результат...
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setStep("info");
                      setCurrentQ(0);
                      setAnswers([]);
                      setScore(0);
                      setCalcProgress(0);
                      setSaving(false);
                    }}
                    className="rounded-md border border-border/50 bg-secondary/30 px-5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60"
                  >
                    Пройти ще раз
                  </button>
                  {user && (
                    <a
                      href="/profile"
                      className="rounded-md bg-primary px-5 py-2 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Мій кабінет
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Telegram CTA */}
            <div className="rounded-lg border border-border/50 bg-card p-6 text-center space-y-3">
              <Send className="h-6 w-6 text-primary mx-auto" />
              <p className="text-sm font-medium text-foreground">
                Не пропустіть магнітні бурі!
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Підпишіться на наш Telegram-канал і отримуйте щоденні прогнози магнітних бур прямо в месенджер.
              </p>
              <a
                href="https://t.me/+7UKzAK5ur8UxZmMy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[hsl(200,80%,45%)] px-6 py-2.5 font-mono text-sm font-medium text-white transition-colors hover:bg-[hsl(200,80%,40%)]"
              >
                <Send className="h-4 w-4" />
                Підписатись в Telegram
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeteoTest;
