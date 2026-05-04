import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletMachineClient } from "@/components/WalletMachineClient";

export default function Page() {
  return (
    <div className="wrap">
      <Header />
      <main>
        <section className="hero">
          <div className="badge">Safe Mode</div>
          <h1>Get your locked <span className="green">SOL</span> back.</h1>
          <p className="lead">Find SOL sitting unused in your wallet. Clean unused Solana accounts. Burn unwanted tokens safely later.</p>
          <div className="trust"><div className="pill">No seed phrase</div><div className="pill">No private key</div><div className="pill">No wallet import</div><div className="pill">You approve every action</div></div>
          <WalletMachineClient />
        </section>

        <section className="section" id="how">
          <h2>Clean your Solana wallet in one calm flow.</h2>
          <div className="steps"><div className="step"><span>1</span>Connect</div><div className="step"><span>2</span>Scan</div><div className="step"><span>3</span>Recover</div><div className="step"><span>4</span>Confirm</div><div className="step"><span>5</span>Done</div></div>
        </section>

        <section className="section">
          <h2>Built to stay simple.</h2>
          <div className="grid">
            <div className="card"><h3>Recover SOL</h3><p>The first real version focuses only on empty Solana token accounts. Closing them can recover SOL locked inside.</p></div>
            <div className="card"><h3>Tokens later</h3><p>Unwanted token burn will be added after Safe Mode testing. Burning is permanent and must be reviewed manually.</p></div>
            <div className="card"><h3>NFTs later</h3><p>NFTs are not touched in this version. This keeps the first release safer and easier to understand.</p></div>
          </div>
        </section>

        <section className="section" id="security">
          <h2>Security first.</h2>
          <div className="grid">
            <div className="card"><h3>No seed phrase</h3><p>If any website asks for your seed phrase, private key, or recovery phrase, it is not us.</p></div>
            <div className="card"><h3>Non-custodial</h3><p>SolanaRefund does not control your wallet. You approve every action from your own wallet.</p></div>
            <div className="card"><h3>No token burn</h3><p>The Recover SOL action only closes empty token accounts. No tokens are burned.</p></div>
          </div>
        </section>

        <section className="section" id="faq">
          <h2>FAQ</h2>
          <p className="lead" style={{ textAlign: "left", fontSize: 16, marginBottom: 20 }}>SolanaRefund is built for simple wallet cleanup on Solana. It helps you find unused token accounts, understand what can be closed, and review every action before anything is signed in your wallet.</p>
          <details open><summary>What does SolanaRefund do?</summary><p>SolanaRefund scans your Solana wallet for unused token accounts and helps you recover SOL locked as rent by closing empty accounts safely.</p></details>
          <details><summary>Is this a gas fee refund?</summary><p>No. This is not a gas-fee refund. SolanaRefund recovers SOL locked as rent inside unused Solana token accounts.</p></details>
          <details><summary>Do you ask for my seed phrase?</summary><p>No. SolanaRefund never asks for your seed phrase or private key. You connect your wallet and approve every action yourself.</p></details>
          <details><summary>Can SolanaRefund recover stolen SOL?</summary><p>No. SolanaRefund does not recover stolen funds. It only helps identify and close unused token accounts that may contain recoverable rent-exempt SOL.</p></details>
          <details><summary>Why is SOL locked in token accounts?</summary><p>On Solana, token accounts often require a small amount of SOL as rent-exempt balance. If an account is empty and unused, it may be possible to close it and recover that SOL.</p></details>
          <details><summary>Is every wallet eligible?</summary><p>No. Some wallets may have no unused accounts to close. The scanner only shows recoverable opportunities when they are found.</p></details>
          <details><summary>How does SolanaRefund work?</summary><p>SolanaRefund closes unused Solana token accounts and recovers the SOL locked inside them. A small percentage is taken only from SOL successfully recovered. There is no upfront payment.</p></details>
          <details><summary>Will tokens be burned automatically?</summary><p>No. Tokens are never burned automatically. Burning is permanent and will require manual review in a later version.</p></details>
          <details><summary>Is SolanaRefund affiliated with Solana?</summary><p>No. SolanaRefund is an independent tool and is not affiliated with the Solana Foundation or any wallet provider.</p></details>
          <details><summary>How do I know I am on the real website?</summary><p>Always check the domain before connecting your wallet: solanarefund.xyz. SolanaRefund will never ask for your seed phrase or private key.</p></details>
        </section>
      </main>
      <Footer />
    </div>
  );
}
