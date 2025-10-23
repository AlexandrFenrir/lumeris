/**
 * 📊 HOLOGRAPHIC PRICE TICKER
 * Enhanced 3D price bar with glass morphism
 */

import { useState, useEffect } from "react";
import { cryptoService, CryptoPrice } from "@/lib/cryptoService";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinLogo } from "./CoinLogo";

const TRACKED_COINS = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "ADA",
  "DOT",
  "MATIC",
  "AVAX",
];

export function HolographicPriceTicker() {
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const [loading, setLoading] = useState(true);
  const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchPrices = async () => {
      const priceData = await cryptoService.getPrices(TRACKED_COINS);
      setPrices(priceData);
      setLoading(false);
    };

    fetchPrices();

    // Subscribe to real-time updates
    const unsubscribe = cryptoService.subscribeToPriceUpdates(
      TRACKED_COINS,
      (symbol, price) => {
        setPrices((prev) => new Map(prev).set(symbol, price));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        className="fixed top-16 left-0 right-0 z-40 overflow-hidden backdrop-blur-xl border-b border-purple-500/20 py-3"
        style={{
          background:
            "linear-gradient(to bottom, rgba(15, 10, 30, 0.8), rgba(15, 10, 30, 0.6))",
        }}
      >
        <div className="flex items-center justify-center space-x-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20" />
              <div className="w-20 h-6 bg-purple-500/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 overflow-hidden backdrop-blur-xl border-b border-purple-500/20 py-3"
      style={{
        background:
          "linear-gradient(to bottom, rgba(15, 10, 30, 0.8), rgba(15, 10, 30, 0.6))",
        boxShadow: "0 4px 30px rgba(147, 51, 234, 0.1)",
      }}
    >
      {/* Holographic Shimmer Effect */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(147, 51, 234, 0.8), rgba(245, 158, 11, 0.8), transparent)",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />

      {/* Ticker Content */}
      <div className="ticker-wrapper-3d">
        <div className="ticker-content-3d">
          {Array.from(prices.entries()).map(([symbol, price], index) => (
            <div
              key={`${symbol}-${index}`}
              className="ticker-item-3d group"
              onMouseEnter={() => setHoveredCoin(symbol)}
              onMouseLeave={() => setHoveredCoin(null)}
            >
              {/* Coin Logo */}
              <div
                className="transition-all duration-300 group-hover:scale-125"
                style={{
                  transform:
                    hoveredCoin === symbol
                      ? "translateZ(10px)"
                      : "translateZ(0)",
                }}
              >
                <CoinLogo symbol={symbol} size={32} />
              </div>

              {/* Symbol */}
              <span
                className="font-bold text-lg transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #9333EA 0%, #F59E0B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow:
                    hoveredCoin === symbol
                      ? "0 0 20px rgba(147, 51, 234, 0.8)"
                      : "none",
                  transform:
                    hoveredCoin === symbol
                      ? "translateZ(5px) scale(1.1)"
                      : "translateZ(0)",
                }}
              >
                {symbol}
              </span>

              {/* Price */}
              <span
                className="text-white font-mono font-semibold transition-all duration-300"
                style={{
                  transform:
                    hoveredCoin === symbol
                      ? "translateZ(5px)"
                      : "translateZ(0)",
                }}
              >
                {cryptoService.formatPrice(price.price)}
              </span>

              {/* 24h Change */}
              <span
                className={`flex items-center space-x-1 text-sm font-bold transition-all duration-300 ${
                  price.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
                style={{
                  transform:
                    hoveredCoin === symbol
                      ? "translateZ(5px)"
                      : "translateZ(0)",
                }}
              >
                {price.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(price.change24h).toFixed(2)}%</span>
              </span>

              {/* Hover Chart Preview */}
              {hoveredCoin === symbol && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 rounded-lg backdrop-blur-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)",
                    boxShadow: "0 8px 32px rgba(147, 51, 234, 0.3)",
                  }}
                >
                  <div className="text-xs text-white/70 mb-1">24h Volume</div>
                  <div className="text-sm font-bold text-white">
                    ${(Math.random() * 1000000000).toFixed(0)}M
                  </div>
                </div>
              )}

              {/* Separator */}
              <span
                className="text-purple-500/30 text-2xl"
                style={{
                  transform:
                    hoveredCoin === symbol
                      ? "translateZ(5px)"
                      : "translateZ(0)",
                }}
              >
                |
              </span>
            </div>
          ))}

          {/* Duplicate for seamless loop */}
          {Array.from(prices.entries()).map(([symbol, price], index) => (
            <div
              key={`${symbol}-duplicate-${index}`}
              className="ticker-item-3d group"
              onMouseEnter={() => setHoveredCoin(symbol)}
              onMouseLeave={() => setHoveredCoin(null)}
            >
              <div className="transition-all duration-300 group-hover:scale-125">
                <CoinLogo symbol={symbol} size={32} />
              </div>
              <span
                className="font-bold text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #9333EA 0%, #F59E0B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {symbol}
              </span>
              <span className="text-white font-mono font-semibold">
                {cryptoService.formatPrice(price.price)}
              </span>
              <span
                className={`flex items-center space-x-1 text-sm font-bold ${
                  price.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(price.change24h).toFixed(2)}%</span>
              </span>
              <span className="text-purple-500/30 text-2xl">|</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ticker-wrapper-3d {
          overflow: hidden;
          position: relative;
          perspective: 1000px;
        }

        .ticker-content-3d {
          display: flex;
          animation: ticker-scroll-3d 40s linear infinite;
          transform-style: preserve-3d;
        }

        .ticker-item-3d {
          flex-shrink: 0;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1.5rem;
          position: relative;
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }

        .ticker-item-3d:hover {
          transform: translateZ(10px);
        }

        @keyframes ticker-scroll-3d {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-content-3d:hover {
          animation-play-state: paused;
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
