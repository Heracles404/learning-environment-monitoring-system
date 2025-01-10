const { newDevice, existsId,
    getAllDevices, getDeviceById, getActive, getInactive,
    getDeviceByClassroom, updateDevice, deleteDevice} = require('../../models/device.model');

function httpGetAllDevices(req, res) {
    return res.status(200).json(getAllDevices());
}

function httpNewDevice(req, res) {
    const paramsCheck = ['classroom', 'status'];

    const device = req.body;

    const badParameters = paramsCheck.filter(attr => !device[attr]);

    if (badParameters.length > 0) {
        return res.status(400).json({ error: 'Bad Parameters: ' + badParameters.join(', ') });
    }

    const readout = {
        ...device
    };

    newDevice(readout);

    return res.status(201).json({
        message: 'New device inserted...',
        readout: readout
    });
}

function httpGetDeviceById(req, res) {
    const deviceId = Number(req.params.id);

    if (isNaN(deviceId)) {
        return res.status(400).json({ error: 'Invalid readout ID' });
    }

    if (existsId(deviceId)) {
        return res.status(200).json(getDeviceById(deviceId));
    } else {
        return res.status(404).json({ message: 'Readout not found' });
    }
}

function httpGetDeviceByClassroom(req, res) {
    const classroom = req.params.classroom;

    const devicesInClassroom = getDeviceByClassroom(classroom);

    if (devicesInClassroom.length === 0) {
        return res.status(404).json({ message: 'No devices found in classroom ' + classroom });
    }

    return res.status(200).json(devicesInClassroom);
}

function httpGetActive(req, res) {
    const activeDevices = getActive();
    const activeCount = activeDevices.length;

    if (activeCount === 0) {
        return res.status(404).json({ count: "0" });
    }

    return res.status(200).json({ count: activeCount });
}

function httpGetInactive(req, res) {
    const inactiveDevices = getInactive();
    const inactiveCount = inactiveDevices.length;

    if (inactiveCount === 0) {
        return res.status(404).json({ count: "0" });
    }

    return res.status(200).json({ count: inactiveCount });
}

function httpDeleteDevice(req, res) {
    const deviceId = Number(req.params.id);

    if (isNaN(deviceId)) {
        return res.status(400).json({ error: 'Invalid device ID' });
    }

    if (deleteDevice(deviceId)) {
        return res.status(200).json({ message: 'Deleted successfully.' });
    } else {
        return res.status(404).json({ message: 'Device not found.' });
    }
}

function httpUpdateDevice(req, res) {
    const deviceId = Number(req.params.id);
    const updatedData = req.body;

    if (isNaN(deviceId)) {
        return res.status(400).json({ error: 'Invalid device ID' });
    }

    const updatedDevice = updateDevice(deviceId, updatedData);

    if (updatedDevice) {
        return res.status(200).json({
            message: 'Device updated successfully',
            device: updatedDevice
        });
    } else {
        return res.status(404).json({ message: 'Device not found' });
    }
}
module.exports = {
    httpNewDevice,
    httpGetAllDevices,
    httpGetDeviceById,
    httpGetDeviceByClassroom,
    httpGetActive,
    httpGetInactive,
    httpDeleteDevice,
    httpUpdateDevice
};
