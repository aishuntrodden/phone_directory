const { DataTypes } = require("sequelize"); 
const db = require("../configuration/postgres_db").sequelize;

const User = require("./userModel");
const Contact = db.define("Contact", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 10]
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  }
});

// Contact.belongsTo(User, { foreignKey: 'userId' });

module.exports = Contact;