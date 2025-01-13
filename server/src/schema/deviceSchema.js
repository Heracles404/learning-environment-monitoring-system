const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    classroom: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
