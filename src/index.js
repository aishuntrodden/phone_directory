require("dotenv").config();
const express = require("express");
const db = require("./configuration/postgres_db").sequelize;
// databse model imports
const User = require("./db_models/userModel");
const Contact = require("./db_models/contactModel");
// bodyparser from middleware
const parserMiddleware = require("./middleware/parser");
const SpamStatus = require("./db_models/spamStatusModel");
const Associations = require("./db_models/associations");
const loggerMiddleware = require("./middleware/logger");
const logger = require("./configuration/loggerConfig");
const routes = require("./routes/route");

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(parserMiddleware);
app.use(loggerMiddleware);

app.use(routes);

db.authenticate()
  .then(async () => {
    await User.sync({ alter: true });
    await Contact.sync({ alter: true });
    await SpamStatus.sync({ alter: true });
    Associations.associations();
  })
  .then(() => {
    logger.info("Database connection successful");
    logger.info("Models synchronized successfully");
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });
