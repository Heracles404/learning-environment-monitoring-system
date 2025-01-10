const devices = new Map();

let latestDeviceId = 1;

const device  = {
    _id: 1,
    classroom: "401",
    status: "active"
}

devices.set(device._id, device);

function newDevice(device){
    latestDeviceId++;

    const newReadout = {
        _id: latestDeviceId,
        ...device
    };

    devices.set(newReadout._id, newReadout);

    console.log(devices);
}

function getAllDevices(){
    console.log(devices);
    return Array.from(devices.values());
}

function existsId(deviceId){
    return devices.has(deviceId);
}

function getDeviceById(deviceId){
    return devices.get(deviceId);
}

function getDeviceByClassroom(classroom) {
    return Array.from(devices.values()).filter(device => device.classroom === classroom);
}

function getActive(){
    return Array.from(devices.values()).filter(device => device.status.toUpperCase() === "ACTIVE");
}

function getInactive(){
    return Array.from(devices.values()).filter(device => device.status.toUpperCase() === "INACTIVE");
}

function deleteDevice(deviceId) {
    return devices.delete(deviceId);
}

function updateDevice(deviceId, updatedData) {
    if (devices.has(deviceId)) {
        const existingDevice = devices.get(deviceId);
        const updatedDevice = { ...existingDevice, ...updatedData };
        devices.set(deviceId, updatedDevice);
        return updatedDevice;
    }
    return null; // Return null if the device does not exist
}


module.exports = {
    newDevice,
    existsId,
    getAllDevices,
    getDeviceById,
    getDeviceByClassroom,
    getActive,
    getInactive,
    deleteDevice,
    updateDevice
}