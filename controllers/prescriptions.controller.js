const Prescription = require('../models/prescriptions.model');
const User = require('../models/users.model');
const ObjectId = require('mongoose').Types.ObjectId;

exports.postPrescription = async (req, res, next) => {
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

exports.getPrescriptionsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    function isValidObjectId(id) {
      if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
      }
      return false;
    }

    if (!isValidObjectId(userId)) {
      throw {
        status: 400,
        msg: `Invalid request`,
      };
    }
    const userExists = await User.exists({ _id: userId });

    if (userExists) {
      const prescriptions = await Prescription.find({ userId: userId });

      res.status(200).json({ prescriptions });
    } else {
      throw {
        status: 404,
        msg: `No user with userId ${userId} found in the database`,
      };
    }
  } catch (err) {
    next(err);
  }
};
