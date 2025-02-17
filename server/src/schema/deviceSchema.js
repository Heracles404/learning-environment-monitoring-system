const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    classroom: { type: String, set: (name) => name.toUpperCase(), required: true, unique: true },
    status: { type: String, set: (name) => name.toUpperCase(), enum: ['ACTIVE', 'INACTIVE'], required: true },
    bh1750: { type: String, set: (name) => name.toUpperCase(), required: true },
    bme680: { type: String, set: (name) => name.toUpperCase(), required: true },
    pms5003: { type: String, set: (name) => name.toUpperCase(), required: true },
    lastUpdated: { type: String, required: true },
});

// Middleware to update the updatedAt field before saving
deviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;