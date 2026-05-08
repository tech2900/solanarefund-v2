"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import {
  ScanResult,
  splitIntoBatches,
  solText,
  shortAddress,
} from "@/lib/solana";

const FEE_WALLET =
  process.env.NEXT_PUBLIC_FEE_WALLET ||
  "EUsMmpF9iP3JFUDW8JdsEMorvZ1Brer2kywgjb9TWjcw";
const SERVICE_FEE_BPS = Number(
  process.env.NEXT_PUBLIC_SERVICE_FEE_BPS || "500"
);
const MAX_BATCH_SIZE = Number(
  process.env.NEXT_PUBLIC_MAX_BATCH_SIZE || "10"
);
const FEE_PCT = (SERVICE_FEE_BPS / 100).toFixed(0);

type Stage =
  | "idle"
  | "scanning"
  | "ready"
  | "confirming"
  | "recovering"
  | "done"
  | "error";

interface FeeBreakdown {
  recoverableLamports: number;
  feeLamports: number;
  userLamports: number;
}

function calcFee(lamports: number): FeeBreakdown {
  const feeLamports = Math.floor((lamports * SERVICE_FEE_BPS) / 10_000);
  return {
    recoverableLamports: lamports,
    feeLamports,
    userLamports: lamports - feeLamports,
  };
}

function classifyError(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (
    msg.includes("user rejected") ||
    msg.includes("cancelled") ||
    msg.includes("denied") ||
    msg.includes("rejected")
  ) {
    return "rejected";
  }
  if (msg.includes("timeout") || msg.includes("timed out")) {
    return "timeout";
  }
  return "failed";
}

