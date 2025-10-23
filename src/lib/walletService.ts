/**
 * Multi-Wallet Connection Service
 * Supports MetaMask, Coinbase Wallet, Trust Wallet, WalletConnect
 */

import { ethers } from "ethers";

export type WalletType = "metamask" | "coinbase" | "trust" | "walletconnect";

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
  walletType: WalletType;
  ensName?: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
  value?: number; // USD value
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private walletInfo: WalletInfo | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Check if wallet is available
   */
  isWalletAvailable(walletType: WalletType): boolean {
    switch (walletType) {
      case "metamask":
        return (
          typeof window !== "undefined" &&
          typeof (window as any).ethereum !== "undefined"
        );
      case "coinbase":
        return (
          typeof window !== "undefined" &&
          typeof (window as any).coinbaseSolana !== "undefined"
        );
      case "trust":
        return (
          typeof window !== "undefined" &&
          typeof (window as any).trustwallet !== "undefined"
        );
      case "walletconnect":
        return true; // WalletConnect is always available via QR code
      default:
        return false;
    }
  }

  /**
   * Connect to wallet
   */
  async connect(walletType: WalletType = "metamask"): Promise<WalletInfo> {
    try {
      let ethereum: any;

      switch (walletType) {
        case "metamask":
          if (!(window as any).ethereum) {
            throw new Error("MetaMask is not installed");
          }
          ethereum = (window as any).ethereum;
          break;

        case "coinbase":
          if (!(window as any).ethereum?.isCoinbaseWallet) {
            throw new Error("Coinbase Wallet is not installed");
          }
          ethereum = (window as any).ethereum;
          break;

        case "trust":
          if (!(window as any).ethereum?.isTrust) {
            throw new Error("Trust Wallet is not installed");
          }
          ethereum = (window as any).ethereum;
          break;

        case "walletconnect":
          // WalletConnect implementation would go here
          throw new Error("WalletConnect integration coming soon");

        default:
          throw new Error("Unsupported wallet type");
      }

      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();

      // Get wallet info
      const address = accounts[0];
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      // Try to get ENS name
      let ensName: string | undefined;
      try {
        ensName = (await this.provider.lookupAddress(address)) || undefined;
      } catch (error) {
        // ENS lookup failed, continue without it
      }

      this.walletInfo = {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        chainName: this.getChainName(Number(network.chainId)),
        walletType,
        ensName,
      };

      // Set up event listeners
      this.setupEventListeners(ethereum);

      // Emit connection event
      this.emit("connected", this.walletInfo);

      return this.walletInfo;
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      throw new Error(error.message || "Failed to connect wallet");
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.walletInfo = null;
    this.emit("disconnected", null);
  }

  /**
   * Get current wallet info
   */
  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  /**
   * Get token balances
   */
  async getTokenBalances(tokenAddresses: string[]): Promise<TokenBalance[]> {
    if (!this.provider || !this.walletInfo) {
      throw new Error("Wallet not connected");
    }

    const balances: TokenBalance[] = [];

    for (const tokenAddress of tokenAddresses) {
      try {
        const contract = new ethers.Contract(
          tokenAddress,
          [
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
          ],
          this.provider
        );

        const [balance, decimals, symbol] = await Promise.all([
          contract.balanceOf(this.walletInfo.address),
          contract.decimals(),
          contract.symbol(),
        ]);

        balances.push({
          symbol,
          balance: ethers.formatUnits(balance, decimals),
          decimals,
          address: tokenAddress,
        });
      } catch (error) {
        console.error(`Error fetching balance for ${tokenAddress}:`, error);
      }
    }

    return balances;
  }

  /**
   * Send transaction
   */
  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }

    try {
      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("Transaction error:", error);
      throw new Error(error.message || "Transaction failed");
    }
  }

  /**
   * Sign message
   */
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }

    try {
      return await this.signer.signMessage(message);
    } catch (error: any) {
      console.error("Signing error:", error);
      throw new Error(error.message || "Failed to sign message");
    }
  }

  /**
   * Switch network
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  /**
   * Add network
   */
  async addNetwork(chainId: number): Promise<void> {
    const networks: { [key: number]: any } = {
      56: {
        chainId: "0x38",
        chainName: "Binance Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com/"],
      },
      137: {
        chainId: "0x89",
        chainName: "Polygon",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    };

    const networkConfig = networks[chainId];
    if (!networkConfig) {
      throw new Error("Network not supported");
    }

    const ethereum = (window as any).ethereum;
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkConfig],
    });
  }

  /**
   * Get chain name
   */
  private getChainName(chainId: number): string {
    const chains: { [key: number]: string } = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      56: "Binance Smart Chain",
      97: "BSC Testnet",
      137: "Polygon",
      80001: "Mumbai Testnet",
      43114: "Avalanche",
      43113: "Fuji Testnet",
      250: "Fantom",
      4002: "Fantom Testnet",
    };
    return chains[chainId] || `Chain ${chainId}`;
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(ethereum: any): void {
    // Account changed
    ethereum.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else if (this.walletInfo) {
        const balance = await this.provider!.getBalance(accounts[0]);
        this.walletInfo.address = accounts[0];
        this.walletInfo.balance = ethers.formatEther(balance);
        this.emit("accountChanged", this.walletInfo);
      }
    });

    // Chain changed
    ethereum.on("chainChanged", (chainId: string) => {
      window.location.reload(); // Recommended by MetaMask
    });

    // Disconnect
    ethereum.on("disconnect", () => {
      this.disconnect();
    });
  }

  /**
   * Event emitter
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  /**
   * Format address for display
   */
  formatAddress(address: string, length: number = 4): string {
    if (!address) return "";
    return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
  }

  /**
   * Check if address is valid
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }
}

// Export singleton instance
export const walletService = new WalletService();
