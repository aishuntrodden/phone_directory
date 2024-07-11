const User = require('../db_models/userModel');


const searchByPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;
  
    try {
      // Search registered users by phone number
      const registeredUser = await User.findOne({
        where: { phoneNumber },
        attributes: ['name', 'phoneNumber', 'email']
      });
  
      if (registeredUser) {
        const result = {
          name: registeredUser.name,
          phoneNumber: registeredUser.phoneNumber,
          spamLikelihood: calculateSpamLikelihood(registeredUser.phoneNumber),
          email: registeredUser.email
        };
        return res.status(200).json(result);
      }
  
      // Search contacts by phone number
      const contacts = await Contact.findAll({
        where: { phoneNumber },
        attributes: ['name', 'phoneNumber']
      });
  
      const searchResults = contacts.map(contact => ({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        spamLikelihood: calculateSpamLikelihood(contact.phoneNumber)
      }));
  
      res.status(200).json(searchResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };