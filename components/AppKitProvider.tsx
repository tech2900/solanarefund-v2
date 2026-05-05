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
  icons: ["https://solanarefund.xyz/icon.png"]
};

function initAppKitOnce() {
  const solanaAdapter = new SolanaAdapter();
  createAppKit({
    adapters: [solanaAdapter],
    networks: [solana],
    metadata,
    projectId,
    features: { analytics: true, email: false, socials: false },
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
  useEffect(() => { if (!initialized.current) { initialized.current = true; initAppKitOnce(); } }, []);
  return <>{children}</>;
}
