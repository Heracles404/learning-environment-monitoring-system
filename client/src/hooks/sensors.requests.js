const API_URL = process.env.REACT_APP_API_URL;

async function httpGetAllReadouts(){
    const response = await fetch(`${API_URL}/sensors`);
    return await response.json();
}

async function httpGetReadoutById(_id){
    const response = await fetch(`${API_URL}/sensors/${_id}`);
    return await response.json();
}

async function httpGetReadoutsByDate(startDate, endDate){
    const response = await fetch(`${API_URL}/sensors/date/date?startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
}

async function httpGetReadoutsByTime(time){
    const response = await fetch(`${API_URL}/sensors/time/${time}`);
    return await response.json();
}


async function httpNewReadouts(readout){
    try {
        return await fetch(`${API_URL}/sensors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(readout),
        });
    } catch (err) {
        return {
            ok: false,
        };
    }

    // Send Data Body
    //  "temperature": 46,
    //  "humidity": 33,
    //  "heatIndex": 37,
    //  "lighting": 160,
    //  "voc": 70,
    //  "IAQIndex": 72,
    //  "pm25": 30,
    //  "pm10": 15,
    //  "OAQIndex": 80,
    //  "indoorAir": "Good",
    //  "outdoorAir": "Good",
    //  "temp": "Good",
    //  "remarks": "Good"
}


async function httpDeleteReadout(_id){
    try {
        return await fetch(`${API_URL}/sensors/${_id}`, {
            method: "DELETE",
        });
    } catch (err) {
        // console.log(err);
        return {
            ok: false,
        };
    }
}

async function httpDeleteAllReadouts(){
    try {
        return await fetch(`${API_URL}/sensors`, {
            method: "DELETE",
        });
    } catch (err) {
        // console.log(err);
        return {
            ok: false,
        };
    }
}

export {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts
}
