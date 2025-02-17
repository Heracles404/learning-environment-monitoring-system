const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    classroom: { type: String, set: (classroom) => classroom.toUpperCase(), required: true, unique: true },
    status: { type: String, set: (status) => status.toUpperCase(), enum: ['ACTIVE', 'INACTIVE'], required: true },
    bh1750: { type: String, set: (bh1750) => bh1750.toUpperCase(), required: true },
    bme680: { type: String, set: (bme680) => bme680.toUpperCase(), required: true },
    pms5003: { type: String, set: (pms5003) => pms5003.toUpperCase(), required: true },
    lastUpdated: { type: String, required: true },
});

// Middleware to update the updatedAt field before saving
deviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;