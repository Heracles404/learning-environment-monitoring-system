const {getAllUsers,
    getUser,
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
        return res.status(201).json(getUser(userName))
    }
}


function httpAddNewUser(req, res){
    const user = req.body;
    if(!user.userName || !user.password || !user.role || !user.firstName || !user.lastName){
        return res.status(400).json({
           error: 'Missing required attributes'
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
    httpAddNewUser,
    httpDeleteUser,
    httpUpdateUser
}
