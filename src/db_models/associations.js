const User = require("./userModel");
const Contact = require("./contactModel");
const SpamStatus = require("./spamStatusModel");

const associations = function (){
  User.hasMany(Contact, { foreignKey: "userId" });
  Contact.belongsTo(User, { foreignKey: "userId" });

  User.hasOne(SpamStatus, {
    foreignKey: "userId",
    constraints: false, 
  });
  Contact.hasOne(SpamStatus, {
    foreignKey: "contactId",
    constraints: false, 
  });
  SpamStatus.belongsTo(User, { foreignKey: "userId", constraints: false }); 
  SpamStatus.belongsTo(Contact, { foreignKey: "contactId", constraints: false }); 
};
module.exports = {
  associations
};