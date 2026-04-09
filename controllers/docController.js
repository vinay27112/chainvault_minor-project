import Doc from "../model/docModel.js";

export const getDocs = async (req, res) => {
  try {
    const docs = await Doc.find({ author: req.user._id });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDoc = async (req, res) => {
  try {
    const { title, content } = req.body;
    const documentId = req.file ? req.file.buffer : null; // Assuming you're using Multer for file upload
    const doc = await Doc.create({
      title,
      content,
      author: req.user.id,
      documentId,
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const doc = await Doc.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
