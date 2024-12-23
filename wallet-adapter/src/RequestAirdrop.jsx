import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


export function RequestAirdrop(){

    const wallet = useWallet();
    const {connection} = useConnection();


    async function RequestAirdrop(){
        let amt = document.getElementById("amount").value;
        await connection.requestAirdrop(wallet.publicKey, amt * LAMPORTS_PER_SOL);  
        alert("Airdropped " + amt + " SOL to " + wallet.publicKey.toBase58());
    }

    return (
        <div>
            <h1>Request Airdrop</h1>
            <input id="amount" type="number" placeholder="Amount in SOL" />
            <button onClick={RequestAirdrop}>Request Airdrop</button>
        </div>
    )
}