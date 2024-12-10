const { existsId, getAllReadouts, getReadoutById, getReadoutsByDate, getReadoutsByTime, newReadouts, deleteReadout, deleteAllReadouts } = require('../../models/vog.model');

// Function to get all readouts
function httpGetAllReadouts(req, res) {
    return res.status(200).json(getAllReadouts());
}

// Function to get a specific readout by ID
function httpGetReadoutById(req, res) {
    const readoutId = Number(req.params.id);

    if (isNaN(readoutId)) {
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if (existsId(readoutId)) {
        return res.status(200).json(getReadoutById(readoutId));
    } else {
        return res.status(404).json({ message: 'Readout not found' });
    }
}

// Function to get readouts by date range
function httpGetReadoutsByDate(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Both startDate and endDate are required.' });
    }

    const readoutsInRange = getReadoutsByDate(startDate, endDate);

    if (readoutsInRange.length > 0) {
        return res.status(200).json(readoutsInRange);
    } else {
        return res.status(404).json({ message: 'No readouts found for the specified date range.' });
    }
}

// Function to get readouts by time
function httpGetReadoutsByTime(req, res) {
    const time = req.params.time;
    const readoutsAtTime = getReadoutsByTime(time);

    if (readoutsAtTime.length > 0) {
        return res.status(200).json(readoutsAtTime);
    } else {
        return res.status(404).json({ message: 'No readouts found for the specified time.' });
    }
}

// Function to create a new readout (called when posting data)
function httpNewReadouts(req, res) {
    const sensors = [
        'pm25', 'pm10', 'OAQIndex', 'level'
    ];

    const readout = req.body;

    // Check for missing sensor parameters
    const badSensorParameters = sensors.filter(attr => !readout[attr]);

    if (badSensorParameters.length > 0) {
        return res.status(400).json({ error: 'Bad Sensor Parameters: ' + badSensorParameters.join(', ') });
    }

    // Dynamically generate the date and time for each new readout
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();  // Format date as "MM/DD/YYYY"
    const currentTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // Format time as "HH:MM AM/PM"

    // Include the date and time dynamically into the readout
    const readoutWithTimestamp = {
        ...readout,
        date: currentDate,
        time: currentTime
    };

    // Call the model to insert the new readout, which now includes date and time dynamically
    newReadouts(readoutWithTimestamp);

    return res.status(201).json({
        message: 'New record inserted...',
        readout: readoutWithTimestamp
    });
}

// Function to delete a specific readout by ID
function httpDeleteReadout(req, res) {
    const readoutId = Number(req.params.id);

    if (isNaN(readoutId)) {
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if (existsId(readoutId)) {
        deleteReadout(readoutId);
        return res.status(201).json('Deleted');
    } else {
        return res.status(404).json({ message: 'Readout not found' });
    }
}

// Function to delete all readouts
function httpDeleteAllReadouts(req, res) {
    deleteAllReadouts();
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
