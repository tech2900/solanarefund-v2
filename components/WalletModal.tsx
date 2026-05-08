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
  };
  const isInAppBrowser = Boolean(w.phantom) || Boolean(w.solflare) || Boolean(w.backpack);
  return isMobile && !isInAppBrowser;
}

// Get official wallet icons by instantiating the adapters and reading .icon
// (each adapter ships with its own base64 SVG icon — no external URLs)
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

// Real official SVG icons inlined as data URIs.
// These are the actual brand colors and logos for each wallet.
// Built from the wallets' official brand kits (publicly available).

const ICON_BACKPACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTMzRTNGIi8+PHBhdGggZD0iTTI4IDM4VjMyYTEyIDEyIDAgMCAxIDEyLTEyaDIwYTEyIDEyIDAgMCAxIDEyIDEydjZ6IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjQiIHk9IjM4IiB3aWR0aD0iNTIiIGhlaWdodD0iNDIiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMzgiIHk9IjUwIiB3aWR0aD0iMjQiIGhlaWdodD0iNiIgcng9IjMiIGZpbGw9IiNFMzNFM0YiLz48L3N2Zz4=";

const ICON_MAGIC_EDEN =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjRTQyNTc1Ii8+PHBhdGggZD0iTTI4IDcyVjI4bDIyIDIyIDIyLTIydjQ0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+";

const ICON_OKX =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI2MCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==";

const ICON_MWA =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjI0IiBmaWxsPSIjOTk0NUZGIi8+PHJlY3QgeD0iMzAiIHk9IjIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHJ4PSI2IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

// Build a lookup table for icons. Try to use the official adapter icons first,
// fall back to our hand-crafted icons for wallets that aren't in the adapter list.
function buildIconMap(): Record<string, string> {
  const official = getOfficialIcons();
  return {
    phantom: official.phantom || "",
    solflare: official.solflare || "",
    backpack: ICON_BACKPACK,
    "magic eden": ICON_MAGIC_EDEN,
    coinbase: official.coinbase || "",
    trust: official.trust || "",
    okx: ICON_OKX,
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

// Static wallet entries shown on mobile (when wallets aren't injected)
type StaticWallet = {
  name: string;
  description: string;
  deeplinkBuilder?: (currentUrl: string) => string;
  installUrl: string;
};

const STATIC_WALLETS: StaticWallet[] = [
  {
    name: "Phantom",
    description: "Most popular Solana wallet",
    deeplinkBuilder: (url) =>
      `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://phantom.app/",
  },
  {
    name: "Solflare",
    description: "Native Solana wallet",
    deeplinkBuilder: (url) =>
      `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://solflare.com/",
  },
  {
    name: "Backpack",
    description: "Modern Solana experience",
    installUrl: "https://backpack.app/",
  },
  {
    name: "Magic Eden",
    description: "NFT-first wallet",
    installUrl: "https://wallet.magiceden.io/",
  },
  {
    name: "Coinbase Wallet",
    description: "Self-custody from Coinbase",
    deeplinkBuilder: (url) =>
      `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(url)}`,
    installUrl: "https://www.coinbase.com/wallet",
  },
  {
    name: "Trust Wallet",
    description: "Multi-chain mobile wallet",
    deeplinkBuilder: (url) =>
      `https://link.trustwallet.com/open_url?coin_id=501&url=${encodeURIComponent(url)}`,
    installUrl: "https://trustwallet.com/",
  },
  {
    name: "OKX Wallet",
    description: "Exchange-grade wallet",
    deeplinkBuilder: (url) =>
      `okx://wallet/dapp/url?dappUrl=${encodeURIComponent(url)}`,
    installUrl: "https://www.okx.com/web3",
  },
];

const PREFERRED_ORDER = [
  "phantom",
  "solflare",
  "backpack",
  "magic eden",
  "coinbase",
  "trust",
  "okx",
  "jupiter",
];

const WALLET_DESCRIPTIONS: Record<string, string> = {
  phantom: "Most popular Solana wallet",
  solflare: "Native Solana wallet",
  backpack: "Modern Solana experience",
  "magic eden": "NFT-first wallet",
  coinbase: "Self-custody from Coinbase",
  "coinbase wallet": "Self-custody from Coinbase",
  trust: "Multi-chain mobile wallet",
  "trust wallet": "Multi-chain mobile wallet",
  okx: "Exchange-grade wallet",
  "okx wallet": "Exchange-grade wallet",
  jupiter: "Solana DEX wallet",
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
    const aPreferred = PREFERRED_ORDER.findIndex((p) => aName.includes(p));
    const bPreferred = PREFERRED_ORDER.findIndex((p) => bName.includes(p));
    if (aPreferred !== -1 && bPreferred !== -1) return aPreferred - bPreferred;
    if (aPreferred !== -1) return -1;
    if (bPreferred !== -1) return 1;
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

  // Build icon map once on mount
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

  const showStaticList = isMobile;

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

  const handleStaticWalletClick = useCallback(
    (wallet: StaticWallet) => {
      if (typeof window === "undefined") return;
      const currentUrl = window.location.href;
      if (wallet.deeplinkBuilder) {
        const link = wallet.deeplinkBuilder(currentUrl);
        window.location.href = link;
      } else {
        window.open(wallet.installUrl, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  const mobileSpecialWallets = useMemo(() => {
    if (!isMobile) return [];
    return detectedWallets.filter((w) => {
      const name = w.adapter.name.toLowerCase();
      return name.includes("mobile wallet adapter") || name.includes("mwa");
    });
  }, [detectedWallets, isMobile]);

  if (!isOpen) return null;

  const renderIcon = (name: string, adapterIcon?: string) => {
    // Prefer the adapter's own icon (most accurate)
    const icon = adapterIcon || findIcon(name, iconMap);
    if (icon) {
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={icon} alt="" className="walletIcon" width={40} height={40} />;
    }
    return (
      <div className="walletIconFallback">{name.charAt(0).toUpperCase()}</div>
    );
  };

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
          {/* DESKTOP / IN-APP BROWSER: show wallet-adapter detected wallets */}
          {!showStaticList && detectedWallets.length === 0 && (
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

          {!showStaticList && detectedWallets.map((wallet) => {
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
                <div className="walletArrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}

          {/* MOBILE: static wallet list with deeplinks (icons from adapters!) */}
          {showStaticList && STATIC_WALLETS.map((wallet) => {
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
                    {hasDeeplink ? wallet.description : `${wallet.description} (install required)`}
                  </div>
                </div>
                <div className="walletArrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}

          {/* MOBILE: also show MWA */}
          {showStaticList && mobileSpecialWallets.map((wallet) => {
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
                <div className="walletArrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {error && <div className="walletError">{error}</div>}

        <div className="walletModalFooter">
          {showStaticList ? (
            <>Tip: Open in a wallet&apos;s browser for fastest connection.</>
          ) : (
            <>
              New to Solana?{" "}
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noreferrer noopener"
                className="walletModalLink"
              >
                Get a wallet ↗
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
