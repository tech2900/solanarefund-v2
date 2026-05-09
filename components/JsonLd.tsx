export function JsonLd() {
  // Schema 1: WebSite — enables Google Sitelinks Search Box + SearchAction
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://solanarefund.xyz/#website",
    "name": "SolanaRefund",
    "alternateName": "Solana Refund",
    "url": "https://solanarefund.xyz",
    "description": "Recover SOL locked inside unused Solana token accounts.",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://solanarefund.xyz/?wallet={search_term_string}",
      "query-input": "required name=search_term_string"
    },
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
    "screenshot": "https://solanarefund.xyz/og-image.png",
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

  // Schema 5: FAQPage — matches the 5 visible FAQ items on the page
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://solanarefund.xyz/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is SolanaRefund?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SolanaRefund helps you scan your Solana wallet for empty token accounts that may hold unused SOL from rent deposits, then lets you review and reclaim eligible SOL safely. No sign-up required."
        }
      },
      {
        "@type": "Question",
        "name": "How does SolanaRefund recover SOL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Solana wallets can accumulate empty token accounts that still hold small rent balances (~0.002 SOL each). SolanaRefund checks for eligible empty accounts and prepares a transaction for you to review before anything is signed."
        }
      },
      {
        "@type": "Question",
        "name": "Is SolanaRefund non-custodial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SolanaRefund does not ask for your seed phrase or private key. You connect your wallet, review the result, and approve any action directly inside your wallet. Nothing is signed without your explicit confirmation."
        }
      },
      {
        "@type": "Question",
        "name": "Which wallets does SolanaRefund support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SolanaRefund works with popular Solana wallets such as Phantom, Solflare, Jupiter, and other compatible Solana wallet browsers."
        }
      },
      {
        "@type": "Question",
        "name": "What does \"Wallet looks clean\" mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means the scan did not find eligible empty token accounts with reclaimable SOL in the connected wallet. Your wallet cleanup is already complete, or this wallet has no unused token accounts to close."
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
