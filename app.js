// ✅ Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xB34d87C1202B54dc196A32d69be35bEd273F7148";

const CONTRACT_ABI = [
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "logHash", "type": "bytes32" }], "name": "LogStored", "type": "event" },
  { "inputs": [{ "internalType": "bytes32", "name": "logHash", "type": "bytes32" }], "name": "storeLog", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "verifiedLogs", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "logHash", "type": "bytes32" }], "name": "verifyLog", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

// ── Page Navigation ──────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });
}

// ── File Selected Handler ────────────────────────────────
function onFileSelected(type) {
  const input = document.getElementById(type === 'upload' ? 'fileInputUpload' : 'fileInputVerify');
  const infoDiv = document.getElementById(type === 'upload' ? 'uploadFileInfo' : 'verifyFileInfo');
  const file = input.files[0];
  if (file) {
    const size = file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(1) + ' KB'
      : (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    infoDiv.innerHTML = `📄 <strong>${file.name}</strong> &nbsp;·&nbsp; ${size}`;
    infoDiv.classList.add('visible');
  }
}

// ── MetaMask / Contract ──────────────────────────────────
async function getContract() {
  if (!window.ethereum) {
    alert("MetaMask is not installed! Please install it from https://metamask.io");
    throw new Error("MetaMask not found");
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0xaa36a7") {
    alert("Please switch MetaMask to the Sepolia testnet!");
    throw new Error("Wrong network");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// ── Hash File ────────────────────────────────────────────
async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Upload & Store ───────────────────────────────────────
async function uploadFile() {
  const file = document.getElementById("fileInputUpload").files[0];
  const responseDiv = document.getElementById("uploadResponse");

  if (!file) {
    responseDiv.innerHTML = `<div class="result error">⚠️ Please select a file first.</div>`;
    return;
  }

  responseDiv.innerHTML = `<div class="result loading">⏳ Hashing file...</div>`;

  try {
    const logHash = await hashFile(file);
    responseDiv.innerHTML = `<div class="result loading">🦊 Connecting MetaMask...</div>`;

    const contract = await getContract();
    responseDiv.innerHTML = `<div class="result loading">📦 Confirm the transaction in MetaMask to store on blockchain...</div>`;

    const tx = await contract.storeLog(logHash);
    responseDiv.innerHTML = `<div class="result loading">⏳ Waiting for confirmation...</div>`;

    await tx.wait();

    responseDiv.innerHTML = `
      <div class="result success">
        ✅ Stored on blockchain successfully!<br/>
        <strong>File:</strong> ${file.name}<br/>
        <span class="hash">Hash: ${logHash}</span>
        <span class="hash">TX: <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">${tx.hash}</a></span>
      </div>`;
  } catch (err) {
    responseDiv.innerHTML = `<div class="result error">❌ ${err.message}</div>`;
  }
}

// ── Verify ───────────────────────────────────────────────
async function verifyFile() {
  const file = document.getElementById("fileInputVerify").files[0];
  const responseDiv = document.getElementById("verifyResponse");

  if (!file) {
    responseDiv.innerHTML = `<div class="result error">⚠️ Please select a file first.</div>`;
    return;
  }

  responseDiv.innerHTML = `<div class="result loading">⏳ Hashing file...</div>`;

  try {
    const logHash = await hashFile(file);
    responseDiv.innerHTML = `<div class="result loading">🔍 Checking blockchain...</div>`;

    const contract = await getContract();
    const isVerified = await contract.verifiedLogs(logHash);

    if (isVerified) {
      responseDiv.innerHTML = `
        <div class="result success">
          ✅ File is VERIFIED on blockchain!<br/>
          <strong>File:</strong> ${file.name}<br/>
          <span class="hash">Hash: ${logHash}</span>
        </div>`;
    } else {
      responseDiv.innerHTML = `
        <div class="result error">
          ❌ File NOT found on blockchain.<br/>
          <strong>File:</strong> ${file.name}<br/>
          <span class="hash">Hash: ${logHash}</span>
        </div>`;
    }
  } catch (err) {
    responseDiv.innerHTML = `<div class="result error">❌ ${err.message}</div>`;
  }
}

// ── Init ─────────────────────────────────────────────────
showPage('home');