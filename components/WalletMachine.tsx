"use client";
import { useCallback, useMemo, useState } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from "@reown/appkit-adapter-solana/react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createCloseAccountInstruction } from "@solana/spl-token";
import { ScanResult, splitIntoBatches, solText, shortAddress } from "@/lib/solana";
import { WalletModal } from "@/components/WalletModal";

const FEE_WALLET = process.env.NEXT_PUBLIC_FEE_WALLET || "EUsMmpF9iP3JFUDW8JdsEMorvZ1Brer2kywgjb9TWjcw";
const SERVICE_FEE_BPS = Number(process.env.NEXT_PUBLIC_SERVICE_FEE_BPS || "500");
const MAX_BATCH_SIZE = Number(process.env.NEXT_PUBLIC_MAX_BATCH_SIZE || "10");

type StatusKind = "idle" | "scanning" | "ready" | "recovering" | "done" | "error";

export function WalletMachine() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { connection } = useAppKitConnection();
  const { disconnect } = useDisconnect();

  const [statusKind, setStatusKind] = useState<StatusKind>("idle");
  const [message, setMessage] = useState("");
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const readyLamports = scan?.recoverableLamports || 0;
  const readySol = solText(readyLamports);
  const canRecover = Boolean(isConnected && scan && scan.emptyAccounts.length > 0 && statusKind !== "recovering");

  const walletText = useMemo(() => {
    if (!isConnected || !address) return "";
    return `Connected · ${shortAddress(address)}`;
  }, [isConnected, address]);

  const handleConnectClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true);
    try {
      await disconnect();
      setScan(null);
      setStatusKind("idle");
      setMessage("");
      setLastTx(null);
    } catch (e) {
      // Silent fail - user can retry
    } finally {
      setIsDisconnecting(false);
    }
  }, [disconnect]);

  const scanWallet = useCallback(async () => {
    if (!address) { setIsModalOpen(true); return; }
    setStatusKind("scanning"); setMessage("Scanning wallet..."); setLastTx(null);
    try {
      const res = await fetch(`/api/scan?address=${encodeURIComponent(address)}`, { method: "GET", headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error("Scan failed.");
      const data = await res.json() as ScanResult;
      setScan(data); setStatusKind("ready");
      setMessage(data.emptyAccounts.length === 0 ? "Your wallet looks clean. No recoverable SOL found." : "");
    } catch { setStatusKind("error"); setMessage("Scan failed. Please try again."); }
  }, [address]);

  const buildTransaction = useCallback(async (accounts: ScanResult["emptyAccounts"]) => {
    if (!address) throw new Error("Wallet not connected.");
    const owner = new PublicKey(address);
    const tx = new Transaction();
    let reclaimLamports = 0;

    for (const account of accounts) {
      if (account.amount !== "0") throw new Error("Only empty token accounts can be closed.");
      const programId = account.programId === TOKEN_2022_PROGRAM_ID.toBase58() ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
      tx.add(createCloseAccountInstruction(new PublicKey(account.pubkey), owner, owner, [], programId));
      reclaimLamports += account.lamports;
    }

    const feeLamports = Math.floor((reclaimLamports * SERVICE_FEE_BPS) / 10_000);
    if (feeLamports > 0) {
      tx.add(SystemProgram.transfer({ fromPubkey: owner, toPubkey: new PublicKey(FEE_WALLET), lamports: feeLamports }));
    }

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    tx.feePayer = owner;
    tx.recentBlockhash = blockhash;
    return tx;
  }, [address, connection]);

  const recoverSol = useCallback(async () => {
    if (!scan || !walletProvider || !address) return;
    const batches = splitIntoBatches(scan.emptyAccounts, MAX_BATCH_SIZE);
    if (batches.length === 0) { setMessage("No empty accounts to close."); return; }
    setStatusKind("recovering");
    setMessage("Confirm in your wallet...");
    try {
      let lastSignature = "";
      for (let i = 0; i < batches.length; i++) {
        setMessage(`Confirm in wallet · Batch ${i + 1} of ${batches.length}`);
        const tx = await buildTransaction(batches[i]);
        const result = await walletProvider.signAndSendTransaction(tx);
        const signature = typeof result === "string" ? result : (result as { signature?: string })?.signature || String(result);
        lastSignature = signature;
        await connection.confirmTransaction(signature, "confirmed");
      }
      setLastTx(lastSignature);
      setStatusKind("done");
      setMessage("");
      await scanWallet();
    } catch {
      setStatusKind("error");
      setMessage("Recovery cancelled or failed. Nothing was completed.");
    }
  }, [address, buildTransaction, connection, scan, scanWallet, walletProvider]);

  // Determine which state to render (progressive disclosure)
  const showInitial = !isConnected;
  const showConnected = isConnected && !scan && statusKind !== "scanning";
  const showScanning = isConnected && statusKind === "scanning";
  const showResult = isConnected && scan;

  // Disconnect button — shown whenever wallet is connected
  const DisconnectButton = () => (
    <button
      className="btn btnSecondary"
      onClick={handleDisconnect}
      disabled={isDisconnecting}
      style={{ marginTop: 12 }}
    >
      {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
    </button>
  );

  return (
    <div id="app">
      {/* Connection status pill (when connected) */}
      {isConnected && (
        <div style={{ textAlign: "center" }}>
          <div className="connectionStatus">
            <span className="dot"></span>
            {walletText}
          </div>
        </div>
      )}

      {/* STATE 1: INITIAL — Connect button only */}
      {showInitial && (
        <div className="actionZone">
          <div className="stepIndicator">
            <span className="num">01</span><span className="slash">/</span>Connect your wallet
          </div>
          <button className="btn btnPrimary" onClick={handleConnectClick}>
            Connect Wallet
          </button>
          <div className="reassurance">SolanaRefund will never ask for your seed phrase.</div>
        </div>
      )}

      {/* STATE 2: CONNECTED — Scan button + Disconnect */}
      {showConnected && (
        <div className="actionZone">
          <div className="stepIndicator">
            <span className="num">02</span><span className="slash">/</span>Scan for recoverable SOL
          </div>
          <button className="btn btnPrimary" onClick={scanWallet}>
            Start Scan
          </button>
          <div className="reassurance">Read-only scan. Nothing is signed yet.</div>
          {statusKind === "error" && message && <div className="notice">{message}</div>}
          <DisconnectButton />
        </div>
      )}

      {/* STATE 2b: SCANNING — show loading + Disconnect */}
      {showScanning && (
        <div className="actionZone">
          <div className="stepIndicator">
            <span className="num">02</span><span className="slash">/</span>Scanning...
          </div>
          <button className="btn btnPrimary" disabled>
            Scanning wallet...
          </button>
          <div className="reassurance">Reading your token accounts on-chain.</div>
          <DisconnectButton />
        </div>
      )}

      {/* STATE 3: SCANNED — Result + Reclaim + Disconnect */}
      {showResult && (
        <>
          {scan.emptyAccounts.length > 0 ? (
            <>
              <div className="scanResult">
                <div className="scanLabel">Recoverable</div>
                <div className="scanAmount">{readySol}</div>
                <div className="scanAmountUnit">SOL</div>
                <div className="scanContext">from {scan.emptyAccounts.length} unused account{scan.emptyAccounts.length === 1 ? "" : "s"}</div>
              </div>

              <div className="actionZone">
                <div className="stepIndicator">
                  <span className="num">03</span><span className="slash">/</span>Recover your SOL
                </div>
                <button className="btn btnRecover" onClick={recoverSol} disabled={!canRecover}>
                  {statusKind === "recovering" ? "Recovering..." : "Reclaim SOL"}
                </button>
                <div className="reassurance">Your wallet will show all transaction details before approval.</div>

                {(statusKind === "recovering" || statusKind === "error") && message && (
                  <div className="notice">{message}</div>
                )}

                {statusKind === "done" && lastTx && (
                  <div className="notice">
                    <div style={{ marginBottom: 8 }}>Recovery complete.</div>
                    <a className="txLink" href={`https://solscan.io/tx/${lastTx}`} target="_blank" rel="noreferrer">
                      View on Solscan ↗
                    </a>
                  </div>
                )}

                <DisconnectButton />
              </div>
            </>
          ) : (
            <div className="actionZone">
              <div className="stepIndicator">
                <span className="num">✓</span><span className="slash">/</span>All clean
              </div>
              <div className="notice">
                Your wallet looks clean. No recoverable SOL found right now.
              </div>
              <button className="btn btnPrimary" onClick={scanWallet} style={{ marginTop: 16 }}>
                Scan again
              </button>
              <DisconnectButton />
            </div>
          )}
        </>
      )}

      {/* Custom wallet modal — renders when user clicks Connect */}
      <WalletModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
