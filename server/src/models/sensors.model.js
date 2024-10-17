const readouts = new Map();

let latestReadoutId = 1;

const currentDateTime = new Date();

const readout  = {
    readoutId: 1,
    date: "10/16/2024",
    time: "3:15:00 PM",
    temperature: 6,
    humidity: 33,
    lighting: 160,
    headCount: 54,
    oxygen: 24,
    carbonDioxide: 600,
    sulfurDioxide: 30,
    particulateMatter: 15
}

readouts.set(readout.readoutId, readout);

function getAllReadouts(){
    console.log(readouts);
    return Array.from(readouts.values());
}

function existsId(readoutId){
    return readouts.has(readoutId);
}

function getReadoutById(readoutId){
    return readouts.get(readoutId);
}

function getReadoutsByDate(date){
    return readouts.filter(readout => readout.date === date);
}

function getReadoutsByTime(time){
    return readouts.filter(readout => readout.time === time);
}

function newReadouts(readout){
    latestReadoutId++;

    const newReadout = {
        readoutId: latestReadoutId,
        date: currentDateTime.toLocaleDateString(), // Format date
        time: currentDateTime.toLocaleTimeString(), // Format time
        ...readout
    };

    readouts.set(newReadout.readoutId, newReadout);

    console.log(readouts);
}

function deleteReadout(id){
    readouts.delete(id);
    console.log(readouts);
}

function deleteAllReadouts(){
    readouts.clear();
    console.log(readouts);
}

module.exports = {
    existsId,
    getAllReadouts,
    getReadoutById,
    getReadoutsByDate,
    getReadoutsByTime,
    newReadouts,
    deleteReadout,
    deleteAllReadouts
}