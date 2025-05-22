"use strict";

const { Schema, model } = require('mongoose');

const RatingSchema = new Schema({
   
     client_id: {
        type: Schema.Types.ObjectId,
        ref: 'CLIENTS', // Assuming there's a 'Client' model to reference
        required: true
    },
    text: {
        type: String,
        trim: true,
        default: null
    },
   rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Rating = model('Rating', RatingSchema);

module.exports = Rating;
