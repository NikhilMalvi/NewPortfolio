import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String }, // Optional title
    altText: { type: String }, // Optional alt text
    category: { type: String, default: "general" }, // page name (home/about/project/etc.)

    // ImageKit fields
    imageUrl: { type: String, required: true },
    fileId: { type: String, required: true },

    fileType: { type: String }, // image/png, application/pdf, etc.
    fileSize: { type: String }, // KB or MB
    width: { type: Number }, // only for images
    height: { type: Number }, // only for images
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
