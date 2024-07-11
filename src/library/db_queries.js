const User = require("../db_models/userModel");
const Spam = require("../db_models/spamStatusModel");
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
    const spamStatus = await Spam.create(data);
    return spamStatus;
  } catch (error) {
    throw new Error(error.errors[0].message);
  }
};

module.exports = {
  createUser,
  findUserByPhoneNumber,
  findContactByPhoneNumber,
  setSpamStatus,
};
