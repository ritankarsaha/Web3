import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const generateWallet = async () => {
    try {

      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, Buffer.from(seed)).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  return (
    <>
      <button onClick={generateWallet}>Generate Solana Wallet</button>
      {publicKeys.map((publicKey, index) => (
        <div key={index}>Sol - {publicKey}</div>
      ))}
    </>
  );
}
