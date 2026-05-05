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
            Get your locked <span className="accent">SOL</span> back.
          </h1>

          <p className="lead">
            Find SOL sitting unused in your Solana wallet. Recover it safely.
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
          <h2>Clean your Solana wallet in one calm flow.</h2>
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
              <div className="stepName">Recover</div>
              <div className="stepDesc">locked SOL</div>
            </div>
            <div className="step">
              <div className="stepNum">04</div>
              <div className="stepName">Confirm</div>
              <div className="stepDesc">in your wallet</div>
            </div>
            <div className="step">
              <div className="stepNum">05</div>
              <div className="stepName">Done</div>
              <div className="stepDesc">SOL back in wallet</div>
            </div>
          </div>
        </section>

        {/* Built simple */}
        <section className="section">
          <div className="sectionLabel">What it does</div>
          <h2>Built to stay simple.</h2>
          <div className="cards">
            <div className="card">
              <div className="cardLabel">Now</div>
              <h3 className="cardTitle">Recover SOL</h3>
              <p className="cardDesc">
                The first real version focuses only on empty Solana token accounts. Closing them can recover SOL locked inside.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Later</div>
              <h3 className="cardTitle">Token burn</h3>
              <p className="cardDesc">
                Unwanted token burn will be added in a future update. Burning is permanent and must be reviewed manually.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Not yet</div>
              <h3 className="cardTitle">NFTs</h3>
              <p className="cardDesc">
                NFTs are not touched in this version. This keeps the first release safer and easier to understand.
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
                If any website asks for your seed phrase, private key, or recovery phrase, it is not us.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">Non-custodial</div>
              <h3 className="cardTitle">You stay in control</h3>
              <p className="cardDesc">
                SolanaRefund does not control your wallet. You approve every action from your own wallet.
              </p>
            </div>
            <div className="card">
              <div className="cardLabel">No burn</div>
              <h3 className="cardTitle">Empty accounts only</h3>
              <p className="cardDesc">
                The Recover SOL action only closes empty token accounts. No tokens are burned.
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
            <p>SolanaRefund scans your Solana wallet for unused token accounts and helps you recover SOL locked as rent by closing empty accounts safely.</p>
          </details>
          <details>
            <summary>Do I need to share my seed phrase?</summary>
            <p>No. SolanaRefund never asks for your seed phrase or private key. You connect your wallet and approve every action yourself.</p>
          </details>
          <details>
            <summary>Can SolanaRefund recover stolen SOL?</summary>
            <p>No. SolanaRefund does not recover stolen funds. It only helps identify and close unused token accounts that may contain recoverable rent-exempt SOL.</p>
          </details>
          <details>
            <summary>Why is SOL locked in token accounts?</summary>
            <p>On Solana, token accounts often require a small amount of SOL as rent-exempt balance. If an account is empty and unused, it may be possible to close it and recover that SOL.</p>
          </details>
          <details>
            <summary>Is every wallet eligible?</summary>
            <p>No. Some wallets may have no unused accounts to close. The scanner only shows recoverable opportunities when they are found.</p>
          </details>
          <details>
            <summary>How does SolanaRefund work?</summary>
            <p>SolanaRefund closes unused Solana token accounts and recovers the SOL locked inside them. A small percentage is taken only from SOL successfully recovered. There is no upfront payment.</p>
          </details>
          <details>
            <summary>Is this a gas fee refund?</summary>
            <p>No. This is not a gas-fee refund. SolanaRefund recovers SOL locked as rent inside unused Solana token accounts.</p>
          </details>
          <details>
            <summary>Will tokens be burned automatically?</summary>
            <p>No. Tokens are never burned automatically. Burning is permanent and will require manual review in a later version.</p>
          </details>
          <details>
            <summary>Is SolanaRefund affiliated with Solana?</summary>
            <p>No. SolanaRefund is an independent tool and is not affiliated with the Solana Foundation or any wallet provider.</p>
          </details>
          <details>
            <summary>How do I know I am on the real website?</summary>
            <p>Always check the domain before connecting your wallet: solanarefund.xyz. SolanaRefund will never ask for your seed phrase or private key.</p>
          </details>
        </section>
      </main>

      <Footer />
    </div>
  );
}
