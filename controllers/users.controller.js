const User = require('../models/users.model');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
    });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const validUrl =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!validUrl.test(email)) {
      throw {
        status: 400,
        msg: `Invalid request`,
      };
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      throw {
        status: 404,
        msg: `No user with ${email} found in the database`,
      };
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
