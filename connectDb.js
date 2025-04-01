const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connectMongoDb(url){
    return mongoose.connect(url||process.env.MONGODB_URI);
}

module.exports = {connectMongoDb};    