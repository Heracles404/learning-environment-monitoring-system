const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');

const usersRouter = require('./routes/users/users.router');
const sensorsRouter = require('./routes/sensors/sensors.router');
const vogRouter = require('./routes/vog/vog.router');
const devicesRouter = require('./routes/devices/device.router');
const {startDeviceStatusScheduler} = require("./scheduler/scheduler");

const app = express();

connectDB();

// startDeviceStatusScheduler();

app.use(cors({
    // origin: ["http://localhost:3000"],
    origin: '*',
}));

app.use(express.json());


app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);
app.use('/vog', vogRouter)
app.use('/devices', devicesRouter);

module.exports = app;

