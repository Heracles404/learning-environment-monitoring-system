const { newDevice, existsId,
    getAllDevices, getDeviceById, getActive, getInactive,
    getDeviceByClassroom, updateDevice, deleteDevice} = require('../../models/device.model');
const mongoose = require("mongoose");

async function httpGetAllDevices(req, res) {
    const devices = await getAllDevices();
    return res.status(200).json(devices);
}


function httpNewDevice(req, res) {
    const paramsCheck = ['classroom', 'status', 'bme680', 'bh1750'];

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

async function httpGetDeviceById(req, res) {
    const deviceId = req.params.id;

    if (!await existsId(deviceId)) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const device = await getDeviceById(deviceId);
    return res.status(200).json(device);
}

async function httpGetDeviceByClassroom(req, res) {
    const classroom = req.params.classroom;
    const devicesInClassroom = await getDeviceByClassroom(classroom);

    if (devicesInClassroom.length === 0) {
        return res.status(404).json({ message: 'No devices found in classroom ' + classroom });
    }

    return res.status(200).json(devicesInClassroom);
}

async function httpGetActive(req, res) {
    const activeDevices = await getActive();
    const activeCount = activeDevices.length;

    return res.status(200).json({ count: activeCount });
}

async function httpGetInactive(req, res) {
    const inactiveDevices = await getInactive();
    const inactiveCount = inactiveDevices.length;

    return res.status(200).json({ count: inactiveCount });
}

async function httpDeleteDevice(req, res) {
    const deviceId = req.params.id;

    const deletedDevice = await deleteDevice(deviceId);
    if (deletedDevice) {
        return res.status(200).json({ message: 'Deleted successfully.' });
    } else {
        return res.status(404).json({ message: 'Device not found.' });
    }
}

async function httpUpdateDevice(req, res) {
    const deviceId = req.params.id;
    const updatedData = req.body;

    // Validate the deviceId
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
        return res.status(400).json({ message: 'Invalid device ID' });
    }

    try {
        const updatedDevice = await updateDevice(deviceId, updatedData);

        if (updatedDevice) {
            return res.status(200).json({
                message: 'Device updated successfully',
                device: updatedDevice
            });
        } else {
            return res.status(404).json({ message: 'Device not found' });
        }
    } catch (error) {
        console.error('Error updating device:', error);
        return res.status(500).json({ message: 'An error occurred while updating the device' });
    }
}

async function httpUpdateDeviceByClassroom(req, res) {
    const classroom = req.params.classroom;
    const updatedData = req.body;

    // Find devices in the specified classroom
    const devicesToUpdate = await getDeviceByClassroom(classroom);

    if (devicesToUpdate.length === 0) {
        return res.status(404).json({ message: 'No devices found in classroom ' + classroom });
    }

    // Update each device in the classroom
    const updatedDevices = await Promise.all(
        devicesToUpdate.map(device => updateDevice(device._id, updatedData))
    );

    return res.status(200).json({
        message: 'Devices updated successfully',
        devices: updatedDevices
    });
}

module.exports = {
    httpNewDevice,
    httpGetAllDevices,
    httpGetDeviceById,
    httpGetDeviceByClassroom,
    httpGetActive,
    httpGetInactive,
    httpDeleteDevice,
    httpUpdateDevice,
    httpUpdateDeviceByClassroom
};
