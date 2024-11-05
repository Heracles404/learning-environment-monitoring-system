const express = require('express');
const {httpGetAllUsers,
    httpAddNewUser,
    httpDeleteUser,
    httpGetUser,
    httpUpdateUser,
    httpAuthenticateUser
} = require('./users.controller');

const  usersRouter = express.Router();

usersRouter.get('/', httpGetAllUsers);
usersRouter.get('/:userName', httpGetUser);
usersRouter.post('/authenticate', httpAuthenticateUser);
usersRouter.post('/', httpAddNewUser);
usersRouter.delete('/:userName', httpDeleteUser);
usersRouter.patch('/:userName', httpUpdateUser)

module.exports = usersRouter;