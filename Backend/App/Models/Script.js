"use strict"

const { Schema, model } = require('mongoose');

const scriptModel = Schema({
    price: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    basket: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    calltype: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    stock: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    tag1:{
        type:String,
        required: true,
        trim: true,
        default: null
    },
    tag2:{
        type:String,
        trim: true,
        default: null
    }, 
    tag3:{
        type:String,
        trim: true,
        default: null
    }, 
    stoploss:{
        type:String,
        trim: true,
        default: null
    }, 
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    }
  
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const Script_model = model('Script', scriptModel);



module.exports = Script_model;
