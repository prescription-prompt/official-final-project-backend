const mongoose = require('mongoose');
const connectDB = require('../connection');
const dotenv = require('dotenv').config();
const Prescription = require('../../models/prescriptions.model');
const User = require('../../models/users.model');
const savedData = {};

const saveUser = (usersData) => {
  return User.insertMany(usersData);
};

const savePrescription = (prescriptionData) => {
  return Prescription.insertMany(prescriptionData);
};

const seed = async ({ userData, prescriptionData }) => {
  await User.deleteMany({});
  await Prescription.deleteMany({});
  const users = await saveUser(userData);
  savedData.users = users;
  const visits = await savePrescription(prescriptionData);
  savedData.visits = visits;
  return savedData;
};

module.exports = seed;
