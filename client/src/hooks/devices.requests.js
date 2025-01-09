const API_URL = 'http://localhost:8000';


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

export {
    httpGetAllDevices,
    httpGetDeviceById,
    httpGetActive
}
