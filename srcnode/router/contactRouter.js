const express = require("express");
const cors = require("cors");
const ContactModel = require("../models/Contact");
const contactRouter = express.Router();

contactRouter.use(cors());
contactRouter.use(express.json());

contactRouter.post("/contact", async (req, res) => {
  console.log("Received contact data:", req.body); // Log the received data to confirm it's reaching the backend

  const { name, email, subject, message } = req.body;

  try {
    const newContact = new ContactModel({ name, email, subject, message });
    await newContact.save(); // Save the contact data

    res.status(201).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error saving contact data:", error);
    res
      .status(500)
      .json({ message: "Error saving message. Please try again." });
  }
});

contactRouter.get("/getcontact", async (req, res) => {
  try {
    const findContact = await ContactModel.find();
    res.json(findContact);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

contactRouter.delete("/contact/:id", async (req, res) => {
  const contactId = req.params.id; // Get the contact ID from the URL

  try {
    // Try to find and delete the contact
    const deletedContact = await ContactModel.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res
      .status(500)
      .json({ message: "Error deleting contact. Please try again." });
  }
});

module.exports = contactRouter;
