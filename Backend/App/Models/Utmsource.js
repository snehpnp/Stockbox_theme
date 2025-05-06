"use strict"

const { Schema, model } = require('mongoose');

const UtmsourceModel = Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    utmcount: {
        type: Number,
        default: 0
    },
  
   
    
},
    {
        timestamps: true
    },

)
const Utmsource_Model = model('Utmsource', UtmsourceModel);



module.exports = Utmsource_Model;
