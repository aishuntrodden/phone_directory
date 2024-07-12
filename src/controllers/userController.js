const jwt = require("jsonwebtoken");
const db_queries = require("../library/db_queries");
const logger = require('../configuration/loggerConfig');

exports.registerUser = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    const newUser = await db_queries.createUser({
      name,
      phoneNumber,
      email,
      password,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`)
    res.status(500).json({ Error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await db_queries.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.dataValues.id },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    logger.error(`url: ${req.url}   error:${error.message}`)
    res.status(500).json({ error: `Login Failed: ${error.message}` });
  }
};

