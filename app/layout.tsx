import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppKitProvider } from "@/components/AppKitProvider";
import { JsonLd } from "@/components/JsonLd";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://solanarefund.xyz"),
  title: {
    default: "SolanaRefund — Recover Locked SOL from Unused Token Accounts",
    template: "%s | SolanaRefund"
  },
  description: "Recover SOL locked as rent in unused Solana token accounts. Connect your wallet, scan safely, and close empty accounts to reclaim your SOL. No seed phrase. Non-custodial. You approve every action.",
  applicationName: "SolanaRefund",
  authors: [{ name: "SolanaRefund" }],
  generator: "Next.js",
  keywords: [
    "solana refund",
    "reclaim SOL",
    "recover SOL",
    "locked SOL",
    "solana rent",
    "rent exempt SOL",
    "close Solana token accounts",
    "close empty token accounts",
    "Solana wallet cleaner",
    "recover rent Solana",
    "SPL token accounts",
    "Solana rent reclaim",
    "unused Solana accounts",
    "Solana account cleanup",
    "Phantom wallet cleaner",
    "Solflare wallet cleaner"
  ],
  referrer: "origin-when-cross-origin",
  creator: "SolanaRefund",
  publisher: "SolanaRefund",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/"
    }
  },
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
    title: "SolanaRefund — Recover Locked SOL from Unused Token Accounts",
    description: "Scan your Solana wallet for unused token accounts and recover locked SOL safely. No seed phrase. Non-custodial. You approve every action.",
    url: "https://solanarefund.xyz",
    siteName: "SolanaRefund",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolanaRefund — Recover locked SOL from unused Solana token accounts",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SolanaRefund — Recover Locked SOL",
    description: "Recover SOL locked in unused Solana token accounts. Connect, scan, review, and approve every action safely.",
    images: ["/og-image.png"],
    creator: "@SolanaRefundXYZ"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  category: "finance",
  classification: "Cryptocurrency Wallet Tool"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <JsonLd />
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
