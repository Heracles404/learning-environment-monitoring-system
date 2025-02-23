const VOGReadout = require('../schema/vogSchema');
const { getDeviceByClassroom, updateDevice } = require('../models/device.model');

// Function to get all readouts
async function getAllReadouts() {
    const readouts = await VOGReadout.find().lean();
    return readouts;
}

// Function to check if a readout ID exists
async function existsId(readoutId) {
    return await VOGReadout.exists({ _id: readoutId });
}

// Function to get a readout by ID
async function getReadoutById(readoutId) {
    return await VOGReadout.findById(readoutId).lean();
}

// Function to get readouts by date range
async function getReadoutsByDate(startDate, endDate) {
    return await VOGReadout.find({
        date: { $gte: startDate, $lte: endDate }
    }).lean();
}

// Function to get readouts by time
async function getReadoutsByTime(time) {
    return await VOGReadout.find({ time }).lean(); 
}

// Function to create a new readout
async function newReadouts(readout) {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();

    const newReadout = new VOGReadout({
        ...readout,
        date: currentDate,
    });

    const savedReadout = await newReadout.save();

    // Extract classroom from the readout and update devices directly
    if (savedReadout.classroom) {
        try {
            const devicesToUpdate = await getDeviceByClassroom(savedReadout.classroom);

            if (devicesToUpdate.length > 0) {
                await Promise.all(
                    devicesToUpdate.map(device =>
                        updateDevice(device._id, {
                            status: 'ACTIVE',
                            pms5003: 'ACTIVE',
                            lastUpdated: currentDateTime.toISOString()
                        })
                    )
                );
            }
        } catch (error) {
            console.error('Error updating devices in classroom:', error);
        }
    }

    return savedReadout;
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