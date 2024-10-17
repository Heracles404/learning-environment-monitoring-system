const {existsId,
    getAllReadouts,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts} = require('../../models/sensors.model');
function httpGetAllReadouts(req, res){
    return res.status(200).json(getAllReadouts());
}

function httpGetReadoutById(req, res){
    const readoutId = Number(req.params.id);

    if (isNaN(readoutId)) {
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if(existsId(readoutId)){
        return res.status(200).json(getReadoutById(readoutId));
    }else {
        return res.status(404).json({
            message: 'Readout not found...'
        });
    }
}


function httpGetReadoutsByDate(req, res) {
    const { startDate, endDate } = req.query; // Extract startDate and endDate from query parameters

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Both startDate and endDate are required.' });
    }

    const readoutsInRange = getReadoutsByDate(startDate, endDate);

    if (readoutsInRange.length > 0) {
        res.status(200).json(readoutsInRange);
    } else {
        res.status(404).json({ message: 'No readouts found for the specified date range.' });
    }
}

function httpGetReadoutsByTime(req, res) {
    const time = req.params.time; // Extract the 'time' parameter from the request
    const readoutsAtTime = getReadoutsByTime(time); // Use the function to get readouts for the specified time

    if (readoutsAtTime.length > 0) {
        res.status(200).json(readoutsAtTime);
    } else {
        res.status(404).json({ message: 'No readouts found for the specified time.' });
    }
}


function httpNewReadouts(req,res){
    const sensors = [
        'temperature',
        'humidity',
        'lighting',
        'headCount',
        'oxygen',
        'carbonDioxide',
        'sulfurDioxide',
        'particulateMatter'
    ];

    const readout = req.body;

    const badSensorParameters = sensors.filter(attr => !readout[attr]);

    if (badSensorParameters.length > 0){
        return res.status(400).json({
           error: 'Bad Sensor Parameters: ' + badSensorParameters.join(', ')
        });
    }

    newReadouts(readout);
    return res.status(201).json({
        message: 'New record inserted...',
        readout
    });
}

function httpDeleteReadout(req, res){
    const readoutId = Number(req.params.id);
    if (isNaN(readoutId)) {
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if(existsId(readoutId)){
        deleteReadout(readoutId);
        return res.status(201).json('Deleted');
    }else {
        return res.status(404).json({
            message: 'Readout not found...'
        });
    }
}

function httpDeleteAllReadouts(req, res){
    deleteAllReadouts();
    return res.status(201).json('All Records Deleted');
}

module.exports = {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
}
