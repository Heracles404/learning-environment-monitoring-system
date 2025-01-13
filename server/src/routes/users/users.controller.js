const {
    getAllUsers,
    authenticateUser ,
    getUserByUserName,
    addNewUser ,
    existsUserName,
    deleteUserByUserName,
    updateUserByUserName
} = require('../../models/users.model');

async function httpGetAllUsers(req, res) {
    const users = await getAllUsers();
    return res.status(200).json(users);
}

async function httpGetUser (req, res) {
    const userName = req.params.userName;

    if (!await existsUserName(userName)) {
        return res.status(404).json({
            error: `User  ${userName} not found...`
        });
    } else {
        const user = await getUserByUserName(userName);
        return res.status(200).json(user);
    }
}

async function httpAuthenticateUser (req, res) {
    const user = req.body;

    // Check for missing required attributes
    if (!user.userName || !user.password) {
        return res.status(400).json({
            error: 'Missing required attributes'
        });
    }

    // Check if the user exists
    if (!await existsUserName(user.userName)) {
        return res.status(404).json({
            error: `User  does not exist.`
        });
    }

    // Authenticate the user
    const authenticatedUser  = await authenticateUser (user.userName, user.password);

    // Check if authentication was successful
    if (authenticatedUser ) {
        return res.status(200).json(authenticatedUser ); // Return user data without password
    } else {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }
}

async function httpAddNewUser (req, res) {
    const user = req.body;
    if (!user.userName || !user.password || !user.role || !user.firstName || !user.lastName) {
        return res.status(400).json({
            error: 'Missing required attributes'
        });
    }

    if (await existsUserName(user.userName)) {
        return res.status(400).json({
            error: `User Name ${user.userName} already exists.`
        });
    }

    await addNewUser (user);
    return res.status(201).json(user);
}

async function httpDeleteUser (req, res) {
    const userName = req.params.userName;

    const message = await deleteUserByUserName(userName);
    if (message.includes('deleted')) {
        return res.status(200).json(message);
    } else {
        return res.status(404).json({
            error: message
        });
    }
}

async function httpUpdateUser (req, res) {
    const userName = req.params.userName;
    const updates = req.body;

    const message = await updateUserByUserName(userName, updates);
    if (message.includes('updated')) {
        return res.status(200).json(message);
    } else {
        return res.status(404).json({
            error: message
        });
    }
}

module.exports = {
    httpGetAllUsers,
    httpGetUser ,
    httpAuthenticateUser ,
    httpAddNewUser ,
    httpDeleteUser ,
    httpUpdateUser
};