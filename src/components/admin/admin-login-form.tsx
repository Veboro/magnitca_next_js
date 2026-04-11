"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || "Невірний пароль.");
          }

          router.replace("/admin");
          router.refresh();
        } catch (loginError) {
          setError(loginError instanceof Error ? loginError.message : "Помилка входу.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Пароль редактора
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="Введіть пароль"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Вхід..." : "Увійти"}
      </button>
    </form>
  );
}
