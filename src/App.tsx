import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataProvider";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import InterventionPage from "./pages/InterventionPage";
import MonitoringPage from "./pages/MonitoringPage";
import LoginPage from "./pages/LoginPage";
import DataInputPage from "./pages/DataInputPage";
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
        <DataProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <header className="border-b bg-card shadow-sm">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img src="/images/logo-pbd.png" alt="Logo Papua Barat Daya" className="h-16 w-auto object-contain" />
                      <img src="/images/logo-pupr.png" alt="Logo PUPR" className="h-16 w-auto object-contain" />
                    </div>
                    <div>
                      <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                        SIGAP-DINAS PEKERJAAN UMUM DAN PERUMAHAN RAKYAT<br />PROVINSI PAPUA BARAT DAYA
                      </h1>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sistem Informasi Geospasial Analisis Stunting dan Kemiskinan
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
                <Route path="/data-input" element={<DataInputPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
