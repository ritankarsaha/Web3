import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTokens() {

    const wallet = useWallet();
    const {connection} = useConnection();

    async function SendTokens(){
        let to = document.getElementById("to").value
        let amt = document.getElementById("amount").value
        
    }
}