export function WalletMachine() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { connection } = useAppKitConnection();
  const { disconnect } = useDisconnect();

  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<[number, number]>([0, 0]);
  const recovering = useRef(false);

  const publicKey = useMemo(() => {
    if (!address || !isConnected) return null;
    try {
      return new PublicKey(address);
    } catch {
      return null;
    }
  }, [address, isConnected]);

  const isReady = isConnected && Boolean(publicKey);

  const walletShort = useMemo(
    () => (address ? shortAddress(address) : ""),
    [address]
  );
  const feeWalletShort = shortAddress(FEE_WALLET);

  const feeBreakdown = useMemo<FeeBreakdown | null>(() => {
    if (!scan || scan.emptyAccounts.length === 0) return null;
    return calcFee(scan.recoverableLamports);
  }, [scan]);

  // Reset scan state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setScan(null);
      setStage("idle");
      setErrorMsg("");
      setLastTx(null);
    }
  }, [isConnected]);

  // Lock body scroll when confirmation modal is open
  useEffect(() => {
    if (stage === "confirming") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [stage]);

  // ESC key closes confirmation modal
  useEffect(() => {
    if (stage !== "confirming") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStage("ready");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  const handleConnect = useCallback(() => {
    open();
  }, [open]);

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true);
    try {
      await disconnect();
    } catch {
      // silent — state reset handled by the useEffect above
    } finally {
      setIsDisconnecting(false);
    }
  }, [disconnect]);

  const handleScan = useCallback(async () => {
    if (!address) {
      open();
      return;
    }
    setStage("scanning");
    setErrorMsg("");
    setLastTx(null);
    setScan(null);

    try {
      const res = await fetch(
        `/api/scan?address=${encodeURIComponent(address)}`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        const code = body?.error ?? "SCAN_FAILED";
        if (code === "RPC_REQUEST_FAILED") {
          throw new Error("RPC unavailable. Please try again in a moment.");
        }
        if (code === "MISSING_HELIUS_RPC_URL") {
          throw new Error("Server configuration error. Contact support.");
        }
        throw new Error("Scan failed. Please try again.");
      }
      const data = (await res.json()) as ScanResult;
      setScan(data);
      setStage("ready");
    } catch (err) {
      setStage("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Scan failed. Please try again."
      );
    }
  }, [address, open]);

  const buildTx = useCallback(
    async (accounts: ScanResult["emptyAccounts"]): Promise<Transaction> => {
      if (!publicKey || !connection) throw new Error("Wallet not connected.");

      const owner = publicKey;
      const tx = new Transaction();
      let reclaimLamports = 0;

      for (const account of accounts) {
        if (account.amount !== "0") continue; // safety: skip non-empty
        const programId =
          account.programId === TOKEN_2022_PROGRAM_ID.toBase58()
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;
        tx.add(
          createCloseAccountInstruction(
            new PublicKey(account.pubkey),
            owner,
            owner,
            [],
            programId
          )
        );
        reclaimLamports += account.lamports;
      }

      const feeLamports = Math.floor(
        (reclaimLamports * SERVICE_FEE_BPS) / 10_000
      );
      if (feeLamports > 0) {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: owner,
            toPubkey: new PublicKey(FEE_WALLET),
            lamports: feeLamports,
          })
        );
      }

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.feePayer = owner;
      tx.recentBlockhash = blockhash;
      return tx;
    },
    [publicKey, connection]
  );

  const handleConfirmAndRecover = useCallback(async () => {
    if (!scan || !publicKey || !walletProvider || !connection) return;
    if (recovering.current) return;

    const batches = splitIntoBatches(scan.emptyAccounts, MAX_BATCH_SIZE);
    if (batches.length === 0) return;

    recovering.current = true;
    setStage("recovering");
    setErrorMsg("");
    setBatchProgress([0, batches.length]);

    try {
      let lastSignature = "";
      for (let i = 0; i < batches.length; i++) {
        setBatchProgress([i + 1, batches.length]);
        const tx = await buildTx(batches[i]);
        const sig = await walletProvider.sendTransaction(tx, connection);
        lastSignature = sig;
        await connection.confirmTransaction(sig, "confirmed");
      }
      setLastTx(lastSignature);
      setScan(null);
      setStage("done");
    } catch (err) {
      const kind = classifyError(err);
      if (kind === "rejected") {
        setStage("ready");
        setErrorMsg("Transaction rejected. Nothing was sent.");
      } else if (kind === "timeout") {
        setStage("error");
        setErrorMsg("Transaction timed out. Check Solscan to confirm status.");
      } else {
        setStage("error");
        setErrorMsg("Transaction failed. Your funds are safe — nothing was lost.");
      }
    } finally {
      recovering.current = false;
    }
  }, [scan, publicKey, walletProvider, connection, buildTx]);

  // UI state flags
  const showConnect = !isReady;
  const showConnected =
    isReady && stage !== "scanning" && !scan && stage !== "error";
  const showScanning = stage === "scanning";
  const showScanError = isReady && stage === "error" && !scan;
  const showEmpty =
    isReady && !!scan && scan.emptyAccounts.length === 0;
  const showResult =
    isReady && !!scan && scan.emptyAccounts.length > 0 && stage !== "done";
  const showRecovering = stage === "recovering";
  const showDone = stage === "done";
  const showConfirmModal = stage === "confirming";

  return (
    <div id="app">
      {/* Wallet address pill — only shown when connected */}
      {isReady && (
        <div className="walletPill">
          <span className="walletPillDot" aria-hidden="true" />
          <span className="walletPillAddr">{walletShort}</span>
          <button
            className="walletPillDisconnect"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            aria-label="Disconnect wallet"
          >
            {isDisconnecting ? "…" : "Disconnect"}
          </button>
        </div>
      )}

      {/* ── STATE: Not connected ── */}
      {showConnect && (
        <div className="actionZone">
          <button className="btn btnGold" onClick={handleConnect}>
            Connect Wallet
          </button>
          <p className="hint">
            SolanaRefund will never ask for your seed phrase.
          </p>
        </div>
      )}

      {/* ── STATE: Connected, ready to scan ── */}
      {showConnected && (
        <div className="actionZone">
          <button className="btn btnGold" onClick={handleScan}>
            Scan Wallet
          </button>
          <p className="hint">Read-only scan. Nothing is signed yet.</p>
        </div>
      )}

      {/* ── STATE: Scanning ── */}
      {showScanning && (
        <div className="actionZone">
          <button className="btn btnGold" disabled aria-busy="true">
            <span className="spinner" aria-hidden="true" />
            Scanning…
          </button>
          <p className="hint">Reading token accounts on-chain.</p>
        </div>
      )}

      {/* ── STATE: Scan error (no prior results) ── */}
      {showScanError && (
        <div className="actionZone">
          <div className="errorBanner">{errorMsg}</div>
          <button
            className="btn btnGold"
            onClick={handleScan}
            style={{ marginTop: 16 }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── STATE: No closable accounts found ── */}
      {showEmpty && (
        <div className="actionZone">
          <div className="emptyState">
            <div className="emptyIcon" aria-hidden="true">✓</div>
            <p className="emptyTitle">Wallet looks clean</p>
            <p className="emptyDesc">
              No refundable SOL found in this wallet.
            </p>
          </div>
          <button className="btn btnGhost" onClick={handleScan}>
            Scan again
          </button>
        </div>
      )}

      {/* ── STATE: Closable accounts found ── */}
      {showResult && feeBreakdown && (
        <>
          <div className="scanResult">
            <div className="scanLabel">Recoverable SOL</div>
            <div className="scanAmount">
              {solText(feeBreakdown.recoverableLamports)}
            </div>
            <div className="scanUnit">SOL</div>
            <div className="scanSub">
              from {scan!.emptyAccounts.length} empty account
              {scan!.emptyAccounts.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="feeBreakdown">
            <div className="feeRow">
              <span>Gross recoverable</span>
              <span>{solText(feeBreakdown.recoverableLamports)} SOL</span>
            </div>
            <div className="feeRow">
              <span>SolanaRefund fee ({FEE_PCT}%)</span>
              <span className="feeDeduct">
                − {solText(feeBreakdown.feeLamports)} SOL
              </span>
            </div>
            <div className="feeDivider" />
            <div className="feeRow feeRowNet">
              <span>You receive</span>
              <span className="feeNet">
                {solText(feeBreakdown.userLamports)} SOL
              </span>
            </div>
          </div>

          <div className="actionZone" style={{ marginTop: 0 }}>
            {showRecovering ? (
              <button className="btn btnGold" disabled aria-busy="true">
                <span className="spinner" aria-hidden="true" />
                {batchProgress[1] > 1
                  ? `Confirming batch ${batchProgress[0]} of ${batchProgress[1]}…`
                  : "Confirming in wallet…"}
              </button>
            ) : (
              <button
                className="btn btnGold"
                onClick={() => setStage("confirming")}
              >
                Review &amp; Reclaim SOL
              </button>
            )}
            {stage === "error" && errorMsg && (
              <div className="errorBanner" style={{ marginTop: 14 }}>
                {errorMsg}
              </div>
            )}
            <p className="hint">
              Your wallet will show full details before signing.
            </p>
          </div>
        </>
      )}

      {/* ── STATE: Done ── */}
      {showDone && (
        <div className="actionZone">
          <div className="successState">
            <div className="successIcon" aria-hidden="true">✓</div>
            <p className="successTitle">SOL recovered</p>
            <p className="successDesc">
              Your wallet balance has been updated.
            </p>
            {lastTx && (
              <a
                className="solscanLink"
                href={`https://solscan.io/tx/${lastTx}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Solscan ↗
              </a>
            )}
          </div>
          <button className="btn btnGhost" onClick={handleScan}>
            Scan again
          </button>
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirmModal && feeBreakdown && (
        <div
          className="confirmBackdrop"
          onClick={() => setStage("ready")}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmTitle"
        >
          <div
            className="confirmModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmHeader">
              <p className="confirmTitle" id="confirmTitle">
                Review before signing
              </p>
              <button
                className="confirmClose"
                onClick={() => setStage("ready")}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="confirmBody">
              <div className="confirmRows">
                <div className="confirmRow">
                  <span className="confirmKey">Recoverable SOL</span>
                  <span className="confirmVal">
                    {solText(feeBreakdown.recoverableLamports)} SOL
                  </span>
                </div>
                <div className="confirmRow">
                  <span className="confirmKey">Accounts to close</span>
                  <span className="confirmVal">
                    {scan!.emptyAccounts.length}
                  </span>
                </div>
                <div className="confirmRow">
                  <span className="confirmKey">
                    SolanaRefund fee ({FEE_PCT}%)
                  </span>
                  <span className="confirmVal confirmValDeduct">
                    − {solText(feeBreakdown.feeLamports)} SOL
                  </span>
                </div>
                <div className="confirmDivider" />
                <div className="confirmRow confirmRowNet">
                  <span className="confirmKey">You receive</span>
                  <span className="confirmValNet">
                    {solText(feeBreakdown.userLamports)} SOL
                  </span>
                </div>
                <div className="confirmDivider" />
                <div className="confirmRow">
                  <span className="confirmKey">Your wallet</span>
                  <span className="confirmVal confirmMono">{walletShort}</span>
                </div>
                <div className="confirmRow">
                  <span className="confirmKey">Fee destination</span>
                  <span className="confirmVal confirmMono">
                    {feeWalletShort}
                  </span>
                </div>
              </div>

              <div className="confirmWarning">
                You will be asked to approve a Solana transaction in your
                wallet. SolanaRefund never controls your wallet or seed phrase.
              </div>
            </div>

            <div className="confirmActions">
              <button
                className="btn btnGhost"
                onClick={() => setStage("ready")}
              >
                Cancel
              </button>
              <button
                className="btn btnGold"
                onClick={handleConfirmAndRecover}
              >
                Confirm in wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
