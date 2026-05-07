"use client";
import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import type { Adapter } from "@solana/wallet-adapter-base";

// RPC endpoint — uses Helius if available, falls back to public mainnet
const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

export function AppKitProvider({ children }: { children: ReactNode }) {
  // Wallet Standard auto-detects most modern wallets (Phantom, Solflare, Backpack,
  // Magic Eden, OKX, Coinbase, Trust) when they're installed as browser extensions
  // or available as in-app browsers. We add Phantom and Solflare adapters explicitly
  // for older versions that don't support Wallet Standard yet.
  const wallets = useMemo<Adapter[]>(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
