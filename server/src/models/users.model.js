const argon2 = require('argon2');
const User = require('../schema/userSchema');

// Function to check if a username exists
async function existsUserName(userName) {
    try {
        const user = await User.findOne({ userName });
        return user !== null;
    } catch (error) {
        throw new Error('Error checking username existence');
    }
}

// Function to get all users
async function getAllUsers() {
    try {
        const users = await User.find().lean();
        return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    } catch (error) {
        throw new Error('Error fetching users');
    }
}

// Function to authenticate a user
async function authenticateUser (userName, password) {
    try {
        const user = await User.findOne({ userName }).lean();
        if (user && await argon2.verify(user.password, password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        throw new Error('Error authenticating user');
    }
}

// Function to get a user by username
async function getUserByUserName(userName) {
    try {
        const user = await User.findOne({ userName }).lean();
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    } catch (error) {
        throw new Error('Error fetching user');
    }
}

// Function to add a new user
async function addNewUser (user) {
    try {
        const hashedPassword = await argon2.hash(user.password);
        const newUser  = new User({ ...user, password: hashedPassword });
        await newUser .save();
    } catch (error) {
        throw new Error('Error adding new user');
    }
}

// Function to delete a user by username
async function deleteUserByUserName(userName) {
    try {
        const result = await User.deleteOne({ userName });
        return result.deletedCount > 0 ? `User ${userName} has been deleted.` : `User  ${userName} not found.`;
    } catch (error) {
        throw new Error('Error deleting user');
    }
}

// Function to update a user by username
async function updateUserByUserName(userName, updates) {
    try {
        // Hash the password if included in the updates
        if (updates.password) {
            updates.password = await argon2.hash(updates.password);
        }
        const result = await User.updateOne({ userName }, { $set: updates });
        return result;
    } catch (error) {
        throw new Error('Error updating user');
    }
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