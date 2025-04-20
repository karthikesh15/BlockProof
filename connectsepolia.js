import Web3 from 'web3';

const web3 = new Web3("https://sepolia.infura.io/v3/4577e38ff7284f16a948b7b61433b8e6");

async function checkConnection() {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        console.log("Connected to Sepolia! Latest Block:", blockNumber);
    } catch (error) {
        console.log("Error connecting to Sepolia:", error);
    }
}

checkConnection();
