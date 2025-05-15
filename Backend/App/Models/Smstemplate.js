"use strict";

const { Schema, model } = require('mongoose');

const SmsemplateSchema = new Schema({
    sms_type: {
        type: String,
        required: true,
        trim: true
    },
    templateid: {
        type: String,
        required: true,
        trim: true
    },
    sms_body: {
        type: String,
        required: true,
        trim: true // assuming true means active and false means inactive
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Smstemplate = model('Smstemplate', SmsemplateSchema);

module.exports = Smstemplate;
