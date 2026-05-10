export function Footer() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        SolanaRefund<span className="footerDot">·</span>xyz
      </div>
      <div className="footerTagline">
        Recover locked SOL from unused Solana accounts.
        <br />
        No seed phrase. No private key. You approve every action.
      </div>
      <div className="footerLinks">
        <a
          href="https://x.com/solanarefundxyz"
          target="_blank"
          rel="noopener noreferrer"
          className="footerLink"
        >
          X&nbsp;·&nbsp;@solanarefundxyz
        </a>
        <a
          href="https://medium.com/@SolanaRefund"
          target="_blank"
          rel="noopener noreferrer"
          className="footerLink"
        >
          Medium&nbsp;·&nbsp;@SolanaRefund
        </a>
        <a
          href="https://medium.com/@SolanaRefund/how-to-recover-unused-sol-from-empty-solana-token-accounts-4c5a1c7e978b"
          target="_blank"
          rel="noopener noreferrer"
          className="footerLink"
        >
          Guide: How to Recover Unused SOL
        </a>
      </div>
      <div className="footerMeta">
        <a href="mailto:contact@solanarefund.xyz">contact@solanarefund.xyz</a>
        <br />
        © 2026 SolanaRefund.xyz — Independent tool, not affiliated with Solana
        Foundation.
      </div>
    </footer>
  );
}
