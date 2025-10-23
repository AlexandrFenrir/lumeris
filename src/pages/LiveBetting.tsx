import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LiveBettingSystem } from "@/components/LiveBettingSystem";

const LiveBetting = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <LiveBettingSystem />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveBetting;
