import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

import { useState } from "react";
import './App.css';
import { generateMnemonic } from "bip39";
import EthereumWallet from "./EthereumWallet";

export default function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wallet Generator</h1>
        <p>Securely generate mnemonic phrases and wallets for various blockchains.</p>
      </header>

      <main className="main-content">
        <section className="mnemonic-section">
          <label htmlFor="mnemonic-input" className="mnemonic-label">
            Mnemonic Phrase
          </label>
          <div className="input-wrapper"> {/* Added wrapper for better styling */}
            <input
              id="mnemonic-input"
              type="text"
              value={mnemonic}
              readOnly
              placeholder="Generate a mnemonic to view it here"
              className="mnemonic-input"
            />
            <button
              className="generate-mnemonic-button"
              onClick={handleGenerateMnemonic}
            >
              Generate
            </button>
          </div>
        </section>

        <section className="wallets-section">
          {mnemonic ? (
            <div className="wallet-grid"> {/* Use grid for wallet layout */}
              <div className="wallet-card">
                <h2>Ethereum Wallet</h2>
                <EthereumWallet mnemonic={mnemonic} />
              </div>
              {/* Add more wallet cards here as needed */}
            </div>
          ) : (
            <div className="placeholder-container">
              <p className="wallets-placeholder">Click "Generate" to create a new mnemonic and associated wallets.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Secure Wallet Generator</p>
      </footer>
    </div>
  );
}