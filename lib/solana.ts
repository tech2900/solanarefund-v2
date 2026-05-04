export type EmptyTokenAccount = { pubkey: string; mint: string; programId: string; lamports: number; amount: string };
export type ScanResult = { address: string; emptyAccounts: EmptyTokenAccount[]; recoverableLamports: number; nonEmptyTokenAccounts: number };
export function solText(lamports: number): string { return (lamports / 1_000_000_000).toFixed(6).replace(/0+$/, "").replace(/\.$/, ""); }
export function shortAddress(address: string): string { return `${address.slice(0, 4)}…${address.slice(-4)}`; }
export function splitIntoBatches<T>(items: T[], size: number): T[][] { const batches:T[][]=[]; for(let i=0;i<items.length;i+=size) batches.push(items.slice(i,i+size)); return batches; }
