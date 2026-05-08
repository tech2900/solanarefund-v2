import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppKitProvider } from "@/components/AppKitProvider";
import { JsonLd } from "@/components/JsonLd";

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://solanarefund.xyz"),
  title: {
    default: "SolanaRefund — Reclaim Unused SOL From Your Wallet",
    template: "%s | SolanaRefund",
  },
  description:
    "Recover unused SOL from empty Solana token accounts. Connect your wallet, scan safely, and reclaim rent in seconds.",
  applicationName: "SolanaRefund",
  authors: [{ name: "SolanaRefund" }],
  keywords: [
    "solana refund",
    "recover SOL",
    "reclaim SOL",
    "close token accounts",
    "solana rent",
    "burn tokens",
    "solana wallet cleanup",
    "free SOL back",
    "locked SOL",
    "solana rent refund",
    "close empty token accounts",
    "SPL token accounts",
    "solana account cleanup",
    "Phantom wallet cleaner",
    "Solflare wallet cleaner",
  ],
  referrer: "origin-when-cross-origin",
  creator: "SolanaRefund",
  publisher: "SolanaRefund",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "SolanaRefund — Reclaim Unused SOL From Your Wallet",
    description:
      "Recover unused SOL from empty Solana token accounts. Connect your wallet, scan safely, and reclaim rent in seconds.",
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
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolanaRefund — Reclaim Unused SOL From Your Wallet",
    description:
      "Recover unused SOL from empty Solana token accounts. Connect your wallet, scan safely, and reclaim rent in seconds.",
    images: ["/og-image.png"],
    creator: "@SolanaRefundXYZ",
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
      "max-snippet": -1,
    },
  },
  category: "finance",
  classification: "Cryptocurrency Wallet Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd />
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
