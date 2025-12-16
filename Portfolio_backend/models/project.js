import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, require: true },
    skillSlug: { type: String, require: true },
    parentSkill: { type: String, default: "none" },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    projectImage: { type: String, require: true },
    projectTitle: { type: String, require: true },
    projectDescription: { type: String, require: true },
    projectTools: { type: String, require: true },
    projectSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    projectWebsite: { type: String, require: true },
    projectLocation: { type: String, require: true },
  },

  { timestamps: true }
);

export const Skill = mongoose.model("Skill", skillSchema);

export const Project = mongoose.model("Project", projectSchema);
