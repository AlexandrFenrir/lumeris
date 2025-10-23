import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Gaming from "./pages/Gaming";
import DeFi from "./pages/DeFi";
import AdvancedTrading from "./pages/AdvancedTrading";
import NFTMarketplace from "./pages/NFTMarketplace";
import Launchpad from "./pages/Launchpad";
import Governance from "./pages/Governance";
import DailyLotteryPage from "./pages/DailyLotteryPage";
import DailyGiftPage from "./pages/DailyGiftPage";
import AIChatPage from "./pages/AIChatPage";
import NotFound from "./pages/NotFound";
import DailyFeaturesButton from "./components/DailyFeaturesButton";
import LumerisLoadingScreen from "./components/LumerisLoadingScreen";
import { PerformanceProvider } from "./contexts/PerformanceContext";

const queryClient = new QueryClient();

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Lumeris Cosmic Loading Screen */}
      {isLoading && (
        <LumerisLoadingScreen
          onLoadingComplete={() => setIsLoading(false)}
          minimumLoadTime={7500}
        />
      )}

      <Toaster />
      <Sonner />

      {/* Daily Features Floating Button */}
      <DailyFeaturesButton />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gaming" element={<Gaming />} />
        <Route path="/defi" element={<DeFi />} />
        <Route path="/advanced-trading" element={<AdvancedTrading />} />
        <Route path="/nft-marketplace" element={<NFTMarketplace />} />
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/daily-lottery" element={<DailyLotteryPage />} />
        <Route path="/daily-gift" element={<DailyGiftPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PerformanceProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </PerformanceProvider>
  </QueryClientProvider>
);

export default App;
