import ArenaHeader from "@/components/ArenaHeader";
import { ArenaHeroSection } from "@/components/ArenaHeroSection";
import { ArenaFeaturesSection } from "@/components/ArenaFeaturesSection";
import ArenaFooter from "@/components/ArenaFooter";
import { HolographicPriceTicker } from "@/components/HolographicPriceTicker";
import { DiamondNexusEarthBackground } from "@/components/backgrounds/DiamondNexusEarthBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* 💎 DIAMOND NEXUS EARTH BACKGROUND - Futuristic wealth globe */}
      <DiamondNexusEarthBackground />

      {/* Main Content - Above solar system */}
      <div className="relative z-10 pointer-events-auto">
        <ArenaHeader />
        <HolographicPriceTicker />
        <main>
          <ArenaHeroSection />
          <ArenaFeaturesSection />
        </main>
        <ArenaFooter />
      </div>
    </div>
  );
};

export default Index;
