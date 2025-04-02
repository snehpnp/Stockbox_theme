"use strict";

const { Schema, model } = require('mongoose');

const PlanmanageSchema = new Schema({
   
    clientid: {
        type: String,
        trim: true,
        default: null
    },
    serviceid: {
        type: String,
        trim: true,
        default: null
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Planmanage = model('Planmanage', PlanmanageSchema);

module.exports = Planmanage;
