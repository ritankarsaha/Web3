import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function TokenLaunchpad() {

    const connection = useConnection();
    const wallet = useWallet();

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const metadata = {
            mint: mintKeypair.publicKey,
            name: 'RITA',
            symbol: 'RIT',
            uri: 'https://cdn.100xdevs.com/metadata.json',
            additionalMetadata: [],
        };


        const mintLen = getMintLen(ExtensionType.MetadataPointer);
        const metadataLen = pack(metadata).length + TYPE_SIZE + LENGTH_SIZE;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
        const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),

        
        createInitializeMetadataPointerInstruction(mintKeypair.publicKey,wallet.publicKey,mintKeypair.publicKey,TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintKeypair.publicKey,9,wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
            creators: ['Ritankar Saha'],

        }),



    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);


    await wallet.sendTransaction(transaction, connection);



    }
    
    


    
    return  <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}