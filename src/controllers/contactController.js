const Contact = require("../db_models/contactModel.js");
const logger = require('../configuration/loggerConfig');

exports.createContact = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const userId = req.userId;
    const newContact = await Contact.create({ name, phoneNumber, userId });
    console.log("Contact created Successfully", newContact);
    res.status(201).json(newContact);
  } catch (err) {
    logger.error(`url: ${req.url}   error:${error.message}`)
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { userId: req.userId } });
    res.status(201).json(contacts);
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`)
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
