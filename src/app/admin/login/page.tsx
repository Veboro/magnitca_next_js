import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Admin access</p>
          <h1 className="font-display text-4xl font-bold">Вхід у редакторську панель</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Проста адмінка для одного редактора: новини, SEO-метадані й керування публічними сторінками.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
