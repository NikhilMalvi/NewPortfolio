import { Home, About, Profile, Technology } from "../models/pages.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { saveToGallery } from "./galleryControllers.js";
import { log } from "console";

export const getHome = async (req, res) => {
  try {
    const data = await Home.findOne();

    if (!data) {
      return res.json({
        success: false,
        message: "No home data found",
      });
    }

    res.json({
      success: true,
      home: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateHome = async (req, res) => {
  try {
    const {
      homeHeading,
      homeDescription,
      homeCTA,
      homeCTALink,
      lightImage: bodyLightImage,
      darkImage: bodyDarkImage,
    } = req.body;

    const files = req.files || {};

    // Find existing data
    const existing = await Home.findOne();

    // Decide final image values
    const finalLightImage =
      files?.lightImage?.[0]?.filename ||
      bodyLightImage ||
      existing?.lightImage ||
      "";

    const finalDarkImage =
      files?.darkImage?.[0]?.filename ||
      bodyDarkImage ||
      existing?.darkImage ||
      "";

    const updatedHome = await Home.findOneAndUpdate(
      {},
      {
        homeHeading,
        homeDescription,
        homeCTA,
        homeCTALink,
        lightImage: finalLightImage,
        darkImage: finalDarkImage,
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Home updated successfully",
      data: updatedHome,
    });
  } catch (error) {
    console.error("updateHome error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAbout = async (req, res) => {
  try {
    const data = await About.findOne();
    if (!data) {
      return res.json({
        success: false,
        message: "No about data found",
      });
    }

    res.json({
      success: true,
      about: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const {
      aboutHeading,
      aboutDescription,
      lightImage: bodyLightImage,
      darkImage: bodyDarkImage,
      counters,
      section3Title,
      section3Content,
      section3LightImg: bodySection3LightImg,
      section3DarkImg: bodySection3DarkImg,
    } = req.body;

    const files = req.files || {};

    const existing = await About.findOne();

    const finalLightImage =
      files?.lightImage?.[0]?.filename ||
      bodyLightImage ||
      existing?.lightImage ||
      "";

    const finalDarkImage =
      files?.darkImage?.[0]?.filename ||
      bodyDarkImage ||
      existing?.darkImage ||
      "";

    const finalSection3LightImg =
      files?.section3LightImg?.[0]?.filename ||
      bodySection3LightImg ||
      existing?.section3LightImg ||
      "";

    const finalSection3DarkImg =
      files?.section3DarkImg?.[0]?.filename ||
      bodySection3DarkImg ||
      existing?.section3DarkImg ||
      "";

    // FIXED: await the existing document

    if (files?.lightImage?.[0]) {
      await saveToGallery({
        file: files.lightImage[0],
        title: "About Light Image",
        category: "about",
      });
    }

    if (files?.darkImage?.[0]) {
      await saveToGallery({
        file: files.darkImage[0],
        title: "About Dark Image",
        category: "about",
      });
    }

    if (files?.section3LightImg?.[0]) {
      await saveToGallery({
        file: files.section3LightImg[0],
        title: "About Section 3 Light",
        category: "about",
      });
    }

    if (files?.section3DarkImg?.[0]) {
      await saveToGallery({
        file: files.section3DarkImg[0],
        title: "About Section 3 Dark",
        category: "about",
      });
    }

    const updatedData = {
      aboutHeading,
      aboutDescription,
      counters: counters ? JSON.parse(counters) : existing?.counters,
      section3Title,
      section3Content,

      // Proper image fallback logic
      lightImage: finalLightImage,
      darkImage: finalDarkImage,
      section3LightImg: finalSection3LightImg,
      section3DarkImg: finalSection3DarkImg,
    };

    const updatedAbout = await About.findOneAndUpdate({}, updatedData, {
      upsert: true,
      new: true,
    });

    res.json({
      success: true,
      message: "About page updated successfully",
      about: updatedAbout,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const data = await Profile.findOne();
    if (!data) {
      return res.json({ success: false, message: "No Profile data found" });
    }

    res.json({
      success: true,
      profile: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      profileName,
      designation,
      aboutme,
      aboutLink,
      profileImg: bodyProfileImg,
    } = req.body;

    const files = req.files || {};

    const existing = await Profile.findOne();
    const finalProfileImg =
      files?.profileImg?.[0]?.filename ||
      bodyProfileImg ||
      existing?.profileImg ||
      "";

    const updatedData = {
      profileName,
      designation,
      aboutme,
      aboutLink,
      profileImg: finalProfileImg,
    };

    const updateProfile = await Profile.findOneAndUpdate({}, updatedData, {
      upsert: true,
      new: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updateProfile,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addTechnology = async (req, res) => {
  try {
    const { techName, techImg: bodyTechImg } = req.body;

    // For single uploaded file use req.file instead of req.files
    const techImg = req.file?.filename || bodyTechImg;

    // Validate required fields
    if (!techName || techName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Technology name is required",
      });
    }

    if (!techImg) {
      return res.status(400).json({
        success: false,
        message: "Technology image is required",
      });
    }

    // Save to database
    const technology = await Technology.create({
      techImg,
      techName,
    });

    return res.status(201).json({
      success: true,
      message: "Technology created successfully",
      data: technology,
    });
  } catch (error) {
    console.error("Error adding technology:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const editTechnology = async (req, res) => {
  try {
    const { id } = req.params; // Fix: req.params not req.parse
    const { techName, techImg: bodyTechImg } = req.body;

    const techImg = req.file?.filename || bodyTechImg;
    const newImage = techImg || null;
    // Check if record exists
    const existingTech = await Technology.findById(id);
    if (!existingTech) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    existingTech.techName = techName || existingTech.techName;

    // Only replace image if user uploaded a new one
    if (newImage) {
      existingTech.techImg = newImage;
    }

    await existingTech.save();

    return res.json({
      success: true,
      message: "Technology updated successfully",
      data: existingTech,
    });
  } catch (error) {
    console.error("Error editing technology:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTechnology = async (req, res) => {
  try {
    const { id } = req.params;

    const tech = await Technology.findById(id);

    if (!tech) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    // Delete image from uploads folder if exists
    if (tech.techImg) {
      const filePath = path.join("uploads/tech", tech.techImg);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Technology.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting technology:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTechnology = async (req, res) => {
  try {
    const data = await Technology.find();
    if (!data) {
      return res.json({ success: false, message: "No Tech data found" });
    }

    res.json({
      success: true,
      technology: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTechnologyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format before querying DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Technology ID",
      });
    }

    const data = await Technology.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Technology found",
      technology: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
