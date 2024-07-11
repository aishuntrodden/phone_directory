const { Op } = require('sequelize');
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
          attributes: ['spam', 'phoneNumber']
        },
      });
  
      return user;
    } catch (error) {
        console.log(error)
      throw new Error(error.message);
    }
  };

  const searchUsersByName = async function (name) {
    try {
      const usersStartWithName = await User.findAll({
        where: {
          name: {
            [Op.iLike]: `${name}%`  
          }
        },
        include: {
          model: SpamStatus,
          attributes: ['spam', 'phoneNumber']
        },
      });
  
      const usersContainName = await User.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`  
          },
          id: {
            [Op.notIn]: usersStartWithName.map(user => user.id)  
          }
        },
        include: {
          model: SpamStatus,
          attributes: ['spam', 'phoneNumber']
        },
      });
  
      const sortedUsers = [...usersStartWithName, ...usersContainName];
  
      return sortedUsers;
    } catch (error) {
      throw new Error(error.message);
    }
  };

module.exports = {
  createUser,
  findUserByPhoneNumber,
  findContactByPhoneNumber,
  setSpamStatus,
  findUsersWithSpamDetails,
  searchUsersByName
};
