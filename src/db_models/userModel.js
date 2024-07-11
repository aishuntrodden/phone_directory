const { DataTypes } = require("sequelize");
const db = require("../configuration/postgres_db").sequelize;
const bcrypt = require("bcryptjs");

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
      len: [10, 10]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    }
  }
});

User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;