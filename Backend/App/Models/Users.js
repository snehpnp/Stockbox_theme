"use strict"

const { Schema, model } = require('mongoose');

const userModel = Schema({
    FullName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    UserName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    PhoneNo: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 10,
        default: null
    },
    password:{
        type:String,
        required: true,
        trim: true,
        default: null
    },
    Role: {
        type: Number,
        default: 2
    },  
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    permissions: [{ type: String }],
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    ActiveStatus: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    forgotPasswordToken: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: null // Token field to store the random 20-character token
      },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: null,
    }
    
    
},
    {
        timestamps: true
    },

)
const User_model = model('USERS', userModel);




module.exports = User_model;
