// users.model.js
const User = require('../schema/userSchema');

// Function to check if a username exists
async function existsUserName(userName) {
    const user = await User.findOne({ userName });
    return user !== null;
}

// Function to get all users
async function getAllUsers() {
    const users = await User.find().lean(); // Use .lean() to return plain objects
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
}

// Function to authenticate a user
async function authenticateUser (userName, password) {
    const user = await User.findOne({ userName, password }).lean(); // Use .lean() here as well
    if (user) {
        const { password, ...userWithoutPassword } = user; // Exclude password
        return userWithoutPassword; // Return user data without password
    }
    return null;
}

// Function to get a user by username
async function getUserByUserName(userName) {
    const user = await User.findOne({ userName }).lean(); // Use .lean() here as well
    if (user) {
        const { password, ...userWithoutPassword } = user; // Exclude password
        return userWithoutPassword;
    }
    return null; // User not found
}

// Function to add a new user
async function addNewUser (user) {
    const newUser  = new User(user);
    await newUser .save();
}

// Function to delete a user by username
async function deleteUserByUserName(userName) {
    const result = await User.deleteOne({ userName });
    return result.deletedCount > 0 ? `User  ${userName} has been deleted.` : `User  ${userName} not found.`;
}

// Function to update a user by username
async function updateUserByUserName(userName, updates) {
    const result = await User.updateOne({ userName }, { $set: updates });
    return result.modifiedCount > 0 ? `User  ${userName} has been updated.` : `User  ${userName} not found.`;
}

module.exports = {
    existsUserName,
    getAllUsers,
    authenticateUser ,
    getUserByUserName,
    addNewUser ,
    deleteUserByUserName,
    updateUserByUserName,
};