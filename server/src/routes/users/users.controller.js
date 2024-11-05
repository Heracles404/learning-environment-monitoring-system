const {getAllUsers,
    getUser,
    authenticateUser,
    getUserByUserName,
    addNewUser,
    existsUserName,
    deleteUserByUserName,
    updateUserByUserName} = require('../../models/users.model');

function httpGetAllUsers(req, res){
    return res.status(200).json(getAllUsers());
}

function httpGetUser(req, res) {
    const userName = req.params.userName;

    if (!existsUserName(userName)){
        return res.status(400).json({
            error: `User ${userName} not found...`
        })
    }else {
        return res.status(201).json(getUserByUserName(userName))
    }
}



function httpAuthenticateUser (req, res) {
    const user = req.body;

    // Check for missing required attributes
    if (!user.userName || !user.password) {
        return res.status(400).json({
            error: 'Missing required attributes'
        });
    }

    // Check if the user exists
    if (!existsUserName(user.userName)) {
        return res.status(400).json({
            error: `User  does not exist.`
        });
    }

    // Authenticate the user
    const authenticatedUser  = authenticateUser (user.userName, user.password);

    // Check if authentication was successful
    if (authenticatedUser ) {
        return res.status(200).json(authenticatedUser ); // Return user data without password
    } else {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }
}


function httpAddNewUser(req, res){
    const user = req.body;
    if(!user.userName || !user.password || !user.role || !user.firstName || !user.lastName){
        return res.status(400).json({
            error: 'Missing required attributes'
        });
    }

    if (existsUserName(user.userName)) {
        return res.status(400).json({
            error: `UserName ${user.userName} already exists.`
        });
    }

    addNewUser(user);
    return res.status(201).json(user);
}

function httpDeleteUser(req, res){
    const userName = req.params.userName;

    if(existsUserName(userName)){
        deleteUserByUserName(userName);
        return res.status(201).json(`User ${userName} has been deleted...`);
    }else
    {
        return res.status(404).json({
            error: `User ${userName} not found...`
        });
    }

}

function  httpUpdateUser(req, res){
    const userName = req.params.userName;
    const updates = req.body;

    if(existsUserName(userName)){
        const content = updateUserByUserName(userName, updates);
        return res.status(201).json(`User ${userName} has been updated...`);
    }else{
        return res.status(404).json({
            error: `User ${userName} not found...`
        });
    }
}

module.exports = {
    httpGetAllUsers,
    httpGetUser,
    httpAuthenticateUser,
    httpAddNewUser,
    httpDeleteUser,
    httpUpdateUser
}