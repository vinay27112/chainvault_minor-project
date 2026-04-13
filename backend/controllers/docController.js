import Doc from "../model/docModel.js";
import { uploadToIPFS } from "../services/ipfs.service.js";
import { registerDocument, verifyCID } from "../services/blockchain.service.js";

export const getDocs = async (req, res) => {
  try {
    const docs = await Doc.find({ author: req.user.id });
    res.json({ success: true, docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDoc = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    const { title, description } = req.body;
    //const documentId = req.file ? req.file.buffer : null;
    const { cid, ipfsUrl } = await uploadToIPFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );
    const blockchainResponse = await registerDocument(cid);
    if (!blockchainResponse.success) {
      if (blockchainResponse.alreadyRegistered) {
        return res.status(409).json({
          success: false,
          message: "This document is already registered on the blockchain",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Blockchain registration failed",
      });
    }
    const doc = await Doc.create({
      title,
      description,
      author: req.user.id,
      ipfsUrl,
      ipfsCid: cid,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      txHash: blockchainResponse.txHash,
    });
    // const doc = await Doc.create({
    //   title,
    //   description,
    //   author: req.user.id,
    //   documentId,
    // });
    res.status(201).json({ success: true, doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const doc = await Doc.findOne({ _id: req.params.id, author: req.user.id });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    await doc.deleteOne();
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyDoc = async (req, res) => {
  try {
    const doc = await Doc.findOne({ ipfsCid: req.params.cid });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    const blockchainResponse = await verifyCID(req.params.cid);
    if (!blockchainResponse.success) {
      return res
        .status(500)
        .json({ success: false, message: "Blockchain verification failed" });
    }
    if (!blockchainResponse.isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Document is not authentic" });
    }
    res.json({
      success: true,
      message: "Document is authentic",
      title: doc.title,
      ipfsUrl: doc.ipfsUrl,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      owner: blockchainResponse.owner,
      registeredAt: blockchainResponse.timestamp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
