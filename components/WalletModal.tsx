"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import type { Wallet } from "@solana/wallet-adapter-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Detect mobile browser (not in-app wallet browser)
function isMobileBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return false;
  const w = window as unknown as {
    phantom?: unknown;
    solflare?: unknown;
    backpack?: unknown;
    jupiter?: unknown;
  };
  const isInAppBrowser =
    Boolean(w.phantom) ||
    Boolean(w.solflare) ||
    Boolean(w.backpack) ||
    Boolean(w.jupiter);
  return isMobile && !isInAppBrowser;
}

// Instantiate adapters once to read their built-in base64 SVG icons (no external URLs)
function getOfficialIcons(): Record<string, string> {
  try {
    return {
      phantom: new PhantomWalletAdapter().icon,
      solflare: new SolflareWalletAdapter().icon,
      coinbase: new CoinbaseWalletAdapter().icon,
      trust: new TrustWalletAdapter().icon,
    };
  } catch {
    return {};
  }
}

// Hand-crafted inline SVG icons for wallets without a wallet-adapter package
const ICON_BACKPACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTMzRTNGIi8+PHBhdGggZD0iTTI4IDM4VjMyYTEyIDEyIDAgMCAxIDEyLTEyaDIwYTEyIDEyIDAgMCAxIDEyIDEydjZ6IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjQiIHk9IjM4IiB3aWR0aD0iNTIiIGhlaWdodD0iNDIiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMzgiIHk9IjUwIiB3aWR0aD0iMjQiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNFMzNFM0YiLz48L3N2Zz4=";

const ICON_MAGIC_EDEN =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTQyNTc1Ii8+PHBhdGggZD0iTTI4IDcyVjI4bDIyIDIyIDIyLTIydjQ0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+";

const ICON_JUPITER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjMTcxQTIxIi8+PHBhdGggZD0iTTcwIDMwQTI1IDI1IDAgMSAxIDMwIDcwIiBzdHJva2U9IiMwMGM0ZmYiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTUwIDMwYzAgMCAxNSAxMCAxNSAyMHMtMTUgMjAtMTUgMjAiIHN0cm9rZT0iIzAwYzRmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=";

const ICON_MWA =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjOTk0NUZGIi8+PHJlY3QgeD0iMzAiIHk9IjIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHJ4PSI2IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

function buildIconMap(): Record<string, string> {
  const official = getOfficialIcons();
  return {
    phantom: official.phantom || "",
    solflare: official.solflare || "",
    backpack: ICON_BACKPACK,
    "magic eden": ICON_MAGIC_EDEN,
    coinbase: official.coinbase || "",
    trust: official.trust || "",
    jupiter: ICON_JUPITER,
    "mobile wallet adapter": ICON_MWA,
  };
}

function findIcon(name: string, iconMap: Record<string, string>): string {
  const key = name.toLowerCase();
  if (iconMap[key]) return iconMap[key];
  for (const k of Object.keys(iconMap)) {
    if (key.includes(k) || k.includes(key)) return iconMap[k];
  }
  return "";
}

// Static wallet list for mobile (deeplinks open the wallet's in-app browser)
// Research finding: Phantom, Solflare use the Solana Wallet Standard ul/browse scheme.
// Backpack also implements this same scheme (backpack.app/ul/v1/browse).
// Coinbase/Trust/OKX have their own deeplink schemes.
// Magic Eden and Jupiter have no confirmed mobile deeplink — show install page.
type StaticWallet = {
  name: string;
  description: string;
  deeplinkBuilder?: (currentUrl: string) => string;
  installUrl: string;
};

// Order matches user request: Phantom, Jupiter, Solflare, Magic Eden, Backpack, Trust
// MWA is rendered separately (first) from detectedWallets
const STATIC_WALLETS: StaticWallet[] = [
  {
    name: "Phantom",
    description: "Most popular Solana wallet",
    deeplinkBuilder: (url) =>
      `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://phantom.app/",
  },
  {
    name: "Jupiter",
    description: "Solana DEX wallet",
    installUrl: "https://jup.ag/",
  },
  {
    name: "Solflare",
    description: "Native Solana wallet",
    deeplinkBuilder: (url) =>
      `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://solflare.com/",
  },
  {
    name: "Magic Eden",
    description: "NFT-first wallet",
    installUrl: "https://wallet.magiceden.io/",
  },
  {
    name: "Backpack",
    description: "Modern Solana experience",
    // Backpack implements the Solana Wallet Standard mobile browse scheme
    deeplinkBuilder: (url) =>
      `https://backpack.app/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://backpack.app/",
  },
  {
    name: "Trust Wallet",
    description: "Multi-chain mobile wallet",
    deeplinkBuilder: (url) =>
      `https://link.trustwallet.com/open_url?coin_id=501&url=${encodeURIComponent(url)}`,
    installUrl: "https://trustwallet.com/",
  },
];

