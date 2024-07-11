const db_queries = require("../library/db_queries");
const Search = require("../library/search/searchByName");

exports.globalSearch = async (req, res) => {
  try {
    const users = await db_queries.findUsersWithSpamDetails();
    res.status(201).json({ message: "All User details", users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchByName = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Search.searchByName(name);
    res.status(201).json({ message: "List", list: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
