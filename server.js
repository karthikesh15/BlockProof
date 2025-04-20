import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Web3 from "web3";

const app = express();
const PORT = 3000;
app.use(express.json()); // Parse JSON body

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

const contractABI = [
    
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
     // ✅ Fixed syntax error
]; // ✅ Properly closed the ABI array

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Setup signer account using private key
const privateKey = process.env.PRIVATE_KEY;  // Add PRIVATE_KEY in your .env
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

app.get("/", (req, res) => {
    res.send("Blockchain API is running");
});

// ✅ Verify if a logHash is stored
app.get("/verifyLog/:logHash", async (req, res) => {
    try {
        const logHash = req.params.logHash;

        // ✅ Validate hex format (strict check)
        if (!web3.utils.isHexStrict(logHash)) {
            return res.status(400).json({
                success: false,
                error: "Invalid logHash. Must be a strict hex string (starts with 0x and only hex characters)."
            });
        }

        // ✅ Validate length for bytes32
        if (logHash.length !== 66) {
            return res.status(400).json({
                success: false,
                error: "Invalid logHash length. Expected 66 characters (0x + 64 hex characters)."
            });
        }

        // ✅ Call smart contract method (use either verifyLog OR verifiedLogs — both are fine)
        const isVerified = await contract.methods.verifiedLogs(logHash).call();

        res.json({
            success: true,
            logHash,
            verified: isVerified
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Store a new logHash
app.post("/storeLog", async (req, res) => {
    try {
        const { logHash } = req.body;

        const tx = await contract.methods.storeLog(logHash).send({
            from: account.address,
            gas: 3000000
        });

        res.json({ success: true, transactionHash: tx.transactionHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
