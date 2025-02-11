"use strict";

const { Schema, model } = require('mongoose');

const RequestclientSchema = new Schema({
    clientid: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    id: {
        type: Schema.Types.ObjectId,
        trim: true
    },
    status: {
        type: Number,
        default: 0,
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the record is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Requestclient = model('Requestclient', RequestclientSchema);



module.exports = Requestclient;
