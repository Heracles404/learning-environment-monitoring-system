const readouts = new Map();

let latestReadoutId = 1;

const currentDateTime = new Date();

const readout  = {
    _id: 1,
    date: "10/16/2024",
    time: "03:15 PM",

    pm25: 30,
    pm10: 15,
    OAQIndex: 80,

    remarks: "Good"
}

readouts.set(readout._id, readout);

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


function getReadoutsByDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return Array.from(readouts.values()).filter(readout => {
        const readoutDate = new Date(readout.date);
        return readoutDate >= start && readoutDate <= end;
    });
}


function getReadoutsByTime(time){
    return Array.from(readouts.values()).filter(readout => readout.time === time);
}

function newReadouts(readout){
    latestReadoutId++;

    const newReadout = {
        _id: latestReadoutId,
        date: currentDateTime.toLocaleDateString(), // Format date
        time: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time to include only hour and minute
        // time: currentDateTime.toLocaleTimeString(), // Format time
        ...readout
    };

    readouts.set(newReadout._id, newReadout);

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