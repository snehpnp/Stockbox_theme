"use strict";

const { Schema, model } = require('mongoose');

const ReferSchema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    senderearn: {
        type: Number,
        default: 0,
        min: 0
    },
    receiverearn: {
        type: Number,
        default: 0,
        min: 0
    },
    senderamount: {
        type: Number,
        default: 0,
        min: 0
    },
    receiveramount: {
        type: Number,
        default: 0,
        min: 0
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
const Refer = model('Refer', ReferSchema);

module.exports = Refer;
