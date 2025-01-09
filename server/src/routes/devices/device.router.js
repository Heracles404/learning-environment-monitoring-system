const express = require('express');
const {httpNewDevice, httpGetAllDevices, httpGetDeviceById, httpGetActive} = require('./device.controller');

const  deviceRouter = express.Router();

deviceRouter.get('/', httpGetAllDevices);
deviceRouter.get('/getActive', httpGetActive);
deviceRouter.get('/:id', httpGetDeviceById);

deviceRouter.post('/', httpNewDevice);

module.exports = deviceRouter;