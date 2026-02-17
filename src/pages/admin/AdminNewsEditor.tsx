import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
    ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
    м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
    ю: "yu", я: "ya", "'": "", ʼ: "",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

interface NewsForm {
  title: string;
  slug: string;
  content: string;
  image_url: string;
  published_at: string;
  telegram_sent: boolean;
  meta_title: string;
  meta_description: string;
  source: string;
}

const emptyForm: NewsForm = {
  title: "",
  slug: "",
  content: "",
  image_url: "",
  published_at: new Date().toISOString().slice(0, 16),
  telegram_sent: false,
  meta_title: "",
  meta_description: "",
  source: "manual",
};

const AdminNewsEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  usePageMeta(
    isEdit ? "Редагування новини — Магнітка" : "Нова новина — Магнітка",
    "Адмін-панель"
  );

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-news-edit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug || "",
        content: existing.content,
        image_url: existing.image_url || "",
        published_at: existing.published_at.slice(0, 16),
        telegram_sent: existing.telegram_sent ?? false,
        meta_title: (existing as any).meta_title || "",
        meta_description: (existing as any).meta_description || "",
        source: existing.source || "manual",
      });
      setAutoSlug(false);
    }
  }, [existing]);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      ...(autoSlug ? { slug: transliterate(title) } : {}),
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug || null,
        content: form.content,
        image_url: form.image_url || null,
        published_at: new Date(form.published_at).toISOString(),
        telegram_sent: form.telegram_sent,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        source: form.source || "manual",
      } as any;

      if (isEdit) {
        const { error } = await supabase.from("news").update(payload).eq("id", id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Новину оновлено" : "Новину створено");
      navigate("/admin/news");
    },
    onError: (e) => toast.error(`Помилка: ${e.message}`),
  });

  if (isEdit && isLoading) {
    return (
      <AdminGuard>
        <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Завантаження...</div>
        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/news")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад до списку
          </Button>

          <h1 className="text-xl font-bold mb-6">
            {isEdit ? "Редагування новини" : "Нова новина"}
          </h1>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Заголовок новини"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="url-friendly-slug"
                  className="font-mono text-xs"
                />
                {!autoSlug && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setForm((f) => ({ ...f, slug: transliterate(f.title) }));
                    }}
                  >
                    Авто
                  </Button>
                )}
              </div>
            </div>

            {/* Content - Rich Text Editor */}
            <div className="space-y-1.5">
              <Label>Контент *</Label>
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                placeholder="Текст новини..."
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            />

            {/* Published at */}
            <div className="space-y-1.5">
              <Label htmlFor="published_at">Дата публікації</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
              />
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <Label htmlFor="source">Джерело</Label>
              <Input
                id="source"
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="manual"
              />
            </div>

            {/* Telegram */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="telegram_sent"
                checked={form.telegram_sent}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, telegram_sent: checked === true }))
                }
              />
              <Label htmlFor="telegram_sent" className="cursor-pointer">
                Для Telegram (не показувати на сайті)
              </Label>
            </div>

            {/* SEO Section */}
            <div className="rounded-lg border border-border/50 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                SEO
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="meta_title">
                  Meta Title{" "}
                  <span className="text-muted-foreground text-xs">
                    ({form.meta_title.length}/60)
                  </span>
                </Label>
                <Input
                  id="meta_title"
                  value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  placeholder={form.title || "Заповниться з заголовка"}
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta_description">
                  Meta Description{" "}
                  <span className="text-muted-foreground text-xs">
                    ({form.meta_description.length}/160)
                  </span>
                </Label>
                <Textarea
                  id="meta_description"
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  placeholder="Короткий опис для пошукових систем"
                  className="min-h-[60px]"
                  maxLength={300}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!form.title || !form.content || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/news")}>
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
};

export default AdminNewsEditor;
