const device = require('../schema/deviceSchema');

async function newDevice(deviceData) {
    const newDevice = new device(deviceData);
    await newDevice.save();
    console.log('New device added:', newDevice);
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
    return await device.findByIdAndUpdate(deviceId, updatedData, { new: true });
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
