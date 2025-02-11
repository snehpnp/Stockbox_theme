"use strict";

const { Schema, model } = require('mongoose');

const BasicSettingSchema = new Schema({
    favicon: {
        type: String,
        trim: true,
        default: null
    },
    logo: {
        type: String,
        trim: true,
        default: null
    },
    website_title: {
        type: String,
        trim: true,
        default: null
    },
    email_address: {
        type: String,
        trim: true,
        default: null
    },
    contact_number: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    smtp_status: {
        type: Number,
        default: 0
    },
    smtp_host: {
        type: String,
        trim: true,
        default: null
    },
    smtp_port: {
        type: Number,
        default: 0
    },
    encryption: {
        type: String,
        trim: true,
        default: null
    },
    smtp_username: {
        type: String,
        trim: true,
        default: null
    },
    smtp_password: {
        type: String,
        trim: true,
        default: null
    },
    from_mail: {
        type: String,
        trim: true,
        default: null
    },
    from_name: {
        type: String,
        trim: true,
        default: null
    },
    to_mail: {
        type: String,
        trim: true,
        default: null
    },
    refer_title: {
        type: String,
        trim: true,
        default: null
    },
    refer_description: {
        type: String,
        trim: true,
        default: null
    },
    sender_earn: {
        type: String,
        trim: true,
        default: null
    },
    receiver_earn: {
        type: String,
        trim: true,
        default: null
    },
    refer_image: {
        type: String,
        trim: true,
        default: null
    },
    refer_status: {
        type: Number,
        trim: true,
        default: 0
    },
    surepass_token: {
        type: String,
        trim: true,
        default: null
    },
    digio_client_id: {
        type: String,
        trim: true,
        default: null
    },
    digio_client_secret: {
        type: String,
        trim: true,
        default: null
    },
    digio_template_name: {
        type: String,
        trim: true,
        default: null
    },
    razorpay_key: {
        type: String,
        trim: true,
        default: null
    },
    razorpay_secret: {
        type: String,
        trim: true,
        default: null
    },
    freetrial: {
        type: Number,
        trim: true,
        default: 0
    },
    staffstatus: {
        type: Number,
        trim: true,
        default: 1
    },
    kyc: {
        type: Number,
        trim: true,
        default: 1
    },
    company_key: {
        type: String,
        trim: true,
        default: null
    },
    cashexpiretime: {
        type: Number,
        trim: true,
        default: 0
    },
    foexpiretime: {
        type: Number,
        trim: true,
        default: 0
    },
    cashexpirehours: {
        type: Number,
        trim: true,
        default: 0
    },
    foexpirehours: {
        type: Number,
        trim: true,
        default: 0
    },
    aliceuserid: {
        type: String,
        trim: true,
        default: null
    },
    apikey: {
        type: String,
        trim: true,
        default: null
    },
    secretkey: {
        type: String,
        trim: true,
        default: null
    },
    authtoken: {
        type: String,
        trim: true,
        default: null
    },
    facebook: {
        type: String,
        trim: true,
        default: null
    },
    youtube: {
        type: String,
        trim: true,
        default: null
    },
    twitter: {
        type: String,
        trim: true,
        default: null
    },
    instagram: {
        type: String,
        trim: true,
        default: null
    },
    brokerloginstatus: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    paymentstatus: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    officepaymenystatus: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    invoicestatus: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    theme_id: {
        type: Schema.Types.ObjectId,
        ref: "Theme",
        default: null
      },
      offer_image: {
        type: String,
        trim: true,
        default: null
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const BasicSetting = model('BasicSetting', BasicSettingSchema);

module.exports = BasicSetting;
