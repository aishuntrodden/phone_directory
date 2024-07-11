const { DataTypes } = require("sequelize");
const db = require("../configuration/postgres_db").sequelize;
const User = require("./userModel");
const Contact = require("./contactModel");

const SpamStatus = db.define("SpamStatus", {
  spam: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 10]
    },
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Contact,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
});

// SpamStatus.belongsTo(User, { foreignKey: 'userId' });
// SpamStatus.belongsTo(Contact, { foreignKey: 'contactId' });

module.exports = SpamStatus;
