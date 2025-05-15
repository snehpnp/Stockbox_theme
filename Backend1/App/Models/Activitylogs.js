"use strict"

const { Schema, model } = require('mongoose');

const ActivitylogsModel = Schema({
    message: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    olddays: {
        type: String,
        trim: true,
        default: null
    },
    newdays: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
   
    
},
    {
        timestamps: true
    },

)
const Activitylogs_Model = model('Activitylogs', ActivitylogsModel);



module.exports = Activitylogs_Model;
