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
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import StormCalendar from "./pages/StormCalendar";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import MeteoTest from "./pages/MeteoTest";
import AdminNews from "./pages/admin/AdminNews";
import AdminNewsEditor from "./pages/admin/AdminNewsEditor";
import KpIndex from "./pages/KpIndex";
import CityKyiv from "./pages/CityKyiv";
import CityPage from "./pages/CityPage";
import SolarWind from "./pages/SolarWind";
import { LanguageWrapper } from "@/components/LanguageWrapper";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <>
    <Route path="/" element={<Index />} />
    <Route path="/kp-index" element={<KpIndex />} />
    <Route path="/solar-wind" element={<SolarWind />} />
    <Route path="/city/kyiv" element={<CityKyiv />} />
    <Route path="/city/:slug" element={<CityPage />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/calendar" element={<StormCalendar />} />
    <Route path="/news" element={<News />} />
    <Route path="/news/:slug" element={<NewsArticle />} />
    <Route path="/contacts" element={<Contacts />} />
    <Route path="/about" element={<About />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/test" element={<MeteoTest />} />
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
              {AppRoutes()}
            </Route>

            {/* Russian routes with /ru prefix */}
            <Route path="/ru" element={<LanguageWrapper />}>
              {AppRoutes()}
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
