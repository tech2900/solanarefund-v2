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
  themeVariables: { "--w3m-accent": "#14f195", "--w3m-border-radius-master": "18px" }
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
