export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <svg
          className="logoMark"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" fill="none" stroke="#c8a96a" strokeWidth="1.5" opacity="0.6" />
          <path
            d="M10 20 L16 12 L22 20"
            fill="none"
            stroke="#c8a96a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 17 L19 17"
            stroke="#c8a96a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="logoText">
          SolanaRefund
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
