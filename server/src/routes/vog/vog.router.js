const express = require('express');
const {httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts} = require('./vog.controller');

const  vogRouter = express.Router();

vogRouter.get('/', httpGetAllReadouts);
vogRouter.get('/:id', httpGetReadoutById);
vogRouter.get('/date/date', httpGetReadoutsByDate);
vogRouter.get('/time/:time', httpGetReadoutsByTime);

vogRouter.post('/', httpNewReadouts);

vogRouter.delete('/:id', httpDeleteReadout);
vogRouter.delete('/', httpDeleteAllReadouts);

module.exports = vogRouter;