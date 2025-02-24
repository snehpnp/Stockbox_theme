"use strict"

const { Schema, model } = require('mongoose');

const Adminnotification = Schema({
    clientid: {
        type: String,
        trim: true,
        default: null
    },
    segmentid: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    title: {
        type: String,
        trim: true,
        default: null
    },
    message: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Number,
        enum: [0, 1], // Example statuses
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
   
},
    {
        timestamps: true
    },

)
const Adminnotification_Model = model('Adminnotification', Adminnotification);



module.exports = Adminnotification_Model;
