import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /* documentId: {
      type: String,
      required: true,
      unique: true,
    },
    for working with centralized file storage like AWS S3, Google Cloud Storage, etc. We can store the file URL or unique identifier here instead of the actual file data in MongoDB.
    */
    fileName: {
      type: String,
      required: true,
    },
    ipfsUrl: {
      type: String,
      required: true,
    },
    ipfsCid: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      unique: true,
      default: null,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Doc", docSchema);
