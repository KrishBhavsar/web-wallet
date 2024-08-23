import { useState, useEffect } from "react";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

interface SolanaWalletProps {
  mnemonic: string;
}

interface WalletInfo {
  publicKey: PublicKey;
  privateKey: string;
}

export default function SolWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return parseInt(localStorage.getItem("currentIndex") || "0", 10);
  });

  const [wallets, setWallets] = useState<WalletInfo[]>(() => {
    const savedWallets = localStorage.getItem("wallets");
    return savedWallets
      ? JSON.parse(savedWallets).map((wallet: any) => ({
          publicKey: new PublicKey(wallet.publicKey),
          privateKey: wallet.privateKey,
        }))
      : [];
  });

  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex.toString());
    localStorage.setItem(
      "wallets",
      JSON.stringify(
        wallets.map((w) => ({
          publicKey: w.publicKey.toBase58(),
          privateKey: w.privateKey,
        }))
      )
    );
  }, [currentIndex, wallets]);

  const addWallet = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setWallets([
      ...wallets,
      {
        publicKey: keypair.publicKey,
        privateKey: Buffer.from(keypair.secretKey).toString("hex"),
      },
    ]);
  };

  const deleteWallet = (index: number) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Generated Solana Wallets
      </h2>
      <button
        onClick={addWallet}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all duration-200 mb-8 text-lg"
      >
        Add New Wallet
      </button>
      <div className="space-y-6">
        {wallets.map((wallet, index) => (
          <div
            key={index}
            className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
          >
            <button
              onClick={() => deleteWallet(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete wallet"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-2 text-purple-600">
              Wallet {index + 1}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Public Key:</p>
              <div className="flex items-center bg-white p-2 rounded border border-gray-200">
                <p className="text-gray-800 break-all flex-grow">
                  {wallet.publicKey.toBase58()}
                </p>
                <button
                  onClick={() => copyToClipboard(wallet.publicKey.toBase58())}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Copy public key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4">Private Key:</p>
              <div className="flex items-center bg-white p-2 rounded border border-gray-200">
                <p className="text-gray-800 break-all flex-grow">
                  {wallet.privateKey}
                </p>
                <button
                  onClick={() => copyToClipboard(wallet.privateKey)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Copy private key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}