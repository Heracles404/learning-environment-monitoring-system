const express = require('express');
const {httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutByDate,
    httpGetReadoutByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts} = require('./sensors.controller');

const  sensorsRouter = express.Router();

sensorsRouter.get('/', httpGetAllReadouts);
sensorsRouter.get('/:id', httpGetReadoutById);
sensorsRouter.get('/:date', httpGetReadoutByDate);
sensorsRouter.get('./:time', httpGetReadoutByTime);

sensorsRouter.post('/', httpNewReadouts);

sensorsRouter.delete('/:id', httpDeleteReadout);
sensorsRouter.delete('/', httpDeleteAllReadouts);

module.exports = sensorsRouter;