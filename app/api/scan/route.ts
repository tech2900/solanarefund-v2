import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { NextResponse } from "next/server";
import type { EmptyTokenAccount, ScanResult } from "@/lib/solana";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(code: string, status = 400) {
  return NextResponse.json({ ok: false, error: code }, { status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address")?.trim();
  if (!address) return jsonError("MISSING_WALLET");

  let owner: PublicKey;
  try { owner = new PublicKey(address); } catch { return jsonError("MISSING_WALLET"); }

  const rpc = process.env.HELIUS_RPC_URL;
  if (!rpc) {
    console.error("[scan] HELIUS_RPC_URL is not set");
    return jsonError("MISSING_HELIUS_RPC_URL", 500);
  }
  try { new URL(rpc); } catch {
    console.error("[scan] HELIUS_RPC_URL is not a valid URL");
    return jsonError("INVALID_RPC_URL", 500);
  }

  try {
    const connection = new Connection(rpc, "confirmed");
    const programs = [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID];
    const emptyAccounts: EmptyTokenAccount[] = [];
    let nonEmptyTokenAccounts = 0;

    for (const programId of programs) {
      const res = await connection.getParsedTokenAccountsByOwner(owner, { programId });
      for (const item of res.value) {
        const data = item.account.data as ParsedAccountData;
        const info = data?.parsed?.info;
        const amount = String(info?.tokenAmount?.amount ?? "0");
        if (!info?.mint) continue;
        if (amount === "0") emptyAccounts.push({ pubkey: item.pubkey.toBase58(), mint: info.mint, programId: programId.toBase58(), lamports: Number(item.account.lamports || 0), amount });
        else nonEmptyTokenAccounts += 1;
      }
    }

    emptyAccounts.sort((a, b) => b.lamports - a.lamports);
    const recoverableLamports = emptyAccounts.reduce((s, a) => s + a.lamports, 0);
    const result: ScanResult = { address: owner.toBase58(), emptyAccounts, recoverableLamports, nonEmptyTokenAccounts };
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[scan] RPC request failed:", err instanceof Error ? err.message : "unknown error");
    return jsonError("RPC_REQUEST_FAILED", 500);
  }
}
