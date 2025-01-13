const express = require('express');
const {httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByClassroom,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
} = require('./sensors.controller');

const  sensorsRouter = express.Router();

sensorsRouter.get('/', httpGetAllReadouts);
sensorsRouter.get('/:id', httpGetReadoutById);
sensorsRouter.get('/date/date', httpGetReadoutsByDate);
sensorsRouter.get('/time/:time', httpGetReadoutsByTime);
sensorsRouter.get('/classroom/:classroom', httpGetReadoutsByClassroom);

sensorsRouter.post('/', httpNewReadouts);

sensorsRouter.delete('/:id', httpDeleteReadout);
sensorsRouter.delete('/', httpDeleteAllReadouts);

module.exports = sensorsRouter;