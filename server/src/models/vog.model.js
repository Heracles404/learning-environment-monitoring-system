const vogReadouts = new Map();

let latestReadoutId = 1;

const currentDateTime = new Date();

const vogReadout  = {
    _id: 1,
    date: "10/16/2024",
    time: "03:15 PM",

    pm25: 30,
    pm10: 15,
    OAQIndex: 80,

    level: "2"
}

vogReadouts.set(vogReadout._id, vogReadout);

function getAllReadouts(){
    console.log(vogReadouts);
    return Array.from(vogReadouts.values());
}

function existsId(readoutId){
    return vogReadouts.has(readoutId);
}

function getReadoutById(readoutId){
    return vogReadouts.get(readoutId);
}


function getReadoutsByDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return Array.from(vogReadouts.values()).filter(readout => {
        const readoutDate = new Date(readout.date);
        return readoutDate >= start && readoutDate <= end;
    });
}


function getReadoutsByTime(time){
    return Array.from(vogReadouts.values()).filter(readout => readout.time === time);
}

function newReadouts(readout){
    latestReadoutId++;

    const newReadout = {
        _id: latestReadoutId,
        date: currentDateTime.toLocaleDateString(), // Format date
        time: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time to include only hour and minute
        ...readout
    };

    vogReadouts.set(newReadout._id, newReadout);

    console.log(vogReadouts);
}

function deleteReadout(id){
    vogReadouts.delete(id);
    console.log(vogReadouts);
}

function deleteAllReadouts(){
    vogReadouts.clear();
    console.log(vogReadouts);
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