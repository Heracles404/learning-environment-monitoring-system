// sensors.requests.js
const API_URL = 'http://localhost:8000';

async function httpGetAllReadouts() {
    const response = await fetch(`${API_URL}/sensors.requests`);
    return await response.json();
}

async function httpGetReadoutById(_id) {
    const response = await fetch(`${API_URL}/sensors/${_id}`);
    return await response.json();
}

async function httpGetReadoutsByDate(startDate, endDate) {
    const response = await fetch(`${API_URL}/sensors/date/date?startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
}

async function httpGetReadoutsByTime(time) {
    const response = await fetch(`${API_URL}/sensors/time/${time}`);
    return await response.json();
}

async function httpNewReadouts(readout) {
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
}

async function httpDeleteReadout(_id) {
    try {
        return await fetch(`${API_URL}/sensors/${_id}`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err);
        return {
            ok: false,
        };
    }
}

async function httpDeleteAllReadouts() {
    try {
        return await fetch(`${API_URL}/sensors`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err);
        return {
            ok: false,
        };
    }
}

// Export all functions
module.exports = {
    httpGetAllReadouts,
    httpGetReadoutById,
    httpGetReadoutsByDate,
    httpGetReadoutsByTime,
    httpNewReadouts,
    httpDeleteReadout,
    httpDeleteAllReadouts,
};