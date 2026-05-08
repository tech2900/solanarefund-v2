"use client";
import { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana } from "@reown/appkit/networks";

const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "3201b2bf5f0eed77929fe746703587b5";

const solanaAdapter = new SolanaAdapter();

createAppKit({
  adapters: [solanaAdapter],
  networks: [solana],
  defaultNetwork: solana,
  projectId,
  metadata: {
    name: "SolanaRefund",
    description: "Recover locked SOL from unused Solana token accounts.",
    url: "https://solanarefund.xyz",
    icons: ["https://solanarefund.xyz/icon-512.png"],
  },
  features: {
    analytics: false,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
    history: false,
    emailShowWallets: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#c8a96a",
    "--w3m-color-mix": "#080808",
    "--w3m-color-mix-strength": 35,
    "--w3m-border-radius-master": "10px",
    "--w3m-font-family": "inherit",
    "--w3m-z-index": 99999,
  },
  featuredWalletIds: [
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
    "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79", // Solflare
    "2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0", // Backpack
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
    "8b830a2b724a9c3fbab63af6f55ed29c9dfa8a55e732dc88c80a196a2ba136c6", // Magic Eden
  ],
  enableInjected: true,
  enableWalletConnect: true,
  enableEIP6963: true,
  enableCoinbase: true,
  allowUnsupportedChain: false,
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
