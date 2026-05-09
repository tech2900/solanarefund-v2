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
    default: "SolanaRefund — Recover SOL From Empty Solana Token Accounts",
    template: "%s | SolanaRefund",
  },
  description:
    "Recover unused SOL from empty Solana token accounts. Connect your Solana wallet, scan safely, review eligible accounts, and reclaim SOL in seconds.",
  applicationName: "SolanaRefund",
  authors: [{ name: "SolanaRefund" }],
  keywords: [
    "Solana refund",
    "recover SOL",
    "reclaim SOL",
    "recover Solana",
    "Solana rent recovery",
    "Solana account rent recovery",
    "close empty token accounts",
    "close unused token accounts",
    "recover unused SOL",
    "reclaim unused SOL",
    "Solana wallet cleanup",
    "empty token accounts",
    "unused Solana token accounts",
    "free SOL back",
    "sol recover",
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
    title: "SolanaRefund — Recover SOL From Empty Solana Token Accounts",
    description:
      "Recover unused SOL from empty Solana token accounts. Connect your Solana wallet, scan safely, review eligible accounts, and reclaim SOL in seconds.",
    url: "https://solanarefund.xyz/",
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
    title: "SolanaRefund — Recover SOL From Empty Solana Token Accounts",
    description:
      "Recover unused SOL from empty Solana token accounts. Connect your Solana wallet, scan safely, review eligible accounts, and reclaim SOL in seconds.",
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
