import express from "express";
import { protect } from "../middleware/auth.js";
import { adminLogin } from "../controllers/adminControllers.js";

const adminRouter = express.Router();

adminRouter.post("/logIn", adminLogin);

export default adminRouter;
