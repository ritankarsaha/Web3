import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTokens() {

    const wallet = useWallet();
    const {connection} = useConnection();

    async function SendTokens(){
        let to = document.getElementById("to").value
        let amt = document.getElementById("amount").value
        

        const transaction  = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(to),
                lamports: amt * LAMPORTS_PER_SOL
            })
        );

        await wallet.sendTransaction(transaction, connection);
        alert("Sent " + amt + " SOL to " + to);

    }

    return (
        <>
        <input id="to" type="text" placeholder="To Address" />
        <input id="amount" type="number" placeholder="Amount in SOL" />
        <button onClick={SendTokens}>Send Tokens</button>
        </>
    )
}