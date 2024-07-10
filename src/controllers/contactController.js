const Contact = require("../db_models/contactModel.js");

exports.createContact = async (req, res) => {
  try {
    const { name, phoneNumber, userId,isSpam } = req.body;
    const newContact = await Contact.create({ name, phoneNumber, userId,isSpam });
    console.log("Contact created Successfully", newContact);
    res.status(201).json(newContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.setSpam = async (req, res) => {
  const { phoneNumber, isSpam } = req.body;

  try {
    const contact = await Contact.findOne({
      where: { phoneNumber },
    });

    if (!contact) {
      return res.status(401).json({ error: "Contact not found" });
    }
    if (isSpam == undefined) {
      return res
        .status(500)
        .json({ error: "Spam status not defined in Input." });
    }
    contact.isSpam = isSpam;

    await contact.save();

    return res
      .status(200)
      .json({ message: "Contact spam status updated", contact });
  } catch (error) {
    console.error("Error reporting spam:", error);
    res.status(500).json({ error: "Server error" });
  }
};
