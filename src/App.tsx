import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import InterventionPage from "./pages/InterventionPage";
import MonitoringPage from "./pages/MonitoringPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Navigation from "./components/layout/Navigation";
import { BarChart3 } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <header className="border-b bg-card shadow-sm">
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">SIGAP-PU</h1>
                    <p className="text-sm text-muted-foreground">
                      Sistem Informasi Geospasial Analisis Stunting dan Kemiskinan – Pekerjaan Umum
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <Navigation />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/intervention" element={<InterventionPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
