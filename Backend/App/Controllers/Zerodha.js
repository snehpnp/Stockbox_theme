var axios = require('axios');
var dateTime = require('node-datetime');
const sha256 = require('js-sha256');
"use strict";
const db = require("../Models");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Clients_Modal = db.Clients;
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Order_Modal = db.Order;
const BasicSetting_Modal = db.BasicSetting;
const Basketorder_Modal = db.Basketorder;
const Signalsdata_Modal = db.Signalsdata;
const Signalstock_Modal = db.Signalstock;

const qs = require("querystring");
const jwt = require("jsonwebtoken");
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

class Zerodha {

    async GetAccessToken(req, res) {


        try {

                var keystr = req.query.key;
               // const key = keystr.split('?request_token=')[0];
                let key = decodeURIComponent(keystr.split('?request_token=')[0] || "");
                key = key.replace(/\s/g, "+"); 
                
                const request_token = req.query.request_token;



            const client = await Clients_Modal.findOne({ Email: keystr,ActiveStatus:1,del:0 });


            // Check if the client exists
            if (!client) {
             //   if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                                      return res.status(404).json({
                                          status: false,
                                          message: "Client not found"
                                      });
                                //  } else {
                                //      const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                                //      return res.redirect(dynamicUrl);
                                //  }
            }

