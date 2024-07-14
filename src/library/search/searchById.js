const { findUserByQuery, findContactByQuery } = require("../db_queries");
const SpamStatus = require("../../db_models/spamStatusModel");

async function search(LoggedInId, userId, contactId) {
  try {
    let record = null;

    if (userId && contactId) {
      throw new Error("Cannot send both userId and contactId to search.");
    }

    if (userId) {
      record = await findUserByQuery({
        where: {
          id: userId,
        },
        include: {
          model: SpamStatus,
          attributes: ["spam"],
        },
      });
      const loggedInUserDetails = await findUserByQuery({
        where: {
          id: LoggedInId,
        },
        include: {
          model: SpamStatus,
          attributes: ["spam"],
        },
      });
      if (record) {
        const contactFoundInUser = await findContactByQuery({
          where: {
            userId: record[0].dataValues.id,
            phoneNumber: loggedInUserDetails[0].dataValues.phoneNumber,
          },
        });
        if (!contactFoundInUser) {
          delete record.email;
        }
      }
    }

    if (!record && contactId) {
      record = await findContactByQuery({
        where: {
          id: contactId,
        },
        include: [
          {
            model: SpamStatus,
            attributes: ["spam"],
          },
          {
            model: Contact,
            attributes: ["id", "name", "phoneNumber"],
            include: {
              model: SpamStatus,
              attributes: ["spam"],
            },
          },
        ],
      });
    }

    return record;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { search };
