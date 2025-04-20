import axios from "axios";

// Replace this with your actual logHash (must be 66 characters: 0x + 64 hex)
const logHash = "0xb2fb1fdec35147093613dae679742e1374aa7d273d3ba3d7d83cf930a3ad3341";

// Your backend server
const baseURL = "http://localhost:3000";

async function testStoreAndVerifyLog() {
    try {
        // Step 1: Store the logHash
       console.log("📦 Storing logHash...");
        const storeResponse = await axios.post(`${baseURL}/storeLog`, { logHash });
        console.log("✅ Store Success:", storeResponse.data);

        // Step 2: Verify the logHash
        console.log("\n🔍 Verifying logHash...");
        const verifyResponse = await axios.get(`${baseURL}/verifyLog/${logHash}`);
        console.log("✅ Verify Result:", verifyResponse.data);

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
}

testStoreAndVerifyLog();
