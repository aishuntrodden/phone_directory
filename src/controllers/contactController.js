const Contact = require("../db_models/contactModel.js");

exports.createContact = async (req, res) => {
  try {
    const { name, phoneNumber, userId } = req.body;
    const newContact = await Contact.create({ name, phoneNumber, userId });
    console.log("Contact created Successfully", newContact);
    res.status(201).json(newContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
