require("dotenv").config();
const express = require("express");
const db = require("./configuration/postgres_db").sequelize;
// databse model imports
const User = require("./db_models/userModel");
const Contact = require("./db_models/contactModel");
// bodyparser from middleware
const parserMiddleware = require("./middleware/parser");
// api endpoint routes import
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const spamRoutes = require("./routes/spamRouts");
const searchRoutes = require("./routes/searchRoutes");

const tokenVerification = require("./middleware/authVerify");
const SpamStatus = require("./db_models/spamStatusModel");
const Associations = require("./db_models/associations");

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(parserMiddleware);

app.use("/user", userRoutes);
app.use("/contact", tokenVerification, contactRoutes);
app.use("/spam", tokenVerification, spamRoutes);
app.use("/search", tokenVerification, searchRoutes);

db.authenticate()
  .then(async () => {
    await User.sync({ alter: true });
    await Contact.sync({ alter: true });
    await SpamStatus.sync({ alter: true });
    Associations.associations();
  })
  .then(() => {
    console.log("Database connection successful");
    console.log("Models synchronized successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
