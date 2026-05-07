"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preferred order — wallets we want to feature at the top of the modal.
// Lowercased for case-insensitive matching against wallet.adapter.name.
const PREFERRED_ORDER = [
  "phantom",
  "solflare",
  "backpack",
  "magic eden",
  "coinbase",
  "trust",
  "okx",
];

// Friendly one-line descriptions for known wallets.
// Falls back gracefully for any wallet not in this map.
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
  glow: "Solana-native wallet",
  exodus: "Multi-chain desktop wallet",
};

function getDescription(name: string): string {
  const key = name.toLowerCase();
  if (WALLET_DESCRIPTIONS[key]) return WALLET_DESCRIPTIONS[key];
  // Try partial match (e.g. "Phantom" matches "phantom")
  for (const k of Object.keys(WALLET_DESCRIPTIONS)) {
    if (key.includes(k) || k.includes(key)) return WALLET_DESCRIPTIONS[k];
  }
  return "Solana wallet";
}

function sortWallets(wallets: readonly Wallet[]): Wallet[] {
  return [...wallets].sort((a, b) => {
    const aName = a.adapter.name.toLowerCase();
    const bName = b.adapter.name.toLowerCase();

    // Find preferred index (lower = higher priority)
    const aPreferred = PREFERRED_ORDER.findIndex((p) => aName.includes(p));
    const bPreferred = PREFERRED_ORDER.findIndex((p) => bName.includes(p));

    // Both preferred — sort by preferred order
    if (aPreferred !== -1 && bPreferred !== -1) return aPreferred - bPreferred;

    // Only one preferred — preferred goes first
    if (aPreferred !== -1) return -1;
    if (bPreferred !== -1) return 1;

    // Neither preferred — installed wallets first, then by name
    const aInstalled = a.readyState === WalletReadyState.Installed;
    const bInstalled = b.readyState === WalletReadyState.Installed;
    if (aInstalled && !bInstalled) return -1;
    if (!aInstalled && bInstalled) return 1;
    return aName.localeCompare(bName);
  });
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallets, select, connect, connecting } = useWallet();
  const [pendingWallet, setPendingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll + handle Escape key when modal is open
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

  // Reset error when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPendingWallet(null);
    }
  }, [isOpen]);

  // Sort wallets by our preferred order
  const sortedWallets = useMemo(() => sortWallets(wallets), [wallets]);

  // Filter: show installed/loadable wallets + the ones in our preferred list
  // (so users see Phantom/Solflare even if not installed — they get a download link path)
  const displayWallets = useMemo(() => {
    return sortedWallets.filter((w) => {
      // Always show installed and loadable wallets
      if (
        w.readyState === WalletReadyState.Installed ||
        w.readyState === WalletReadyState.Loadable
      ) {
        return true;
      }
      // Show NotDetected only if it's in our preferred list (so Phantom/Solflare are visible)
      if (w.readyState === WalletReadyState.NotDetected) {
        const name = w.adapter.name.toLowerCase();
        return PREFERRED_ORDER.some((p) => name.includes(p));
      }
      return false;
    });
  }, [sortedWallets]);

  const handleWalletClick = useCallback(
    async (walletName: string) => {
      if (pendingWallet || connecting) return;
      setError(null);
      setPendingWallet(walletName);
      try {
        // Select the wallet first — wallet-adapter handles the rest
        select(walletName as never);
        // The connection happens automatically once selected if autoConnect is on,
        // but we trigger it explicitly to be safe.
        // Small delay lets the adapter register the selection before we connect.
        await new Promise((r) => setTimeout(r, 50));
        await connect();
        // Success — close the modal
        onClose();
      } catch (e) {
        const message = e instanceof Error ? e.message : "Connection failed.";
        // Common case: user rejected in wallet — don't show as error
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
    [select, connect, onClose, pendingWallet, connecting]
  );

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
              <path
                d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {displayWallets.length === 0 && (
          <div className="walletEmpty">
            <p>No Solana wallets detected.</p>
            <p className="walletEmptyHint">
              Install{" "}
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noreferrer noopener"
                className="walletModalLink"
              >
                Phantom
              </a>{" "}
              or{" "}
              <a
                href="https://solflare.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="walletModalLink"
              >
                Solflare
              </a>{" "}
              to continue.
            </p>
          </div>
        )}

        {displayWallets.length > 0 && (
          <div className="walletList">
            {displayWallets.map((wallet) => {
              const name = wallet.adapter.name;
              const isPending = pendingWallet === name;
              const isInstalled = wallet.readyState === WalletReadyState.Installed;
              return (
                <button
                  key={name}
                  type="button"
                  className={`walletItem${isPending ? " walletItemConnecting" : ""}`}
                  onClick={() => handleWalletClick(name)}
                  disabled={pendingWallet !== null}
                >
                  <div className="walletIconWrap">
                    {wallet.adapter.icon ? (
                      // Wallet adapters provide their official icon as a data URL or HTTP URL
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={wallet.adapter.icon}
                        alt=""
                        className="walletIcon"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="walletIconFallback">
                        {name.charAt(0).toUpperCase()}
                      </div>
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
                      <path
                        d="M5 3L9 7L5 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="walletError">
            {error}
          </div>
        )}

        <div className="walletModalFooter">
          New to Solana?{" "}
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noreferrer noopener"
            className="walletModalLink"
          >
            Get a wallet ↗
          </a>
        </div>
      </div>
    </div>
  );
}
