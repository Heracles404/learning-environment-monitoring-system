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
    const date = req.params.date;

    // Validate the date
    if (!isValidDate(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use MM/DD/YYYY.' });
    }

    const readoutsByDate = getReadoutsByDate(date);

    // Check if any readouts were found
    if (readoutsByDate.length === 0) {
        return res.status(404).json({ error: 'No readouts found for the given date' });
    }

    // Return the found readouts
    return res.status(200).json(readoutsByDate);
}

// Helper function to validate dates in MM/DD/YYYY format
function isValidDate(date) {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(20[0-9]{2})$/; // Matches MM/DD/YYYY
    return regex.test(date);
}
function httpGetReadoutsByTime(req, res){}


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
