import Web3 from "web3";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Set up Web3 connection (use Infura, Alchemy, or your local node)
const web3 = new Web3(process.env.INFURA_URL); // Ensure this is set in .env

// Contract address (replace with your actual deployed address)
const contractAddress = "0xBBDaFD7d5c63a96289A00973631483ce219Cca2E";

// Contract ABI (paste full ABI here)
const abi = [
  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "logHash",
          "type": "bytes32"
        }
      ],
      "name": "LogStored",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "logHash",
          "type": "bytes32"
        }
      ],
      "name": "storeLog",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "verifiedLogs",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "logHash",
          "type": "bytes32"
        }
      ],
      "name": "verifyLog",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  
];

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Log hash to verify
const logHash = "0x62b17c7dbc3f6b09b7214dbe9dea88e9ba4dace59af5e42d74f569a3c925c5d2";

try {
  const result = await contract.methods.verifiedLogs(logHash).call();
  console.log("Verified:", result);
} catch (error) {
  console.error("Error:", error.message);
}
