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
            unused SOL safely.
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
          <p className="seoPara">
            SolanaRefund helps you recover unused SOL that may be locked in
            empty Solana token accounts. Connect your wallet, run a read-only
            scan, and review eligible accounts before approving anything in
            your wallet.
          </p>
          <div className="cards">
            <div className="card">
              <div className="cardLabel">Step 01</div>
              <h3 className="cardTitle">Connect your Solana wallet</h3>
              <p className="cardDesc">
                Use Phantom, Solflare, Jupiter, or another compatible Solana
                wallet. SolanaRefund only reads public wallet data during the
                scan.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Step 02</div>
              <h3 className="cardTitle">Scan for empty token accounts</h3>
              <p className="cardDesc">
                Solana wallets can contain unused token accounts that still
                hold small rent balances. The scan checks for eligible empty
                accounts that may be closed to recover unused SOL.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Step 03</div>
              <h3 className="cardTitle">Review and reclaim SOL</h3>
              <p className="cardDesc">
                You see the result first, then review the transaction inside
                your wallet before signing. Nothing happens without your
                explicit approval.
              </p>
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
          <p className="seoPara">
            SolanaRefund is non-custodial. It never asks for your seed phrase
            or private key. The scan is read-only, and any Solana wallet
            cleanup or SOL recovery action must be reviewed and approved
            directly inside your wallet.
          </p>
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
              <div className="cardLabel">Read-only scan</div>
              <h3 className="cardTitle">No signing until you decide</h3>
              <p className="cardDesc">
                The scan reads public wallet data only. No transaction is
                prepared or signed until you choose to proceed.
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
              SolanaRefund is a Solana wallet cleanup tool that helps you scan
              for empty token accounts and recover unused SOL from eligible
              accounts. It is designed for users who want a simple way to
              reclaim SOL safely.
            </p>
          </details>
          <details>
            <summary>How can I recover SOL from my Solana wallet?</summary>
            <p>
              Connect your Solana wallet, run a read-only scan, and
              SolanaRefund will check for eligible empty token accounts. If
              recoverable SOL is found, you can review the details and approve
              the transaction inside your wallet.
            </p>
          </details>
          <details>
            <summary>What is Solana rent recovery?</summary>
            <p>
              Some Solana token accounts hold small rent balances. When an
              eligible empty token account is closed, that rent can be returned
              to the wallet. SolanaRefund helps identify these accounts and
              prepare a reviewable transaction.
            </p>
          </details>
          <details>
            <summary>What are empty token accounts?</summary>
            <p>
              Empty token accounts are Solana token accounts with no token
              balance. Some of them may still hold rent deposits that can be
              reclaimed when the account is safely closed.
            </p>
          </details>
          <details>
            <summary>Is SolanaRefund non-custodial?</summary>
            <p>
              Yes. SolanaRefund does not ask for your seed phrase or private
              key. You connect your wallet, scan public wallet data, and
              approve any action directly inside your wallet.
            </p>
          </details>
          <details>
            <summary>
              Does SolanaRefund work with Phantom, Solflare, and Jupiter?
            </summary>
            <p>
              Yes. SolanaRefund is designed to work with popular Solana wallets
              and wallet browsers, including Phantom, Solflare, Jupiter, and
              other compatible Solana wallet adapters.
            </p>
          </details>
          <details>
            <summary>What does &ldquo;Wallet looks clean&rdquo; mean?</summary>
            <p>
              It means the scan did not find eligible empty token accounts with
              reclaimable SOL in the connected wallet.
            </p>
          </details>
          <details>
            <summary>
              Can SolanaRefund recover crypto from every blockchain?
            </summary>
            <p>
              No. SolanaRefund is focused on Solana. It is designed to help
              users recover unused SOL from eligible Solana token accounts, not
              recover assets from unrelated blockchains.
            </p>
          </details>
          <details>
            <summary>
              What is the safest way to close unused Solana token accounts?
            </summary>
            <p>
              The safest approach is to use a non-custodial tool that scans
              first, shows eligible empty accounts, and lets you review the
              transaction inside your wallet before signing. SolanaRefund
              follows this flow.
            </p>
          </details>
          <details>
            <summary>
              Why do people search for &ldquo;recover SOL&rdquo; or
              &ldquo;Solana refund&rdquo;?
            </summary>
            <p>
              Many Solana users have small amounts of SOL locked in unused
              token accounts. SolanaRefund helps detect eligible accounts so
              users can reclaim unused SOL safely.
            </p>
          </details>
        </section>
      </main>

      <Footer />
    </div>
  );
}
