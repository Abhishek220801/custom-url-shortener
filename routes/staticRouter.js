const URL = require('../models/url')
const {restrictTo} = require('../middlewares/auth')

const express = require('express');

const router = express.Router();

router.get('/admin/urls', restrictTo(['ADMIN']), async(req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls: allUrls,
        userName: req.user.email
    })
})

router.get('/', restrictTo(['NORMAL','ADMIN']), async (req,res)=>{
    const allUrls = await URL.find({createdBy: req.user._id});
    return res.render('home',{
        urls: allUrls,
        userName: req.user.email
    })
})

router.get('/signup', (req,res)=>{
    return res.render('signup')
})

router.get('/login', (req,res)=>{
    // console.log(req.user.email)
    return res.render('login')
})

module.exports = router;