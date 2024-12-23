import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function ShowSolBalance() {
    const {connection} = useConnection();
    const wallet = useWallet();

    async function getBalance(){
        let balance = await connection.getBalance(wallet.publicKey);
        document.getElementById("balance").innerHTML = balance / LAMPORTS_PER_SOL;  
        alert("Balance: " + balance / LAMPORTS_PER_SOL + " SOL");
    }

    return (
        <div>
            <h1>Check Balance</h1>
            <button onClick={getBalance}>Check Balance</button>
            <p id="balance"></p>
        </div>
    )
}