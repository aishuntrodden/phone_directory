const { Sequelize } = require("sequelize");

// For deployed version use this
const sequelize = new Sequelize(process.env.DEPLOYED_DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // This will enable SSL connection
      rejectUnauthorized: false, // This will allow you to connect to a server with a self-signed certificate
    },
  },
});

// For local database use this
// const sequelize = new Sequelize(process.env.LOCAL_DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,
//   dialectOptions: {
//   },
// });

module.exports = {sequelize};