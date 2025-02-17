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
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching users' });
    }
}

async function httpGetUser (req, res) {
    const userName = req.params.userName;

    try {
        if (!await existsUserName(userName)) {
            return res.status(404).json({
                error: `User ${userName} not found...`
            });
        } else {
            const user = await getUserByUserName(userName);
            return res.status(200).json(user);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user' });
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

    try {
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
    } catch (error) {
        return res.status(500).json({ error: 'Error authenticating user' });
    }
}

async function httpAddNewUser (req, res) {
    const user = req.body;
    if (!user.userName || !user.password || !user.role || !user.firstName || !user.lastName) {
        return res.status(400).json({
            error: 'Missing required attributes'
        });
    }

    try {
        if (await existsUserName(user.userName)) {
            return res.status(400).json({
                error: `User  Name ${user.userName} already exists.`
            });
        }

        await addNewUser (user);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error adding new user' });
    }
}

async function httpDeleteUser (req, res) {
    const userName = req.params.userName;

    try {
        const message = await deleteUserByUserName(userName);
        if (message.includes('deleted')) {
            return res.status(200).json(message);
        } else {
            return res.status(404).json({
                error: message
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting user' });
    }
}

async function httpUpdateUser (req, res) {
    const userName = req.params.userName;
    const updates = req.body;

    try {
        if (!await existsUserName(userName)) {
            return res.status(404).json({
                error: `User ${userName} not found.`
            });
        }

        const result = await updateUserByUserName(userName, updates);

        if (result.modifiedCount > 0) {
            return res.status(200).json({
                message: `User ${userName} has been updated.`
            });
        } else {
            return res.status(200).json({
                message: `No changes were made.`
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating user' });
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