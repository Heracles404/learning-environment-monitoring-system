const VOGReadout = require('../schema/vogSchema');

// Function to get all readouts
async function getAllReadouts() {
    const readouts = await VOGReadout.find().lean(); // Use .lean() to return plain objects
    return readouts;
}

// Function to check if a readout ID exists
async function existsId(readoutId) {
    return await VOGReadout.exists({ _id: readoutId });
}

// Function to get a readout by ID
async function getReadoutById(readoutId) {
    return await VOGReadout.findById(readoutId).lean(); // Use .lean() to return plain objects
}

// Function to get readouts by date range
async function getReadoutsByDate(startDate, endDate) {
    return await VOGReadout.find({
        date: { $gte: startDate, $lte: endDate }
    }).lean(); // Use .lean() to return plain objects
}

// Function to get readouts by time
async function getReadoutsByTime(time) {
    return await VOGReadout.find({ time }).lean(); // Use .lean() to return plain objects
}

// Function to create a new readout
async function newReadouts(readout) {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();

    const newReadout = new VOGReadout({
        ...readout,
        date: currentDate,
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