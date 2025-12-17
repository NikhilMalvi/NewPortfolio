import express from "express";
import {
  AddGalleryItem,
  deleteGalleryById,
  editGalleryById,
  getAllGalleryItems,
  getGalleryById,
} from "../controllers/galleryControllers.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const galleryRouter = express.Router();

galleryRouter.post("/add", protect, upload.single("file"), AddGalleryItem);
galleryRouter.get("/all", getAllGalleryItems);
galleryRouter.put(
  "/edit-file/:id",
  upload.none(), // <- parse multipart form fields into req.body
  editGalleryById
);
galleryRouter.delete("/delete-file/:id", deleteGalleryById);
galleryRouter.get("/:id", getGalleryById);

export default galleryRouter;
