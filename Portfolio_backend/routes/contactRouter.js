import express from "express";
import {
  deleteContact,
  getAllContacts,
  getContactById,
  numberOfContacts,
  sendContactMessage,
} from "../controllers/contactControllers.js";

const contactRouter = express.Router();

contactRouter.post("/send", sendContactMessage);
contactRouter.get("/all", getAllContacts);
contactRouter.delete("/delete/:id", deleteContact);
contactRouter.get("/count-contacts", numberOfContacts);
contactRouter.get("/:id", getContactById);

export default contactRouter;
