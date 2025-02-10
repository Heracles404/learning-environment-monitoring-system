const VOGReadout = require('../schema/vogSchema');

// Helper function to normalize date and time
function normalizeDateTime(dateTime) {
    const dateObj = new Date(dateTime);
    const normalizedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    const normalizedTime = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
    return { normalizedDate, normalizedTime };
}

// Function to get all readouts
async function getAllReadouts() {
    const readouts = await VOGReadout.find().lean();
    return readouts.map(readout => {
        const { normalizedDate, normalizedTime } = normalizeDateTime(readout.date);
        return { ...readout, date: normalizedDate, time: normalizedTime };
    });
}

// Function to check if a readout ID exists
async function existsId(readoutId) {
    return await VOGReadout.exists({ _id: readoutId });
}

// Function to get a readout by ID
async function getReadoutById(readoutId) {
    const readout = await VOGReadout.findById(readoutId).lean();
    if (readout) {
        const { normalizedDate, normalizedTime } = normalizeDateTime(readout.date);
        return { ...readout, date: normalizedDate, time: normalizedTime };
    }
    return null;
}

// Function to get readouts by date range
async function getReadoutsByDate(startDate, endDate) {
    const readouts = await VOGReadout.find({
        date: { $gte: startDate, $lte: endDate }
    }).lean();
    return readouts.map(readout => {
        const { normalizedDate, normalizedTime } = normalizeDateTime(readout.date);
        return { ...readout, date: normalizedDate, time: normalizedTime };
    });
}

// Function to get readouts by time
async function getReadoutsByTime(time) {
    const readouts = await VOGReadout.find({ time }).lean();
    return readouts.map(readout => {
        const { normalizedDate, normalizedTime } = normalizeDateTime(readout.date);
        return { ...readout, date: normalizedDate, time: normalizedTime };
    });
}

// Function to create a new readout
async function newReadouts(readout) {
    const currentDateTime = new Date();
    const { normalizedDate, normalizedTime } = normalizeDateTime(currentDateTime);

    const newReadout = new VOGReadout({
        ...readout,
        date: normalizedDate,
        time: normalizedTime
    });

    await newReadout.save();
}

// Function to delete a readout by ID
async function deleteReadout(id) {
    await VOGReadout.findByIdAndDelete(id);
}

// Function to delete all readouts
async function deleteAllReadouts() {
    await VOGReadout.deleteMany({});
}

module.exports = {
    existsId,
    getAllReadouts,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
};
