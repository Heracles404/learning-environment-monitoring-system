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

function getActive(){
    return Array.from(devices.values()).filter(device => device.status === "active");
}

module.exports = {
    newDevice,
    existsId,
    getAllDevices,
    getDeviceById,
    getActive
}