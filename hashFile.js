import fs from "fs";
import pkg from "js-sha3";
const { keccak256 } = pkg;

const filePath = "./sample.txt";

function hashFile(path) {
    const data = fs.readFileSync(path);
    const hash = keccak256(data);
    console.log("Keccak256 Hash:", "0x" + hash);
}

hashFile(filePath);
