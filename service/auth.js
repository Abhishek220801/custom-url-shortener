const sessionIdToUserMap = new Map(); //hashmap to track session and its respective user

function setUser(id, user){
    sessionIdToUserMap.set(id, user);
}

function getUserBySession(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUserBySession,
}