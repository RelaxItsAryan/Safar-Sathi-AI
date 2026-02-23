import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import TripDetail from "./pages/TripDetail";
import { SplashScreen } from "./components/SplashScreen";

const queryClient = new QueryClient();

import { useState } from "react";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
          {!showSplash && (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/trip/:id" element={<TripDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
