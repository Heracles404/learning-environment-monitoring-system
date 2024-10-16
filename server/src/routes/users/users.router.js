const express = require('express');
const {httpGetAllUsers, httpAddNewUser, httpDeleteUser} = require('./users.controller');

const  usersRouter = express.Router();

usersRouter.get('/', httpGetAllUsers);
usersRouter.post('/', httpAddNewUser);
usersRouter.delete('/:id', httpDeleteUser);

module.exports = usersRouter;