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
            <summary>What does SolanaRefund do?</summary>
            <p>
              SolanaRefund scans your Solana wallet for unused token accounts
              and helps you recover SOL locked as rent by closing empty
              accounts safely.
            </p>
          </details>
          <details>
            <summary>Do I need to share my seed phrase?</summary>
            <p>
              No. SolanaRefund never asks for your seed phrase or private key.
              You connect your wallet and approve every transaction yourself.
            </p>
          </details>
          <details>
            <summary>Why is SOL locked in token accounts?</summary>
            <p>
              On Solana, every token account requires a small SOL deposit
              (~0.002 SOL) as rent-exempt balance. When the account empties,
              that SOL stays locked until the account is closed.
            </p>
          </details>
          <details>
            <summary>How much can I recover?</summary>
            <p>
              Each empty account holds roughly 0.002 SOL. Active wallets often
              have dozens of them. The exact amount is shown after scanning —
              no signup required.
            </p>
          </details>
          <details>
            <summary>What is the fee?</summary>
            <p>
              SolanaRefund takes 5% of recovered SOL. The fee breakdown is
              shown clearly before you sign anything. There is no upfront cost.
            </p>
          </details>
          <details>
            <summary>Can SolanaRefund recover stolen SOL?</summary>
            <p>
              No. SolanaRefund only closes empty token accounts. It cannot
              recover funds that were taken from your wallet by a third party.
            </p>
          </details>
          <details>
            <summary>Will tokens be burned automatically?</summary>
            <p>
              No. Tokens are never burned automatically. SolanaRefund only
              closes accounts that already have a zero token balance.
            </p>
          </details>
          <details>
            <summary>Is this a gas fee refund?</summary>
            <p>
              No. This is not a gas-fee refund. SolanaRefund recovers SOL
              locked as rent inside unused Solana token accounts.
            </p>
          </details>
          <details>
            <summary>Is SolanaRefund affiliated with Solana?</summary>
            <p>
              No. SolanaRefund is an independent tool and is not affiliated
              with the Solana Foundation or any wallet provider.
            </p>
          </details>
          <details>
            <summary>How do I know I am on the real website?</summary>
            <p>
              Always verify the domain before connecting: solanarefund.xyz.
              SolanaRefund will never ask for your seed phrase or private key.
            </p>
          </details>
        </section>
      </main>

      <Footer />
    </div>
  );
}
