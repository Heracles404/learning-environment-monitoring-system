const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');

const usersRouter = require('./routes/users/users.router');
const sensorsRouter = require('./routes/sensors/sensors.router');
const vogRouter = require('./routes/vog/vog.router');
const devicesRouter = require('./routes/devices/device.router');

const app = express();

connectDB();

app.use(cors({
    origin: ["http://localhost:3000"],
}));

app.use(express.json());


app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);
app.use('/vog', vogRouter)
app.use('/devices', devicesRouter);

module.exports = app;

