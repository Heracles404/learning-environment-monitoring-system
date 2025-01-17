const express = require('express');
const {httpNewDevice, httpGetAllDevices, httpGetDeviceById, httpGetActive, httpGetInactive, httpGetDeviceByClassroom,
    httpDeleteDevice, httpUpdateDevice, httpUpdateDeviceByClassroom
} = require('./device.controller');

const  deviceRouter = express.Router();

deviceRouter.get('/', httpGetAllDevices);
deviceRouter.get('/getActive', httpGetActive);
deviceRouter.get('/getInactive', httpGetInactive);
deviceRouter.get('/:id', httpGetDeviceById);
deviceRouter.get('/classroom/:classroom', httpGetDeviceByClassroom);

deviceRouter.delete('/:id', httpDeleteDevice);
deviceRouter.patch('/:id', httpUpdateDevice);
deviceRouter.patch('/classroom/:classroom', httpUpdateDeviceByClassroom);


deviceRouter.post('/', httpNewDevice);

module.exports = deviceRouter;