const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    classroom: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], required: true },
    bh1750: { type: String, required: true },
    bme680: { type: String, required: true },
    pms5003: { type: String, required: true },
    lastUpdated: { type: String, required: true },
});

// Middleware to update the updatedAt field before saving
deviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;