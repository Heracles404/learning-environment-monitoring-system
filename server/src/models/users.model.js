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

users.set(user.userName, user);

function existsUserName(userName){
    console.log(users);
    return users.has(userName);
}

function getAllUsers(){
    // return Array.from(users.values());
    return Array.from(users.values()).map(({password, ...userWithoutPassword}) => userWithoutPassword);}

function getUser(userName){
    const { password, ...userWithoutPassword } = users.get(userName); // Exclude password
    return userWithoutPassword;
}

function addNewUser(user) {
    latestUserId++;

    // Create a new user object that includes the userId
    const newUser = {
        userId: latestUserId, // Add userId
        ...user // Spread the properties from the user object
    };

    users.set(user.userName, newUser); // Store the new user in the map
}


function deleteUserByUserName(userName){
    const username = user.userName;

    if (!existsUserName(userName)) {
        return `User ${userName} not found.`;
    }

    users.delete(userName);
}


function updateUserByUserName(userName, updates){
    const user = users.get(userName);

    // Update the fields with the provided updates
    Object.assign(user, updates); // Update the fields
    // users.set(userName, user); // Save the updated user back to the Map

    // Return a success message
    return `User ${userName} has been updated.`;
}

module.exports = {
    existsUserName,
    getAllUsers,
    getUser,
    addNewUser,
    deleteUserByUserName,
    updateUserByUserName
}