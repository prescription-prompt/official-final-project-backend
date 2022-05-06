const controller = require('../controllers');
const prescriptionsRouter = require('express').Router();

prescriptionsRouter.get(
  '/:userId',
  controller.prescriptions.getPrescriptionsByUserId
);

prescriptionsRouter.post('/', controller.prescriptions.postPrescription);

prescriptionsRouter.delete(
  '/:id',
  controller.prescriptions.deletePrescriptionById
);

module.exports = prescriptionsRouter;
