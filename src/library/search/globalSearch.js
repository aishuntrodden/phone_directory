const { findUserByQuery, findContactByQuery } = require("../db_queries");
const SpamStatus = require("../../db_models/spamStatusModel");

async function search() {
  try {
    const queryParams = {
      include: {
        model: SpamStatus,
        attributes: ["spam", "phoneNumber"],
      },
    };
    const users = await findUserByQuery(queryParams);
    const contacts = await findContactByQuery(queryParams);
    return [...users, ...contacts];
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  search,
};
