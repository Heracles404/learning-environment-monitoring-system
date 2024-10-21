const API_URL = 'http://localhost:8000';


async function httpGetUser(userName){
    const response = await fetch(`${API_URL}/users/${userName}`);
    return await response.json();
}

async function httpGetAllUsers(){
    const response = await fetch(`${API_URL}/users`);
    return await response.json();
}

async function httpAddNewUser(user){
    try {
        return await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    } catch (err) {
        return {
            ok: false,
        };
    }

    // Send Data Body
    //
    //     "userName": "Juan",
    //     "password": "123admin",
    //     "role": "Principal",
    //     "firstName": "Nicanor",
    //     "lastName": "Reyes II"
    //
}

async function httpUpdateUser(userName, updates){
    try {
        return await fetch(`${API_URL}/users/${userName}`, {
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

    // Updatable Fields
    //      "role": "Vice Principal",
    //      "firstName": "Nicanorian",
    //      "password": "NewPassword"

}

async function httpDeleteUser(userName){
    try {
        return await fetch(`${API_URL}/launches/${userName}`, {
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
    httpGetUser,
    httpGetAllUsers,
    httpAddNewUser,
    httpUpdateUser,
    httpDeleteUser
}