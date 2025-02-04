"use strict";


require('dotenv').config();
const mongoConnection = require("./App/Connection/Connection.js");
const express = require("express");
const app = express();
var axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
// const Papa = require('papaparse');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");
const bodyparser = require('body-parser');
const db = require("./App/Models/index.js");
//const { AddBulkStockCron } = require('./App/Controllers/Cron.js'); 
process.env.TZ = 'Asia/Kolkata'; // Set the global time zone to IST

const nodemailer = require('nodemailer');
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    credentials: true
  }
});



io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });


  socket.on("deactivestaff", (staffId) => {
    io.emit("forceLogout", staffId);
  });

});


require("./App/Utils/ioSocketReturn.js")(app, io);
const { sendFCMNotification } = require('./App/Controllers/Pushnotification.js');

require('./App/Controllers/Cron.js');
require('./App/Utils/Settimeout.js');

const Clients_Modal = db.Clients;
const BasicSetting_Modal = db.BasicSetting;
const Activitylogs_Modal = db.Activitylogs;
const Blogs_Modal = db.Blogs;
const News_Modal = db.News;
const Coupon_Modal = db.Coupon;
const Role_Modal = db.Role;
const Service_Modal = db.Service;
const Users_Modal = db.Users;
const Faq_Modal = db.Faq;
const Plan_Modal = db.Plan;
const Stock_Modal = db.Stock;
const Basket_Modal = db.Basket;
const Script_Modal = db.Script;
const Signal_Modal = db.Signal;
const Banner_Modal = db.Banner;
const Plancategory_Modal = db.Plancategory;
const PlanSubscription_Modal = db.PlanSubscription;
const Content_Modal = db.Content;
const BasketSubscription_Modal = db.BasketSubscription;
const Mailtemplate_Modal = db.Mailtemplate;
const Refer_Modal = db.Refer;
const Planmanage = db.Planmanage;
const Payout_Modal = db.Payout;
const Order_Modal = db.Order;
const Freetrial_Modal = db.Freetrial;
const Helpdesk_Modal = db.Helpdesk;
const Broadcast_Modal = db.Broadcast;
const License_Modal = db.License;
const Notification_Modal = db.Notification;
const Bank_Modal = db.Bank;
const Adminnotification_Modal = db.Adminnotification;
const Basketstock_Modal = db.Basketstock;
const Liveprice_Modal = db.Liveprice;
const Requestclient_Modal = db.Requestclient;
const Stockrating_Modal = db.Stockrating;
const Addtocart_Modal = db.Addtocart;


const { Alice_Socket } = require("./App/Utils/AliceSocket.js");


const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept", "authorization",
  ],
};
app.options("*", cors())

app.use(cors(corsOpts));

// Body-parser middleware setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb', extended: true }));


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

let ws;
const url = "wss://ws1.aliceblueonline.com/NorenWS/"
app.get("/test", async (req, res) => {
  Alice_Socket();
});




require('./App/Routes/index')(app)
require('./App/api/Routes/index')(app)

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