            if (req.query.request_token) {

              

                let api_key = client.apikey;
                let api_secret = client.apisecret;
                let checksum = sha256(api_key + request_token + api_secret);
                let data = 'api_key=' + api_key + '&request_token=' + request_token + '&checksum=' + checksum;
                
                const config = {
                    method: 'post',
                    url: 'https://api.kite.trade/session/token',
                    headers: {
                        'X-Kite-Version': '3'
                    },
                    data: data
                };
            
                const response = await axios(config);
                
                try {
                   
                    if (response.data.status == "success") {
                        const brokerlink = await Clients_Modal.findOneAndUpdate(
                            {
                                Email: keystr,
                                del: 0,
                                ActiveStatus: 1  // or use 1 if that's how it's stored in DB
                              },
                            {
                                authtoken: response.data.data.access_token,  // Update authtoken
                                dlinkstatus: 1,         // Update dlinkstatus
                                tradingstatus: 1,        // Update tradingstatus
                              //  alice_userid: response.data.data.public_token
                            },
                            { new: true }  // Return the updated document
                        );



                     //   if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                            return res.json({
                                status: true,
                                message: "Broker login successfully",
                            });
                    //    } else {
                    //        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                    //        return res.redirect(dynamicUrl);
                    //    }

                      
                    }
                    else
                    {

                     //   if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                            return res.status(500).json({ status: false, message: response.data });
                    //    } else {
                    //        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                    //        return res.redirect(dynamicUrl);
                    //    }
                       

                    }

                } catch (error) {

                  //  if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                        return res.status(500).json({ status: false, message: "Server error" });
                //    } else {
                //        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                //        return res.redirect(dynamicUrl);
                //    }

                    
                }

            } else {
             //   if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                    return res.status(400).json({ status: false, message: "Request Token is required" });
            //    } else {
            //        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
            //        return res.redirect(dynamicUrl);
            //    }


                
            }
        } catch (error) {

           // if (req.headers['user-agent'] && req.headers['user-agent'].includes('okhttp')) {
                return res.status(500).json({ status: false, message: error.message || "Server error" });

        //    } else {
        //        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
        //        return res.redirect(dynamicUrl);
        //    }

        }
    }

    async placeOrder(req, res) {

        try {
            const { id, signalid, quantity, price, tsprice, tsstatus, slprice, exitquantity } = req.body;
            const client = await Clients_Modal.findById(id);
           
           
            if (!client) {
                return res.status(404).json({
                    status: false,
                    message: "Client not found"
                });
            }


            if (client.tradingstatus == 0) {
                return res.status(404).json({
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                });
            }


            const signal = await Signal_Modal.findById(signalid);
            if (!signal) {
                return res.status(404).json({
                    status: false,
                    message: "Signal not found"
                });
            }



            const authToken = client.authtoken;
            const apikey = client.apikey;


            let optiontype, exchange, producttype,segment;

            if (signal.segment === "C") {
                optiontype = "EQ";
                exchange = "NSE";
            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NFO";
            }

            // Determine product type based on segment and call duration
            if (signal.callduration === "Intraday") {
                producttype = "MIS";
            } else {
                producttype = signal.segment === "C" ? "CNC" : "NRML";
            }

            // Query Stock_Modal based on segment type
            let stock;
            if (signal.segment === "C") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    //    option_type: optiontype 
                });
            } else if (signal.segment === "F") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    //    option_type: optiontype 
                });
            } else {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    option_type: optiontype,
                    strike: signal.strikeprice
                });
            }


            if (!stock) {
                return res.status(404).json({
                    status: false,
                    message: "Stock not found"
                });
            }

           

          let  tradingsymbol;
            const pattern = stock.instrument_token;
            let filePath_token = '../../tokenzerodha/Zerodha.csv';
            const filePath1 = path.join(__dirname, filePath_token);
            
         
            const searchToken = stock.instrument_token; // Instrument Token to search

            fs.readFile(filePath1, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file: ${err.message}`);
                    return;
                }
            
                const lines = data.split('\n');
            
                for (const line of lines) {
                    const parts = line.split(','); // Splitting by comma
                    if (parts.length > 2 && parts[1] === searchToken) { // Checking for match in the second column
                        tradingsymbol = parts[2]; // Storing in variable
                       break;
                    }
                }
            
             if (signal.segment && signal.segment.toLowerCase() === 'c') {
                 tradingsymbol = stock.symbol;
             }
             else
             {
                tradingsymbol = tradingsymbol;
             }



    let datas = 'tradingsymbol=' + tradingsymbol +
    '&exchange=' + exchange +
    '&transaction_type=' + signal.calltype +
    '&quantity=' + quantity +
    '&order_type=MARKET' +
    '&product=' + producttype +
    '&price=' + price +
    '&trigger_price=0.00' +
    '&validity=DAY';

    let config = {
        method: 'post',
        url: 'https://api.kite.trade/orders/regular',
        headers: {
            'Authorization': 'token ' + apikey + ':' + authToken
        },
        data: datas
    };

    axios(config)
        .then(async (response) => {

            if (response.data.status == "success") {

                const finalExitQuantity = exitquantity && exitquantity > 0 ? exitquantity : quantity;
                const order = new Order_Modal({
                    clientid: client._id,
                    signalid: signal._id,
                    orderid: response.data.data.order_id,
                    ordertype: signal.calltype,
                    borkerid: 5,
                    quantity: quantity,
                    ordertoken: stock.instrument_token,
                    tsprice: tsprice,
                    slprice:slprice,
                    exitquantity:finalExitQuantity,
                    tsstatus: tsstatus,
                    exchange: exchange
                });



                await order.save();
                return res.json({
                    status: true,
                    data: response.data ? null : "Order Successfully",
                });
            }
            else {

                return res.status(500).json({
                    status: false,
                    message: response.data
                });
            }

        })
        .catch(async (error) => {
            const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

            let url;
            if (message == "") {
                url = `https://kite.zerodha.com/connect/login?v=3&api_key=${client.apikey}`;
            }

            return res.status(500).json({
                status: false,
                url: url,
                message: message
            });

        });


});

      

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            });
        }
    }


    async ExitplaceOrder(req, res) {
        try {
            const { id, signalid, quantity, price } = req.body;
    
            const client = await Clients_Modal.findById(id);
            if (!client) {
                return res.status(404).json({ status: false, message: "Client not found" });
            }
    
            if (client.tradingstatus == 0) {
                return res.status(404).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            const signal = await Signal_Modal.findById(signalid);
            if (!signal) {
                return res.status(404).json({ status: false, message: "Signal not found" });
            }
    
            const authToken = client.authtoken;
            const apikey = client.apikey;
    
            let optiontype, exchange, producttype;
            if (signal.segment === "C") {
                optiontype = "EQ";
                exchange = "NSE";
            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NFO";
            }
    
            producttype = (signal.callduration === "Intraday") ? "MIS" : (signal.segment === "C" ? "CNC" : "NRML");
    
            let stock;
            if (signal.segment === "C") {
                stock = await Stock_Modal.findOne({ symbol: signal.stock, segment: signal.segment });
            } else if (signal.segment === "F") {
                stock = await Stock_Modal.findOne({ symbol: signal.stock, segment: signal.segment, expiry: signal.expirydate });
            } else {
                stock = await Stock_Modal.findOne({ symbol: signal.stock, segment: signal.segment, expiry: signal.expirydate, strike: signal.strikeprice });
            }
    
            if (!stock) {
                return res.status(404).json({ status: false, message: "Stock not found" });
            }
    
            let tradingsymbol;
            const searchToken = stock.instrument_token;
            const filePath_token = '../../tokenzerodha/Zerodha.csv';
            const filePath1 = path.join(__dirname, filePath_token);
    
            try {
                const data = await fs.promises.readFile(filePath1, 'utf8');
                const lines = data.split('\n');
    
                for (const line of lines) {
                    const parts = line.split(','); 
                    if (parts.length > 2 && parts[1] === searchToken) { 
                        tradingsymbol = parts[2]; 
                        break;
                    }
                }
    
                if (!tradingsymbol) {
                    tradingsymbol = stock.symbol;
                }
            } catch (err) {
                console.error("Error reading file:", err.message);
                return res.status(500).json({ status: false, message: "Error reading token file" });
            }
    
            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;
    
            try {
                positionData = await CheckPosition(apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, tradingsymbol);
            } catch (error) {}
    
            if (stock.segment === "C") {
                try {
                    holdingData = await CheckHolding(apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype,tradingsymbol);
                } catch (error) {}
    
                totalValue = (Number(positionData.qty) || 0) + (Number(holdingData.qty) || 0);
            } else {
                totalValue = Math.abs(positionData.qty);
            }
    
            let calltypes = signal.calltype === 'BUY' ? "SELL" : "BUY";
    
            if (totalValue >= quantity) {
                let datas = `tradingsymbol=${tradingsymbol}&exchange=${exchange}&transaction_type=${signal.calltype}&quantity=${quantity}&order_type=MARKET&product=${producttype}&price=${price}&trigger_price=0.00&validity=DAY`;
    
                let config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',
                    headers: { 'Authorization': `token ${apikey}:${authToken}` },
                    data: datas
                };
    
                axios(config)
                    .then(async (response) => {
                        if (response.data.status === "success") {
                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.order_id,
                                ordertype: calltypes,
                                borkerid: 5,
                                quantity: quantity,
                            });
    
                            await order.save();
    
                            const orderupdate = await Order_Modal.findOne({ clientid: id, signalid, borkerid: 5 });
                            if (orderupdate) {
                                orderupdate.tsstatus = 0;
                                await orderupdate.save();
                            }
    
                            return res.json({ status: true, data: response.data ? null : "Order Successfully" });
                        } else {
                            return res.status(500).json({ status: false, message: response.data });
                        }
                    }) 
                    .catch(async (error) => {
                        const message = (JSON.stringify(error.response?.data) || "").replace(/["',]/g, '');
                        let url = message === "" ? `https://kite.zerodha.com/connect/login?v=3&api_key=${client.apikey}` : null;
    
                        return res.status(500).json({ status: false, url: url, message: message });
                    });
            } else {
                return res.status(500).json({ status: false, message: "Sorry, the requested quantity is not available." });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            });
        }
    }
    



    async checkOrder(req, res) {

        try {
            const { orderid, clientid } = req.body;

            const order = await Order_Modal.findOne({
                clientid: clientid,
                orderid: orderid
            });

            if (!order) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this client"
                });
            }




            const client = await Clients_Modal.findById(clientid);
            if (!client) {
                return res.status(404).json({
                    status: false,
                    message: "Client not found"
                });
            }





            if (order.status == 1) {

                return res.json({
                    status: true,
                    response: order.data
                });
            }

            if (client.tradingstatus == 0) {
                return res.status(404).json({
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                });
            }


            if (order.borkerid != 5) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const apikey = client.apikey;



                var config = {
                    method: 'get',
                    url: 'https://api.kite.trade/orders/' + orderid,
                    headers: {
                        'Authorization': 'token ' + apikey + ':' + authToken
                    }
                };

            const response = await axios(config);

            order.data = response.data;
            order.status = 1;
            await order.save();

            return res.json({
                status: true,
                response: response.data
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "Error occurred while fetching order details."
            });
        }
    }
    

    async orderexitzerodha(item){
      

        try {

            const { clientid, signalid, quantity, stockInfo_lp, exitquantity, _id } = item;

            const orderss = await Order_Modal.findById(_id);
            if (orderss) {
                orderss.tsstatus = 0;
                await orderss.save();
              }

           
            const price =stockInfo_lp;
            const client = await Clients_Modal.findById(clientid);
            if (!client) {
                return{
                    status: false,
                    message: "Client not found"
                };
              
            }


            if (client.tradingstatus == 0) {
                return {
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                };
            }


            const signal = await Signal_Modal.findById(signalid);
            if (!signal) {
                return {
                    status: false,
                    message: "Signal not found"
                };
            }


            const authToken = client.authtoken;
            const apikey = client.apikey;


            let optiontype, exchange, producttype;

            if (signal.segment === "C") {
                optiontype = "EQ";
                exchange = "NSE";
            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NFO";
            }

            // Determine product type based on segment and call duration
            if (signal.callduration === "Intraday") {
                producttype = "MIS";
            } else {
                producttype = signal.segment === "C" ? "CNC" : "NRML";
            }

            // Query Stock_Modal based on segment type
            let stock;
            if (signal.segment === "C") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    //  option_type: optiontype 
                });
            } else if (signal.segment === "F") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    //    option_type: optiontype 
                });
            } else {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    // option_type: optiontype, 
                    strike: signal.strikeprice
                });
            }


            if (!stock) {
                return {
                    status: false,
                    message: "Stock not found"
                };
            }

