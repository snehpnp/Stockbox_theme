"use strict";

const { Schema, model } = require('mongoose');

const FreetrialSchema = new Schema({
   
    clientid: {
        type: String,
        trim: true,
        default: null
    },
    startdate: {
        type: Date,
        default: null 
    },
    enddate: {
        type: Date,
        default: null
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Freetrial = model('Freetrial', FreetrialSchema);

module.exports = Freetrial;
