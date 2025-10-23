import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { NFTGalleryBackground } from "@/components/backgrounds/NFTGalleryBackground";
import {
  Image,
  ShoppingCart,
  TrendingUp,
  Users,
  Crown,
  Palette,
  Gamepad2,
  Star,
  DollarSign,
  Trophy,
  Sparkles,
  Wallet,
  Award,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const nftCollections = [
  {
    id: 1,
    name: "CyberWarriors",
    floorPrice: "2.5 ETH",
    volume: "156 ETH",
    items: "10,000",
    image: "⚔️",
    category: "Gaming",
    rarity: "Epic",
  },
  {
    id: 2,
    name: "Digital Artifacts",
    floorPrice: "0.8 ETH",
    volume: "89 ETH",
    items: "5,000",
    image: "🏺",
    category: "Art",
    rarity: "Rare",
  },
  {
    id: 3,
    name: "Quantum Vehicles",
    floorPrice: "1.2 ETH",
    volume: "234 ETH",
    items: "3,000",
    image: "🚗",
    category: "Gaming",
    rarity: "Epic",
  },
  {
    id: 4,
    name: "MetaLands",
    floorPrice: "4.1 ETH",
    volume: "445 ETH",
    items: "1,000",
    image: "🏝️",
    category: "Virtual Real Estate",
    rarity: "Legendary",
  },
];

const featuredNFTs = [
  {
    id: 1,
    name: "Legendary Sword #001",
    price: "12.5 ETH",
    seller: "CryptoWarrior",
    image: "⚔️",
    rarity: "Legendary",
  },
  {
    id: 2,
    name: "Cyberpunk Avatar #456",
    price: "3.2 ETH",
    seller: "DigitalArtist",
    image: "🤖",
    rarity: "Epic",
  },
  {
    id: 3,
    name: "Racing Beast #789",
    price: "5.8 ETH",
    seller: "SpeedDemon",
    image: "🏎️",
    rarity: "Rare",
  },
];

const NFTMarketplace = () => {
  const [userStats] = useState({
    collectorLevel: 8,
    nftsOwned: 42,
    totalSpent: 156.8,
    rarityScore: 8450,
    tradingVolume: 234.5,
    galleryRank: 156,
    creatorStatus: "Verified",
  });

  const handleBuyNFT = (nftName: string, price: string) => {
    toast.success(`🎨 NFT Purchase Initiated!`, {
      description: `${nftName} for ${price}`,
      duration: 5000,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "Epic":
        return "text-purple-400 bg-purple-500/20 border-purple-400/30";
      case "Rare":
        return "text-blue-400 bg-blue-500/20 border-blue-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* 🌌 NFT GALLERY BACKGROUND */}
      <NFTGalleryBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <ArenaHeader />

        <main className="pt-24 pb-16">
          {/* Hero Section with Stats */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="max-w-7xl mx-auto">
                {/* Title */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-purple border border-purple-400/30 mb-6">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                    <span className="text-sm font-semibold text-gradient-purple">
                      Cosmic Gallery Collection
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient-purple text-glow-purple">
                      NFT Marketplace
                    </span>
                    <br />
                    <span className="text-gradient-gold text-glow-gold">
                      Digital Treasures
                    </span>
                  </h1>

                  <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                    Discover, collect, and trade unique digital assets from
                    gaming and art communities
                  </p>
                </div>

                {/* User Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                  {/* Collector Level Card */}
                  <HolographicCard theme="gold" className="col-span-2">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-yellow-500/20">
                          <Crown className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/60">
                            Collector Level
                          </p>
                          <p className="text-2xl font-bold text-gradient-gold">
                            {userStats.collectorLevel}
                          </p>
                          <p className="text-xs text-foreground/60 mt-1">
                            Master Collector
                          </p>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>

                  {/* NFTs Owned Card */}
                  <HolographicCard theme="purple">
                    <div className="p-4 text-center">
                      <Image className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                      <p className="text-2xl font-bold text-gradient-purple">
                        {userStats.nftsOwned}
                      </p>
                      <p className="text-xs text-foreground/60">NFTs Owned</p>
                    </div>
                  </HolographicCard>

                  {/* Total Spent Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        {userStats.totalSpent}
                      </p>
                      <p className="text-xs text-foreground/60">ETH Spent</p>
                    </div>
                  </HolographicCard>

                  {/* Rarity Score Card */}
                  <HolographicCard theme="purple">
                    <div className="p-4 text-center">
                      <Star className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                      <p className="text-2xl font-bold text-gradient-purple">
                        {userStats.rarityScore}
                      </p>
                      <p className="text-xs text-foreground/60">Rarity Score</p>
                    </div>
                  </HolographicCard>

                  {/* Trading Volume Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.tradingVolume}
                      </p>
                      <p className="text-xs text-foreground/60">ETH Volume</p>
                    </div>
                  </HolographicCard>

                  {/* Gallery Rank Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-1 text-silver-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        #{userStats.galleryRank}
                      </p>
                      <p className="text-xs text-foreground/60">Gallery Rank</p>
                    </div>
                  </HolographicCard>

                  {/* Creator Status Card */}
                  <HolographicCard theme="purple">
                    <div className="p-4 text-center">
                      <Palette className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                      <p className="text-lg font-bold text-gradient-purple">
                        {userStats.creatorStatus}
                      </p>
                      <p className="text-xs text-foreground/60">Creator</p>
                    </div>
                  </HolographicCard>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <MagneticButton className="btn-gold">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </MagneticButton>
                  <MagneticButton className="btn-purple">
                    <Award className="w-5 h-5" />
                    Achievements
                  </MagneticButton>
                  <MagneticButton className="btn-silver">
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </MagneticButton>
                  <MagneticButton className="btn-purple">
                    <Crown className="w-5 h-5" />
                    My Gallery
                  </MagneticButton>
                </div>

                {/* Featured NFTs */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-purple">Featured NFTs</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {featuredNFTs.map((nft) => (
                    <HolographicCard
                      key={nft.id}
                      theme={
                        nft.rarity === "Legendary"
                          ? "gold"
                          : nft.rarity === "Epic"
                            ? "purple"
                            : "silver"
                      }
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <div className="p-6">
                        <div
                          className="text-8xl text-center mb-6 animate-float"
                          data-space-effect="float"
                        >
                          {nft.image}
                        </div>
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
                          <Badge
                            className={`${getRarityColor(nft.rarity)} border`}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            {nft.rarity}
                          </Badge>
                        </div>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-foreground/60">Price:</span>
                            <span className="font-bold text-gradient-gold text-lg">
                              {nft.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground/60">Seller:</span>
                            <span className="font-semibold">{nft.seller}</span>
                          </div>
                        </div>
                        <MagneticButton
                          className="btn-gold w-full"
                          onClick={() => handleBuyNFT(nft.name, nft.price)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </MagneticButton>
                      </div>
                    </HolographicCard>
                  ))}
                </div>

                {/* Top Collections */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-gold">Top Collections</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {nftCollections.map((collection) => (
                    <HolographicCard
                      key={collection.id}
                      theme={
                        collection.rarity === "Legendary" ? "gold" : "purple"
                      }
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="text-6xl animate-pulse">
                            {collection.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-1">
                              {collection.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground/60">
                                {collection.category}
                              </span>
                              <Badge
                                className={`${getRarityColor(collection.rarity)} border text-xs`}
                              >
                                {collection.rarity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Floor Price
                            </div>
                            <div className="font-bold text-gradient-gold text-lg">
                              {collection.floorPrice}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Volume
                            </div>
                            <div className="font-bold text-lg">
                              {collection.volume}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">Items</div>
                            <div className="font-bold text-lg">
                              {collection.items}
                            </div>
                          </div>
                        </div>
                        <MagneticButton className="btn-purple w-full">
                          <Zap className="w-4 h-4" />
                          View Collection
                        </MagneticButton>
                      </div>
                    </HolographicCard>
                  ))}
                </div>

                {/* Marketplace Features */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-silver">
                    Marketplace Features
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <HolographicCard theme="purple" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Crown className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-purple">
                        Royalty System
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Creators earn royalties on every secondary sale
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="gold" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Gamepad2 className="w-8 h-8 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold">
                        Gaming Integration
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Use NFTs directly in supported games
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="silver" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-silver">
                        Price Analytics
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Track price history and market trends
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="purple" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-purple">
                        Community
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Connect with artists and collectors
                      </p>
                    </div>
                  </HolographicCard>
                </div>
              </div>
            </div>
          </section>
        </main>

        <ArenaFooter />
      </div>
    </div>
  );
};

export default NFTMarketplace;
