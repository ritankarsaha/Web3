require('dotenv').config();
const { Connection, Keypair } = require('@solana/web3.js');
const { Wallet } = require('@project-serum/anchor');

const connection = new Connection('https://api.devnet.solana.com');

const privateKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));

const wallet = new Wallet(Keypair.fromSecretKey(privateKey));

console.log('Wallet public key:', wallet.payer.publicKey.toBase58());

