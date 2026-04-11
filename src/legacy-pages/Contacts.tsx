import { useState } from "react";
import { ArrowLeft, Send, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Contacts = () => {
  usePageMeta(
    "Контакти — Магнітка",
    "Зв'яжіться з командою Магнітки. Питання, пропозиції та повідомлення про помилки."
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Заповніть усі поля", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("contact-form", {
        body: { name: name.trim(), email: email.trim(), message: message.trim() },
      });
      if (error) throw error;
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast({ title: "Помилка при відправці", description: "Спробуйте пізніше", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> На головну
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono mb-6">Контакти</h1>

        <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <h2 className="text-lg font-semibold">Дякуємо!</h2>
              <p className="text-sm text-muted-foreground">Ваше повідомлення надіслано. Ми відповімо найближчим часом.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Надіслати ще одне повідомлення
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Якщо у вас є питання, пропозиції або ви хочете повідомити про помилку — напишіть нам:
              </p>
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-foreground/70 mb-1">Ваше ім'я</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ваше ім'я"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground/70 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-foreground/70 mb-1">Повідомлення</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  required
                  rows={5}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Ваше питання або пропозиція..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Надсилання..." : "Надіслати"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Contacts;
