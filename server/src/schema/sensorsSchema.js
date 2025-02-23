const mongoose = require('mongoose');

const sensorsSchema = new mongoose.Schema({
    classroom: { type: String, set: (classroom) => classroom.toUpperCase(), required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    temperature: { type: Number, required: false },
    humidity: { type: Number, required: false },
    heatIndex: { type: Number, required: false },
    lighting: { type: Number, required: false },
    voc: { type: Number, required: false },
    IAQIndex: { type: Number, required: false },
    indoorAir: { type: String, set: (indoorAir) => indoorAir.toUpperCase(), required: false },
    temp: { type: String, set: (temp) => temp.toUpperCase(), required: false },
    lightRemarks: { type: String, set: (lightRemarks) => lightRemarks.toUpperCase(), required: false },
});

const Sensors = mongoose.model('sensors', sensorsSchema);

module.exports = Sensors;