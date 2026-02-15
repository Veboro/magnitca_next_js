import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Contacts = () => (
  <main className="min-h-screen bg-background pt-20 pb-12">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> На головну
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono mb-6">Контакти</h1>
      <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8 space-y-4 text-sm text-foreground/85 leading-relaxed">
        <p>Якщо у вас є питання, пропозиції або ви хочете повідомити про помилку — зв'яжіться з нами:</p>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-primary" />
          <a href="mailto:info@magnitca.com" className="text-primary hover:underline">info@magnitca.com</a>
        </div>
        <div className="flex items-center gap-3">
          <MessageCircle className="h-4 w-4 text-primary" />
          <a href="https://t.me/magnitca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram: @magnitca</a>
        </div>
      </div>
    </div>
  </main>
);

export default Contacts;
