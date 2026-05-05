export function JsonLd() {
  // Schema 1: WebSite — enables Google Sitelinks Search Box
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://solanarefund.xyz/#website",
    "name": "SolanaRefund",
    "alternateName": "Solana Refund",
    "url": "https://solanarefund.xyz",
    "description": "Recover SOL locked inside unused Solana token accounts.",
    "inLanguage": "en-US",
    "publisher": {
      "@id": "https://solanarefund.xyz/#organization"
    }
  };

  // Schema 2: Organization — builds brand authority
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://solanarefund.xyz/#organization",
    "name": "SolanaRefund",
    "url": "https://solanarefund.xyz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://solanarefund.xyz/icon-512.png",
      "width": 512,
      "height": 512
    },
    "email": "contact@solanarefund.xyz",
    "description": "SolanaRefund is an independent tool that helps users recover SOL locked as rent inside unused Solana token accounts."
  };

  // Schema 3: WebApplication — describes the tool itself
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://solanarefund.xyz/#webapp",
    "name": "SolanaRefund",
    "url": "https://solanarefund.xyz",
    "applicationCategory": "FinanceApplication",
    "applicationSubCategory": "Cryptocurrency Wallet Tool",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript and a Solana wallet (Phantom, Solflare, Backpack, etc.)",
    "description": "SolanaRefund scans your Solana wallet for unused token accounts and helps you recover SOL locked as rent-exempt balance by closing empty accounts safely. No seed phrase required, non-custodial, you approve every action.",
    "featureList": [
      "Scan Solana wallets for unused token accounts",
      "Identify recoverable rent-exempt SOL",
      "Close empty token accounts safely",
      "Non-custodial — wallet stays in user control",
      "No seed phrase or private key required",
      "Works with Phantom, Solflare, Backpack, and other Solana wallets"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free to use. A small percentage is taken only from successfully recovered SOL."
    },
    "publisher": {
      "@id": "https://solanarefund.xyz/#organization"
    }
  };

  // Schema 4: HowTo — opens "Featured Snippet" opportunity in Google
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Recover Locked SOL from Unused Solana Token Accounts",
    "description": "Step-by-step guide to recovering SOL locked as rent in empty Solana token accounts using SolanaRefund.",
    "totalTime": "PT2M",
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Solana wallet (Phantom, Solflare, Backpack, or compatible)"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "SolanaRefund web application"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Connect your Solana wallet",
        "text": "Click 'Connect Wallet' and choose your Solana wallet. SolanaRefund will never ask for your seed phrase or private key."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Scan for recoverable SOL",
        "text": "Click 'Start Scan' to read your wallet's token accounts. This is read-only — nothing is signed yet."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Review the recoverable amount",
        "text": "See how much SOL is locked in unused token accounts and how many accounts can be closed."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Confirm in your wallet",
        "text": "Click 'Reclaim SOL'. Your wallet will show all transaction details for your approval before signing."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Done",
        "text": "Recovered SOL returns to your wallet balance immediately after confirmation."
      }
    ]
  };

  // Schema 5: FAQPage — strongest opportunity for "People Also Ask" placements
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://solanarefund.xyz/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does SolanaRefund do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SolanaRefund scans your Solana wallet for unused token accounts and helps you recover SOL locked as rent-exempt balance by closing empty accounts safely."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to share my seed phrase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SolanaRefund never asks for your seed phrase or private key. You connect your wallet and approve every action yourself from your own wallet interface."
        }
      },
      {
        "@type": "Question",
        "name": "Can SolanaRefund recover stolen SOL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SolanaRefund does not recover stolen funds. It only helps identify and close unused token accounts that may contain recoverable rent-exempt SOL."
        }
      },
      {
        "@type": "Question",
        "name": "Why is SOL locked in token accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "On Solana, every token account requires a small amount of SOL (about 0.002 SOL) as rent-exempt balance to exist on-chain. When the account becomes empty and unused, that SOL stays locked until the account is closed. Closing the account refunds the SOL to your wallet."
        }
      },
      {
        "@type": "Question",
        "name": "How much SOL can I recover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each empty token account holds approximately 0.002 SOL in rent. The total amount depends on how many unused accounts are in your wallet. Active Solana users often have dozens of empty accounts. The exact amount is shown after scanning."
        }
      },
      {
        "@type": "Question",
        "name": "Is SolanaRefund safe to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SolanaRefund is non-custodial — it never controls your wallet or your funds. It only closes empty token accounts. No tokens or NFTs are ever burned. You approve every transaction in your own wallet before anything is signed."
        }
      },
      {
        "@type": "Question",
        "name": "Which Solana wallets are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SolanaRefund works with all major Solana wallets including Phantom, Solflare, Backpack, Coinbase Wallet, Trust Wallet, and any wallet compatible with WalletConnect that supports the Solana network."
        }
      },
      {
        "@type": "Question",
        "name": "Is this a gas fee refund?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. This is not a gas-fee refund. SolanaRefund recovers SOL locked as rent-exempt balance inside unused Solana token accounts, not transaction gas fees."
        }
      },
      {
        "@type": "Question",
        "name": "Will tokens be burned automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Tokens are never burned automatically by SolanaRefund. The current version only closes empty token accounts. Burning is permanent and would require manual review in a future version."
        }
      },
      {
        "@type": "Question",
        "name": "Is SolanaRefund affiliated with Solana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SolanaRefund is an independent tool and is not affiliated with the Solana Foundation, Solana Labs, or any wallet provider."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
