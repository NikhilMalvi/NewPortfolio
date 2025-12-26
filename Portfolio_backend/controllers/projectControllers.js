import mongoose from "mongoose";
import { Project, Skill } from "../models/project.js";
import { saveToGallery } from "./galleryControllers.js";

export const addSkill = async (req, res) => {
  try {
    let { skillName, skillSlug, parentSkill } = req.body;

    // Normalize formatting

    // trim() → remove extra spaces

    // .toLowerCase() → convert to lowercase

    // .replace(/\s+/g, "-") → replace all spaces with -

    skillName = skillName?.trim();
    skillSlug = skillSlug?.trim().toLowerCase().replace(/\s+/g, "-");
    parentSkill = parentSkill?.trim() || "none";

    // Validate empty fields
    if (!skillName || !skillSlug) {
      return res.status(400).json({
        success: false,
        message: "Skill Name and Slug cannot be empty",
      });
    }

    // Validate self parenting
    if (parentSkill === skillName) {
      return res.status(400).json({
        success: false,
        message: "A skill cannot be its own parent",
      });
    }

    // Check if skill already exists

    // $or tells MongoDB: "Find a document where EITHER the first condition OR second condition matches."

    // What does the RegExp part mean?

    // This creates a regular expression to compare skill names in a smarter way.

    // Symbol	Meaning
    // ^	    Match from start
    // $	    Match end
    // "i"	  Case-insensitive

    const existSkill = await Skill.findOne({
      $or: [
        { skillName: new RegExp(`^${skillName}$`, "i") },
        { skillSlug: skillSlug },
      ],
    });

    if (existSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({
      skillName,
      skillSlug,
      parentSkill,
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const editSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    let { skillName, skillSlug, parentSkill } = req.body;

    // Normalize values
    skillName = skillName?.trim();
    skillSlug = skillSlug?.trim().toLowerCase().replace(/\s+/g, "-");
    parentSkill = parentSkill?.trim() || "none";

    // Find skill
    const existing = await Skill.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Prevent duplicate skill name or slug
    const duplicateCheck = await Skill.findOne({
      _id: { $ne: id }, // exclude current ID
      $or: [
        { skillName: new RegExp(`^${skillName}$`, "i") },
        { skillSlug: skillSlug },
      ],
    });

    if (duplicateCheck) {
      return res.status(409).json({
        success: false,
        message: "A skill with this name or slug already exists",
      });
    }

    // Validate name
    if (!skillName || !skillSlug) {
      return res.status(400).json({
        success: false,
        message: "Skill name or slug cannot be empty",
      });
    }

    // Prevent self-parenting
    if (parentSkill === skillName) {
      return res.status(400).json({
        success: false,
        message: "A skill cannot be its own parent",
      });
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(skillSlug)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid slug format. Only lowercase letters, numbers, and single hyphens allowed (e.g. react-js).",
      });
    }

    // Update fields
    existing.skillName = skillName;
    existing.skillSlug = skillSlug;
    existing.parentSkill = parentSkill;

    await existing.save();

    return res.json({
      success: true,
      message: "Skill updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Error editing skill:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Skill ID",
      });
    }

    const data = await Skill.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill found",
      skill: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    //     // 🚨 Check if skill is referenced in projects
    // const projectUsingSkill = await Project.findOne({ projectSkills: id });

    // if (projectUsingSkill) {
    //   return res.status(409).json({
    //     success: false,
    //     message: `Cannot delete. This skill is used in project: ${projectUsingSkill.projectTitle}`,
    //   });
    // }

    await Skill.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Skill:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSkill = async (req, res) => {
  try {
    const data = await Skill.find();

    if (!data) {
      return res.json({ success: false, message: "No Skill data found" });
    }

    res.json({
      success: true,
      skill: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addProject = async (req, res) => {
  try {
    const {
      projectTitle,
      projectDescription,
      projectTools,
      projectSkills,
      projectWebsite,
      projectLocation,
      projectImageUrl,
    } = req.body;

    // const projectImage = req.file?.filename;

    // const projectImage = req.file?.filename || bodyProjectImage;

    if (!projectImageUrl || typeof projectImageUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    // Validation
    if (
      !projectTitle?.trim() ||
      !projectDescription?.trim() ||
      !projectTools?.trim() ||
      !projectWebsite?.trim() ||
      !projectLocation?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // if (!projectImage) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Project image is required",
    //   });
    // }

    // 🧠 Convert skills into array
    let parsedSkills = [];

    if (Array.isArray(projectSkills)) {
      parsedSkills = projectSkills;
    } else if (typeof projectSkills === "string") {
      try {
        // Try parsing JSON formatted string
        parsedSkills = JSON.parse(projectSkills);
      } catch {
        // Or fallback to comma-separated format
        parsedSkills = projectSkills.split(",").map((s) => s.trim());
      }
    }

    // 🚨 Ensure valid ObjectIds
    parsedSkills = parsedSkills.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));

    if (parsedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid skill must be selected",
      });
    }

    // Create project
    const project = await Project.create({
      projectTitle,
      projectDescription,
      projectTools,
      projectSkills: parsedSkills,
      projectWebsite,
      projectLocation,
      projectImageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectTitle,
      projectDescription,
      projectTools,
      projectSkills,
      projectWebsite,
      projectLocation,
      projectImageUrl,
    } = req.body;

    // const projectImage = req.file?.filename || bodyProjectImage;

    // Find project
    const existing = await Project.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    // Update fields
    existing.projectTitle = projectTitle || existing.projectTitle;
    existing.projectDescription =
      projectDescription || existing.projectDescription;
    existing.projectTools = projectTools || existing.projectTools;
    existing.projectWebsite = projectWebsite || existing.projectWebsite;
    existing.projectLocation = projectLocation || existing.projectLocation;
    if (projectSkills) {
      let parsedSkills = [];

      if (Array.isArray(projectSkills)) {
        parsedSkills = projectSkills;
      } else if (typeof projectSkills === "string") {
        try {
          parsedSkills = JSON.parse(projectSkills);
        } catch {
          parsedSkills = projectSkills.split(",").map((s) => s.trim());
        }
      }

      // Safe filtering
      parsedSkills = parsedSkills.filter(
        (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
      );

      existing.projectSkills = parsedSkills;
    }

    existing.projectImageUrl = projectImageUrl || existing.projectImageUrl;

    // if (projectImageUrl) {
    //   await saveToGallery({
    //     file: req.file,
    //     title: projectTitle || existing.projectTitle,
    //     category: "project",
    //   });

    //   existing.projectImageUrl = projectImageUrl;
    // }
    await existing.save();

    return res.json({
      success: true,
      message: "Project updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Error editing project:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    await Project.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    const data = await Project.findById(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Project No  data found" });
    }

    res.status(200).json({
      success: true,
      message: "Project found",
      project: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllProject = async (req, res) => {
  try {
    const data = await Project.find().populate("projectSkills");

    if (!data) {
      return res.json({ success: false, message: "No Project data found" });
    }

    res.json({
      success: true,
      project: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const numberOfProjects = async (req, res) => {
  try {
    const count = await Project.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Total number of projects",
      totalProjects: count,
    });
  } catch (error) {
    console.error("Error getting project count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
