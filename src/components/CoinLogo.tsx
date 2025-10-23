/**
 * 🪙 COIN LOGO COMPONENT
 * Real cryptocurrency logos with fallback
 */

interface CoinLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

// Coin logo URLs from CoinGecko API (free, no API key needed)
const COIN_LOGO_URLS: { [key: string]: string } = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  MATIC:
    "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  SHIB: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
  ATOM: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
};

// Fallback gradient colors for each coin
const COIN_COLORS: { [key: string]: { from: string; to: string } } = {
  BTC: { from: "#F7931A", to: "#FF9500" },
  ETH: { from: "#627EEA", to: "#8B9FFF" },
  BNB: { from: "#F3BA2F", to: "#FFD700" },
  SOL: { from: "#14F195", to: "#9945FF" },
  ADA: { from: "#0033AD", to: "#3468C0" },
  DOT: { from: "#E6007A", to: "#FF1493" },
  MATIC: { from: "#8247E5", to: "#A855F7" },
  AVAX: { from: "#E84142", to: "#FF6B6B" },
  XRP: { from: "#23292F", to: "#4A5568" },
  DOGE: { from: "#C2A633", to: "#F0D000" },
  SHIB: { from: "#FFA409", to: "#FFD700" },
  LINK: { from: "#2A5ADA", to: "#4A90E2" },
  UNI: { from: "#FF007A", to: "#FF4D9F" },
  ATOM: { from: "#2E3148", to: "#5064FB" },
};

export function CoinLogo({ symbol, size = 32, className = "" }: CoinLogoProps) {
  const logoUrl = COIN_LOGO_URLS[symbol];
  const colors = COIN_COLORS[symbol] || { from: "#9333EA", to: "#F59E0B" };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
        boxShadow: `0 0 20px ${colors.from}40`,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={symbol}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to text if image fails to load
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="font-bold text-white" style="font-size: ${
                size * 0.4
              }px">${symbol.slice(0, 1)}</span>`;
            }
          }}
        />
      ) : (
        <span
          className="font-bold text-white"
          style={{ fontSize: `${size * 0.4}px` }}
        >
          {symbol.slice(0, 1)}
        </span>
      )}
    </div>
  );
}
