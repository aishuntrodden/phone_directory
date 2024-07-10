const { DataTypes } = require('sequelize');
const db = require('../configuration/postgres_db').sequelize;
const bcrypt = require('bcryptjs');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email format',
        },
      },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashedPassword);
    },
  },
});

module.exports = User;