const {getAllReadouts,
    getReadoutById,
    getReadoutByDate,
    getReadoutByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts} = require('../../models/sensors.model');
function httpGetAllReadouts(req, res){
    return res.status(200).json(getAllReadouts());
}

function httpGetReadoutById(req, res){}

function httpGetReadoutByDate(req, res){}

function httpGetReadoutByTime(req, res){}

function httpNewReadouts(req,res){}

function httpDeleteReadout(req, res){}

function httpDeleteAllReadouts(req, res){}

module.exports = {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutByDate,
    httpGetReadoutByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
}
