// users.model.js
const User = require('../schema/userSchema');

// Helper function to normalize strings to uppercase
function normalizeToUppercase(value) {
    return value ? value.toUpperCase() : value;
}

// Function to check if a username exists (with normalization)
async function existsUserName(userName) {
    const normalizedUserName = normalizeToUppercase(userName);
    const user = await User.findOne({ userName: normalizedUserName });
    return user !== null;
}

// Function to get all users
async function getAllUsers() {
    const users = await User.find().lean(); // Use .lean() to return plain objects
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
}

// Function to authenticate a user (with normalization)
async function authenticateUser(userName, password) {
    const normalizedUserName = normalizeToUppercase(userName);
    const user = await User.findOne({ userName: normalizedUserName, password }).lean(); // Use .lean() here as well
    if (user) {
        const { password, ...userWithoutPassword } = user; // Exclude password
        return userWithoutPassword; // Return user data without password
    }
    return null;
}

// Function to get a user by username (with normalization)
async function getUserByUserName(userName) {
    const normalizedUserName = normalizeToUppercase(userName);
    const user = await User.findOne({ userName: normalizedUserName }).lean(); // Use .lean() here as well
    if (user) {
        const { password, ...userWithoutPassword } = user; // Exclude password
        return userWithoutPassword;
    }
    return null; // User not found
}

// Function to add a new user
async function addNewUser(user) {
    const normalizedUser = {
        ...user,
        userName: normalizeToUppercase(user.userName),
    };
    const newUser = new User(normalizedUser);
    await newUser.save();
}

// Function to delete a user by username (with normalization)
async function deleteUserByUserName(userName) {
    const normalizedUserName = normalizeToUppercase(userName);
    const result = await User.deleteOne({ userName: normalizedUserName });
    return result.deletedCount > 0 ? `User ${userName} has been deleted.` : `User ${userName} not found.`;
}

// Function to update a user by username (with normalization)
async function updateUserByUserName(userName, updates) {
    const normalizedUserName = normalizeToUppercase(userName);
    const normalizedUpdates = { ...updates };

    if (normalizedUpdates.userName) {
        normalizedUpdates.userName = normalizeToUppercase(normalizedUpdates.userName);
    }

    const result = await User.updateOne({ userName: normalizedUserName }, { $set: normalizedUpdates });
    return result.modifiedCount > 0 ? `User ${userName} has been updated.` : `User ${userName} not found.`;
}

module.exports = {
    existsUserName,
    getAllUsers,
    authenticateUser,
    getUserByUserName,
    addNewUser,
    deleteUserByUserName,
    updateUserByUserName,
};
