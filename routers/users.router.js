const controller = require('../controllers/');
const usersRouter = require('express').Router();

usersRouter.get('/', controller.users.getUsers);

usersRouter.get('/:email', controller.users.getUserByEmail);

usersRouter.post('/', controller.users.postUser);

module.exports = usersRouter;