// Desktop preferred ordering (for wallet-adapter detected wallets)
const PREFERRED_ORDER = [
  "mobile wallet adapter",
  "phantom",
  "jupiter",
  "solflare",
  "magic eden",
  "backpack",
  "trust",
  "coinbase",
  "okx",
];

const WALLET_DESCRIPTIONS: Record<string, string> = {
  "mobile wallet adapter": "Connect any installed Solana wallet",
  phantom: "Most popular Solana wallet",
  jupiter: "Solana DEX wallet",
  solflare: "Native Solana wallet",
  backpack: "Modern Solana experience",
  "magic eden": "NFT-first wallet",
  coinbase: "Self-custody from Coinbase",
  "coinbase wallet": "Self-custody from Coinbase",
  trust: "Multi-chain mobile wallet",
  "trust wallet": "Multi-chain mobile wallet",
  okx: "Exchange-grade wallet",
  "okx wallet": "Exchange-grade wallet",
};

function getDescription(name: string): string {
  const key = name.toLowerCase();
  if (WALLET_DESCRIPTIONS[key]) return WALLET_DESCRIPTIONS[key];
  for (const k of Object.keys(WALLET_DESCRIPTIONS)) {
    if (key.includes(k) || k.includes(key)) return WALLET_DESCRIPTIONS[k];
  }
  return "Solana wallet";
}

