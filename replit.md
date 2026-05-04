# SolanaRefund

A Next.js web app that helps users recover SOL locked in unused Solana token accounts by scanning their wallet and closing empty accounts safely.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Wallet**: Reown AppKit + Solana Adapter
- **Solana**: `@solana/web3.js`, `@solana/spl-token`
- **RPC**: Helius (configurable via env var)

## Project Structure

```
app/
  page.tsx          — Main landing page
  layout.tsx        — Root layout with AppKitProvider
  globals.css       — Global styles
  api/scan/route.ts — Server-side wallet scan API
components/
  AppKitProvider.tsx  — Reown AppKit wallet init
  WalletMachine.tsx   — Core UI: scan & recover flow
  Header.tsx
  Footer.tsx
lib/
  solana.ts         — Shared types & utilities
```

## Environment Variables

See `.env.example`:
- `NEXT_PUBLIC_REOWN_PROJECT_ID` — Reown/WalletConnect project ID
- `HELIUS_RPC_URL` — Helius Solana RPC URL (server-side only)
- `NEXT_PUBLIC_FEE_WALLET` — Wallet address for service fee collection
- `NEXT_PUBLIC_SERVICE_FEE_BPS` — Fee in basis points (default 500 = 5%)
- `NEXT_PUBLIC_MAX_BATCH_SIZE` — Max accounts per tx batch (default 10)

## Dev Server

Runs on `0.0.0.0:5000` via `npm run dev`.

## Deployment

Configured for autoscale deployment:
- **Build**: `npm run build`
- **Run**: `npm run start` (port 5000)

## GitHub Push

Target repo: `tech2900/solanarefund-v2`
To push, a GitHub PAT with `repo` scope is needed. Store it as secret `GITHUB_PAT` and run:
```
git remote set-url origin https://$GITHUB_PAT@github.com/tech2900/solanarefund-v2.git
git push origin main
```
Note: GitHub OAuth integration was dismissed by user — use PAT secret instead.
