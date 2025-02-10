const API_URL = process.env.REACT_APP_API_URL;

async function httpNewDevice(device){
    try {
        return await fetch(`${API_URL}/devices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(device),
        });
    } catch (err) {
        return {
            ok: false,
        };
    }
}

async function httpGetAllDevices(){
    const response = await fetch(`${API_URL}/devices`);
    return await response.json();
}

async function httpGetDeviceById(_id){
    const response = await fetch(`${API_URL}/devices/${_id}`);
    return await response.json();
}

async function httpGetActive(){
    const response = await fetch(`${API_URL}/devices/getActive`);
    return await response.json();
}

async function httpUpdateDevice(_id, updates){
    try {
        return await fetch(`${API_URL}/devices/${_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });
    } catch (err) {
        return {
            ok: false,
        };
    }
}

async function httpDeleteDevice(_id){
    try {
        return await fetch(`${API_URL}/devices/${_id}`, {
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
    httpNewDevice,
    httpGetAllDevices,
    httpGetDeviceById,
    httpGetActive,
    httpUpdateDevice,
    httpDeleteDevice
}
