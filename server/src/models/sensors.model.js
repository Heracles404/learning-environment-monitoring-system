const { getDeviceByClassroom, updateDevice } = require('../models/device.model');
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

async function newReadouts(readout) {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();

    // Determine BME680 and BH1750 status based on readout values
    const bme680Status = (readout.temperature && readout.humidity && readout.voc) ? 'ACTIVE' : 'INACTIVE';
    const bh1750Status = (readout.lighting) ? 'ACTIVE' : 'INACTIVE';

    // Determine overall device status
    const deviceStatus = (bme680Status === 'ACTIVE' || bh1750Status === 'ACTIVE') ? 'ACTIVE' : 'INACTIVE';

    const newReadout = new Sensors({
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
                            status: deviceStatus,
                            bme680: bme680Status,
                            bh1750: bh1750Status,
                            lastUpdated: currentDateTime.toISOString(),
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