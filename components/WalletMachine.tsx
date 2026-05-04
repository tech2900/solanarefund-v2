"use client";
import { useCallback, useMemo, useState } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from "@reown/appkit-adapter-solana/react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createCloseAccountInstruction } from "@solana/spl-token";
import { ScanResult, splitIntoBatches, solText, shortAddress } from "@/lib/solana";

const FEE_WALLET = process.env.NEXT_PUBLIC_FEE_WALLET || "EUsMmpF9iP3JFUDW8JdsEMorvZ1Brer2kywgjb9TWjcw";
const SERVICE_FEE_BPS = Number(process.env.NEXT_PUBLIC_SERVICE_FEE_BPS || "500");
const MAX_BATCH_SIZE = Number(process.env.NEXT_PUBLIC_MAX_BATCH_SIZE || "10");

type StatusKind = "idle" | "scanning" | "ready" | "recovering" | "done" | "error";

export function WalletMachine() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { connection } = useAppKitConnection();

  const [statusKind, setStatusKind] = useState<StatusKind>("idle");
  const [message, setMessage] = useState("");
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);

  const readyLamports = scan?.recoverableLamports || 0;
  const readySol = solText(readyLamports);
  const canRecover = Boolean(isConnected && scan && scan.emptyAccounts.length > 0 && statusKind !== "recovering");

  const walletText = useMemo(() => {
    if (!isConnected || !address) return "Not connected";
    return `Connected · ${shortAddress(address)}`;
  }, [isConnected, address]);

  const scanWallet = useCallback(async () => {
    if (!address) { await open({ view: "Connect" }); return; }
    setStatusKind("scanning"); setMessage("Scanning wallet..."); setLastTx(null);
    try {
      const res = await fetch(`/api/scan?address=${encodeURIComponent(address)}`, { method: "GET", headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error("Scan failed.");
      const data = await res.json() as ScanResult;
      setScan(data); setStatusKind("ready");
      setMessage(data.emptyAccounts.length === 0 ? "Your wallet looks clean. No recoverable SOL found right now." : "Ready to recover from unused Solana accounts.");
    } catch { setStatusKind("error"); setMessage("Scan failed. Please try again."); }
  }, [address, open]);

  const buildTransaction = useCallback(async (accounts: ScanResult["emptyAccounts"]) => {
    if (!address) throw new Error("Wallet not connected.");
    const owner = new PublicKey(address);
    const tx = new Transaction();
    let reclaimLamports = 0;

    for (const account of accounts) {
      if (account.amount !== "0") throw new Error("Only empty token accounts can be closed in Safe Mode.");
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
    setMessage("You are about to recover SOL from unused accounts. No tokens will be burned.");
    try {
      let lastSignature = "";
      for (let i=0;i<batches.length;i++) {
        setMessage(`Confirm in wallet. Batch ${i+1} of ${batches.length}.`);
        const tx = await buildTransaction(batches[i]);
        const result = await walletProvider.signAndSendTransaction(tx);
        const signature = typeof result === "string" ? result : (result as { signature?: string })?.signature || String(result);
        lastSignature = signature;
        await connection.confirmTransaction(signature, "confirmed");
      }
      setLastTx(lastSignature);
      setStatusKind("done");
      setMessage("Done. Your wallet cleanup completed.");
      await scanWallet();
    } catch {
      setStatusKind("error");
      setMessage("Recovery was cancelled or failed. Nothing was completed without your wallet approval.");
    }
  }, [address, buildTransaction, connection, scan, scanWallet, walletProvider]);

  return (
    <div className="machine" id="app">
      <div className="machineTop"><div className="machineTitle">Wallet scanner</div><div className="walletStatus">{walletText}</div></div>
      <div className="actionGrid">
        <button className="btn primary" onClick={() => open({ view: "Connect" })}>Connect Wallet</button>
        <button className="btn secondary" onClick={scanWallet} disabled={!isConnected || statusKind === "scanning"}>Scan Wallet</button>
      </div>
      {message && <div className="status">{message}</div>}
      {scan && (
        <div className="result">
          <div className="small">SOL found</div>
          <div className="big">{readySol} SOL</div>
          <div className="stats">
            <div className="stat"><b>{scan.emptyAccounts.length}</b><span>Empty accounts</span></div>
            <div className="stat"><b>{scan.nonEmptyTokenAccounts}</b><span>Tokens later</span></div>
            <div className="stat"><b>0</b><span>NFTs touched</span></div>
          </div>
          <div className="notice">Recover SOL only closes empty token accounts. No tokens will be burned in this action.</div>
          <div className="actionGrid" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={recoverSol} disabled={!canRecover}>Recover SOL</button>
            <a className="btn ghost" href="#faq">Review</a>
          </div>
          <div className="reviewPanel">
            <div className="reviewRow"><span>Action</span><b>Close {scan.emptyAccounts.length} empty accounts</b></div>
            <div className="reviewRow"><span>Tokens burned</span><b>None</b></div>
            <div className="reviewRow"><span>Mode</span><b>Safe Mode</b></div>
          </div>
          {lastTx && <div className="notice">Last transaction: <a href={`https://solscan.io/tx/${lastTx}`} target="_blank" rel="noreferrer">View on Solscan</a></div>}
        </div>
      )}
    </div>
  );
}
