const express = require('express');
const {connectMongoDb} = require('./connectDb')
const UrlRouter = require('./routes/url')
const ejs = require('ejs');
require('dotenv').config();
const path = require('path')
const staticRouter = require('./routes/staticRouter')
const URL = require('./models/url')

const app = express();
const PORT = process.env.PORT || 8001;


connectMongoDb(process.env.MONGODB_URI)
    .then(()=>console.log(`MongoDB connected`));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, './')));

app.use(express.json()); //for JSON data
app.use(express.urlencoded({extended: false})); //for form data

app.use('/url', UrlRouter);
app.use('/', staticRouter);

app.get('/test', async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls
    })
})

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