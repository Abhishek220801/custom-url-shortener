const {v4: uuidv4} = require('uuid')
const User = require('../models/user');
const {setUser} = require('../service/auth');

async function handleUserSignup(req,res){
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({email});
    if(existingUser){
        return res.render('signup', {error: 'Email already in use'})
    }
    const newUser = await User.create({name,email,password});
    
    const sessionId = uuidv4();
    setUser(sessionId, newUser);
    res.cookie('uid', sessionId);

    return res.redirect('/');
}

async function handleUserLogin(req,res){
    const { email, password } = req.body;
    const user = await User.findOne({email,password});
    console.log(user);
    if(!user) return res.render('login',{
        error: 'Invalid username or password'
    })
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie('uid', sessionId);
    return res.redirect('/');
}

module.exports = {handleUserSignup, handleUserLogin};