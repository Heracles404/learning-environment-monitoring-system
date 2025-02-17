const Sensors = require('../schema/sensorsSchema');

// Function to get all readouts
async function getAllReadouts() {
    return await Sensors.find();
}

// Function to check if a readout ID exists
async function existsId(readoutId) {
    return await Sensors.exists({ _id: readoutId });
}

// Function to get readouts by classroom
async function getReadoutsByClassroom(classroom) {
    return await Sensors.find({ classroom });
}

// Function to get a readout by ID
async function getReadoutById(readoutId) {
    return await Sensors.findById(readoutId);
}

// Function to get readouts by date range
async function getReadoutsByDate(startDate, endDate) {
    return await Sensors.find({
        date: { $gte: startDate, $lte: endDate }
    });
}

// Function to get readouts by time
async function getReadoutsByTime(time) {
    return await Sensors.find({ time });
}

// Function to create a new readout
async function newReadouts(readout) {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();

    const newReadout = new Sensors({
        ...readout,
        date: currentDate,
    });

    return await newReadout.save();
}

// Function to delete a readout by ID
async function deleteReadout(id) {
    await Sensors.findByIdAndDelete(id);
}

// Function to delete all readouts
async function deleteAllReadouts() {
    await Sensors.deleteMany({});
}

module.exports = {
    existsId,
    getAllReadouts,
    getReadoutsByClassroom,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
};