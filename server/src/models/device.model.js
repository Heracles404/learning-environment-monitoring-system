const device = require('../schema/deviceSchema');

function normalizeToUppercase(data) {
    const normalizedData = { ...data };
    if (normalizedData.classroom) normalizedData.classroom = normalizedData.classroom.toUpperCase();
    if (normalizedData.status) normalizedData.status = normalizedData.status.toUpperCase();
    if (normalizedData.bh1750) normalizedData.bh1750 = normalizedData.bh1750.toUpperCase();
    if (normalizedData.bme680) normalizedData.bme680 = normalizedData.bme680.toUpperCase();
    if (normalizedData.pms5003) normalizedData.pms5003 = normalizedData.pms5003.toUpperCase();
    return normalizedData;
}

async function newDevice(deviceData) {
    try {
        const normalizedData = normalizeToUppercase(deviceData);
        const newDevice = new device({
            ...normalizedData,
            lastUpdated: new Date().toISOString()
        });

        await newDevice.save();
        console.log('New device added:', newDevice);
        return newDevice;
    } catch (error) {
        console.error('Error adding new device:', error.message);
        throw new Error('Failed to add new device');
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
        const normalizedData = normalizeToUppercase(updatedData);
        const updatedDevice = await device.findByIdAndUpdate(
            deviceId,
            {
                ...normalizedData,
                lastUpdated: new Date().toISOString()
            },
            { new: true }
        );

        if (!updatedDevice) {
            return { error: 'Device not found' };
        }
        return updatedDevice;
    } catch (error) {
        console.error('Error updating device:', error.message);
        throw new Error('An error occurred while updating the device');
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
