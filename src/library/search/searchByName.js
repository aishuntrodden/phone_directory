const { Op } = require("sequelize");
const { findUserByQuery, findContactByQuery } = require("../db_queries");
const SpamStatus = require("../../db_models/spamStatusModel");

async function findExactMatchesByName(name) {
  try {
    const queryOptions = {
      where: {
        name: {
          [Op.eq]: name,
        },
      },
      attributes: ["name", "phoneNumber"],
      include: {
        model: SpamStatus,
        attributes: ["spam"],
      },
    };

    const getUsers = await findUserByQuery(queryOptions);

    const getContacts = await findContactByQuery(queryOptions);

    const [users, contacts] = await Promise.all([getUsers, getContacts]);

    const exactMatches = [...users, ...contacts];

    return exactMatches;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findStartingWithMatches(name) {
  try {
    const queryOptions = {
      where: {
        [Op.and]: [
          { name: { [Op.ne]: name } }, // Exclude exact match
          { name: { [Op.startsWith]: name } },
        ],
      },
      attributes: ["name", "phoneNumber"],
      include: {
        model: SpamStatus,
        attributes: ["spam"],
      },
    };

    const getUsers = await findUserByQuery(queryOptions);

    const getContacts = await findContactByQuery(queryOptions);

    const [users, contacts] = await Promise.all([getUsers, getContacts]);

    const startingWithMatches = [...users, ...contacts];

    return startingWithMatches;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findContainsMatches(name) {
  try {
    const queryOptions = {
      where: {
        [Op.and]: [
          {
            [Op.not]: [
              { name: { [Op.like]: name } }, // Exclude exact match
              { name: { [Op.like]: `${name}%` } }, // Exclude names starting with 'name'
            ],
          },
          { name: { [Op.like]: `%${name}%` } }, // Must contain 'name' anywhere in the string
        ],
      },
      attributes: ["name", "phoneNumber"],
      include: {
        model: SpamStatus,
        attributes: ["spam"],
      },
    };

    const getUsers = await findUserByQuery(queryOptions);

    const getContacts = await findContactByQuery(queryOptions);

    const [users, contacts] = await Promise.all([getUsers, getContacts]);

    const containsMatches = [...users, ...contacts];

    return containsMatches;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function search(name) {
  try {
    const exactMatches = await findExactMatchesByName(name);
    const startingWithMatches = await findStartingWithMatches(name);
    const containsMatches = await findContainsMatches(name);

    const combinedResults = [
      ...exactMatches,
      ...startingWithMatches.filter(
        (item) => !exactMatches.find((exact) => exact.name === item.name)
      ),
      ...containsMatches.filter(
        (item) =>
          !exactMatches.find((exact) => exact.name === item.name) &&
          !startingWithMatches.find(
            (startsWith) => startsWith.name === item.name
          )
      ),
    ];

    return combinedResults;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  search
};
