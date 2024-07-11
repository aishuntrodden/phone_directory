const { findUserByQuery, findContactByQuery } = require("../db_queries");
const SpamStatus = require("../../db_models/spamStatusModel");

async function search(phoneNumber) {
  try {
    const queryParams = {
      where: { phoneNumber },
      attributes: ["name", "phoneNumber"],
      include: {
        model: SpamStatus,
        attributes: ["spam"],
      },
    };
    const user = await findUserByQuery(queryParams);
    if (user.length > 0) {
      return [user];
    } else {
      const contacts = await findContactByQuery(queryParams);
      return contacts;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  search,
};
