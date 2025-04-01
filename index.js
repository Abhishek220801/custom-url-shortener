const express = require('express');
const {connectMongoDb} = require('./connectDb')
const UrlRouter = require('./routes/url')
const ejs = require('ejs');
const path = require('path')
const staticRouter = require('./routes/staticRouter')
const URL = require('./models/url')

const app = express();
const PORT = 8001;

connectMongoDb('mongodb://localhost:27017/short-url')
    .then(()=>console.log(`MongoDB connected`));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

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