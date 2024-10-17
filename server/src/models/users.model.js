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

function existsUserName(userName){
    console.log(users);
    for (const user of users.values()) {
        if (user.userName === userName) {
            return true;
        }
    }
    return false;
}

function getAllUsers(){
    // return Array.from(users.values());
    console.log(users);
    return Array.from(users.values()).map(({password, ...userWithoutPassword}) => userWithoutPassword);
}


function getUserByUserName(userName) {
    // Find the user by userName
    for (const user of users.values()) {
        if (user.userName === userName) {
            const { password, ...userWithoutPassword } = user; // Exclude password
            return userWithoutPassword;
        }
    }
    return null; // User not found
}

function addNewUser(user) {
    console.log(users);
    latestUserId++;

    // Create a new user object that includes the userId
    const newUser = {
        userId: latestUserId, // Add userId
        ...user // Spread the properties from the user object
    };

    users.set(newUser.userId, newUser); // Store the new user in the map
}

function deleteUserByUserName(userName) {
    console.log(users);

    // Find the userId by userName and delete the user
    for (const [id, user] of users.entries()) {
        if (user.userName === userName) {
            users.delete(id);
            return `User ${userName} has been deleted.`;
        }
    }

    return `User ${userName} not found.`;
}

function updateUserByUserName(userName, updates) {
    // Find the user by userName and update their details
    for (const [id, user] of users.entries()) {
        if (user.userName === userName) {
            const updatedUser = { ...user, ...updates }; // Update the fields
            users.set(id, updatedUser); // Save the updated user back to the Map
            return `User ${userName} has been updated.`;
        }
    }
    return `User ${userName} not found.`;
}

module.exports = {
    existsUserName,
    getAllUsers,
    getUserByUserName,
    addNewUser,
    deleteUserByUserName,
    updateUserByUserName
}