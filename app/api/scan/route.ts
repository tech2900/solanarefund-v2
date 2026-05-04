import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { NextResponse } from "next/server";
import type { EmptyTokenAccount, ScanResult } from "@/lib/solana";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RPC = process.env.HELIUS_RPC_URL || process.env.NEXT_PUBLIC_HELIUS_RPC || "https://api.mainnet-beta.solana.com";

function jsonError(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address")?.trim();
  if (!address) return jsonError("Missing address.");
  let owner: PublicKey;
  try { owner = new PublicKey(address); } catch { return jsonError("Invalid Solana address."); }

  try {
    const connection = new Connection(RPC, "confirmed");
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

    emptyAccounts.sort((a,b)=>b.lamports-a.lamports);
    const recoverableLamports = emptyAccounts.reduce((s,a)=>s+a.lamports,0);
    const result: ScanResult = { address: owner.toBase58(), emptyAccounts, recoverableLamports, nonEmptyTokenAccounts };
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch { return jsonError("Scan failed.", 500); }
}
