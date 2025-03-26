var axios = require('axios');
var dateTime = require('node-datetime');
"use strict";
const db = require("../Models");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Clients_Modal = db.Clients;
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Order_Modal = db.Order;
const Basketorder_Modal = db.Basketorder;
const Signalsdata_Modal = db.Signalsdata;
const Signalstock_Modal = db.Signalstock;

const qs = require("querystring");
const jwt = require("jsonwebtoken");
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

class Upstox {

    async GetAccessToken(req, res) {
        try {
            var tokenCode = req.query.code;
            var email = req.query.state;

            if (tokenCode != undefined) {

                const client = await Clients_Modal.findOne({ Email: email,ActiveStatus:1,del:0 });

                if (!client) {
                    return res.status(404).json({
                        status: false,
                        message: "Client not found"
                    });
                }
                var hosts = req.headers.host;

                const requestData = new URLSearchParams();
                requestData.append("code", tokenCode);
                requestData.append("client_id", client.apikey);
                requestData.append("client_secret", client.apisecret);
                requestData.append("redirect_uri", `https://${hosts}/backend/upstox/getaccesstoken`); 
                requestData.append("grant_type", "authorization_code");
                const url = "https://api-v2.upstox.com/login/authorization/token";
                const headers = {
                    Accept: "application/json",
                    "Api-Version": "2.0",
                    "Content-Type": "application/x-www-form-urlencoded",
                };
        
                // Make the POST request
                const response = await axios.post(url, requestData.toString(), { headers });

                if (response.data && response.data.access_token) {
                   const auth_token = response.data.access_token;

                   const brokerlink = await Clients_Modal.findOneAndUpdate(
                    { Email: email }, // Find by email
                    {
                        authtoken: auth_token,  // Update authtoken
                        dlinkstatus: 1,         // Update dlinkstatus
                        tradingstatus: 1        // Update tradingstatus
                    },
                    {
                        new: true,  // Return the updated document
                        useFindAndModify: false // Prevent deprecation warning
                    }
                );

                return res.json({
                    status: true,
                    message: "Broker login successfully",
                });
            }
            else {
                return res.status(500).json({ status: false, message: response.data });
            }

            } else {

                return res.status(500).json({ status: false, message: "Server error" });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error });

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
                producttype = "I";
            } else {
                producttype = signal.segment === "C" ? "D" : "D";
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
                    //   option_type: optiontype 
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

            
            const searchToken = stock.instrument_token; // Instrument Token to search
            const filePath = path.join(__dirname, "../../tokenupstox/complete.csv");
            
            let tradingsymbol = null; // Declare outside for global scope
            
            try {
                const data = fs.readFileSync(filePath, "utf8");
                const lines = data.split("\n");
            
                for (const line of lines) {
                    const parts = line.split(",");
            
                    if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                        tradingsymbol = parts[0].replace(/"/g, ""); // Assign value to global variable
                        break;
                    }
                }
            } catch (err) {
                console.error("Error reading file:", err);
            }
            
            



var data = JSON.stringify({
    "quantity": quantity,
    "product": producttype,
    "validity": "DAY",
    "price": 0,
    "tag": "string",
    "instrument_token": tradingsymbol,
    "order_type": "MARKET",
    "transaction_type": signal.calltype,
    "disclosed_quantity": 0,
    "trigger_price": 0,
    "is_amo": false
});


          


let config = {
    method: 'post',
  maxBodyLength: Infinity,
    url: 'https://api-hft.upstox.com/v2/order/place',
    headers: { 
      'Content-Type': 'application/json',
     'Authorization': `Bearer ${authToken}`
    },
    data : data
  };
  




            //  const response = await axios(config);

            axios(config)
                .then(async (response) => {

                    if (response.data.data != undefined) {
                        const finalExitQuantity = exitquantity && exitquantity > 0 ? exitquantity : quantity;


                        const order = new Order_Modal({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.data.order_id,
                            uniqueorderid: response.data.data.order_id,
                            ordertype: signal.calltype,
                            borkerid: 6,
                            quantity: quantity,
                            ordertoken: stock.instrument_token,
                            tsprice: tsprice,
                            tsstatus: tsstatus,
                            slprice: slprice,
                            exitquantity: finalExitQuantity,
                            exchange: exchange
                        });




                        await order.save();

                        return res.json({
                            status: true,
                            data: response.data,
                            message: "Order Placed Successfully"
                        });
                    }
                    else {
                        let url;
                        var hosts = req.headers.host;

                        if (response.data.message == "Invalid Token") {
                            url = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apikey}&redirect_uri=https://${hosts}/backend/upstox/getaccesstoken&state=${client.Email}`;
                        }
                        return res.status(500).json({
                            status: false,
                            url: url,
                            message: "Invalid Token"
                        });
                    }

                })
                .catch(async (error) => {
                    return res.status(500).json({
                        status: false,
                        message: error.response ? error.response.data : error.message  // ✅ Proper error handling
                    });

                });

        } catch (error) {
            // console.error("Error placing order:", error); // Log the error
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : error.message
            });
        }
    }



    async ExitplaceOrder(req, res) {

        try {
            const { id, signalid, quantity, price } = req.body;

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
                producttype = "I";
            } else {
                producttype = signal.segment === "C" ? "D" : "D";
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
                    //   option_type: optiontype 
                });
            } else {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    //   option_type: optiontype, 
                    strike: signal.strikeprice
                });
            }


            if (!stock) {
                return res.status(404).json({
                    status: false,
                    message: "Stock not found"
                });
            }



            const searchToken = stock.instrument_token; // Instrument Token to search
            const filePath = path.join(__dirname, "../../tokenupstox/complete.csv");
            
            let tradingsymbol = null; // Declare outside for global scope
            
            try {
                const data = fs.readFileSync(filePath, "utf8");
                const lines = data.split("\n");
            
                for (const line of lines) {
                    const parts = line.split(",");
            
                    if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                        tradingsymbol = parts[0].replace(/"/g, ""); // Assign value to global variable
                        break;
                    }
                }
            } catch (err) {
                console.error("Error reading file:", err);
            }
            


            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol,tradingsymbol);
            } catch (error) {
                //   console.error('Error in CheckPosition:', error.message);

            }


            if (stock.segment == "C") {
                try {
                    holdingData = await CheckHolding(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype,tradingsymbol);

                } catch (error) {
                    // console.error('Error in CheckHolding:', error.message);
                }
                totalValue = Math.abs(positionData.qty) + holdingData.qty;
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

            if (totalValue >= quantity) {




                var data = JSON.stringify({
                    "quantity": quantity,
                    "product": producttype,
                    "validity": "DAY",
                    "price": 0,
                    "tag": "string",
                    "instrument_token": tradingsymbol,
                    "order_type": "MARKET",
                    "transaction_type": calltypes,
                    "disclosed_quantity": 0,
                    "trigger_price": 0,
                    "is_amo": false
                });
                
                
                          
                
                
                let config = {
                    method: 'post',
                  maxBodyLength: Infinity,
                    url: 'https://api-hft.upstox.com/v2/order/place',
                    headers: { 
                      'Content-Type': 'application/json',
                     'Authorization': `Bearer ${authToken}`
                    },
                    data : data
                  };
                  
                



                axios(config)
                    .then(async (response) => {

                        if (response.data.data != undefined) {


                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.order_id,
                                uniqueorderid: response.data.data.order_id,
                                ordertype: calltypes,
                                borkerid: 6,
                                quantity: quantity,
                            });


                            await order.save();



                            const orderupdate = await Order_Modal.findOne({
                                clientid: id,
                                signalid,
                                borkerid
                            });

                            if (orderupdate) {
                                orderupdate.tsstatus = 0;
                                await orderupdate.save();
                            }


                            return res.json({
                                status: true,
                                data: response.data,
                                message: "Order Placed Successfully"
                            });
                        }
                        else {
                            let url;
                            var hosts = req.headers.host;

                        if (response.data.message == "Invalid Token") {
                            url = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apikey}&redirect_uri=https://${hosts}/backend/upstox/getaccesstoken&state=${client.Email}`;
                        }
                            return res.status(500).json({
                                status: false,
                                url: url,
                                message: "Invalid Token"
                            });
                        }

                    })
                    .catch(async (error) => {
                        return res.status(500).json({
                            status: false,
                            message: error.response ? error.response.data : error.message  // ✅ Proper error handling
                        });

                    });

            }
            else {

                return res.status(500).json({
                    status: false,
                    message: "Sorry, the requested quantity is not available."
                });

            }

        } catch (error) {
            // console.error("Error placing order:", error); // Log the error
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : error.message  // ✅ Proper error handling

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


            if (order.borkerid != 6) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;

            var config = {
                             method: 'get',
                             url: 'https://api-v2.upstox.com/order/details',
                             headers: {
                                Authorization: `Bearer ${authToken}`,
                             },
                             params: {
                                order_id: orderId
                            }
                         };
         

            const response = await axios(config); // Use await with axios

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




    async orderexitupstox(item) {

        try {
            const { clientid, signalid, quantity, stockInfo_lp, exitquantity, _id } = item;


            const orderss = await Order_Modal.findById(_id);
            if (orderss) {
                orderss.tsstatus = 0;
                await orderss.save();
            }

            const price = stockInfo_lp;
            const client = await Clients_Modal.findById(clientid);
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
                producttype = "I";
            } else {
                producttype = signal.segment === "C" ? "D" : "D";
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
                    //   option_type: optiontype 
                });
            } else {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    //   option_type: optiontype, 
                    strike: signal.strikeprice
                });
            }


            if (!stock) {
                return {
                    status: false,
                    message: "Stock not found"
                };
            }


            let tradingsymbol = null; // Declare outside for global scope
            
            try {
                const data = fs.readFileSync(filePath, "utf8");
                const lines = data.split("\n");
            
                for (const line of lines) {
                    const parts = line.split(",");
            
                    if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                        tradingsymbol = parts[0].replace(/"/g, ""); // Assign value to global variable
                        break;
                    }
                }
            } catch (err) {
                console.error("Error reading file:", err);
            }
            



            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol,tradingsymbol);
            } catch (error) {
                //   console.error('Error in CheckPosition:', error.message);

            }


            if (stock.segment == "C") {
                try {
                    holdingData = await CheckHolding(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype,tradingsymbol);

                } catch (error) {
                    // console.error('Error in CheckHolding:', error.message);
                }
                totalValue = Math.abs(positionData.qty) + holdingData.qty;
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
              
              
              
                var data = JSON.stringify({
                    "quantity": quantity,
                    "product": producttype,
                    "validity": "DAY",
                    "price": 0,
                    "tag": "string",
                    "instrument_token": tradingsymbol,
                    "order_type": "MARKET",
                    "transaction_type": calltypes,
                    "disclosed_quantity": 0,
                    "trigger_price": 0,
                    "is_amo": false
                });
                
                
                          
                
                
                let config = {
                    method: 'post',
                  maxBodyLength: Infinity,
                    url: 'https://api-hft.upstox.com/v2/order/place',
                    headers: { 
                      'Content-Type': 'application/json',
                     'Authorization': `Bearer ${authToken}`
                    },
                    data : data
                  };
                  
                



                axios(config)
                    .then(async (response) => {

                        if (response.data.data != undefined) {



                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.order_id,
                                uniqueorderid: response.data.data.order_id,
                                ordertype: calltypes,
                                borkerid: 6,
                                quantity: exitquantity,
                            });


                            await order.save();



                            //    const orderupdate = await Order_Modal.findOne({ 
                            //     clientid, 
                            //     signalid, 
                            //     borkerid 
                            // });

                            // if (orderupdate) {
                            //   orderupdate.tsstatus = 0;
                            //   await orderupdate.save();
                            // }


                            return {
                                status: true,
                                data: response.data,
                                message: "Order Placed Successfully"
                            };
                        }
                        else {
                            let url;
                            if (response.data.message == "Invalid Token") {
                                url = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apikey}&redirect_uri=https://${hosts}/backend/upstox/getaccesstoken&state=${client.Email}`;
                            }
                            return {
                                status: false,
                                url: url,
                                message: error.response ? error.response.data : error.message  // ✅ Proper error handling

                            };
                        }

                    })
                    .catch(async (error) => {
                        return {
                            status: false,
                            message: error.response ? error.response.data : error.message  // ✅ Proper error handling

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
            // console.error("Error placing order:", error); // Log the error
            return {
                status: false,
                message: error.response ? error.response.data : error.message  // ✅ Proper error handling
            };
        }
    }




    async upstoxorderplace(item) {

        try {
            const { id, quantity, price, version, basket_id, tradesymbol, instrumentToken, calltype, brokerid, howmanytimebuy } = item;

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

            if (brokerid != 6) {
                return {
                    status: false,
                    message: "Invalid Broker Place Order"
                };
            }
            const authToken = client.authtoken;

            let exchange, producttype;
            exchange = "NSE";
            producttype = "D";

            if (calltype == "BUY") { } else {


                let tradingsymbol = null; // Declare outside for global scope
            
                try {
                    const data = fs.readFileSync(filePath, "utf8");
                    const lines = data.split("\n");
                
                    for (const line of lines) {
                        const parts = line.split(",");
                
                        if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                            tradingsymbol = parts[0].replace(/"/g, ""); // Assign value to global variable
                            break;
                        }
                    }
                } catch (err) {
                    console.error("Error reading file:", err);
                }
                
    

                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;  // Declare totalValue outside the blocks
                try {
                    positionData = await CheckPosition(userId, authToken, "C", instrumentToken, producttype, calltype, tradesymbol,tradingsymbol);

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




              
            var data = JSON.stringify({
                "quantity": quantity,
                "product": producttype,
                "validity": "DAY",
                "price": 0,
                "tag": "string",
                "instrument_token": tradingsymbol,
                "order_type": "MARKET",
                "transaction_type": calltype,
                "disclosed_quantity": 0,
                "trigger_price": 0,
                "is_amo": false
            });
            
            
                      
            
            
            let config = {
                method: 'post',
              maxBodyLength: Infinity,
                url: 'https://api-hft.upstox.com/v2/order/place',
                headers: { 
                  'Content-Type': 'application/json',
                 'Authorization': `Bearer ${authToken}`
                },
                data : data
              };
              


            return axios(config)
                .then(async (response) => {



                    if (response.data.data != undefined) {



                       


                        const order = new Basketorder_Modal({
                            clientid: client._id,
                            tradesymbol: tradesymbol,
                            orderid: response.data.data.order_id,
                            uniqueorderid: response.data.data.order_id,
                            ordertype: calltype,
                            borkerid: 6,
                            price: price,
                            quantity: quantity,
                            ordertoken: instrumentToken,
                            exchange: exchange,
                            version: version,
                            basket_id: basket_id,
                            howmanytimebuy: howmanytimebuy
                        });

                        await order.save();


                        if (calltype == "SELL") {
                            await Basketorder_Modal.updateMany(
                                {
                                    version: version,
                                    clientid: client._id,
                                    basket_id: basket_id,
                                    brokerid: '6',
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
                            message: "Order Successfully",
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


                    return {
                        status: false,
                        message: error
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


            if (order.borkerid != 6) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;


            var config = {
                method: 'get',
                url: 'https://api-v2.upstox.com/order/details',
                headers: {
                   Authorization: `Bearer ${authToken}`,
                },
                params: {
                   order_id: orderId
               }
            };

            const response = await axios(config); // Use await with axios

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
            if (!client) return res.status(404).json({ status: false, message: "Client not found" });
    
            if (client.tradingstatus == 0) {
                return res.status(400).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) return res.status(404).json({ status: false, message: "Signal not found" });
    
            // ✅ Fetch Stocks for the Given Signal
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) return res.status(404).json({ status: false, message: "No stock found for this signal" });
    
            // ✅ Authorization Data
            const authToken = client.authtoken;
            const apikey = client.apikey;
    
            let ordersData = [];
    
            for (let stock of stocks) {
                let optiontype, exchange, producttype, tradingsymbol, stockData;
    
                if (stock.segment === "C") {
                    optiontype = "EQ";
                    exchange = "NSE";

                } else {
                    optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "I" : (stock.segment === "C" ? "D" : "D");
    
                // ✅ Fetch Stock Data from `Stock_Modal`
                if (stock.segment === "C") {
                    stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment });
                } else if (stock.segment === "F") {
                    stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment, expiry: stock.expirydate });
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
                    return res.status(404).json({ status: false, message: `Stock not found for ${stockData.tradesymbol}` });
                }
    
                // ✅ Fetch Trading Symbol from CSV
                const filePath = path.join(__dirname, '../../tokenupstox/complete.csv');
                const searchToken = stockData.instrument_token;
    
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const lines = data.split('\n');
    
                    for (const line of lines) {
                        const parts = line.split(',');
                        if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                            tradingsymbol = parts[0].replace(/"/g, "");
                            break;
                        }
                    }
                } catch (err) {
                    console.error(`Error reading file: ${err.message}`);
                }
    
                tradingsymbol = signal.segment.toLowerCase() === 'c' ? stockData.symbol : tradingsymbol;
    
                // ✅ Order Data
                ordersData.push({
                    "quantity": parseInt(quantity),
                    "product": producttype,
                    "validity": "DAY",
                    "price": 0,
                    "tag": "string",
                    "instrument_token": tradingsymbol,
                    "order_type": "MARKET",
                    "transaction_type": stock.calltype,
                    "disclosed_quantity": 0,
                    "trigger_price": 0,
                    "is_amo": false
                });
            }
    
            // ✅ Order API Call to Upstox
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api-hft.upstox.com/v2/order/place',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                data: ordersData
            };
    
            axios(config)
                .then(async (response) => {
                    if (response.data.data != undefined) {
                        let orderRecords = [];
                        for (let stock of stocks) {
                            let stockData,exchange;
                
                           
                            // ✅ Fetch Stock Data from `Stock_Modal`
                            if (stock.segment === "C") {
                                stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment });
                            } else if (stock.segment === "F") {
                                stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment, expiry: stock.expirydate });
                            } else {
                                stockData = await Stock_Modal.findOne({
                                    symbol: signal.stock,
                                    segment: stock.segment,
                                    expiry: stock.expirydate,
                                    option_type: optiontype,
                                    strike: stock.strikeprice
                                });
                            }


                            if (stock.segment === "C") {
                                exchange = "NSE";
                            } else {
                                exchange = "NFO";
                            }
                          orderRecords.push({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.order_id,
                                ordertype: stock.calltype,
                                borkerid: 6,
                                quantity: quantity,
                                ordertoken: stockData.instrument_token,
                                exchange: exchange
                            });
                        }
    
                        await Order_Modal.insertMany(orderRecords);
    
                        return res.json({
                            status: true,
                            message: "Order Placed Successfully",
                            data: response.data
                        });
                    } else {
                        let url;
                        var hosts = req.headers.host;
    
                        if (response.data.message == "Invalid Token") {
                            url = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apikey}&redirect_uri=https://${hosts}/backend/upstox/getaccesstoken&state=${client.Email}`;
                        }
                        return res.status(500).json({
                            status: false,
                            url: url,
                            message: "Invalid Token"
                        });
                    }
                })
                .catch(async (error) => {
                    return res.status(500).json({
                        status: false,
                        message: error.response ? error.response.data : error.message
                    });
                });
    
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
            if (!client) return res.status(404).json({ status: false, message: "Client not found" });
    
            if (client.tradingstatus == 0) {
                return res.status(400).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) return res.status(404).json({ status: false, message: "Signal not found" });
    
            // ✅ Fetch Stocks for the Signal
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) return res.status(404).json({ status: false, message: "No stock found for this signal" });
    
            // ✅ Authorization Data
            const authToken = client.authtoken;
            const apikey = client.apikey;
    
            let ordersData = [];
    
            for (let stock of stocks) {
                let optiontype, exchange, producttype, stockData;
    
                // ✅ Determine Exchange & Option Type
                if (stock.segment === "C") {
                    optiontype = "EQ";
                    exchange = "NSE";
                } else {
                    optiontype = stock.optiontype || (stock.segment === "F" ? "UT" : "");
                    exchange = "NFO";
                }
    
                // ✅ Determine Product Type
                producttype = signal.callduration === "Intraday" ? "I" : "D";
    
                // ✅ Fetch Stock Data from `Stock_Modal`
                
                           
                // ✅ Fetch Stock Data from `Stock_Modal`
                if (stock.segment === "C") {
                    stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment });
                } else if (stock.segment === "F") {
                    stockData = await Stock_Modal.findOne({ symbol: signal.stock, segment: stock.segment, expiry: stock.expirydate });
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
                const filePath = path.join(__dirname, "../../tokenupstox/complete.csv");
                const searchToken = stockData.instrument_token;
                let tradingsymbol = null;
    
                try {
                    const data = fs.readFileSync(filePath, "utf8");
                    const lines = data.split("\n");
    
                    for (const line of lines) {
                        const parts = line.split(",");
                        if (parts.length > 1 && parts[1].replace(/"/g, "") === searchToken) {
                            tradingsymbol = parts[0].replace(/"/g, "");
                            break;
                        }
                    }
                } catch (err) {
                    console.error("Error reading file:", err);
                }
    
                if (!tradingsymbol) {
                    console.warn(`Trading symbol not found for ${stockData.tradesymbol}, skipping.`);
                    continue;
                }
    
                // ✅ Check Position & Holdings
                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;
    
                try {
                    positionData = await CheckPosition(client.apikey, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype, tradingsymbol);
                } catch (error) {
                    console.error(`Error in CheckPosition for ${stockData.tradesymbol}:`, error.message);
                }
    
                if (stock.segment === "C") {
                    try {
                        holdingData = await CheckHolding(client.apikey, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype, tradingsymbol);
                    } catch (error) {
                        console.error(`Error in CheckHolding for ${stock.tradesymbol}:`, error.message);
                    }
                    totalValue = Math.abs(positionData.qty || 0) + (holdingData.qty || 0);
                } else {
                    totalValue = Math.abs(positionData.qty || 0);
                }
    
                let calltypes = signal.calltype === "BUY" ? "SELL" : "BUY";
    
                if (totalValue >= quantity) {
                    let orderData = {
                        quantity: quantity,
                        product: producttype,
                        validity: "DAY",
                        price: 0,
                        tag: "string",
                        instrument_token: tradingsymbol,
                        order_type: "MARKET",
                        transaction_type: calltypes,
                        disclosed_quantity: 0,
                        trigger_price: 0,
                        is_amo: false
                    };
    
                    let config = {
                        method: "post",
                        maxBodyLength: Infinity,
                        url: "https://api-hft.upstox.com/v2/order/place",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`
                        },
                        data: orderData
                    };
    
                    ordersData.push({ config, stockData });
                } else {
                    console.warn(`Not enough quantity to exit for ${stockData.tradesymbol}, skipping.`);
                }
            }
    
            // ✅ Execute All Exit Orders
            let responses = await Promise.all(ordersData.map(async ({ config, stockData }) => {
                try {
                    let response = await axios.request(config);
                    if (response.data.data) {
                        return {
                            status: true,
                            data: response.data,
                            message: "Exit Order Placed Successfully",
                            stock: stockData

                        };
                    } else {
                        let url;
                        let hosts = req.headers.host;
    
                        if (response.data.message === "Invalid Token") {
                            url = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apikey}&redirect_uri=https://${hosts}/backend/upstox/getaccesstoken&state=${client.Email}`;
                        }
                        return {
                            status: false,
                            url: url,
                            message: "Invalid Token",
                            stock: stock.tradesymbol
                        };
                    }
                } catch (error) {
                    return {
                        status: false,
                        message: `Error placing exit order for ${stockData.tradesymbol}: ${error.message}`
                    };
                }
            }));
    
            // ✅ Insert Successful Exit Orders into Database
            let successfulOrders = responses.filter(order => order.status === true);
            if (successfulOrders.length > 0) {
                let exitOrderRecords = successfulOrders.map(order => ({
                    clientid: client._id,
                    signalid: signal._id,
                    orderid: order.data.data.order_id,
                    uniqueorderid: order.data.data.order_id,
                    ordertype: order.stock.calltype === "BUY" ? "SELL" : "BUY",
                    borkerid: 6,
                    quantity: quantity,
                    ordertoken: order.stock.instrument_token
                }));
    
                await Order_Modal.insertMany(exitOrderRecords);
            }
    
            return res.json({ status: true, responses });
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : error.message
            });
        }
    }
    

}




