import type { Metadata } from "next";
import "./globals.css";
import { AppKitProvider } from "@/components/AppKitProvider";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://solanarefund.xyz"),
  title: "SolanaRefund — Recover Locked SOL from Unused Solana Accounts",
  description: "Recover SOL locked in unused Solana token accounts. Connect your wallet, scan safely, review every action, and close empty accounts without sharing your seed phrase or private key.",
  keywords: [
    "Solana refund",
    "recover SOL",
    "reclaim SOL",
    "locked SOL",
    "unused Solana accounts",
    "close token accounts",
    "Solana wallet cleaner",
    "recover rent Solana",
    "SPL token accounts",
    "Solana rent reclaim"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SolanaRefund — Recover Locked SOL",
    description: "Scan your Solana wallet for unused token accounts and recover locked SOL safely. No seed phrase. No private key. You approve every action.",
    url: "https://solanarefund.xyz",
    siteName: "SolanaRefund",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "SolanaRefund — Recover Locked SOL",
    description: "Recover SOL locked in unused Solana token accounts. Connect, scan, review, and approve every action safely."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><JsonLd /><AppKitProvider>{children}</AppKitProvider></body></html>;
}
