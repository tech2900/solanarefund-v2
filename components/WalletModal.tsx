"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Detect if user is on a mobile browser (not in-app browser of a wallet)
function isMobileBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return false;
  // Detect if we're already inside a wallet's in-app browser
  // (in which case the wallet is already injected and we don't need deeplinks)
  const w = window as unknown as {
    phantom?: unknown;
    solflare?: unknown;
    backpack?: unknown;
  };
  const isInAppBrowser = Boolean(w.phantom) || Boolean(w.solflare) || Boolean(w.backpack);
  return isMobile && !isInAppBrowser;
}

// Static wallet entries shown on mobile (when wallets aren't injected)
// These use deeplinks to open the wallet's in-app browser with our site loaded.
type StaticWallet = {
  name: string;
  icon: string;
  description: string;
  deeplinkBuilder?: (currentUrl: string) => string;
  installUrl: string;
};

const STATIC_WALLETS: StaticWallet[] = [
  {
    name: "Phantom",
    icon: "https://phantom.com/img/phantom-icon-purple.svg",
    description: "Most popular Solana wallet",
    deeplinkBuilder: (url) => `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://phantom.app/",
  },
  {
    name: "Solflare",
    icon: "https://solflare.com/img/logo.svg",
    description: "Native Solana wallet",
    deeplinkBuilder: (url) => `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,
    installUrl: "https://solflare.com/",
  },
  {
    name: "Backpack",
    icon: "https://backpack.app/_next/static/media/backpack.bcd736e8.svg",
    description: "Modern Solana experience",
    installUrl: "https://backpack.app/",
  },
  {
    name: "Magic Eden",
    icon: "https://wallet.magiceden.io/me-wallet-logo.svg",
    description: "NFT-first wallet",
    installUrl: "https://wallet.magiceden.io/",
  },
  {
    name: "Coinbase Wallet",
    icon: "https://www.coinbase.com/assets/sub-brands/wallet/coinbase-wallet-logo-icon-only.svg",
    description: "Self-custody from Coinbase",
    deeplinkBuilder: (url) => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(url)}`,
    installUrl: "https://www.coinbase.com/wallet",
  },
  {
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/trust_platform.svg",
    description: "Multi-chain mobile wallet",
    deeplinkBuilder: (url) => `https://link.trustwallet.com/open_url?coin_id=501&url=${encodeURIComponent(url)}`,
    installUrl: "https://trustwallet.com/",
  },
  {
    name: "OKX Wallet",
    icon: "https://www.okx.com/cdn/assets/imgs/2411/8DCEE9B9F2D67E36.png",
    description: "Exchange-grade wallet",
    deeplinkBuilder: (url) => `okx://wallet/dapp/url?dappUrl=${encodeURIComponent(url)}`,
    installUrl: "https://www.okx.com/web3",
  },
];

// Preferred order for sorting native (wallet-adapter detected) wallets
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
  glow: "Solana-native wallet",
  exodus: "Multi-chain desktop wallet",
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

  // Mount detection (avoids SSR mismatch for mobile detection)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock + Escape key
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

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPendingWallet(null);
    }
  }, [isOpen]);

  // Detect mobile environment (only after mount to avoid hydration issues)
  const isMobile = useMemo(() => mounted && isMobileBrowser(), [mounted]);

  // Detected wallets (only those installed/loadable on the user's device)
  const detectedWallets = useMemo(() => {
    return sortWallets(wallets).filter(
      (w) =>
        w.readyState === WalletReadyState.Installed ||
        w.readyState === WalletReadyState.Loadable
    );
  }, [wallets]);

  // On mobile browsers, show static wallet list with deeplinks
  // On desktop, show detected wallets from wallet-adapter
  // (We also include MWA / Jupiter from detectedWallets on mobile)
  const showStaticList = isMobile;

  // Handler for native (wallet-adapter) wallet click — desktop and MWA on mobile
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

  // Handler for static wallet click on mobile — opens wallet's in-app browser
  const handleStaticWalletClick = useCallback(
    (wallet: StaticWallet) => {
      if (typeof window === "undefined") return;
      const currentUrl = window.location.href;
      if (wallet.deeplinkBuilder) {
        // Universal link → opens the wallet's in-app browser with our site
        const link = wallet.deeplinkBuilder(currentUrl);
        window.location.href = link;
      } else {
        // No deeplink available → open install page
        window.open(wallet.installUrl, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  // Find native wallets that are MWA or other special non-extension wallets
  // (These should still appear on mobile even though we use static list)
  const mobileSpecialWallets = useMemo(() => {
    if (!isMobile) return [];
    return detectedWallets.filter((w) => {
      const name = w.adapter.name.toLowerCase();
      // Mobile Wallet Adapter is the special one we want to keep on mobile
      return name.includes("mobile wallet adapter") || name.includes("mwa");
    });
  }, [detectedWallets, isMobile]);

  if (!isOpen) return null;

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
          {/* DESKTOP: show wallet-adapter detected wallets */}
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
                  {wallet.adapter.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={wallet.adapter.icon} alt="" className="walletIcon" width={40} height={40} />
                  ) : (
                    <div className="walletIconFallback">{name.charAt(0).toUpperCase()}</div>
                  )}
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

          {/* MOBILE: show static wallet list with deeplinks */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallet.icon}
                    alt=""
                    className="walletIcon"
                    width={40}
                    height={40}
                    onError={(e) => {
                      // If icon fails to load, replace with letter fallback
                      const target = e.currentTarget;
                      const parent = target.parentElement;
                      if (parent) {
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "walletIconFallback";
                        fallback.textContent = wallet.name.charAt(0).toUpperCase();
                        parent.appendChild(fallback);
                      }
                    }}
                  />
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

          {/* MOBILE: also show MWA from wallet-adapter (Jupiter ships through it) */}
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
                  {wallet.adapter.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={wallet.adapter.icon} alt="" className="walletIcon" width={40} height={40} />
                  ) : (
                    <div className="walletIconFallback">M</div>
                  )}
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

        {error && (
          <div className="walletError">{error}</div>
        )}

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
