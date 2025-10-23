import { AIChatInterface } from "@/components/AIChatInterface";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AIChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative z-10">
        <AIChatInterface />
      </main>
      <Footer />
    </div>
  );
}
