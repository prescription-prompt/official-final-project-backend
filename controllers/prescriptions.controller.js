const Prescription = require('../models/prescriptions.model');
const User = require('../models/users.model');
const ObjectId = require('mongoose').Types.ObjectId;

exports.postPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.create({
      name: req.body.name,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      firstPromptTime: req.body.firstPromptTime,
      notes: req.body.notes,
      userId: req.body.userId,
      amount: req.body.amount,
    });
    res.status(201).json({ prescription });
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

exports.deletePrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPrescription = await Prescription.deleteOne({ _id: id });
    res.status(204).json(deletedPrescription);
  } catch (err) {
    next(err);
  }
};
