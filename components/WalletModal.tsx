"use client";
import { useEffect, useState, useCallback, useMemo } from "react";

// Wallet IDs verified from sol-incinerator's bundle — these are the official
// WalletConnect Cloud registry IDs (64-char hex). Reown uses these to identify
// wallets in their modal and to generate QR/deeplink flows.
const WC_WALLET_IDS = {
  phantom:    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
  solflare:   "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",
  magicEden:  "8b830a2b724a9c3fbab63af6f55ed29c9dfa8a55e732dc88c80a196a2ba136c6",
  backpack:   "2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0",
  trust:      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
  okx:        "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
  coinbase:   "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
} as const;

// Inline base64 wallet icons — no external URL fetches needed, works CSP-safe
// Icons are sourced from official wallet brand assets (simplified SVG form)
const ICONS: Record<string, string> = {
  mwa:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjOTk0NUZGIi8+PHJlY3QgeD0iMzAiIHk9IjIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHJ4PSI2IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMy41IiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI3MCIgcj0iMyIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
  phantom:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjNTQxNEY1Ii8+PGVsbGlwc2UgY3g9IjUwIiBjeT0iNDYiIHJ4PSIyNCIgcnk9IjIyIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNDQiIGN5PSI0NiIgcj0iNyIgZmlsbD0iIzU0MTRGNSIvPjxlbGxpcHNlIGN4PSI1NiIgY3k9IjUyIiByeD0iMTIiIHJ5PSI4IiBmaWxsPSIjNTQxNEY1IiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=",
  jupiter:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjMTcxQTIxIi8+PHBhdGggZD0iTTcwIDMwQTI1IDI1IDAgMSAxIDMwIDcwIiBzdHJva2U9IiMwMGM0ZmYiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTUwIDMwYzAgMCAxNSAxMCAxNSAyMHMtMTUgMjAtMTUgMjAiIHN0cm9rZT0iIzAwYzRmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  solflare:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRkM1MDBBIi8+PHBhdGggZD0iTTUwIDIwTDc2IDY1SDI0TDUwIDIwWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC45NSIvPjxwYXRoIGQ9Ik01MCA0MEw2OCA3MEgzMkw1MCA0MFoiIGZpbGw9IiNGQzUwMEEiLz48L3N2Zz4=",
  magicEden:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTQyNTc1Ii8+PHBhdGggZD0iTTI4IDcyVjI4bDIyIDIyIDIyLTIydjQ0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+",
  backpack:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTMzRTNGIi8+PHBhdGggZD0iTTI4IDM4VjMyYTEyIDEyIDAgMCAxIDEyLTEyaDIwYTEyIDEyIDAgMCAxIDEyIDEydjZ6IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjQiIHk9IjM4IiB3aWR0aD0iNTIiIGhlaWdodD0iNDIiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMzgiIHk9IjUwIiB3aWR0aD0iMjQiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNFMzNFM0YiLz48L3N2Zz4=",
  trust:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjMzM3NUJCIi8+PHBhdGggZD0iTTUwIDIyTDI0IDM0djI0YzAgMTQgMTEgMjYgMjYgMjhzMjYtMTQgMjYtMjhWMzRMNTAgMjJ6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjkiLz48cGF0aCBkPSJNNTAgMzJMMzIgNDJ2MThjMCA5IDggMTcgMTggMTlzMTgtMTAgMTgtMTlWNDJMNTAgMzJ6IiBmaWxsPSIjMzM3NUJCIi8+PC9zdmc+",
};

// Mobile deeplinks — only for wallets with confirmed Solana Wallet Standard support
// (Phantom, Solflare, Backpack use the ul/browse scheme; Trust has its own scheme)
const MOBILE_DEEPLINKS: Record<string, (url: string) => string> = {
  phantom:  (url) => `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
  solflare: (url) => `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
  backpack: (url) => `https://backpack.app/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
  trust:    (url) => `https://link.trustwallet.com/open_url?coin_id=501&url=${encodeURIComponent(url)}`,
};

// Wallet descriptor — ordered per user spec: MWA, Phantom, Jupiter, Solflare, Magic Eden, Backpack, Trust
type WalletEntry = {
  key: string;
  name: string;
  description: string;
  icon: string;
  wcId?: string;
  mobileLink?: string;
  installUrl?: string;
  isMwaOnly?: boolean;
};

