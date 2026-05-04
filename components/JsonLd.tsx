export function JsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SolanaRefund",
    "url": "https://solanarefund.xyz"
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SolanaRefund",
    "url": "https://solanarefund.xyz",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "SolanaRefund helps users scan their Solana wallet for unused token accounts and recover SOL locked as rent by closing empty accounts safely.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does SolanaRefund do?",
        "acceptedAnswer": { "@type": "Answer", "text": "SolanaRefund scans your Solana wallet for unused token accounts and helps you recover SOL locked as rent by closing empty accounts safely." }
      },
      {
        "@type": "Question",
        "name": "Do I need to share my seed phrase?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. SolanaRefund never asks for your seed phrase or private key. You connect your wallet and approve every action yourself." }
      },
      {
        "@type": "Question",
        "name": "Can SolanaRefund recover stolen SOL?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. SolanaRefund does not recover stolen funds. It only helps identify and close unused token accounts that may contain recoverable rent-exempt SOL." }
      },
      {
        "@type": "Question",
        "name": "Why is SOL locked in token accounts?",
        "acceptedAnswer": { "@type": "Answer", "text": "On Solana, token accounts often require a small amount of SOL as rent-exempt balance. If an account is empty and unused, it may be possible to close it and recover that SOL." }
      },
      {
        "@type": "Question",
        "name": "Is every wallet eligible?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. Some wallets may have no unused accounts to close. The scanner only shows recoverable opportunities when they are found." }
      },
      {
        "@type": "Question",
        "name": "Is this a gas fee refund?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. This is not a gas-fee refund. SolanaRefund recovers SOL locked as rent inside unused Solana token accounts." }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
