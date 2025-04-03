const {getUserBySession} = require('../service/auth');

function checkForAuthentication(req,res,next){
    const tokenCookie = req.cookies?.token;
    req.user = null;
    if(!tokenCookie) return next();
    const token = tokenCookie;
    const user = getUserBySession(token);
    req.user = user;
    return next();
}

function restrictTo(roles = []){
    return function(req,res,next){
        if(!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)) return res.status(403).end('Unauthorized')
        return next();
    }
}

module.exports = {checkForAuthentication, restrictTo};