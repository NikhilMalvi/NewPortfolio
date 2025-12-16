import mongoose from "mongoose";
import { Contact } from "../models/contact.js";
import { sendEmail } from "../utils/sendMail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    await sendEmail({
      from: email,
      subject,
      message, // <-- Only message now
      name, // <-- Pass name separately
    });

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.json({
      success: true,
      message: "Message sent successfully ✓ We will reply soon.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    // Implementation for fetching all contacts
    const data = await Contact.find().sort({ createdAt: -1 });

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "No contacts found." });
    }

    res.json({ success: true, contacts: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact ID",
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }
    res.json({ success: true, contact });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }
    res.json({ success: true, message: "Contact deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const numberOfContacts = async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
