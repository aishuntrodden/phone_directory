const User = require("../db_models/userModel");
const SpamStatus = require("../db_models/spamStatusModel");
const Contact = require("../db_models/contactModel");

const createUser = async function (data) {
  try {
    const newUser = await User.create(data);
    return newUser;
  } catch (error) {
    throw new Error(error.errors[0].message);
  }
};

const findUserByPhoneNumber = async function (phoneNumber) {
  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findContactByPhoneNumber = async function (phoneNumber) {
  try {
    const contact = await Contact.findOne({ where: { phoneNumber } });
    if (!contact) {
      return null;
    }
    return contact;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setSpamStatus = async function (data) {
  try {
    const spamStatus = await SpamStatus.create(data);
    return spamStatus;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUsersWithSpamDetails = async function () {
  try {
    const user = await User.findAll({
      include: {
        model: SpamStatus,
        attributes: ["spam", "phoneNumber"],
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const findUserByQuery = async function (queryParams) {
  try {
    const users = await User.findAll(queryParams);
    return users;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const findContactByQuery = async function (queryParams) {
  try {
    const contacts = Contact.findAll(queryParams);
    return contacts;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  findUserByPhoneNumber,
  findContactByPhoneNumber,
  setSpamStatus,
  findUsersWithSpamDetails,
  findUserByQuery,
  findContactByQuery,
};
