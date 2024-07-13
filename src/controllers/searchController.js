const logger = require("../configuration/loggerConfig");
const globalSearch = require("../library/search/globalSearch");
const SearchByName = require("../library/search/searchByName");
const searchByPhone = require("../library/search/searchByPhone");

exports.globalSearch = async (req, res) => {
  try {
    const result = await globalSearch.search();
    res.status(201).json({ message: "All User details", result: result });
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.SearchByName = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await SearchByName.search(name);
    res.status(201).json({ message: "List", list: result });
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.searchByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await searchByPhone.search(phoneNumber);
    res.status(201).json({ message: "List", list: result });
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
