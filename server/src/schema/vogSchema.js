const mongoose = require('mongoose');

const vogSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    OAQIndex: { type: Number, required: true },
    level: { type: String, required: true }
});

const VOGReadout = mongoose.model('vogs', vogSchema);

module.exports = VOGReadout;