function sortWallets(wallets: readonly Wallet[]): Wallet[] {
  return [...wallets].sort((a, b) => {
    const aName = a.adapter.name.toLowerCase();
    const bName = b.adapter.name.toLowerCase();
    const aIdx = PREFERRED_ORDER.findIndex((p) => aName.includes(p) || p.includes(aName));
    const bIdx = PREFERRED_ORDER.findIndex((p) => bName.includes(p) || p.includes(bName));
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    const aInstalled = a.readyState === WalletReadyState.Installed;
    const bInstalled = b.readyState === WalletReadyState.Installed;
    if (aInstalled && !bInstalled) return -1;
    if (!aInstalled && bInstalled) return 1;
    return aName.localeCompare(bName);
  });
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallets, select, connect } = useWallet();
  const [pendingWallet, setPendingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const iconMap = useMemo(() => buildIconMap(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPendingWallet(null);
    }
  }, [isOpen]);

  const isMobile = useMemo(() => mounted && isMobileBrowser(), [mounted]);

  const detectedWallets = useMemo(() => {
    return sortWallets(wallets).filter(
      (w) =>
        w.readyState === WalletReadyState.Installed ||
        w.readyState === WalletReadyState.Loadable
    );
  }, [wallets]);

  // MWA wallets detected on the device (Android with supporting wallet apps)
  const mobileWalletAdapters = useMemo(() => {
    if (!isMobile) return [];
    return detectedWallets.filter((w) => {
      const name = w.adapter.name.toLowerCase();
      return name.includes("mobile wallet adapter") || name.includes("mwa");
    });
  }, [detectedWallets, isMobile]);

  const handleNativeWalletClick = useCallback(
    async (walletName: string) => {
      if (pendingWallet) return;
      setError(null);
      setPendingWallet(walletName);
      try {
        select(walletName as never);
        await new Promise((r) => setTimeout(r, 50));
        await connect();
        onClose();
      } catch (e) {
        const message = e instanceof Error ? e.message : "Connection failed.";
        if (
          message.toLowerCase().includes("rejected") ||
          message.toLowerCase().includes("user denied") ||
          message.toLowerCase().includes("cancelled")
        ) {
          setError(null);
        } else {
          setError(message);
        }
      } finally {
        setPendingWallet(null);
      }
    },
    [select, connect, onClose, pendingWallet]
  );

  const handleStaticWalletClick = useCallback((wallet: StaticWallet) => {
    if (typeof window === "undefined") return;
    const currentUrl = window.location.href;
    if (wallet.deeplinkBuilder) {
      window.location.href = wallet.deeplinkBuilder(currentUrl);
    } else {
      window.open(wallet.installUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  if (!isOpen) return null;

  const renderIcon = (name: string, adapterIcon?: string) => {
    const icon = adapterIcon || findIcon(name, iconMap);
    if (icon) {
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={icon} alt="" className="walletIcon" width={40} height={40} />;
    }
    return (
      <div className="walletIconFallback">{name.charAt(0).toUpperCase()}</div>
    );
  };

  const renderArrow = () => (
    <div className="walletArrow" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div
      className="walletModalBackdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="walletModalTitle"
    >
      <div
        className="walletModalContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="walletModalHeader">
          <div className="walletModalTitleGroup">
            <h2 id="walletModalTitle" className="walletModalTitle">
              Connect Wallet
            </h2>
            <p className="walletModalSubtitle">Choose your Solana wallet</p>
          </div>
          <button
            type="button"
            className="walletModalClose"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="walletList">
          {/* MOBILE: MWA listed first (covers Jupiter on Android) */}
          {isMobile && mobileWalletAdapters.map((wallet) => {
            const name = wallet.adapter.name;
            const isPending = pendingWallet === name;
            return (
              <button
                key={name}
                type="button"
                className={`walletItem${isPending ? " walletItemConnecting" : ""}`}
                onClick={() => handleNativeWalletClick(name)}
                disabled={pendingWallet !== null}
              >
                <div className="walletIconWrap">
                  {renderIcon(name, wallet.adapter.icon)}
                </div>
                <div className="walletInfo">
                  <div className="walletName">{name}</div>
                  <div className="walletDesc">
                    {isPending ? "Connecting..." : "Connect any installed Solana wallet"}
                  </div>
                </div>
                {renderArrow()}
              </button>
            );
          })}

          {/* MOBILE: static wallet list in user's preferred order */}
          {isMobile && STATIC_WALLETS.map((wallet) => {
            const hasDeeplink = Boolean(wallet.deeplinkBuilder);
            return (
              <button
                key={wallet.name}
                type="button"
                className="walletItem"
                onClick={() => handleStaticWalletClick(wallet)}
              >
                <div className="walletIconWrap">
                  {renderIcon(wallet.name)}
                </div>
                <div className="walletInfo">
                  <div className="walletName">{wallet.name}</div>
                  <div className="walletDesc">
                    {hasDeeplink
                      ? wallet.description
                      : `${wallet.description} · tap to install`}
                  </div>
                </div>
                {renderArrow()}
              </button>
            );
          })}

          {/* DESKTOP / IN-APP BROWSER: wallet-adapter detected wallets */}
          {!isMobile && detectedWallets.length === 0 && (
            <div className="walletEmpty">
              <p>No Solana wallets detected.</p>
              <p className="walletEmptyHint">
                Install{" "}
                <a href="https://phantom.app/" target="_blank" rel="noreferrer noopener" className="walletModalLink">Phantom</a>
                {" "}or{" "}
                <a href="https://solflare.com/" target="_blank" rel="noreferrer noopener" className="walletModalLink">Solflare</a>
                {" "}as a browser extension.
              </p>
            </div>
          )}

          {!isMobile && detectedWallets.map((wallet) => {
            const name = wallet.adapter.name;
            const isPending = pendingWallet === name;
            const isInstalled = wallet.readyState === WalletReadyState.Installed;
            return (
              <button
                key={name}
                type="button"
                className={`walletItem${isPending ? " walletItemConnecting" : ""}`}
                onClick={() => handleNativeWalletClick(name)}
                disabled={pendingWallet !== null}
              >
                <div className="walletIconWrap">
                  {renderIcon(name, wallet.adapter.icon)}
                </div>
                <div className="walletInfo">
                  <div className="walletName">
                    {name}
                    {isInstalled && <span className="walletInstalled"> · Detected</span>}
                  </div>
                  <div className="walletDesc">
                    {isPending ? "Connecting..." : getDescription(name)}
                  </div>
                </div>
                {renderArrow()}
              </button>
            );
          })}
        </div>

        {error && <div className="walletError">{error}</div>}

        <div className="walletModalFooter">
          {isMobile ? (
            <>Tip: Open in a wallet&apos;s browser for fastest connection.</>
          ) : (
            <>
              New to Solana?{" "}
              <a href="https://phantom.app/" target="_blank" rel="noreferrer noopener" className="walletModalLink">
                Get Phantom ↗
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
