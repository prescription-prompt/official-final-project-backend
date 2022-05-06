const controller = require('../controllers/');
const usersRouter = require('express').Router();

usersRouter.get('/', controller.users.getUsers);

usersRouter.get('/:email', controller.users.getUserByEmail);

usersRouter.post('/', controller.users.postUser);

usersRouter.get('/user/:id', controller.users.getUserById);

module.exports = usersRouter;
