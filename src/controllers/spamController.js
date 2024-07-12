const logger = require("../configuration/loggerConfig");
const db_queries = require("../library/db_queries");

exports.setSpam = async (req, res) => {
  const { phoneNumber, spam } = req.body;
  var setSpamStatus;
  try {
    const user = await db_queries.findUserByPhoneNumber(phoneNumber);
    if (user) {
      setSpamStatus = await db_queries.setSpamStatus({
        spam: spam,
        userId: user.id,
        phoneNumber: phoneNumber,
      });
      return res.status(201).json(setSpamStatus);
    }

    const contact = await db_queries.findContactByPhoneNumber(phoneNumber);
    if (contact) {
      setSpamStatus = await db_queries.setSpamStatus({
        spam: spam,
        contactId: contact.id,
        phoneNumber: phoneNumber,
      });
      return res.status(201).json(setSpamStatus);
    }
    setSpamStatus = await db_queries.setSpamStatus({
      spam: spam,
      phoneNumber: phoneNumber,
    });

    return res
      .status(200)
      .json({ message: "Contact spam status updated", setSpamStatus });
  } catch (error) {
    logger.error(`url: ${req.url}   error :${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
