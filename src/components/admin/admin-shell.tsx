import Link from "next/link";
import { FileText, Home, Search } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Admin</p>
            <h1 className="font-display text-2xl font-bold">Панель редактора Магнітки</h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
          <Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted/40">
            <Home className="h-4 w-4 text-primary" />
            Огляд
          </Link>
          <Link href="/admin/news" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted/40">
            <FileText className="h-4 w-4 text-primary" />
            Новини
          </Link>
          <Link href="/admin/seo" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted/40">
            <Search className="h-4 w-4 text-primary" />
            Метадані сторінок
          </Link>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
