const sensors = new Map();

let latestReadoutId = 1;

const sensor  = {
    readoutId: 1,
    date: "January 1, 2024",
    time: "13:15",
    temperature: 6,
    humidity: 33,
    lighting: 160,
    headCount: 54,
    oxygen: 24,
    carbonDioxide: 600,
    sulfurDioxide: 30,
    particulateMatter: 15
}

sensors.set(sensor.readoutId, sensor);

function getAllReadouts(){
    return Array.from(sensors.values());
}

function existsId(readoutId){
    return sensor.has(readoutId);
}

function getReadoutById(readoutId){
    return sensors.get(readoutId);
}

function getReadoutByDate(){}

function getReadoutByTime(){}

function newReadouts(){}

function deleteReadout(){}

function deleteAllReadouts(){}

module.exports = {
    getAllReadouts,
    getReadoutById,
    getReadoutByDate,
    getReadoutByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
}