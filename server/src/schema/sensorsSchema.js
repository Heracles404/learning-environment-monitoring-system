const mongoose = require('mongoose');

const sensorsSchema = new mongoose.Schema({
    classroom: { type: String, set: (classroom) => classroom.toUpperCase(), required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    heatIndex: { type: Number, required: true },
    lighting: { type: Number, required: true },
    voc: { type: Number, required: true },
    IAQIndex: { type: Number, required: true },
    indoorAir: { type: String, set: (indoorAir) => indoorAir.toUpperCase(), required: true },
    temp: { type: String, set: (temp) => temp.toUpperCase(), required: true },
    lightRemarks: { type: String, set: (lightRemarks) => lightRemarks.toUpperCase(), required: true },
});

const Sensors = mongoose.model('sensors', sensorsSchema);

module.exports = Sensors;