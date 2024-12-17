import { useState } from "react";
import './App.css'
import { generateMnemonic } from "bip39";
import {SolanaWallet} from "./SolanaWallet";
import {EthereumWallet} from "./EthereumWallet";

export default function App() {

  const[mnemonic , setMnemonic] = useState("");
  return(
    <>
    <input type="text" value={mnemonic}></input>
    
    <button onClick={async function(){
     const mnemonic = generateMnemonic();
     setMnemonic(mnemonic);
    }}>Generate Mnemonic</button>

{mnemonic && <SolanaWallet mnemonic={mnemonic}/>}
{mnemonic && <EthereumWallet mnemonic={mnemonic}/>}
    </>

    

  )

}

