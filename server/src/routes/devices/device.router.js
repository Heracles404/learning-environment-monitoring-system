const express = require('express');
const {httpNewDevice, httpGetAllDevices, httpGetDeviceById, httpGetActive, httpGetInactive, httpGetDeviceByClassroom,
    httpDeleteDevice, httpUpdateDevice
} = require('./device.controller');

const  deviceRouter = express.Router();

deviceRouter.get('/', httpGetAllDevices);
deviceRouter.get('/getActive', httpGetActive);
deviceRouter.get('/getInactive', httpGetInactive);
deviceRouter.get('/:id', httpGetDeviceById);
deviceRouter.get('/classroom/:classroom', httpGetDeviceByClassroom);

deviceRouter.delete('/delete/:id', httpDeleteDevice);
deviceRouter.patch('/update/:id', httpUpdateDevice);

deviceRouter.post('/', httpNewDevice);

module.exports = deviceRouter;