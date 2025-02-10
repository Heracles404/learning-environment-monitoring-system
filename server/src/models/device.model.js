const device = require('../schema/deviceSchema');

async function newDevice(deviceData) {
    try {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Ensure 24-hour format
        };

        const currentDate = new Date();
        const currentDateTime = currentDate.toLocaleString('en-US', options); // Use toLocaleString for both date and time

        const newDevice = new device({
            lastUpdated: currentDateTime,
            ...deviceData
        });

        await newDevice.save();
        console.log('New device added:', newDevice);
        return newDevice; // Return the created device for further use
    } catch (error) {
        console.error('Error adding new device:', error.message);
        throw new Error('Failed to add new device'); // Throw an error if saving fails
    }
}


async function getAllDevices() {
    return await device.find({});
}

async function existsId(deviceId) {
    return await device.exists({ _id: deviceId });
}

async function getDeviceById(deviceId) {
    return await device.findById(deviceId);
}

async function getDeviceByClassroom(classroom) {
    return await device.find({ classroom });
}

async function getActive() {
    return await device.find({ status: 'active' });
}

async function getInactive() {
    return await device.find({ status: 'inactive' });
}

async function deleteDevice(deviceId) {
    return await device.findByIdAndDelete(deviceId);
}

async function updateDevice(deviceId, updatedData) {
    try {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Ensure 24-hour format
        };

        const currentDate = new Date();
        const currentDateTime = currentDate.toLocaleString('en-US', options); // Use toLocaleString for both date and time

        const updatedDevice = await device.findByIdAndUpdate(
            deviceId,
            {
                ...updatedData,
                lastUpdated: currentDateTime // Update the lastUpdated field
            },
            { new: true } // Return the updated document
        );

        if (!updatedDevice) {
            return { error: 'Device not found' };
        }

        return updatedDevice;
    } catch (error) {
        console.error('Error updating device:', error.message);
        return { error: 'An error occurred while updating the device' };
    }
}


module.exports = {
    newDevice,
    getAllDevices,
    existsId,
    getDeviceById,
    getDeviceByClassroom,
    getActive,
    getInactive,
    deleteDevice,
    updateDevice,
};
