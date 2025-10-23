/**
 * Multi-Wallet Connection Component
 * Supports MetaMask, Coinbase, Trust Wallet
 */

import { useState, useEffect } from "react";
import { walletService, WalletInfo, WalletType } from "@/lib/walletService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GamingWalletButton } from "./GamingWalletButton";

export function WalletConnect() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    // Listen for wallet events
    walletService.on("connected", (info: WalletInfo) => {
      setWalletInfo(info);
      setShowWalletModal(false);
    });

    walletService.on("disconnected", () => {
      setWalletInfo(null);
    });

    walletService.on("accountChanged", (info: WalletInfo) => {
      setWalletInfo(info);
    });

    return () => {
      walletService.off("connected", () => {});
      walletService.off("disconnected", () => {});
      walletService.off("accountChanged", () => {});
    };
  }, []);

  const handleConnect = async (walletType: WalletType) => {
    setIsConnecting(true);
    setError(null);

    try {
      const info = await walletService.connect(walletType);
      setWalletInfo(info);
    } catch (err: any) {
      setError(err.message);
      console.error("Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setWalletInfo(null);
    setShowAccountModal(false);
  };

  const copyAddress = () => {
    if (walletInfo) {
      navigator.clipboard.writeText(walletInfo.address);
    }
  };

  const openExplorer = () => {
    if (walletInfo) {
      const explorerUrls: { [key: number]: string } = {
        1: "https://etherscan.io",
        56: "https://bscscan.com",
        137: "https://polygonscan.com",
      };
      const baseUrl =
        explorerUrls[walletInfo.chainId] || "https://etherscan.io";
      window.open(`${baseUrl}/address/${walletInfo.address}`, "_blank");
    }
  };

  const walletOptions = [
    {
      type: "metamask" as WalletType,
      name: "MetaMask",
      icon: "🦊",
      description: "Connect with MetaMask",
    },
    {
      type: "coinbase" as WalletType,
      name: "Coinbase Wallet",
      icon: "💼",
      description: "Connect with Coinbase",
    },
    {
      type: "trust" as WalletType,
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Connect with Trust Wallet",
    },
  ];

  if (!walletInfo) {
    return (
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogTrigger asChild>
          <div style={{ width: "200px", height: "60px" }}>
            <GamingWalletButton
              onClick={() => setShowWalletModal(true)}
              isConnected={false}
              displayText="Connect Wallet"
              className="w-full h-full"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="glass-card-gold border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-glow-gold">
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose your preferred wallet to connect to Lumeris
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.type}
                onClick={() => handleConnect(wallet.type)}
                disabled={isConnecting}
                className="w-full p-4 rounded-lg glass-card-gold border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{wallet.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gold group-hover:text-glow-gold">
                      {wallet.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {wallet.description}
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gold -rotate-90 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {isConnecting && (
            <div className="mt-4 text-center text-gold animate-pulse">
              Connecting to wallet...
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
      <DialogTrigger asChild>
        <div style={{ width: "200px", height: "60px" }}>
          <GamingWalletButton
            onClick={() => setShowAccountModal(true)}
            isConnected={true}
            displayText={walletService.formatAddress(walletInfo.address)}
            className="w-full h-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="glass-card-gold border-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-glow-gold">
            Account Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {walletInfo.chainName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Balance */}
          <div className="p-4 rounded-lg glass-card-gold border border-gold/20">
            <div className="text-sm text-gray-400 mb-1">Balance</div>
            <div className="text-3xl font-bold text-glow-gold">
              {parseFloat(walletInfo.balance).toFixed(4)} ETH
            </div>
          </div>

          {/* Address */}
          <div className="p-4 rounded-lg glass-card-gold border border-gold/20">
            <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
            <div className="flex items-center justify-between">
              <code className="text-gold font-mono text-sm">
                {walletInfo.address}
              </code>
              <div className="flex space-x-2">
                <button
                  onClick={copyAddress}
                  className="p-2 rounded-lg hover:bg-gold/10 transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4 text-gold" />
                </button>
                <button
                  onClick={openExplorer}
                  className="p-2 rounded-lg hover:bg-gold/10 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-gold" />
                </button>
              </div>
            </div>
          </div>

          {/* ENS Name */}
          {walletInfo.ensName && (
            <div className="p-4 rounded-lg glass-card-gold border border-gold/20">
              <div className="text-sm text-gray-400 mb-1">ENS Name</div>
              <div className="text-lg font-bold text-gold">
                {walletInfo.ensName}
              </div>
            </div>
          )}

          {/* Wallet Type */}
          <div className="p-4 rounded-lg glass-card-gold border border-gold/20">
            <div className="text-sm text-gray-400 mb-1">Connected With</div>
            <div className="text-lg font-bold text-gold capitalize">
              {walletInfo.walletType}
            </div>
          </div>

          {/* Disconnect Button */}
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
