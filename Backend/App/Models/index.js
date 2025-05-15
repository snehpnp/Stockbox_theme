const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(uri);
const db_GET_VIEW = client.db(process.env.DB_NAME);

const open_position = db_GET_VIEW.collection('open_position');
const open_position_excute = db_GET_VIEW.collection('open_position_excute');



module.exports = {
    Clients: require("./Clients"),
    Activitylogs: require("./Activitylogs"),
    Users: require("./Users"),
    BasicSetting: require("./BasicSetting"),
    Blogs: require("./Blogs"),
    News: require("./News"),
    Coupon: require("./Coupon"),
    Plan: require("./Plan"),
    PlanSubscription: require("./PlanSubscription"),
    Refer: require("./Refer"),
    Role: require("./Role"),
    Service: require("./Service"),
    Users: require("./Users"),
    Faq: require("./Faq"),
    Stock: require("./Stock"),
    Basket: require("./Basket"),
    Script: require("./Script"),
    Signal: require("./Signal"),
    Banner: require("./Banner"),
    Plancategory: require("./Plancategory"),
    Content: require("./Content"),
    BasketSubscription: require("./BasketSubscription"),
    Mailtemplate: require("./Mailtemplate"),
    Planmanage: require("./Planmanage"),
    Payout: require("./Payout"),
    Order: require("./Order"),
    Freetrial: require("./Freetrial"),
    Helpdesk: require("./Helpdesk"),
    Broadcast: require("./Broadcast"),
    License: require("./License"),
    Notification: require("./Notification"),
    Bank: require("./Bank"),
    Adminnotification: require("./Adminnotification"),
    Liveprice: require("./Liveprice"),
    Basketstock: require("./Basketstock"),
    Basketorder: require("./Basketorder"),
    Requestclient: require("./Requestclient"),
    Company :require("./Company"),
    ThemeModal: require("./Theme"),
    Company1 :require("./Company1"),
    Stockrating :require("./Stockrating"),
    Addtocart :require("./Addtocart"),


    open_position:open_position,
    open_position_excute:open_position_excute,










}