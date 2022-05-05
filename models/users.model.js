const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: { required: [true, 'Please input first name'], type: 'string' },
  lastName: { required: [true, 'Please input last name'], type: 'string' },
  password: { required: [true, 'Please input password'], type: 'string' },
  email: { required: [true, 'Please input email'], type: 'string' },
});

module.exports = mongoose.model('User', userSchema);
