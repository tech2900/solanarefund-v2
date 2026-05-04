import type { Metadata } from "next";
import "./globals.css";
import { AppKitProvider } from "@/components/AppKitProvider";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://solanarefund.xyz"),
  title: "Solana Refund — Recover Locked SOL from Unused Token Accounts",
  description: "Recover SOL locked inside unused Solana token accounts. Scan your wallet, close empty accounts, and get SOL back safely. No seed phrase. No private key.",
  keywords: ["solana refund","reclaim SOL","recover SOL","get SOL back","claim free SOL","locked SOL","close Solana token accounts","close empty token accounts","Solana wallet cleaner","burn Solana tokens","Sol Incinerator alternative","RefundYourSOL alternative"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SolanaRefund.xyz — Get your locked SOL back",
    description: "Clean unused Solana accounts. Recover locked SOL safely. No seed phrase. No private key.",
    url: "https://solanarefund.xyz",
    siteName: "SolanaRefund",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><JsonLd /><AppKitProvider>{children}</AppKitProvider></body></html>;
}
