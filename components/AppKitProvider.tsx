"use client";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana } from "@reown/appkit/networks";
import { ReactNode } from "react";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "3201b2bf5f0eed77929fe746703587b5";
const metadata = { name: "SolanaRefund", description: "Recover locked SOL from unused Solana accounts.", url: "https://solanarefund.xyz", icons: ["https://solanarefund.xyz/icon.png"] };

createAppKit({
  adapters: [new SolanaAdapter()],
  networks: [solana],
  metadata,
  projectId,
  features: { analytics: true, email: false, socials: false },
  themeMode: "dark",
  themeVariables: { "--w3m-accent": "#14f195", "--w3m-border-radius-master": "18px" },
  featuredWalletIds: [
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
    "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",
    "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972",
    "6cf4abc48ed6eec4c5ced89b4cc4ea5b0e33d86b30a75bc3dfb8e3bfc2ba4e33",
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
    "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
    "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4",
  ],
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
