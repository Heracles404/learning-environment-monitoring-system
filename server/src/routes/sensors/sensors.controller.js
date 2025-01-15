const {
    existsId,
    getAllReadouts,
    getReadoutsByClassroom,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
} = require('../../models/sensors.model');

// Function to get all readouts
async function httpGetAllReadouts(req, res) {
    const readouts = await getAllReadouts();
    return res.status(200).json(readouts);
}

// Function to get a specific readout by ID
async function httpGetReadoutById(req, res) {
    const readoutId = req.params.id;

    if (!readoutId.match(/^[0-9a-fA-F]{24}$/)) { // Check if the ID is a valid ObjectId
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if (await existsId(readoutId)) {
        const readout = await getReadoutById(readoutId);
        return res.status(200).json(readout);
    } else {
        return res.status(404).json({ message: 'Readout not found' });
    }
}

// Function to get readouts by classroom
async function httpGetReadoutsByClassroom(req, res) {
    const classroom = req.params.classroom;

    const readoutsInClassroom = await getReadoutsByClassroom(classroom);

    if (readoutsInClassroom.length > 0) {
        return res.status(200).json(readoutsInClassroom);
    } else {
        return res.status(404).json({ message: 'Nothing found...' });
    }
}

// Function to get readouts by date range
async function httpGetReadoutsByDate(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Both startDate and endDate are required.' });
    }

    const readoutsInRange = await getReadoutsByDate(startDate, endDate);

    if (readoutsInRange.length > 0) {
        return res.status(200).json(readoutsInRange);
    } else {
        return res.status(404).json({ message: 'No readouts found for the specified date range.' });
    }
}

// Function to get readouts by time
async function httpGetReadoutsByTime(req, res) {
    const time = req.params.time;
    const readoutsAtTime = await getReadoutsByTime(time);

    if (readoutsAtTime.length > 0) {
        return res.status(200).json(readoutsAtTime);
    } else {
        return res.status(404).json({ message: 'No readouts found for the specified time.' });
    }
}

// Function to create a new readout (called when posting data)
async function httpNewReadouts(req, res) {
    const sensors = [
        'time', 'temperature', 'humidity', 'heatIndex', 'lighting',
        'classroom', 'voc', 'IAQIndex', 'indoorAir', 'temp', 'lightRemarks'
    ];

    const readout = req.body;

    // Check for missing sensor parameters
    const badSensorParameters = sensors.filter(attr => !readout[attr]);

    if (badSensorParameters.length > 0) {
        return res.status(400).json({ error: 'Bad Sensor Parameters: ' + badSensorParameters.join(', ') });
    }

    // Call the model to insert the new readout, which now includes date and time dynamically
    await newReadouts(readout);

    return res.status(201).json({
        message: 'New record inserted...',
        readout: readout
    });
}

// Function to delete a specific readout by ID
async function httpDeleteReadout(req, res) {
    const readoutId = req.params.id;

    if (!readoutId.match(/^[0-9a-fA-F]{24}$/)) { // Check if the ID is a valid ObjectId
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if (await existsId(readoutId)) {
        await deleteReadout(readoutId);
        return res.status(201).json('Deleted');
    } else {
        return res.status(404).json({ message: 'Readout not found' });
    }
}

// Function to delete all readouts
async function httpDeleteAllReadouts(req, res) {
    await deleteAllReadouts();
    return res.status(204).json({ message: 'All readouts deleted' });
}

module.exports = {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByClassroom,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
};