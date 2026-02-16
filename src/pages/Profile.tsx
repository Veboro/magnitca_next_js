import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, User, Save, Activity, Calendar, RefreshCw } from "lucide-react";

interface TestResult {
  id: string;
  score: number;
  name: string;
  age: number;
  gender: string;
  has_chronic: boolean;
  created_at: string;
}

const getScoreColor = (score: number) => {
  if (score <= 30) return "text-green-400";
  if (score <= 60) return "text-yellow-400";
  return "text-red-400";
};

const getScoreLabel = (score: number) => {
  if (score <= 20) return "Мінімальна";
  if (score <= 40) return "Низька";
  if (score <= 60) return "Помірна";
  if (score <= 80) return "Висока";
  return "Дуже висока";
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (user) {
      // Load profile
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.display_name || "");
            setAvatarUrl(data.avatar_url || "");
          }
        });

      // Load test results
      supabase
        .from("test_results")
        .select("id, score, name, age, gender, has_chronic, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setTestResults(data);
        });
    }
  }, [user, authLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    setSaved(false);

    const { error: err } = await supabase
      .from("profiles")
      .update({ display_name: displayName, avatar_url: avatarUrl })
      .eq("user_id", user.id);

    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-xl space-y-6 p-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На головну
        </a>

        <div className="rounded-lg border border-border/50 bg-card p-8 space-y-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Налаштування профілю</h1>

          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Аватар" className="h-16 w-16 rounded-full border border-border/50 object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">{displayName || "Користувач"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ім'я</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ваше ім'я"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">URL аватара</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="https://..."
              />
            </div>

            {error && <p className="text-sm text-destructive font-mono">{error}</p>}
            {saved && <p className="text-sm text-primary font-mono">Збережено!</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Зберегти
            </button>
          </form>
        </div>

        {/* Test Results */}
        <div className="rounded-lg border border-border/50 bg-card p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Результати тесту
            </h2>
            <Link
              to="/test"
              className="flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Пройти знову
            </Link>
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">Ви ще не проходили тест</p>
              <Link
                to="/test"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Пройти тест
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 rounded-md border border-border/30 bg-secondary/10 p-4"
                >
                  <div className="flex-shrink-0 text-center">
                    <p className={`text-2xl font-bold font-mono ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </p>
                    <p className={`text-[10px] font-mono ${getScoreColor(result.score)}`}>
                      {getScoreLabel(result.score)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.created_at).toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
