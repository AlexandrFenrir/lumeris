/**
 * Crypto Price Service - CoinMarketCap Integration
 * Fetches real-time cryptocurrency prices and market data
 */

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: Date;
}

interface CoinMarketCapResponse {
  data: {
    [key: string]: {
      id: number;
      name: string;
      symbol: string;
      quote: {
        USD: {
          price: number;
          percent_change_24h: number;
          market_cap: number;
          volume_24h: number;
          last_updated: string;
        };
      };
    };
  };
}

class CryptoService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { data: CryptoPrice; timestamp: number }>;
  private cacheTimeout: number;
  private wsConnections: Map<string, WebSocket>;

  constructor() {
    // For demo purposes, we'll use a fallback API
    // In production, use environment variable: import.meta.env.VITE_CMC_API_KEY
    this.apiKey = import.meta.env.VITE_CMC_API_KEY || "demo";
    this.baseUrl = "https://pro-api.coinmarketcap.com/v1";
    this.cache = new Map();
    this.cacheTimeout = 120000; // 2 minute cache (reduced API calls)
    this.wsConnections = new Map();
  }

  /**
   * Fetch current price for a cryptocurrency
   */
  async getPrice(symbol: string): Promise<CryptoPrice | null> {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // For demo mode, use CoinGecko as fallback (no API key required)
      if (this.apiKey === "demo") {
        return await this.getPriceFromCoinGecko(symbol);
      }

      const response = await fetch(
        `${this.baseUrl}/cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }

      const data: CoinMarketCapResponse = await response.json();
      const coinData = data.data[symbol];

      if (!coinData) {
        return null;
      }

      const priceData: CryptoPrice = {
        id: coinData.id.toString(),
        symbol: coinData.symbol,
        name: coinData.name,
        price: coinData.quote.USD.price,
        change24h: coinData.quote.USD.percent_change_24h,
        marketCap: coinData.quote.USD.market_cap,
        volume24h: coinData.quote.USD.volume_24h,
        lastUpdated: new Date(coinData.quote.USD.last_updated),
      };

      this.cache.set(symbol, { data: priceData, timestamp: Date.now() });
      return priceData;
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return await this.getPriceFromCoinGecko(symbol);
    }
  }

  /**
   * Fallback to CoinGecko API (free, no API key required)
   * Uses CORS proxy to bypass browser restrictions
   */
  private async getPriceFromCoinGecko(
    symbol: string
  ): Promise<CryptoPrice | null> {
    try {
      const coinId = this.getCoinGeckoId(symbol);

      // Try multiple CORS proxies in order
      const corsProxies = [
        "", // Direct request first (might work in production)
        "https://corsproxy.io/?", // CORS proxy 1
        "https://api.allorigins.win/raw?url=", // CORS proxy 2
      ];

      let lastError: Error | null = null;

      for (const proxy of corsProxies) {
        try {
          const url = `${proxy}https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          const coinData = data[coinId];

          if (!coinData) {
            throw new Error(`No data for ${coinId}`);
          }

          const priceData: CryptoPrice = {
            id: coinId,
            symbol: symbol.toUpperCase(),
            name: this.getCoinName(symbol),
            price: coinData.usd,
            change24h: coinData.usd_24h_change || 0,
            marketCap: coinData.usd_market_cap || 0,
            volume24h: coinData.usd_24h_vol || 0,
            lastUpdated: new Date(),
          };

          this.cache.set(symbol, { data: priceData, timestamp: Date.now() });
          console.log(
            `✅ Fetched ${symbol} price: ${this.formatPrice(priceData.price)}`
          );
          return priceData;
        } catch (error) {
          lastError = error as Error;
          continue; // Try next proxy
        }
      }

      // All proxies failed, throw last error
      throw lastError || new Error("All CORS proxies failed");
    } catch (error) {
      console.warn(
        `⚠️ CoinGecko API failed for ${symbol}, using mock data:`,
        error
      );
      return this.getMockPrice(symbol);
    }
  }

  /**
   * Get multiple cryptocurrency prices at once
   * Uses sequential requests with delay to avoid rate limiting
   */
  async getPrices(symbols: string[]): Promise<Map<string, CryptoPrice>> {
    const prices = new Map<string, CryptoPrice>();

    // Sequential requests with delay to avoid rate limiting
    for (const symbol of symbols) {
      try {
        const price = await this.getPrice(symbol);
        if (price) {
          prices.set(symbol, price);
        }
        // Add 200ms delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        // Continue with next symbol even if one fails
      }
    }

    return prices;
  }

  /**
   * Subscribe to real-time price updates via WebSocket
   */
  subscribeToPriceUpdates(
    symbols: string[],
    callback: (symbol: string, price: CryptoPrice) => void
  ): () => void {
    // For demo, we'll use polling instead of WebSocket
    const interval = setInterval(async () => {
      for (const symbol of symbols) {
        try {
          const price = await this.getPrice(symbol);
          if (price) {
            callback(symbol, price);
          }
          // Add delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Failed to update price for ${symbol}:`, error);
        }
      }
    }, 30000); // Update every 30 seconds (reduced from 10s to avoid rate limits)

    return () => clearInterval(interval);
  }

  /**
   * Get historical price data
   */
  async getHistoricalData(
    symbol: string,
    days: number = 7
  ): Promise<{ timestamp: Date; price: number }[]> {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }

      const data = await response.json();
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp: new Date(timestamp),
        price,
      }));
    } catch (error) {
      console.error("Error fetching historical data:", error);
      return this.getMockHistoricalData(symbol, days);
    }
  }

  /**
   * Format price with appropriate decimals
   */
  formatPrice(price: number): string {
    if (price >= 1000) {
      return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(8)}`;
    }
  }

  /**
   * Format market cap
   */
  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })}`;
    }
  }

  /**
   * Helper: Map symbol to CoinGecko ID
   */
  private getCoinGeckoId(symbol: string): string {
    const mapping: { [key: string]: string } = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      ADA: "cardano",
      DOGE: "dogecoin",
      MATIC: "matic-network",
      DOT: "polkadot",
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  /**
   * Helper: Get coin name
   */
  private getCoinName(symbol: string): string {
    const mapping: { [key: string]: string } = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      USDT: "Tether",
      BNB: "Binance Coin",
      SOL: "Solana",
      XRP: "Ripple",
      ADA: "Cardano",
      DOGE: "Dogecoin",
      MATIC: "Polygon",
      DOT: "Polkadot",
    };
    return mapping[symbol.toUpperCase()] || symbol;
  }

  /**
   * Mock data for development/fallback
   * Uses realistic prices based on current market (as of 2024)
   */
  private getMockPrice(symbol: string): CryptoPrice {
    const mockPrices: { [key: string]: number } = {
      BTC: 43000 + Math.random() * 2000, // ~$43k-45k
      ETH: 2300 + Math.random() * 200, // ~$2.3k-2.5k
      USDT: 1.0, // Stablecoin
      BNB: 310 + Math.random() * 20, // ~$310-330
      SOL: 98 + Math.random() * 12, // ~$98-110
      MATIC: 0.85 + Math.random() * 0.15, // ~$0.85-1.00
    };

    const price = mockPrices[symbol.toUpperCase()] || 100;

    console.log(
      `🎲 Using mock price for ${symbol}: ${this.formatPrice(price)}`
    );

    return {
      id: symbol.toLowerCase(),
      symbol: symbol.toUpperCase(),
      name: this.getCoinName(symbol),
      price: price,
      change24h: (Math.random() - 0.5) * 8, // -4% to +4%
      marketCap: price * (1000000000 + Math.random() * 500000000),
      volume24h: price * (100000000 + Math.random() * 50000000),
      lastUpdated: new Date(),
    };
  }

  /**
   * Mock historical data
   */
  private getMockHistoricalData(
    symbol: string,
    days: number
  ): { timestamp: Date; price: number }[] {
    const data: { timestamp: Date; price: number }[] = [];
    const basePrice = this.getMockPrice(symbol).price;
    const now = Date.now();

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now - i * 24 * 60 * 60 * 1000);
      const variance = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variance);
      data.push({ timestamp, price });
    }

    return data;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const cryptoService = new CryptoService();
export type { CryptoPrice };
