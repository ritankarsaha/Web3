import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from 'bs58';

export function SignMessage() {
    const {publicKey, signMessage} = useWallet();

    async function onclick(){
        if(!publicKey) throw new Error("Wallet not connected");
        if(!signMessage) throw new Error("Wallet does not support message signing"); 
        
        
        const message = document.getElementById("message").value;
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);

        if(!ed25519.verify(signature, encodedMessage, publicKey.toBytes())){
            throw new Error("Invalid signature");
        }
        alert("Signature Verified - Signature: " + bs58.encode(signature));
    }

    return (
        <div>
            <h1>Sign Message</h1>
            <input id="message" type="text" placeholder="Message" />
            <button onClick={onclick}>Sign Message</button>
        </div>
    )
}

