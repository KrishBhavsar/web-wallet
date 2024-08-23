import { useState, useEffect } from "react";
import Mnemonic from "./components/Mnemonic";
import SolWallet from "./components/SolWallet";
import EthWallet from "./components/EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState(() => {
    return localStorage.getItem("mnemonic") || "";
  });

  useEffect(() => {
    if (mnemonic) {
      localStorage.setItem("mnemonic", mnemonic);
    }
  }, [mnemonic]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 mt-4">
        <Mnemonic mnemonic={mnemonic} setMnemonic={setMnemonic} />
      </div>
      {mnemonic && (
        <div className="block gap-10 mt-2 md:flex">
          <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 mt-6">
            <SolWallet mnemonic={mnemonic} />
          </div>
          <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 mt-6">
            <EthWallet mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;