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
// Order is respected — these appear FIRST in the modal.
// Source: https://walletconnect.com/explorer
const FEATURED_WALLET_IDS = [
  "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Solflare
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
];

function initAppKitOnce() {
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
      history: false
    },
    featuredWalletIds: FEATURED_WALLET_IDS,
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#9945FF",
      "--w3m-border-radius-master": "12px",
      "--w3m-font-family": "JetBrains Mono, ui-monospace, monospace",
      "--w3m-font-size-master": "14px"
    }
  });
}

export function AppKitProvider({ children }: { children: ReactNode }) {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initAppKitOnce();
    }
  }, []);
  return <>{children}</>;
}
