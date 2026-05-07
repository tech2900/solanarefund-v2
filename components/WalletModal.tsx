"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppKit } from "@reown/appkit/react";

// Solana wallet IDs from WalletConnect Cloud Explorer (verified).
// Order matches our intended display order.
type WalletEntry = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const WALLETS: WalletEntry[] = [
  {
    id: "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
    name: "Phantom",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/4c16cad4-cac9-4643-6726-c696efaf5200?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Most popular Solana wallet",
  },
  {
    id: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    name: "Solflare",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/c5d736d6-4d29-4b52-3c9b-bdfa4a3a2300?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Native Solana wallet",
  },
  {
    id: "bf5b305bbb2eb04b2c6a7589e7dc19a99e7e74339c6b86db3a18abbbe79b59ec",
    name: "Backpack",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/53dffa61-ec00-485d-1c8a-1a17e771d600?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Modern Solana experience",
  },
  {
    id: "541d5dcd4ede02f3afaf75bf8e3e4c4f1f8c3b9c0e8c4d2e1a0b9c8d7e6f5a4b",
    name: "Magic Eden",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/e9d7c4c2-7e3a-4b5f-8c4e-6e6a5e3d2c1b?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "NFT-first wallet",
  },
  {
    id: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
    name: "Coinbase Wallet",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/a5ebc364-8f91-4200-fcc6-be81310a0000?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Self-custody from Coinbase",
  },
  {
    id: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    name: "Trust Wallet",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/0528ee7e-16d1-4089-21e3-bbfb41933100?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Multi-chain mobile wallet",
  },
  {
    id: "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
    name: "OKX Wallet",
    icon: "https://explorer-api.walletconnect.com/v3/logo/lg/45f2f08e-fc0c-4d62-3e63-404e72170500?projectId=2f05ae7f1116030fde2d36508f472bfb",
    description: "Exchange-grade wallet",
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { open } = useAppKit();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [iconErrors, setIconErrors] = useState<Set<string>>(new Set());

  // Lock body scroll + escape key handler when modal is open
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

  const handleWalletClick = useCallback(
    async (walletId: string) => {
      if (connectingId) return;
      setConnectingId(walletId);
      try {
        // Open Reown's connection flow with this specific wallet's ID.
        // Reown will route the user directly to that wallet (deeplink on
        // mobile, browser extension on desktop, or QR fallback if needed).
        await open({ view: "ConnectingWalletConnect", uri: walletId } as never);
      } catch {
        // Reown connection cancelled or failed — silently reset.
      } finally {
        setConnectingId(null);
        // Close our modal so Reown's connection UI takes over cleanly.
        onClose();
      }
    },
    [open, onClose, connectingId]
  );

  const handleIconError = useCallback((walletId: string) => {
    setIconErrors((prev) => {
      const next = new Set(prev);
      next.add(walletId);
      return next;
    });
  }, []);

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

        <div className="walletList">
          {WALLETS.map((wallet) => {
            const isConnecting = connectingId === wallet.id;
            const showFallback = iconErrors.has(wallet.id);
            return (
              <button
                key={wallet.id}
                type="button"
                className={`walletItem${isConnecting ? " walletItemConnecting" : ""}`}
                onClick={() => handleWalletClick(wallet.id)}
                disabled={connectingId !== null}
              >
                <div className="walletIconWrap">
                  {showFallback ? (
                    <div className="walletIconFallback">
                      {wallet.name.charAt(0)}
                    </div>
                  ) : (
                    <img
                      src={wallet.icon}
                      alt=""
                      className="walletIcon"
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleIconError(wallet.id)}
                    />
                  )}
                </div>
                <div className="walletInfo">
                  <div className="walletName">{wallet.name}</div>
                  <div className="walletDesc">
                    {isConnecting ? "Connecting..." : wallet.description}
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
