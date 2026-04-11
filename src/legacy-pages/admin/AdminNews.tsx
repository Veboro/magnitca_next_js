import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const AdminNewsPage = () => {
  usePageMeta("Адмін: Новини — Магнітка", "Управління новинами");
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, published_at, source, telegram_sent")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast.success("Новину видалено");
    },
    onError: () => toast.error("Помилка при видаленні"),
  });

  return (
    <AdminGuard>
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Управління новинами</h1>
            <Button asChild>
              <Link to="/admin/news/new">
                <Plus className="h-4 w-4 mr-2" />
                Створити
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-muted/20 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-left">
                    <th className="p-3 font-medium">Заголовок</th>
                    <th className="p-3 font-medium hidden sm:table-cell">Slug</th>
                    <th className="p-3 font-medium hidden md:table-cell">Дата</th>
                    <th className="p-3 font-medium hidden md:table-cell">Джерело</th>
                    <th className="p-3 font-medium w-24">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {news?.map((item) => (
                    <tr key={item.id} className="border-t border-border/30 hover:bg-muted/10">
                      <td className="p-3">
                        <span className="line-clamp-1">{item.title}</span>
                        {item.telegram_sent && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">TG</span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">
                        <span className="line-clamp-1 text-xs">{item.slug || "—"}</span>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">
                        {formatDate(item.published_at)}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">
                        {item.source || "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link to={`/admin/news/${item.id}/edit`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Видалити новину?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Цю дію неможливо скасувати. Новину буде видалено назавжди.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(item.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Видалити
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {news?.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">Новин поки немає</div>
              )}
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  );
};

export default AdminNewsPage;
