const API_URL = process.env.REACT_APP_API_URL;

async function httpGetAllReadouts() {
    const response = await fetch(`${API_URL}/vog`);
    return await response.json();
}

async function httpGetReadoutById(_id) {
    const response = await fetch(`${API_URL}/vog/${_id}`);
    return await response.json();
}

async function httpGetReadoutsByDate(startDate, endDate) {
    const response = await fetch(`${API_URL}/vog/date/date?startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
}

async function httpGetReadoutsByTime(time) {
    const response = await fetch(`${API_URL}/vog/time/${time}`);
    return await response.json();
}

async function httpNewReadouts(readout) {
    try {
        return await fetch(`${API_URL}/vog`, {
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
        return await fetch(`${API_URL}/vog/${_id}`, {
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
        return await fetch(`${API_URL}/vog`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err);
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