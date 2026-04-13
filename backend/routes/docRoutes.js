import express from "express";
import {
  getDocs,
  createDoc,
  deleteDoc,
  verifyDoc,
} from "../controllers/docController.js";
import { userAuth } from "../middleware/userAuth.js";
import upload from "../config/multer.js";

const docRouter = express.Router();

docRouter.get("/", userAuth, getDocs);
docRouter.post("/upload", userAuth, upload.single("document"), createDoc);
docRouter.delete("/:id", userAuth, deleteDoc);
docRouter.get("/verify/:cid", verifyDoc);

export default docRouter;
