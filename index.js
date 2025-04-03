const express = require('express');
const {connectMongoDb} = require('./connectDb')
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
require('dotenv').config();
const path = require('path')
const URL = require('./models/url')
const {checkForAuthentication, restrictTo} = require('./middlewares/auth')

const UrlRouter = require('./routes/url')
const staticRouter = require('./routes/staticRouter')
const userRouter = require('./routes/user')

const app = express();
const PORT = process.env.PORT || 8001;

connectMongoDb('mongodb://localhost:27017/short-url')
    .then(()=>console.log('MongoDB connected'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, './')));

app.use(express.json()); //for JSON data
app.use(express.urlencoded({extended: false})); //for form data
app.use(cookieParser()); //for cookie
app.use(checkForAuthentication); //for all subsequent requests

app.use('/url', restrictTo(['NORMAL', 'ADMIN']), UrlRouter);
app.use('/user', userRouter)
app.use('/', staticRouter);

// app.get('/test', async (req,res)=>{
//     const allUrls = await URL.find({});
//     return res.render('home', {
//         urls: allUrls
//     })
// })

app.get('/:shortId', async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {timestamp: Date.now()}
        }
    },
    {
        new: true
    })
    if(!entry){
        return res.status(404).send('Short URL not found');
    }
    res.redirect(entry.redirectUrl);
})

app.listen(PORT, ()=>console.log(`Server started at PORT: ${PORT}`))
