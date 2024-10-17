const express = require('express');
const {httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts} = require('./sensors.controller');

const  sensorsRouter = express.Router();

sensorsRouter.get('/', httpGetAllReadouts);
sensorsRouter.get('/:id', httpGetReadoutById);
sensorsRouter.get('/date/date', httpGetReadoutsByDate);
sensorsRouter.get('/time/:time', httpGetReadoutsByTime);

sensorsRouter.post('/', httpNewReadouts);

sensorsRouter.delete('/:id', httpDeleteReadout);
sensorsRouter.delete('/', httpDeleteAllReadouts);

module.exports = sensorsRouter;