const path = require('path');
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users/users.router');
const sensorsRouter = require('./routes/sensors/sensors.router');
const vogRouter = require('./routes/vog/vog.router');

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
}));

app.use(express.json());


app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);
app.use('/vog', vogRouter)

module.exports = app;
