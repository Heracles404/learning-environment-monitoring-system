const users = new Map();

let latestUserId = 1;

const user = {
    userId: 1,
    userName: 'SirNicanor',
    password: '123admin',
    role: 'Principal',
    firstName: 'Nicanor',
    lastName: 'Reyes II'
}

users.set(user.userId, user);

function existsUserId(userId){
    return users.has(userId);
}

function getAllUsers(){
    return Array.from(users.values());
}

function addNewUser(user){
    latestUserId++;
    users.set(
        latestUserId,
        Object.assign(user)
    );
}

function deleteUserById(userId){
    const username = user.userName;
    user.delete(userId);

    return `User ${username} has been deleted...`;
}

module.exports = {
    existsUserId,
    getAllUsers,
    addNewUser,
    deleteUserById
}