const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    classroom: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    bh1750: { type: String, required: false },
    bme680: { type: String, required: false },
    pms5003: { type: String, required: false },
});

// Middleware to update the updatedAt field before saving
deviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;