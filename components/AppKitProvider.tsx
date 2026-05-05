"use client";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana } from "@reown/appkit/networks";
import { ReactNode, useEffect, useRef } from "react";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "3201b2bf5f0eed77929fe746703587b5";

const metadata = {
  name: "SolanaRefund",
  description: "Recover locked SOL from unused Solana accounts.",
  url: "https://solanarefund.xyz",
  icons: ["https://solanarefund.xyz/icon-512.png"]
};

// Verified Solana wallet IDs from WalletConnect Cloud Explorer.
// Order matters — these appear FIRST in the modal.
// Source: https://walletconnect.com/explorer
const SOLANA_FEATURED_WALLETS = [
  "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Solflare
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
];

// EVM-only wallets to hide from the modal (they don't support Solana).
// These cause confusing "not supported" messages when clicked.
const EVM_ONLY_WALLETS_TO_EXCLUDE = [
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // (skip — placeholder, real list below)
];

// Note: We do NOT use excludeWalletIds aggressively because Reown's wallet detection
// is dynamic. Instead, we rely on the Solana adapter to filter incompatible wallets.
// The SolanaAdapter ensures only wallets that support Solana protocol are usable.

let appKitInitialized = false;

function initAppKit() {
  if (appKitInitialized) return;
  appKitInitialized = true;

  const solanaAdapter = new SolanaAdapter();

  createAppKit({
    adapters: [solanaAdapter],
    networks: [solana],
    metadata,
    projectId,
    features: {
      analytics: true,
      email: false,
      socials: false,
      onramp: false,
      swaps: false,
      history: false,
      // Disable email-based wallet (only show real wallets)
      emailShowWallets: false
    },
    featuredWalletIds: SOLANA_FEATURED_WALLETS,
    // Allow injected (browser extensions like Phantom) — fastest connection path
    enableInjected: true,
    // Allow WalletConnect protocol for mobile wallets
    enableWalletConnect: true,
    // Allow EIP-6963 (modern wallet detection standard)
    enableEIP6963: true,
    // Allow Coinbase wallet SDK
    enableCoinbase: true,
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#9945FF",
      "--w3m-border-radius-master": "12px",
      "--w3m-font-family": "JetBrains Mono, ui-monospace, monospace",
      "--w3m-font-size-master": "14px"
    }
  });
}

// Pre-initialize AppKit at module load time (not in useEffect).
// This makes the wallet modal appear faster when user clicks Connect,
// because the SDK is already loaded and ready.
if (typeof window !== "undefined") {
  // Run on next tick to avoid blocking initial render
  Promise.resolve().then(() => initAppKit());
}

export function AppKitProvider({ children }: { children: ReactNode }) {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initAppKit(); // safety: ensure init even if module-level call was skipped
    }
  }, []);
  return <>{children}</>;
}
