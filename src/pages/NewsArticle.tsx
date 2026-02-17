import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });
};

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      // Try slug first, fallback to id
      let { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      
      if (!data) {
        ({ data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", slug!)
          .single());
      }
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const articleTitle = article?.title || "Новина";
  const articleDesc = article?.content?.slice(0, 150)?.replace(/\n/g, " ") || "Читайте новину на Магнітці";

  usePageMeta(
    `${articleTitle} — Магнітка`,
    articleDesc
  );

  // JSON-LD NewsArticle schema
  const jsonLd = article ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "description": articleDesc,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://magnitca.com/news/${article.slug || article.id}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Магнітка",
      "url": "https://magnitca.com",
    },
    ...(article.image_url ? {
      "image": {
        "@type": "ImageObject",
        "url": article.image_url,
      },
    } : {}),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    <main className="min-h-screen bg-background pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Усі новини
        </Link>

        {isLoading ? (
          <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8 animate-pulse">
            <div className="h-6 bg-muted/30 rounded w-3/4 mb-4" />
            <div className="h-3 bg-muted/20 rounded w-1/4 mb-8" />
            <div className="space-y-3">
              <div className="h-3 bg-muted/20 rounded w-full" />
              <div className="h-3 bg-muted/20 rounded w-full" />
              <div className="h-3 bg-muted/20 rounded w-2/3" />
            </div>
          </div>
        ) : !article ? (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-muted-foreground">Новину не знайдено</p>
          </div>
        ) : (
          <article className="rounded-lg border border-border/50 bg-card overflow-hidden">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full aspect-[2/1] object-cover"
              />
            )}
            <div className="p-6 sm:p-8">
              <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight mb-3">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(article.published_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(article.published_at)}
                  </span>
                </div>
              </header>
              <div className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
    </>
  );
};

export default NewsArticle;
