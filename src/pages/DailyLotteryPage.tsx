import { DailyLottery } from "@/components/DailyLottery";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DailyLotteryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative z-10">
        <DailyLottery />
      </main>
      <Footer />
    </div>
  );
}