let tradingsymbol;
            const searchToken = stock.instrument_token;
            const filePath_token = '../../tokenzerodha/Zerodha.csv';
            const filePath1 = path.join(__dirname, filePath_token);
    
            try {
                const data = await fs.promises.readFile(filePath1, 'utf8');
                const lines = data.split('\n');
    
                for (const line of lines) {
                    const parts = line.split(','); 
                    if (parts.length > 2 && parts[1] === searchToken) { 
                        tradingsymbol = parts[2]; 
                        break;
                    }
                }
    
                if (!tradingsymbol) {
                    tradingsymbol = stock.symbol;
                }
            } catch (err) {
                console.error("Error reading file:", err.message);
                return res.status(500).json({ status: false, message: "Error reading token file" });
            }
    





            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, tradingsymbol);

            } catch (error) {
            }

            if (stock.segment === "C") {
                try {
                    holdingData = await CheckHolding(apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, tradingsymbol);

                } catch (error) {
                }

                const validPositionData = !isNaN(Number(positionData.qty)) ? Number(positionData.qty) : 0;  // Validate positionData.qty
                const validHoldingQty = !isNaN(Number(holdingData.qty)) ? Number(holdingData.qty) : 0;  // Validate holdingData.qty
                totalValue = validPositionData + validHoldingQty;

            }
            else {
                totalValue = Math.abs(positionData.qty)
            }


            let calltypes;
            if (signal.calltype === 'BUY') {
                calltypes = "SELL";
            }
            else {
                calltypes = "BUY";
            }

            if (totalValue >= exitquantity) {



                let datas = `tradingsymbol=${tradingsymbol}&exchange=${exchange}&transaction_type=${signal.calltype}&quantity=${quantity}&order_type=MARKET&product=${producttype}&price=${price}&trigger_price=0.00&validity=DAY`;
    
                let config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',
                    headers: { 'Authorization': `token ${apikey}:${authToken}` },
                    data: datas
                };
    
                return axios(config)
                    .then(async (response) => {
                        if (response.data.status === "success") {
                          
                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.order_id,
                                ordertype: calltypes,
                                borkerid: 5,
                                quantity: exitquantity,
                            });
                            await order.save();

                           
               
               

                            return {
                                status: true,
                                data: response.data ? null : "Order Successfully",
                            };
                        }
                        else {

                            return res.status(500).json({
                                status: false,
                                message: response.data
                            });
                        }

                    })
                    .catch(async (error) => {
                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                        let url;
                        if (message == "") {
                            url = `https://kite.zerodha.com/connect/login?v=3&api_key=${client.apikey}`;
                        }

                        return {
                            status: false,
                            url: url,
                            message: message
                        };

                    });
            }
            else {

                return {
                    status: false,
                    message: "Sorry, the requested quantity is not available."
                };

            }

        } catch (error) {
            return {
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            };
        }


    }


    async zerodhaorderplace(item) {
       
        try {
            const { id, quantity, price, version, basket_id,tradesymbol,instrumentToken, calltype, brokerid, howmanytimebuy } = item;
           
          
          
          
            const client = await Clients_Modal.findById(id);
           
            if (!client) {
                return {
                    status: false,
                    message: "Client not found"
                };
            }

         
            if (client.tradingstatus == 0) {
                return {
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                };
            }
            if (brokerid != "5") {
                return {
                    status: false,
                    message: "Invalid Broker Place Order"
                };
            }
            const authToken = client.authtoken;
            const apikey = client.apikey;

            let exchange, producttype;
                exchange = "NSE";
                producttype = "CNC";
                if(calltype =="BUY") {} else {


                    let tradingsymbol;
                    const searchToken = stock.instrument_token;
                    const filePath_token = '../../tokenzerodha/Zerodha.csv';
                    const filePath1 = path.join(__dirname, filePath_token);
            
                    try {
                        const data = await fs.promises.readFile(filePath1, 'utf8');
                        const lines = data.split('\n');
            
                        for (const line of lines) {
                            const parts = line.split(','); 
                            if (parts.length > 2 && parts[1] === searchToken) { 
                                tradingsymbol = parts[2]; 
                                break;
                            }
                        }
            
                        if (!tradingsymbol) {
                            tradingsymbol = stock.symbol;
                        }
                    } catch (err) {
                        console.error("Error reading file:", err.message);
                        return res.status(500).json({ status: false, message: "Error reading token file" });
                    }
            
        
        
        

                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;  // Declare totalValue outside the blocks
                try {
                    positionData = await CheckPosition(userId, authToken, "C", instrumentToken, producttype, calltype, tradingsymbol);
    
                } catch (error) {
                }
              
                    try {
                        holdingData = await CheckHolding(userId, authToken, "C", instrumentToken, producttype, calltype, tradingsymbol);
    
                    } catch (error) {
                    }
    
                    const validPositionData = !isNaN(Number(positionData.qty)) ? Number(positionData.qty) : 0;  // Validate positionData.qty
                    const validHoldingQty = !isNaN(Number(holdingData.qty)) ? Number(holdingData.qty) : 0;  // Validate holdingData.qty
                    totalValue = validPositionData + validHoldingQty;
    

                if (totalValue < quantity) {

                    return {
                        status: false,
                        message: "Sorry, the requested quantity is not available."
                    };
                }
    
            }
          
            let datas = `tradingsymbol=${tradingsymbol}&exchange=${exchange}&transaction_type=${signal.calltype}&quantity=${quantity}&order_type=MARKET&product=${producttype}&price=${price}&trigger_price=0.00&validity=DAY`;
    
            let config = {
                method: 'post',
                url: 'https://api.kite.trade/orders/regular',
                headers: { 'Authorization': `token ${apikey}:${authToken}` },
                data: datas
            };

                  
            return axios(config)
                .then(async (response) => {

                    if (response.data.status === "success") {
   
                        const order = new Basketorder_Modal({
                            clientid: client._id,
                            tradesymbol: tradesymbol,
                            orderid: response.data.data.order_id,
                            ordertype: calltype,
                            borkerid: 5,
                            price: price,
                            quantity: quantity,
                            ordertoken: instrumentToken,
                            exchange: exchange,
                            version:version,
                            basket_id:basket_id,
                            howmanytimebuy:howmanytimebuy
                            
                        });

                        await order.save();
                        
                        if(calltype =="SELL") {
                            await Basketorder_Modal.updateMany(
                                {
                                  version: version,
                                  clientid: client._id,
                                  basket_id: basket_id,
                                  brokerid: '5',
                                  exitstatus: 0,
                                  ordertype: 'BUY',
                                  howmanytimebuy: { $nin: howmanytimebuy }  // Only update if howmanytimebuy is not in [1, 2]
                                },
                                {
                                  $set: { exitstatus: 1 }
                                }
                              );
                         }
                        return {
                            status: true,
                            message:"Order Successfully"
                        };

                    
                    }
                    else {

                        return {
                            status: false,
                            message: response.data
                        };
                    }

                })
                .catch(async (error) => {


                    const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                    return {
                        status: false,
                        message: message
                    };

                });


        } catch (error) {
            return {
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            };
        }
    }


    async checkOrderBasket(req, res) {

        try {
            const { orderid, clientid } = req.body;

            const order = await Basketorder_Modal.findOne({
                clientid: clientid,
                orderid: orderid
            });

            if (!order) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this client"
                });
            }

            const client = await Clients_Modal.findById(clientid);
            if (!client) {
                return res.status(404).json({
                    status: false,
                    message: "Client not found"
                });
            }

            if (order.status == 1) {

                return res.json({
                    status: true,
                    response: order.data
                });
            }

            if (client.tradingstatus == 0) {
                return res.status(404).json({
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                });
            }

            if (order.borkerid != 5) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }

            const authToken = client.authtoken;
            const apikey = client.apikey;


            
            var config = {
                method: 'get',
                url: 'https://api.kite.trade/orders/' + orderid,
                headers: {
                    'Authorization': 'token ' + apikey + ':' + authToken
                }
            };

          
            const response = await axios(config);

            order.data = response.data;
            order.status = 1;
            await order.save();

            return res.json({
                status: true,
                response: response.data
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "Error occurred while fetching order details."
            });
        }
    }

    async MultipleplaceOrder(req, res) {
        try {
            const { id, signalid, quantity } = req.body;
    
            // ✅ Client Check
            const client = await Clients_Modal.findById(id);
            if (!client) {
                return res.status(404).json({ status: false, message: "Client not found" });
            }
    
            if (client.tradingstatus == 0) {
                return res.status(404).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) {
                return res.status(404).json({ status: false, message: "Signal not found" });
            }
    
            // ✅ Fetch Stocks for the Given Signal
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) {
                return res.status(404).json({ status: false, message: "No stock found for this signal" });
            }
    
            // ✅ Authorization Data
            const authToken = client.authtoken;
            const apikey = client.apikey;
    
            let orderResponses = [];
    
            for (let stock of stocks) {
                let optiontype, exchange, producttype, tradingsymbol;
    
                if (stock.segment === "C") {
                    optiontype = "EQ";
                    exchange = "NSE";
                    tradingsymbol = signal.stock;
                } else {
                    optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "MIS" : (stock.segment === "C" ? "CNC" : "NRML");
    
              
            let stockData;
            if (stock.segment === "C") {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    //    option_type: optiontype 
                });
            } else if (stock.segment === "F") {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    expiry: stock.expirydate,
                    //    option_type: optiontype 
                });
            } else {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    expiry: stock.expirydate,
                    option_type: optiontype,
                    strike: stock.strikeprice
                });
            }
    
                if (!stockData) {
                    console.warn(`Stock not found for ${stockData.tradesymbol}, skipping.`);
                    continue;
                }
    
                // ✅ Fetch Trading Symbol from CSV
                const filePath = path.join(__dirname, '../../tokenzerodha/Zerodha.csv');
                const searchToken = stockData.instrument_token;
    
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const lines = data.split('\n');
    
                    for (const line of lines) {
                        const parts = line.split(',');
                        if (parts.length > 2 && parts[1] === searchToken) {
                            tradingsymbol = parts[2];
                            break;
                        }
                    }
                } catch (err) {
                    console.error(`Error reading file: ${err.message}`);
                }
    
                tradingsymbol = tradingsymbol || signal.stock;
    
                let orderData = {
                    tradingsymbol: tradingsymbol,
                    exchange: exchange,
                    transaction_type: stock.calltype,
                    quantity: parseInt(quantity),
                    order_type: "MARKET",
                    product: producttype,
                    price: stock.price,
                    trigger_price: 0.00,
                    validity: "DAY"
                };
    
                let config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',
                    headers: {
                        'Authorization': `token ${apikey}:${authToken}`
                    },
                    data: orderData
                };
    
                try {
                    let response = await axios.request(config);
                    if (response.data.status === "success") {
                        await Order_Modal.create({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.data.order_id,
                            ordertype: stock.calltype,
                            borkerid: 5,
                            quantity: quantity,
                            ordertoken: stockData.instrument_token,
                            exchange: exchange
                        });
    
                        orderResponses.push({ status: true, message: "Order placed successfully", data: response.data });
                    } else {
                        orderResponses.push({ status: false, message: response.data });
                    }
                } catch (error) {
                    const message = error.response ? JSON.stringify(error.response.data).replace(/["',]/g, '') : error.message;
                    let url = message === "" ? `https://kite.zerodha.com/connect/login?v=3&api_key=${client.apikey}` : null;
                    orderResponses.push({ status: false, url: url, message: message });
                }
            }
    
            return res.json({ status: true, responses: orderResponses });
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            });
        }
    }
    
    async MultipleExitplaceOrder(req, res) {
        try {
            const { id, signalid, quantity } = req.body;
    
            // ✅ Client Check
            const client = await Clients_Modal.findById(id);
            if (!client) {
                return res.status(404).json({ status: false, message: "Client not found" });
            }
    
            if (client.tradingstatus == 0) {
                return res.status(404).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) {
                return res.status(404).json({ status: false, message: "Signal not found" });
            }
    
            // ✅ Fetch Stocks for the Given Signal
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) {
                return res.status(404).json({ status: false, message: "No stock found for this signal" });
            }
    
            // ✅ Authorization Data
            const authToken = client.authtoken;
            const apikey = client.apikey;
    
            for (let stock of stocks) {
                let optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                let exchange = stock.segment === "C" ? "NSE" : "NFO";
                let producttype = signal.callduration === "Intraday" ? "MIS" : (stock.segment === "C" ? "CNC" : "NRML");
                let stockData;
            if (stock.segment === "C") {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    //    option_type: optiontype 
                });
            } else if (stock.segment === "F") {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    expiry: stock.expirydate,
                    //    option_type: optiontype 
                });
            } else {
                stockData = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: stock.segment,
                    expiry: stock.expirydate,
                    option_type: optiontype,
                    strike: stock.strikeprice
                });
            }
    
    
                if (!stockData) {
                    console.warn(`Stock not found for ${signal.stock}`);
                    continue; // Skip this stock if not found
                }
    
                // ✅ Fetch Trading Symbol from CSV
                const filePath = path.join(__dirname, '../../tokenzerodha/Zerodha.csv');
                let tradingsymbol = signal.stock;
                const searchToken = stockData.instrument_token;
                
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const lines = data.split('\n');
                    for (const line of lines) {
                        const parts = line.split(',');
                        if (parts.length > 2 && parts[1] === searchToken) {
                            tradingsymbol = parts[2];
                            break;
                        }
                    }
                } catch (err) {
                    console.error(`Error reading file: ${err.message}`);
                }
    
                let positionData = await CheckPosition(apikey, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype, tradingsymbol);
                let holdingData = stock.segment === "C" ? await CheckHolding(apikey, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype, tradingsymbol) : { qty: 0 };
                let totalValue = (Number(positionData.qty) || 0) + (Number(holdingData.qty) || 0);
    
                let calltypes = stock.calltype === 'BUY' ? "SELL" : "BUY";
                if (totalValue < quantity) {
                    console.warn(`Not enough quantity for ${tradingsymbol}`);
                    continue;
                }
    
                // ✅ Place Order One by One
                let config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',
                    headers: {
                        'Authorization': `token ${apikey}:${authToken}`
                    },
                    data: {
                        tradingsymbol: tradingsymbol,
                        exchange: exchange,
                        transaction_type: calltypes,
                        quantity: parseInt(quantity),
                        order_type: "MARKET",
                        product: producttype,
                        price: stock.price,
                        trigger_price: 0.00,
                        validity: "DAY"
                    }
                };
    
                try {
                    let response = await axios(config);
                    if (response.data.status === "success") {
                        await Order_Modal.create({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.data.order_id,
                            ordertype: calltypes,
                            borkerid: 5,
                            quantity: quantity,
                        });
                        console.log(`Order placed for ${tradingsymbol}`);
                    } else {
                        console.error(`Order failed for ${tradingsymbol}: ${response.data}`);
                    }
                } catch (error) {
                    console.error(`Error placing order for ${tradingsymbol}: ${error.message}`);
                }
            }
    
            return res.json({ status: true, message: "Exit Orders Processed" });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing exit orders"
            });
        }
    }

}


