const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: { required: [true, 'Please input first name'], type: 'string' },
  lastName: { required: [true, 'Please input last name'], type: 'string' },
  password: { required: [true, 'Please input password'], type: 'string' },
  email: {
    required: [true, 'Please input email'],
    type: 'string',
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
});

module.exports = mongoose.model('User', userSchema);
