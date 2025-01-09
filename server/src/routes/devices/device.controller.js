const { newDevice, existsId, getAllDevices, getDeviceById, getActive } = require('../../models/device.model');

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

function httpGetActive(req, res){
    const activeDevices = getActive();

    if (activeDevices.length === 0) {
        return res.status(404).json({ message: "No active devices found" });
    }

    return res.status(200).json(activeDevices);
}

module.exports = {
    httpNewDevice,
    httpGetAllDevices,
    httpGetDeviceById,
    httpGetActive
};
