
require('dotenv').config()
const express = require('express');
const db = require('./configuration/postgres_db').sequelize;
const User = require('./db_models/user');
const Contact = require('./db_models/contact')
const app = express();
const port = process.env.SERVER_PORT || 3000;

db.authenticate().then(async ()=>{
    await User.sync({ alter: true }); 
    await Contact.sync({ alter: true }); 
})
  .then(() => {
    console.log('Database connection successful');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });