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

  // Schema 5: FAQPage — matches the 4 visible FAQ items on the page
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
          "text": "SolanaRefund is a non-custodial web tool that scans your Solana wallet for empty token accounts and helps you recover the SOL locked inside them as rent. No sign-up required."
        }
      },
      {
        "@type": "Question",
        "name": "Is SolanaRefund non-custodial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SolanaRefund never holds your funds or controls your wallet. You connect your own wallet and approve every transaction yourself. Nothing is signed without your explicit confirmation."
        }
      },
      {
        "@type": "Question",
        "name": "What does SolanaRefund scan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SolanaRefund scans your wallet for Solana token accounts with a zero token balance. These are empty accounts that still hold a small amount of SOL (~0.002 SOL each) as rent-exempt deposit. Closing them returns that SOL to your wallet."
        }
      },
      {
        "@type": "Question",
        "name": "Does SolanaRefund ask for my seed phrase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SolanaRefund will never ask for your seed phrase, private key, or recovery phrase. If any website claiming to be SolanaRefund asks for these, it is not us."
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
