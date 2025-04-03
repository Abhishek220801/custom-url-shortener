const jwt = require('jsonwebtoken');
const SECRET = 'Abhishek$$99137';

// const sessionIdToUserMap = new Map(); //hashmap to track session and its respective user

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email
    }, SECRET);
}

function getUserBySession(token){
    if(!token) return null;
    try {
        console.log(token)
        return jwt.verify(token,SECRET);
    } catch (error) {
        console.error("Error in getUserBySession:", error.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUserBySession,
}