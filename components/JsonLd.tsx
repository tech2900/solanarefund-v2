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
    "description": "SolanaRefund helps users scan Solana wallets for empty token accounts and recover unused SOL from eligible accounts. Non-custodial, no seed phrase required, you approve every action inside your wallet.",
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

  // Schema 5: FAQPage — matches the 10 visible FAQ items on the page
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
          "text": "SolanaRefund is a Solana wallet cleanup tool that helps you scan for empty token accounts and recover unused SOL from eligible accounts. It is designed for users who want a simple way to reclaim SOL safely."
        }
      },
      {
        "@type": "Question",
        "name": "How can I recover SOL from my Solana wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Connect your Solana wallet, run a read-only scan, and SolanaRefund will check for eligible empty token accounts. If recoverable SOL is found, you can review the details and approve the transaction inside your wallet."
        }
      },
      {
        "@type": "Question",
        "name": "What is Solana rent recovery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Some Solana token accounts hold small rent balances. When an eligible empty token account is closed, that rent can be returned to the wallet. SolanaRefund helps identify these accounts and prepare a reviewable transaction."
        }
      },
      {
        "@type": "Question",
        "name": "What are empty token accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Empty token accounts are Solana token accounts with no token balance. Some of them may still hold rent deposits that can be reclaimed when the account is safely closed."
        }
      },
      {
        "@type": "Question",
        "name": "Is SolanaRefund non-custodial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SolanaRefund does not ask for your seed phrase or private key. You connect your wallet, scan public wallet data, and approve any action directly inside your wallet."
        }
      },
      {
        "@type": "Question",
        "name": "Does SolanaRefund work with Phantom, Solflare, and Jupiter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SolanaRefund is designed to work with popular Solana wallets and wallet browsers, including Phantom, Solflare, Jupiter, and other compatible Solana wallet adapters."
        }
      },
      {
        "@type": "Question",
        "name": "What does \"Wallet looks clean\" mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means the scan did not find eligible empty token accounts with reclaimable SOL in the connected wallet."
        }
      },
      {
        "@type": "Question",
        "name": "Can SolanaRefund recover crypto from every blockchain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SolanaRefund is focused on Solana. It is designed to help users recover unused SOL from eligible Solana token accounts, not recover assets from unrelated blockchains."
        }
      },
      {
        "@type": "Question",
        "name": "What is the safest way to close unused Solana token accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The safest approach is to use a non-custodial tool that scans first, shows eligible empty accounts, and lets you review the transaction inside your wallet before signing. SolanaRefund follows this flow."
        }
      },
      {
        "@type": "Question",
        "name": "Why do people search for \"recover SOL\" or \"Solana refund\"?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Many Solana users have small amounts of SOL locked in unused token accounts. SolanaRefund helps detect eligible accounts so users can reclaim unused SOL safely."
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
