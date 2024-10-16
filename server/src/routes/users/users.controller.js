const {getAllUsers, addNewUser,existsUserId, deleteUserById} = require('../../models/users.model');

function httpGetAllUsers(req, res){
    return res.status(200).json(getAllUsers());
}

function httpAddNewUser(req, res){
    const user = req.body;
    if(!user.userName || !user.password || !user.role || !user.firstName || !user.lastName){
        return res.status(400).json({
           error: 'Missing required attributes'
        });
    }

    addNewUser(user);
    return res.status(200).json(user);
}

function httpDeleteUser(req, res){
    const userId = Number(req.params.id);

    if(existsUserId(userId)){
        deleteUserById(userId);
    }else
    {
        return res.status(404).json({
            error: `User ID ${userId} not found...`
        });
    }

}

module.exports = {
    httpGetAllUsers,
    httpAddNewUser,
    httpDeleteUser
}
