import mongoose from "mongoose";
import Gallery from "../models/gallery.js";
import sharp from "sharp"; // used to read image width/height
import gallery from "../models/gallery.js";
import imagekit from "../config/imagekit.js";

export const AddGalleryItem = async (req, res) => {
  try {
    const file = req.file;
    const { title, altText, category } = req.body;

    /* -------------------- VALIDATION -------------------- */
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    /* -------------------- IMAGE METADATA -------------------- */
    let width = null;
    let height = null;

    if (file.mimetype.startsWith("image/")) {
      try {
        const meta = await sharp(file.buffer).metadata();
        width = meta.width;
        height = meta.height;
      } catch (err) {
        console.log("Image metadata error:", err.message);
      }
    }

    /* -------------------- FILE SIZE -------------------- */
    const sizeKB =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : (file.size / 1024).toFixed(1) + " KB";

    /* -------------------- UPLOAD TO IMAGEKIT -------------------- */
    const uploadResponse = await imagekit.upload({
      file: file.buffer, // 👈 buffer, NOT path
      fileName: file.originalname,
      folder: "/uploads/gallery",
      useUniqueFileName: true,
    });

    /* -------------------- SAVE TO DATABASE -------------------- */
    const newItem = await Gallery.create({
      title,
      altText,
      category: category || "general",

      // ImageKit data
      imageUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,

      // Metadata
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
    return res.status(500).json({
      success: false,
      message: "Failed to upload gallery item",
    });
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

    // Delete from ImageKit
    try {
      await imagekit.deleteFile(item.fileId);
      console.log("✔ File deleted from ImageKit:", item.fileId);
    } catch (err) {
      console.log("❌ Error deleting file from ImageKit:", err.message);
      // Continue to delete from DB even if ImageKit delete fails
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
