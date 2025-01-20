// vog.controller.js
const {
    existsId,
    getAllReadouts,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
} = require('../../models/vog.model');

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
    const sensors = ['time', 'classroom', 'pm25', 'pm10', 'OAQIndex', 'level'];
    const readout = req.body;

    // Check for missing sensor parameters
    const badSensorParameters = sensors.filter(attr => !readout[attr]);

    if (badSensorParameters.length > 0) {
        return res.status(400).json({ error: 'Bad Sensor Parameters: ' + badSensorParameters.join(', ') });
    }

    // Dynamically generate the date and time for each new readout
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();  // Format date as "MM/DD/YYYY"

    // Include the date and time dynamically into the readout
    const readoutWithTimestamp = {
        date: currentDate,
        ...readout
    };

    // Call the model to insert the new readout, which now includes date and time dynamically
    await newReadouts(readoutWithTimestamp);

    return res.status(201).json({
        message: 'New record inserted...',
        readout: readoutWithTimestamp
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
    return res.status(201).json('All records deleted');
}

module.exports = {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
};