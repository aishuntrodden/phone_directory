const { Sequelize } = require("sequelize");

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

module.exports = {sequelize};