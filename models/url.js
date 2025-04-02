const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    referenceName: {
        type: String,
        required: true // Make sure it's required to always have a value
    },
    visitHistory: [{timestamp: {type: Number}}],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
},
    {timestamps: true}
)

const URL = mongoose.model('url', urlSchema);

module.exports = URL; 