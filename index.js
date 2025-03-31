const express = require('express');
const {connectMongoDb} = require('./connectDb')
const UrlRouter = require('./routes/url')
const URL = require('./models/url')

const app = express();
const PORT = 8001;

connectMongoDb('mongodb://localhost:27017/short-url')
    .then(()=>console.log(`MongoDB connected`));

app.use(express.json());

app.use('/', UrlRouter);

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