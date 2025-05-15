"use strict";

const { Schema, model } = require('mongoose');

const BannerSchema = new Schema({
   
    image: {
        type: String,
        trim: true,
        default: null
    },
    hyperlink: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
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
const Banner = model('Banner', BannerSchema);

module.exports = Banner;
