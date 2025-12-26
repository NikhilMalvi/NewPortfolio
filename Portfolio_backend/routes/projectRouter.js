import express from "express";
import {
  addProject,
  addSkill,
  deleteProjectById,
  deleteSkillById,
  editProjectById,
  editSkillById,
  getAllProject,
  getAllSkill,
  getProjectById,
  getSkillById,
  numberOfProjects,
} from "../controllers/projectControllers.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const projectRouter = express.Router();

/* ---------------------- PROJECT ROUTES ---------------------- */

// Get all projects
projectRouter.get("/all", getAllProject);

// Add new project
projectRouter.post(
  "/add",
  protect,
  // (req, res, next) => {
  //   req.uploadFolder = "gallery";
  //   next();
  // },
  upload.none(),
  addProject
);

// Edit project
projectRouter.put("/edit-project/:id", protect, upload.none(), editProjectById);

// Delete project
projectRouter.delete("/delete-project/:id", protect, deleteProjectById);
projectRouter.get("/count-projects/", numberOfProjects);

projectRouter.get("/:id", getProjectById);

// Get project by ID

/* ---------------------- SKILL ROUTES ---------------------- */

// Get all skills
projectRouter.get("/skill/all", getAllSkill);

// Add skill
projectRouter.post("/skill/add", protect, addSkill);

// Edit skill
projectRouter.put("/skill/edit-skill/:id", protect, editSkillById);

// Delete skill
projectRouter.delete("/skill/delete-skill/:id", protect, deleteSkillById);

// Get single skill
projectRouter.get("/skill/:id", getSkillById);

export default projectRouter;
