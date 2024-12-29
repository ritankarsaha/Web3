import { Buffer } from 'buffer';
import React, { useState } from 'react';
globalThis.Buffer = Buffer;
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function TokenLaunchpad() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, connected } = useWallet();
    
    // State for form inputs
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [initialSupply, setInitialSupply] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function createToken() {
        if (!connected || !publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            setIsLoading(true);
            const mintKeypair = Keypair.generate();
            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenName || 'RITA',
                symbol: tokenSymbol || 'RIT',
                uri: imageUrl || 'https://cdn.100xdevs.com/metadata.json',
                additionalMetadata: [],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = pack(metadata).length + TYPE_SIZE + LENGTH_SIZE;
            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
            
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),

                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey,
                    publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                ),
                
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9,
                    publicKey,
                    null,
                    TOKEN_2022_PROGRAM_ID
                ),
                
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: publicKey,
                    updateAuthority: publicKey,
                    creators: ['Ritankar Saha'],
                })
            );

            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            const signature = await sendTransaction(transaction, connection, {
                signers: [mintKeypair]
            });
            
            await connection.confirmTransaction(signature);
            console.log(`Token created: ${mintKeypair.publicKey.toBase58()}`);

            //Solana tokens (SPL tokens) cannot be held directly in a wallet. Instead, they must be held in an associated token account (ATA) that is linked to the wallet.
            //An ATA is a program-derived address (PDA) that acts as a unique container for a specific token in a specific wallet.
            //Without creating this account, minted tokens would have no place to be stored.

            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                publicKey,
                false,  // not allowing token to token transfers over here.
                TOKEN_2022_PROGRAM_ID
            );

            console.log(`Associated token account: ${associatedToken.toBase58()}`);

            //A transaction is created to initialize the ATA if it doesn't already exist.
            // `createAssociatedTokenAccountInstruction` ensures that the ATA is set up correctly.

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    publicKey,
                    associatedToken,
                    publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const signature2 = await sendTransaction(transaction2, connection);
            await connection.confirmTransaction(signature2);

            // actually minting the tokens
            const supplyToMint = initialSupply ? parseInt(initialSupply) : 1000000000;
            
            const transaction3 = new Transaction().add(
                createMintToInstruction(
                    mintKeypair.publicKey,
                    associatedToken,
                    publicKey,
                    supplyToMint,
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const signature3 = await sendTransaction(transaction3, connection);
            await connection.confirmTransaction(signature3);

            console.log('Tokens minted successfully');
            alert('Token created and minted successfully!');
            
        } catch (error) {
            console.error('Error creating token:', error);
            alert(`Error creating token: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Solana Token Launchpad
                </h1>
                
                {!connected ? (
                    <div className="text-center text-red-500">
                        Please connect your wallet to create tokens
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            className="w-full rounded-lg border p-3"
                            type="text"
                            placeholder="Token Name"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                        />
                        
                        <input
                            className="w-full rounded-lg border p-3"
                            type="text"
                            placeholder="Token Symbol"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value)}
                        />
                        
                        <input
                            className="w-full rounded-lg border p-3"
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        
                        <input
                            className="w-full rounded-lg border p-3"
                            type="number"
                            placeholder="Initial Supply"
                            value={initialSupply}
                            onChange={(e) => setInitialSupply(e.target.value)}
                        />
                        
                        <button
                            onClick={createToken}
                            disabled={isLoading}
                            className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white hover:bg-purple-700 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Creating Token...' : 'Create Token'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TokenLaunchpad;