async function CheckPosition(apikey, authToken, segment, instrument_token, producttype, calltype, trading_symbol) {
  
    var config = {
        method: 'get',
        url: 'https://api.kite.trade/portfolio/positions',
        headers: {
            'Authorization': 'token ' + apikey + ':' + authToken
        }
    };

    try {
        const response = await axios(config);  // Wait for the response

        if (response) {
            const Exist_entry_order = response.data.data.net.find(item1 => item1.tradingsymbol == trading_symbol);


            if (Exist_entry_order != undefined) {
                
                    const possition_qty = parseInt(Exist_entry_order.buy_quantity) - parseInt(Exist_entry_order.sell_quantity);

                    return {
                        status: possition_qty !== 0,
                        qty: Math.abs(possition_qty)
                    };
                
            } else {
                return {
                    status: false,
                    qty: 0
                };
            }
        } else {
            return {
                status: false,
                qty: 0
            };
        }
    } catch (error) {
        // console.error('Error in CheckPosition:', error.message);
        return {
            status: false,
            qty: 0
        };
    }
}

async function CheckHolding(userId, authToken, segment, instrument_token, producttype, calltype,trading_symbol) {
    var config = {
        method: 'get',
        url: 'https://api.kite.trade/portfolio/holdings',
        headers: {
            'Authorization': 'token ' + apikey + ':' + authToken
        }
    };

    try {
        const response = await axios(config);

        // Check if the response is valid
        if (response) {

            // Find the matching entry in the holding data
            const existEntryOrder = response.data.data.find(item1 => item1.tradingsymbol == trading_symbol);

            let position_qty = 0;

            if (existEntryOrder !== undefined) {
                // Check for the segment and get the appropriate quantity
                if (segment.toUpperCase() === 'C') {
                    position_qty = parseInt(existEntryOrder.quantity);
                }
            }

            return {
                status: true,
                qty: Math.abs(position_qty)  // Ensure we return the absolute quantity
            };
        } else {
            return {
                status: false,
                qty: 0  // Return 0 if the status is not "Ok"
            };
        }
    } catch (error) {
        // Log the error and return a default response
        // console.error('Error fetching holdings:', error.response ? error.response.data : error.message);
        return {
            status: false,
            qty: 0  // Return 0 in case of an error
        };
    }
}




module.exports = new Zerodha();