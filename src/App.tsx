import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

import { PwaInstallBanner } from "@/components/PwaInstallBanner";
import Index from "./legacy-pages/Index";
import NotFound from "./legacy-pages/NotFound";
import FAQ from "./legacy-pages/FAQ";
import StormCalendar from "./legacy-pages/StormCalendar";
import News from "./legacy-pages/News";
import NewsArticle from "./legacy-pages/NewsArticle";
import Contacts from "./legacy-pages/Contacts";
import About from "./legacy-pages/About";
import Privacy from "./legacy-pages/Privacy";
import Auth from "./legacy-pages/Auth";
import MeteoTest from "./legacy-pages/MeteoTest";
import AdminNews from "./legacy-pages/admin/AdminNews";
import AdminNewsEditor from "./legacy-pages/admin/AdminNewsEditor";
import KpIndex from "./legacy-pages/KpIndex";
import CityKyiv from "./legacy-pages/CityKyiv";
import CityPage from "./legacy-pages/CityPage";
import SolarWind from "./legacy-pages/SolarWind";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import uk from "@/i18n/locales/uk";
import ru from "@/i18n/locales/ru";

const queryClient = new QueryClient();

const AppRoutes = (locale: "uk" | "ru", messages: Record<string, any>) => (
  <>
    <Route index element={<Index locale={locale} messages={messages} />} />
    <Route path="kp-index" element={<KpIndex />} />
    <Route path="solar-wind" element={<SolarWind />} />
    <Route path="city/kyiv" element={<CityKyiv />} />
    <Route path="city/:slug" element={<CityPage />} />
    <Route path="faq" element={<FAQ />} />
    <Route path="calendar" element={<StormCalendar />} />
    <Route path="news" element={<News />} />
    <Route path="news/:slug" element={<NewsArticle />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="about" element={<About />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="test" element={<MeteoTest />} />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SiteHeader />
          <Routes>
            {/* Ukrainian (default) routes */}
            <Route element={<LanguageWrapper />}>
              {AppRoutes("uk", uk)}
            </Route>

            {/* Russian routes with /ru prefix */}
            <Route path="/ru" element={<LanguageWrapper />}>
              {AppRoutes("ru", ru)}
            </Route>

            {/* Auth & Admin — no language prefix needed */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/news/new" element={<AdminNewsEditor />} />
            <Route path="/admin/news/:id/edit" element={<AdminNewsEditor />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SiteFooter />
          
          <PwaInstallBanner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
