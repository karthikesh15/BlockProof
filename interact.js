const Web3 = require("web3");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const contractABI = JSON.parse(fs.readFileSync("./contractABI.json", "utf8"));
const web3 = new Web3(process.env.INFURA_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

console.log("Contract loaded successfully!");
