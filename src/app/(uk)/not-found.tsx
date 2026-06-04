import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold">Сторінку не знайдено</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
        Можливо, URL змінився під час міграції на нову архітектуру або матеріал уже недоступний.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
        Повернутися на головну
      </Link>
    </main>
  );
}
