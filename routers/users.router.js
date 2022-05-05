const controller = require('../controllers/');
const usersRouter = require('express').Router();

usersRouter.get('/', controller.users.getUsers);

usersRouter.get('/:id', controller.users.getUserById);

usersRouter.post('/', controller.users.postUser);

module.exports = usersRouter;
