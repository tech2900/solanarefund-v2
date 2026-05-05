import type { Metadata } from "next";
import "./globals.css";
import { AppKitProvider } from "@/components/AppKitProvider";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://solanarefund.xyz"),
  title: "Solana Refund — Recover Locked SOL from Unused Token Accounts",
  description: "Recover SOL locked inside unused Solana token accounts. Scan your wallet, close empty accounts, and get SOL back safely. No seed phrase. No private key.",
  keywords: ["solana refund", "reclaim SOL", "recover SOL", "locked SOL", "close Solana token accounts", "close empty token accounts", "Solana wallet cleaner", "recover rent Solana", "SPL token accounts", "Solana rent reclaim"],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16.png", type: "image/png", sizes: "16x16" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ]
  },
  openGraph: {
    title: "SolanaRefund — Recover Locked SOL",
    description: "Scan your Solana wallet for unused token accounts and recover locked SOL safely. No seed phrase. No private key. You approve every action.",
    url: "https://solanarefund.xyz",
    siteName: "SolanaRefund",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "SolanaRefund — Recover locked SOL" }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SolanaRefund — Recover Locked SOL",
    description: "Recover SOL locked in unused Solana token accounts. Connect, scan, review, and approve every action safely.",
    images: ["/og-image.png"]
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
