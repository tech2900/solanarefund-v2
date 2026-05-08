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
      <div className="footerMeta">
        <a href="mailto:contact@solanarefund.xyz">contact@solanarefund.xyz</a>
        <br />
        © 2026 SolanaRefund.xyz — Independent tool, not affiliated with Solana
        Foundation.
      </div>
    </footer>
  );
}
