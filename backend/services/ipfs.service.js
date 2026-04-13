import axios from "axios";
import FormData from "form-data";

export const uploadToIPFS = async (fileBuffer, fileName, mimetype) => {
  try {
    const form = new FormData();
    form.append("file", fileBuffer, {
      filename: fileName,
      contentType: mimetype,
    });
    form.append("pinataMetadata", JSON.stringify({ name: fileName }));
    form.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        maxBodyLength: Infinity,
      },
    );
    const cid = response.data.IpfsHash;
    const ipfsUrl = `${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
    return { cid, ipfsUrl };
  } catch (error) {
    console.error("IPFS upload error:", error.message);
    throw new Error("Failed to upload file to IPFS");
  }
};
