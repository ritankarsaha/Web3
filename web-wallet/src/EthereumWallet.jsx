import { useState } from 'react';
import { mnemonicToSeed } from 'bip39';
import { Wallet, HDNodeWallet } from 'ethers';
import axios from 'axios';
import PropTypes from 'prop-types';

const EthereumWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [currentBalance, setCurrentBalance] = useState({});

    const addEthWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const wallet = new Wallet(child.privateKey);

            setAddresses((prevAddresses) => [...prevAddresses, wallet.address]);
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } catch (error) {
            console.error('Error generating Ethereum wallet:', error);
            alert('Failed to generate Ethereum wallet. Please try again.');
        }
    };

    const checkBalance = async (address) => {
        const alchemyUrl = 'https://eth-mainnet.g.alchemy.com/v2/CC_UQv4PhoVuG850MkCf5IdnxQBmUHoe';
        const body = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [address, 'latest'],
        };

        try {
            const response = await axios.post(alchemyUrl, body);

            if (response.data.error) {
                console.error('Error fetching balance:', response.data.error);
                alert(`Error: ${response.data.error.message}`);
            } else {
                const hexBalance = response.data.result;
                const balance = parseInt(hexBalance, 16) / 1e18; // Convert Wei to Ether
                setCurrentBalance((prevBalances) => ({
                    ...prevBalances,
                    [address]: balance.toFixed(6), // Display balance up to 6 decimal places
                }));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            alert('Failed to fetch balance. Please check your internet connection.');
        }
    };

    return (
        <div className="wallet-container">
            <h2>Ethereum Wallets</h2>
            <button
                className="btn-add-wallet"
                onClick={addEthWallet}
            >
                Add ETH Wallet
            </button>

            <div className="wallets-list">
                {addresses.map((address, index) => (
                    <div key={index} className="wallet-item">
                        <p>
                            <span className="wallet-label">Address:</span> {address}
                        </p>
                        <button
                            className="btn-check-balance"
                            onClick={() => checkBalance(address)}
                        >
                            Check Balance
                        </button>
                        <p>
                            <span className="wallet-label">Balance:</span> {currentBalance[address] || 'Fetching...'} ETH
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

EthereumWallet.propTypes = {
    mnemonic: PropTypes.string.isRequired,
};

export default EthereumWallet;
