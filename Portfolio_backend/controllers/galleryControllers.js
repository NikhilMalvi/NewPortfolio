import mongoose from "mongoose";
import Gallery from "../models/gallery.js";
import sharp from "sharp"; // used to read image width/height
import gallery from "../models/gallery.js";
import path from "path";
import fs from "fs";

export const AddGalleryItem = async (req, res) => {
  try {
    const file = req.file;
    const { title, altText, category } = req.body;

    // Validate file
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Metadata defaults
    let width = null;
    let height = null;

    // If file is image → extract width & height
    if (file.mimetype.startsWith("image/")) {
      try {
        const imageInfo = await sharp(file.path).metadata();
        width = imageInfo.width;
        height = imageInfo.height;
      } catch (err) {
        console.log("Image metadata error:", err.message);
      }
    }

    // File size (KB or MB)
    const sizeKB = (file.size / 1024).toFixed(1) + " KB";

    // Save to database
    const newItem = await Gallery.create({
      fileName: file.filename,
      originalName: file.originalname,
      title,
      altText,
      category: category || "general",
      fileType: file.mimetype,
      fileSize: sizeKB,
      width,
      height,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery item added successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("AddGalleryItem Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllGalleryItems = async (req, res) => {
  try {
    const data = await Gallery.find().sort({ createdAt: -1 });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "No gallery items found" });
    }
    res.status(200).json({ success: true, galleryData: data });
  } catch (error) {
    console.error("FetchGalleryItems Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gallery item ID" });
    }

    const data = await Gallery.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery item not found" });
    }
    res.status(200).json({ success: true, gallery: data });
  } catch (error) {
    console.error("FetchGalleryById Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, altText, category } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    // Check if item exists
    const existing = await Gallery.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Update only allowed fields
    existing.title = title || existing.title;
    existing.altText = altText || existing.altText;
    existing.category = category || existing.category;

    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      updatedItem: existing,
    });
  } catch (error) {
    console.error("EditGalleryById Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gallery item ID" });
    }

    // Find item first
    const item = await Gallery.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery item not found" });
    }

    // Build file path
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "gallery",
      item.fileName // Your schema uses fileName
    );

    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.log("❌ Error deleting file:", err.message);
        else console.log("✔ File deleted:", filePath);
      });
    } else {
      console.log("⚠ File not found on disk:", filePath);
    }

    // Delete DB entry
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("DeleteGalleryById Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveToGallery = async ({
  file,
  title,
  altText = "",
  category = "general",
}) => {
  if (!file) return;

  await Gallery.create({
    fileName: file.filename, // ✔ REQUIRED FIELD
    originalName: file.originalname, // optional
    title: title || file.originalname,
    altText,
    category,

    fileType: file.mimetype,
    fileSize: (file.size / 1024).toFixed(1) + " KB",
  });
};
