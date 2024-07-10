const Contact = require("../db_models/contactModel.js");

exports.createContact = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    let userId = req.userId
    const newContact = await Contact.create({ name, phoneNumber, userId });
    console.log("Contact created Successfully", newContact);
    res.status(201).json(newContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { userId: req.userId } });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