function buildWallets(currentUrl: string): WalletEntry[] {
  const link = (key: string) => MOBILE_DEEPLINKS[key]?.(currentUrl);
  return [
    {
      key: "mwa",
      name: "Mobile Wallet Adapter",
      description: "Connect any installed Solana wallet",
      icon: ICONS.mwa,
      isMwaOnly: true,
    },
    {
      key: "phantom",
      name: "Phantom",
      description: "Most popular Solana wallet",
      icon: ICONS.phantom,
      wcId: WC_WALLET_IDS.phantom,
      mobileLink: link("phantom"),
    },
    {
      key: "jupiter",
      name: "Jupiter",
      description: "Solana DeFi wallet",
      icon: ICONS.jupiter,
      installUrl: "https://jup.ag/",
    },
    {
      key: "solflare",
      name: "Solflare",
      description: "Native Solana wallet",
      icon: ICONS.solflare,
      wcId: WC_WALLET_IDS.solflare,
      mobileLink: link("solflare"),
    },
    {
      key: "magicEden",
      name: "Magic Eden",
      description: "NFT-first Solana wallet",
      icon: ICONS.magicEden,
      wcId: WC_WALLET_IDS.magicEden,
      installUrl: "https://wallet.magiceden.io/",
    },
    {
      key: "backpack",
      name: "Backpack",
      description: "Modern Solana experience",
      icon: ICONS.backpack,
      wcId: WC_WALLET_IDS.backpack,
      mobileLink: link("backpack"),
    },
    {
      key: "trust",
      name: "Trust Wallet",
      description: "Multi-chain mobile wallet",
      icon: ICONS.trust,
      wcId: WC_WALLET_IDS.trust,
      mobileLink: link("trust"),
    },
  ];
}

// Detect mobile browser (not inside a wallet in-app browser)
function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (!/Android|iPhone|iPad|iPod/i.test(ua)) return false;
  const w = window as unknown as Record<string, unknown>;
  // If we're already inside a wallet's in-app browser, native adapter connects directly
  return !(w.phantom || w.solflare || w.backpack || w.jupiter || w.trustwallet);
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen: (...args: any[]) => Promise<any>;  // Reown's open() from useAppKit
}

export function WalletModal({ isOpen, onClose, onOpen }: WalletModalProps) {
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll + ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setPending(null);
  }, [isOpen]);

  const isMobile = useMemo(() => mounted && detectMobile(), [mounted]);

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://solanarefund.xyz";
    return window.location.href;
  }, []);

  const wallets = useMemo(() => buildWallets(currentUrl), [currentUrl]);

  const handleWalletClick = useCallback(
    async (wallet: WalletEntry) => {
      if (pending) return;

      // MWA — only shown on mobile; open Reown which triggers MWA on Android
      if (wallet.isMwaOnly) {
        onClose();
        await onOpen();
        return;
      }

      // Mobile: use deeplink if available; for wallets without deeplinks, open Reown
      if (isMobile) {
        if (wallet.mobileLink) {
          window.location.href = wallet.mobileLink;
          return;
        }
        // No deeplink — open Reown's WalletConnect flow (shows QR/deeplink from Reown)
        onClose();
        await onOpen();
        return;
      }

      // Jupiter on any platform — no WC ID, just send to install page
      if (wallet.key === "jupiter") {
        window.open(wallet.installUrl ?? "https://jup.ag/", "_blank", "noopener,noreferrer");
        return;
      }

      // Desktop: open Reown's modal — Reown auto-connects injected wallets,
      // or shows WalletConnect QR/deeplink for wallets without browser extension.
      // This is the exact mechanism sol-incinerator uses.
      setPending(wallet.key);
      onClose();
      try {
        await onOpen();
      } finally {
        setPending(null);
      }
    },
    [pending, isMobile, onClose, onOpen]
  );

  if (!isOpen) return null;

  const renderArrow = () => (
    <div className="walletArrow" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M5 3L9 7L5 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  // Filter list: on desktop, hide the MWA entry (it's only useful on Android)
  const visibleWallets = isMobile ? wallets : wallets.filter((w) => !w.isMwaOnly);

  return (
    <div
      className="walletModalBackdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="walletModalTitle"
    >
      <div className="walletModalContainer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="walletModalHeader">
          <div className="walletModalTitleGroup">
            <h2 id="walletModalTitle" className="walletModalTitle">
              Connect Wallet
            </h2>
            <p className="walletModalSubtitle">
              {isMobile ? "Tap to open in your wallet app" : "Choose your Solana wallet"}
            </p>
          </div>
          <button
            type="button"
            className="walletModalClose"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Wallet list */}
        <div className="walletList">
          {visibleWallets.map((wallet) => {
            const isPending = pending === wallet.key;
            return (
              <button
                key={wallet.key}
                type="button"
                className={`walletItem${isPending ? " walletItemConnecting" : ""}`}
                onClick={() => handleWalletClick(wallet)}
                disabled={pending !== null}
              >
                <div className="walletIconWrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallet.icon}
                    alt=""
                    className="walletIcon"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="walletInfo">
                  <div className="walletName">{wallet.name}</div>
                  <div className="walletDesc">
                    {isPending ? "Opening..." : wallet.description}
                  </div>
                </div>
                {renderArrow()}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="walletModalFooter">
          {isMobile ? (
            <>Tip: Open in a wallet&apos;s browser for the fastest experience.</>
          ) : (
            <>
              New to Solana?{" "}
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noreferrer noopener"
                className="walletModalLink"
              >
                Get Phantom ↗
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
