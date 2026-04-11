"use client";

import { FormEvent, useState } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";

type ContactFormLocale = "uk" | "ru";

const copy: Record<
  ContactFormLocale,
  {
    sendError: string;
    unknownError: string;
    successTitle: string;
    successText: string;
    sendAnother: string;
    name: string;
    email: string;
    message: string;
    sending: string;
    send: string;
  }
> = {
  uk: {
    sendError: "Не вдалося відправити повідомлення.",
    unknownError: "Сталася помилка під час надсилання.",
    successTitle: "Дякуємо за звернення",
    successText:
      "Повідомлення вже в дорозі. Якщо питання термінове, дублюйте його на",
    sendAnother: "Надіслати ще одне повідомлення",
    name: "Ваше ім'я",
    email: "Email",
    message: "Повідомлення",
    sending: "Надсилання...",
    send: "Надіслати повідомлення",
  },
  ru: {
    sendError: "Не удалось отправить сообщение.",
    unknownError: "Произошла ошибка при отправке.",
    successTitle: "Спасибо за обращение",
    successText:
      "Сообщение уже отправляется. Если вопрос срочный, продублируйте его на",
    sendAnother: "Отправить ещё одно сообщение",
    name: "Ваше имя",
    email: "Email",
    message: "Сообщение",
    sending: "Отправка...",
    send: "Отправить сообщение",
  },
};

export function ContactForm({ locale = "uk" }: { locale?: ContactFormLocale }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const t = copy[locale];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t.sendError);
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : t.unknownError
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <h2 className="font-display text-2xl font-bold">{t.successTitle}</h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {t.successText}
          {" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          {t.name}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={255}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          {t.message}
        </label>
        <textarea
          id="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={2000}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? t.sending : t.send}
      </button>
    </form>
  );
}
