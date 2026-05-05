export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <svg className="logoMark" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-label="SolanaRefund logo">
          <path
            d="M40 8 L66 18 L66 38 C66 54 54 66 40 72 C26 66 14 54 14 38 L14 18 Z"
            fill="none"
            stroke="#14F195"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text
            x="40"
            y="50"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="26"
            fontWeight="600"
            fill="#9945FF"
          >
            S
          </text>
        </svg>
        <span className="logoText">
          Solana<span className="logoDot">·</span>Refund
        </span>
      </div>
      <nav className="nav" aria-label="Main navigation">
        <a href="#how">How</a>
        <a href="#security">Security</a>
        <a href="#faq">FAQ</a>
      </nav>
    </header>
  );
}
