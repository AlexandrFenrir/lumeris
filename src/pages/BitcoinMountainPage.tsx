import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BitcoinMountain } from "@/components/BitcoinMountain";
import { HolographicCard } from "@/components/HolographicCard";
import { Mountain, Sparkles, Trophy, Zap, Target, Users } from "lucide-react";

const BitcoinMountainPage = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-400/30 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-sm font-semibold text-gradient-gold">
                  Climb & Earn Adventure
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient-gold text-glow-gold">
                  Bitcoin Mountain
                </span>
                <br />
                <span className="text-gradient-silver text-glow-silver">
                  Climbing Challenge
                </span>
              </h1>

              <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                Make correct trading predictions to climb the legendary Bitcoin
                Mountain. Reach the summit and claim legendary rewards!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <HolographicCard theme="gold">
                  <div className="p-4 text-center">
                    <Mountain className="w-8 h-8 mx-auto mb-2 text-gradient-gold" />
                    <div className="text-3xl font-bold text-gradient-gold mb-1">
                      6
                    </div>
                    <div className="text-sm text-foreground/60">
                      Reward Tiers
                    </div>
                  </div>
                </HolographicCard>
                <HolographicCard theme="silver">
                  <div className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gradient-silver" />
                    <div className="text-3xl font-bold text-gradient-silver mb-1">
                      15K+
                    </div>
                    <div className="text-sm text-foreground/60">Climbers</div>
                  </div>
                </HolographicCard>
                <HolographicCard theme="gold">
                  <div className="p-4 text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gradient-gold" />
                    <div className="text-3xl font-bold text-gradient-gold mb-1">
                      $500K
                    </div>
                    <div className="text-sm text-foreground/60">
                      Rewards Paid
                    </div>
                  </div>
                </HolographicCard>
                <HolographicCard theme="silver">
                  <div className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-gradient-silver" />
                    <div className="text-3xl font-bold text-gradient-silver mb-1">
                      10x
                    </div>
                    <div className="text-sm text-foreground/60">
                      Max Multiplier
                    </div>
                  </div>
                </HolographicCard>
              </div>
            </div>
          </div>
        </section>

        {/* Game Section */}
        <section className="px-4 mb-16">
          <div className="container mx-auto">
            <BitcoinMountain />
          </div>
        </section>

        {/* How to Play */}
        <section className="px-4 mb-16">
          <div className="container mx-auto">
            <HolographicCard theme="silver">
              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gradient-silver flex items-center gap-3">
                  <Target className="w-8 h-8" />
                  How to Play
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="text-4xl">📈</div>
                    <h3 className="text-xl font-bold text-gradient-gold">
                      1. Make Predictions
                    </h3>
                    <p className="text-foreground/70">
                      Use trading signals to predict market movements. Correct
                      predictions help you climb higher!
                    </p>
                    <ul className="text-sm text-foreground/60 space-y-1">
                      <li>✓ Correct BUY/SELL: +5% altitude</li>
                      <li>✓ Wrong prediction: -3% altitude</li>
                      <li>✓ HOLD prediction: +1% altitude</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="text-4xl">⚡</div>
                    <h3 className="text-xl font-bold text-gradient-gold">
                      2. Use Power-Ups
                    </h3>
                    <p className="text-foreground/70">
                      Activate special power-ups to boost your climbing speed
                      and protect against falls.
                    </p>
                    <ul className="text-sm text-foreground/60 space-y-1">
                      <li>🚀 Rocket Boost: +20% instant</li>
                      <li>🛡️ Safety Net: Prevent falls</li>
                      <li>🔮 Oracle Vision: See signals early</li>
                      <li>⚡ Lightning Speed: 2x climb speed</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="text-4xl">🏆</div>
                    <h3 className="text-xl font-bold text-gradient-gold">
                      3. Reach the Summit
                    </h3>
                    <p className="text-foreground/70">
                      Climb through 6 reward tiers to reach the legendary
                      Bitcoin Summit at 95%+ altitude.
                    </p>
                    <ul className="text-sm text-foreground/60 space-y-1">
                      <li>👑 Summit: 5,000 LUMERIS + Legendary NFT</li>
                      <li>🌌 Aurora Peak: 1,500 LUMERIS + Epic NFT</li>
                      <li>💎 Crystal Zone: 500 LUMERIS + Rare NFT</li>
                    </ul>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Weather System */}
        <section className="px-4">
          <div className="container mx-auto">
            <HolographicCard theme="gold">
              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gradient-gold flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Dynamic Weather System
                </h2>

                <p className="text-foreground/70 text-lg">
                  Weather conditions change every 30 seconds, affecting
                  difficulty and rewards. Brave the storm for maximum
                  multipliers!
                </p>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 glass-card rounded-lg text-center">
                    <div className="text-4xl mb-2">☀️</div>
                    <h4 className="font-bold text-yellow-400 mb-1">Sunny</h4>
                    <p className="text-sm text-foreground/60 mb-2">
                      Clear visibility
                    </p>
                    <div className="text-2xl font-bold text-yellow-400">1x</div>
                  </div>

                  <div className="p-4 glass-card rounded-lg text-center">
                    <div className="text-4xl mb-2">☁️</div>
                    <h4 className="font-bold text-gray-400 mb-1">Cloudy</h4>
                    <p className="text-sm text-foreground/60 mb-2">
                      Standard conditions
                    </p>
                    <div className="text-2xl font-bold text-gray-400">1.2x</div>
                  </div>

                  <div className="p-4 glass-card rounded-lg text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h4 className="font-bold text-cyan-400 mb-1">Storm</h4>
                    <p className="text-sm text-foreground/60 mb-2">
                      Lightning strikes
                    </p>
                    <div className="text-2xl font-bold text-cyan-400">2x</div>
                  </div>

                  <div className="p-4 glass-card rounded-lg text-center">
                    <div className="text-4xl mb-2">❄️</div>
                    <h4 className="font-bold text-blue-400 mb-1">Blizzard</h4>
                    <p className="text-sm text-foreground/60 mb-2">
                      Heavy snow
                    </p>
                    <div className="text-2xl font-bold text-blue-400">3x</div>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BitcoinMountainPage;
