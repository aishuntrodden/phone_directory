const jwt = require('jsonwebtoken');
const User = require('../db_models/userModel');

exports.registerUser = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    const newUser = await User.create({ name, phoneNumber, email, password });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Login Failed" });
  }
};