async function CheckPosition(userId, authToken, segment, instrument_token, producttype, calltype, trading_symbol,tradingsymbol) {


    var config = {
        method: 'get',
        url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
        headers: {
            'accept': ' application/json',
            'Api-Version': ' 2.0',
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await axios(config);  // Wait for the response


        if (response.data.data != undefined) {

            const Exist_entry_order = response.data.data.find(item1 => item1.instrument_token === tradingsymbol);

            if (Exist_entry_order != undefined) {
                let possition_qty;
                    possition_qty = parseInt(Exist_entry_order.day_buy_quantity) - parseInt(Exist_entry_order.day_sell_quantity);
                
                if (possition_qty === 0) {
                    return {
                        status: false,
                        qty: 0,
                    };

                } else {
                    return {
                        status: true,
                        qty: possition_qty,
                    };
                }
            } else {

                return {
                    status: false,
                    qty: 0,
                };
            }
        } else {
            return {
                status: false,
                qty: 0,
            };

        }
    } catch (error) {
        return {
            status: false,
            qty: 0
        };
    }

}



async function CheckHolding(userId, authToken, segment, instrument_token, producttype, calltype,tradingsymbol) {


    var config = {
        method: 'get',
        url: 'https://api.upstox.com/v2/portfolio/long-term-holdings',
        headers: {
            'accept': ' application/json',
            'Api-Version': ' 2.0',
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
    };
    try {
        const response = await axios(config);

        if (response.data.data != undefined) {

            const existEntryOrder = response.data.data.find(item1 => item1.instrument_token === tradingsymbol);
            let possition_qty = 0;


            if (existEntryOrder != undefined) {
                if (segment.toUpperCase() == 'C') {
                    possition_qty = parseInt(existEntryOrder.quantity);
                }
            }
            return {
                status: true,
                qty: possition_qty,
            };
        } else {
            return {
                status: false,
                qty: 0,
            };
        }
    } catch (error) {
        return {
            status: false,
            qty: 0,
        };
    }

}

module.exports = new Upstox();