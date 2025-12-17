import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    homeHeading: { type: String, required: true },
    homeDescription: { type: String, required: true },
    homeCTA: { type: String, required: true },
    homeCTALink: { type: String, required: true },

    // Light image
    lightImageUrl: { type: String },

    // Dark image
    darkImageUrl: { type: String },
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
    lightImage: { type: String, required: true }, // filename or Cloudinary URL
    darkImage: { type: String, required: true },

    // SECTION 2
    counters: [counterSchema],

    // SECTION 3
    section3Title: { type: String, required: true },
    section3Content: { type: String, required: true }, // Quill text
    section3LightImg: { type: String, required: true },
    section3DarkImg: { type: String, required: true },
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema(
  {
    profileImg: { type: String, require: true },
    profileName: { type: String, require: true },
    designation: { type: String, require: true },
    aboutme: { type: String, require: true },
    aboutLink: { type: String, require: true },
  },
  { timestamps: true }
);

const techSchema = new mongoose.Schema(
  {
    techImg: { type: String, require: true },
    techName: { type: String, require: true },
  },
  { timestamps: true }
);

export const Home = mongoose.model("Home", homeSchema);

export const About = mongoose.model("About", aboutSchema);

export const Profile = mongoose.model("Profile", profileSchema);

export const Technology = mongoose.model("Technology", techSchema);
