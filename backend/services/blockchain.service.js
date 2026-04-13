import { ethers } from "ethers";
import abi from "../config/abi/DocumentRegistry.json" with { type: "json" };

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

export const registerDocument = async (cid) => {
  try {
    const tx = await contract.registerDocument(cid);
    await tx.wait();
    return {
      success: true,
      txHash: tx.hash,
      message: "Document registered successfully",
    };
  } catch (error) {
    const reason = error.reason || error.info?.error?.message || "";
    if (reason.includes("CID already registered")) {
      return {
        success: false,
        alreadyRegistered: true,
        message: "This document is already registered on the blockchain",
      };
    }
    {
      return {
        success: false,
        message: "This document is already registered on the blockchain",
      };
    }
    console.error("Error registering document:", error);
    return {
      success: false,
      message: "Failed to register document on the blockchain",
    };
  }
};

export const verifyCID = async (cid) => {
  try {
    const [owner, timestamp, isValid] = await contract.verifyCID(cid);
    return { success: true, owner, timestamp: Number(timestamp), isValid };
  } catch (error) {
    console.error("Error verifying CID:", error);
    return { success: false, message: "Failed to verify CID" };
  }
};
