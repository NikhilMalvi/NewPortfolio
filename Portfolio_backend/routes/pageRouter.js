import express from "express";
import {
  addTechnology,
  deleteTechnology,
  editTechnology,
  getAbout,
  getAllTechnology,
  getHome,
  getProfile,
  getTechnologyById,
  updateAbout,
  updateHome,
  updateProfile,
} from "../controllers/pagesControllers.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import { numberOfProjects } from "../controllers/projectControllers.js";

const pageRouter = express.Router();

/* -------- Home Routes -------- */
pageRouter.get("/home/all", getHome);

pageRouter.put("/home/update-home", protect, upload.none(), updateHome);

/* -------- About Routes -------- */
pageRouter.get("/about/all", getAbout);

pageRouter.put("/about/update-about", protect, upload.none(), updateAbout);

/* -------- Profile Routes -------- */
pageRouter.get("/profile/all", getProfile);

pageRouter.put(
  "/profile/update-profile",
  protect,
  upload.none(),
  updateProfile
);

/* -------- Technology Routes -------- */
pageRouter.get("/technology/all", getAllTechnology);

pageRouter.post("/technology/add-tech", protect, upload.none(), addTechnology);

pageRouter.put(
  "/technology/edit-tech/:id",
  protect,
  upload.none(),
  editTechnology
);

pageRouter.delete("/technology/delete-tech/:id", protect, deleteTechnology);

pageRouter.get("/technology/:id", protect, getTechnologyById);

export default pageRouter;
