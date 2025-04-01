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


// Vercel-optimized MongoDB connection
let isDbConnected = false;
const connectDB = async () => {
  if (!isDbConnected) {
    await connectMongoDb(process.env.MONGODB_URI);
    isDbConnected = true;
  }
};

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

// Health check endpoint
app.get('/ping', (req, res) => res.send('pong'));

// Warmup endpoint for Vercel
app.get('/_warmup', async (req, res) => {
  await connectDB();
  res.send('Warmed up');
});


app.listen(PORT, ()=>console.log(`Server started at PORT: ${PORT}`))

// Export as Vercel serverless function
module.exports = app;