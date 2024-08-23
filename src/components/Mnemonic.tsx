import { generateMnemonic } from "bip39";

interface MnemonicProps {
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
}

const Mnemonic = ({ mnemonic, setMnemonic }: MnemonicProps) => {
  const generateNewMnemonic = () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  const mnemonicWords = mnemonic ? mnemonic.split(" ") : [];

  return (
    <div className="mb-3">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Mnemonic Generator
      </h1>
      <button
        onClick={generateNewMnemonic}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-colors duration-200"
      >
        Generate New Mnemonic
      </button>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {mnemonicWords.map((word, index) => (
          <div
            key={index}
            className="p-3 border border-gray-300 rounded-lg text-center text-gray-700 bg-gray-50 shadow-sm"
          >
            <span>{index + 1}.</span> {word}
          </div>
        ))}
      </div>
      {mnemonic && (
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-6 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <button
            onClick={copyToClipboard}
            className="mt-6 text-gray-700 font-semibold py-3 rounded-lg  transition-colors duration-200 "
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Mnemonic;
