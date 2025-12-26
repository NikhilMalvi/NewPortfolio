import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    homeHeading: { type: String, required: true },
    homeDescription: { type: String, required: true },
    homeCTA: { type: String, required: true },
    homeCTALink: { type: String, required: true },

    // Light image
    lightImageUrl: { type: String, required: true },
    lightImageFileId: { type: String, required: true },

    // Dark image
    darkImageUrl: { type: String, required: true },
    darkImageFileId: { type: String, required: true },
  },
  { timestamps: true }
);

const counterSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  symbol: { type: String, default: "" },
});

// ============ ABOUT PAGE MAIN SCHEMA ============
const aboutSchema = new mongoose.Schema(
  {
    // SECTION 1
    aboutHeading: { type: String, required: true },
    aboutDescription: { type: String, required: true }, // Quill HTML content
    lightImageUrl: { type: String, required: true }, // filename or Cloudinary URL
    darkImageUrl: { type: String, required: true },

    // SECTION 2
    counters: [counterSchema],

    // SECTION 3
    section3Title: { type: String, required: true },
    section3Content: { type: String, required: true }, // Quill text
    section3LightImgUrl: { type: String, required: true },
    section3DarkImgUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema(
  {
    profileImgUrl: { type: String, require: true },
    profileName: { type: String, require: true },
    designation: { type: String, require: true },
    aboutme: { type: String, require: true },
    aboutLink: { type: String, require: true },
  },
  { timestamps: true }
);

const techSchema = new mongoose.Schema(
  {
    techImgUrl: { type: String, require: true },
    techName: { type: String, require: true },
  },
  { timestamps: true }
);

export const Home = mongoose.model("Home", homeSchema);

export const About = mongoose.model("About", aboutSchema);

export const Profile = mongoose.model("Profile", profileSchema);

export const Technology = mongoose.model("Technology", techSchema);
