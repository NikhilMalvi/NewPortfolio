import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true }, // saved filename in uploads
    originalName: { type: String }, // original upload name
    title: { type: String }, // Optional title
    altText: { type: String }, // Optional alt text
    category: { type: String, default: "general" }, // page name (home/about/project/etc.)

    fileType: { type: String }, // image/png, application/pdf, etc.
    fileSize: { type: String }, // KB or MB
    width: { type: Number }, // only for images
    height: { type: Number }, // only for images
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
