/**
 * Real-Time Crypto Price Ticker
 * Displays live cryptocurrency prices with 24h change
 */

import { useState, useEffect } from "react";
import { cryptoService, CryptoPrice } from "@/lib/cryptoService";
import { TrendingUp, TrendingDown } from "lucide-react";

const TRACKED_COINS = ["BTC", "ETH", "BNB", "SOL", "MATIC"];

export function CryptoPriceTicker() {
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const [loading, setLoading] = useState(true);

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
      <div className="w-full overflow-hidden bg-black/20 backdrop-blur-sm border-y border-gold/20 py-3">
        <div className="flex items-center justify-center space-x-4 text-gold/50 animate-pulse">
          <div className="w-20 h-6 bg-gold/10 rounded" />
          <div className="w-20 h-6 bg-gold/10 rounded" />
          <div className="w-20 h-6 bg-gold/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-black/20 backdrop-blur-sm border-y border-gold/20 py-3">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {Array.from(prices.entries()).map(([symbol, price], index) => (
            <div
              key={`${symbol}-${index}`}
              className="ticker-item flex items-center space-x-3 px-6"
            >
              {/* Symbol */}
              <span className="font-bold text-gold text-lg">{symbol}</span>

              {/* Price */}
              <span className="text-white font-mono">
                {cryptoService.formatPrice(price.price)}
              </span>

              {/* 24h Change */}
              <span
                className={`flex items-center space-x-1 text-sm font-semibold ${
                  price.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(price.change24h).toFixed(2)}%</span>
              </span>

              {/* Separator */}
              <span className="text-gold/30">|</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {Array.from(prices.entries()).map(([symbol, price], index) => (
            <div
              key={`${symbol}-duplicate-${index}`}
              className="ticker-item flex items-center space-x-3 px-6"
            >
              <span className="font-bold text-gold text-lg">{symbol}</span>
              <span className="text-white font-mono">
                {cryptoService.formatPrice(price.price)}
              </span>
              <span
                className={`flex items-center space-x-1 text-sm font-semibold ${
                  price.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(price.change24h).toFixed(2)}%</span>
              </span>
              <span className="text-gold/30">|</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ticker-wrapper {
          overflow: hidden;
          position: relative;
        }

        .ticker-content {
          display: flex;
          animation: ticker-scroll 30s linear infinite;
        }

        .ticker-item {
          flex-shrink: 0;
          white-space: nowrap;
        }

        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
