import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletMachineClient } from "@/components/WalletMachineClient";

export default function Page() {
  return (
    <div className="wrap">
      <Header />

      <main>
        {/* Hero */}
        <section className="hero">
          <h1>
            Get your free <span className="accent">SOL</span> back.
          </h1>

          <p className="lead">
            Scan your Solana wallet for empty token accounts and reclaim
            unused rent safely.
          </p>

          <div className="trust">
            No seed phrase
            <span className="dot">·</span>
            Non-custodial
            <span className="dot">·</span>
            You approve every action
          </div>

          <WalletMachineClient />
        </section>

        {/* How it works */}
        <section className="section" id="how">
          <div className="sectionLabel">How it works</div>
          <h2>Clean your wallet in one calm flow.</h2>
          <div className="steps">
            <div className="step">
              <div className="stepNum">01</div>
              <div className="stepName">Connect</div>
              <div className="stepDesc">your wallet</div>
            </div>
            <div className="step">
              <div className="stepNum">02</div>
              <div className="stepName">Scan</div>
              <div className="stepDesc">unused accounts</div>
            </div>
            <div className="step">
              <div className="stepNum">03</div>
              <div className="stepName">Review</div>
              <div className="stepDesc">the fee breakdown</div>
            </div>
            <div className="step">
              <div className="stepNum">04</div>
              <div className="stepName">Confirm</div>
              <div className="stepDesc">in your wallet</div>
            </div>
            <div className="step">
              <div className="stepNum">05</div>
              <div className="stepName">Done</div>
              <div className="stepDesc">SOL back in your wallet</div>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="section">
          <div className="sectionLabel">What it does</div>
          <h2>Built to stay simple.</h2>
          <div className="cards">
            <div className="card">
              <div className="cardLabel">Now</div>
              <h3 className="cardTitle">Recover SOL</h3>
              <p className="cardDesc">
                Focuses only on empty Solana token accounts. Closing them
                recovers the SOL rent locked inside.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Later</div>
              <h3 className="cardTitle">Token burn</h3>
              <p className="cardDesc">
                Unwanted token burn will be added in a future update. Burning
                is permanent and requires manual review.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Not yet</div>
              <h3 className="cardTitle">NFTs</h3>
              <p className="cardDesc">
                NFTs are not touched in this version. This keeps the first
                release safer and easier to understand.
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="section" id="security">
          <div className="sectionLabel">Security</div>
          <h2>Security first. Always.</h2>
          <div className="cards">
            <div className="card">
              <div className="cardLabel">No keys</div>
              <h3 className="cardTitle">No seed phrase</h3>
              <p className="cardDesc">
                If any website asks for your seed phrase, private key, or
                recovery phrase, it is not us.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Non-custodial</div>
              <h3 className="cardTitle">You stay in control</h3>
              <p className="cardDesc">
                SolanaRefund does not control your wallet. You approve every
                action from your own wallet app.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Empty only</div>
              <h3 className="cardTitle">Zero balance accounts</h3>
              <p className="cardDesc">
                Only accounts with a zero token balance are eligible. Accounts
                with tokens are never touched.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="sectionLabel">FAQ</div>
          <h2>Questions, answered.</h2>

          <details open>
            <summary>What is SolanaRefund?</summary>
            <p>
              SolanaRefund helps you scan your Solana wallet for empty token
              accounts that may hold unused SOL from rent deposits, then lets
              you review and reclaim eligible SOL safely. No sign-up required.
            </p>
          </details>
          <details>
            <summary>How does SolanaRefund recover SOL?</summary>
            <p>
              Solana wallets can accumulate empty token accounts that still
              hold small rent balances (~0.002 SOL each). SolanaRefund checks
              for eligible empty accounts and prepares a transaction for you to
              review before anything is signed.
            </p>
          </details>
          <details>
            <summary>Is SolanaRefund non-custodial?</summary>
            <p>
              Yes. SolanaRefund does not ask for your seed phrase or private
              key. You connect your wallet, review the result, and approve any
              action directly inside your wallet. Nothing is signed without
              your explicit confirmation.
            </p>
          </details>
          <details>
            <summary>Which wallets does SolanaRefund support?</summary>
            <p>
              SolanaRefund works with popular Solana wallets such as Phantom,
              Solflare, Jupiter, and other compatible Solana wallet browsers.
            </p>
          </details>
          <details>
            <summary>What does "Wallet looks clean" mean?</summary>
            <p>
              It means the scan did not find eligible empty token accounts with
              reclaimable SOL in the connected wallet. Your wallet cleanup is
              already complete, or this wallet has no unused token accounts to
              close.
            </p>
          </details>
        </section>
      </main>

      <Footer />
    </div>
  );
}
