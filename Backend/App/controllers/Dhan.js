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
const crypto = require('crypto'); // For generating correlationId
class Dhan {
    

    async GetAccessToken(req, res) {
        try {
          const { id, apikey, apisecret } = req.body;
      
          if (!id || !apikey || !apisecret) {
            return res.status(400).json({
              status: false,
              message: "All fields (id, apikey, apisecret) are required",
            });
          }
      
          const client = await Clients_Modal.findById(id);
          if (!client) {
            return res.status(404).json({ status: false, message: "Client not found" });
          }
      
          if (client.tradingstatus === "1") {
            return res.json({ status: true, message: "Broker login successfully" });
          }
      
      
          const config = {
            method: 'get',
            url: 'https://api.dhan.co/fundlimit',
            headers: {
              'Content-Type': 'application/json',
              'access-token': apisecret
            }
          };
      
          const response = await axios.request(config);

          if (response.data.dhanClientId === apikey) {


            await Clients_Modal.findByIdAndUpdate(
              id,
              {
                apikey,
                apisecret,
                authtoken:apisecret,
                brokerid: 7,
                tradingstatus: 1,
                dlinkstatus: 1
              },
              { new: true }
            );
      
            return res.json({ status: true, message: "Broker login successfully" });
          } else {
            return res.status(401).json({ status: false, message: "Invalid secret from Dhan API response" });
          }
      
        } catch (error) {
          const errorMessage = error.response?.data?.error
            ? error.response.data.error[0]?.message || "Dhan API error"
            : error.message || "Server error";
      
          return res.status(500).json({ status: false, message: errorMessage });
        }
      }

    async checkOtp(req, res) {
        try {
            const { id, otp } = req.body;

            // Validate inputs
            if (!id || !otp) {
                return res.status(400).json({
                    status: false,
                    message: "All fields (id, otp) are required",
                });
            }

            // Find client by ID
            const client = await Clients_Modal.findById(id);
            if (!client) {
                return res.status(404).json({ status: false, message: "Client not found" });
            }

            // Check trading status
            if (client.tradingstatus === "1") {
                return res.json({ status: true, message: "Broker login successfully" });
            }

            // Prepare API credentials


            // Validate API credentials
            if (!client.apikey || !client.apisecret) {
                return res.status(400).json({
                    status: false,
                    message: "Please provide valid API key, secret, username, and password",
                });
            }



            var data2 = JSON.stringify({
                userId: client.kotakneo_userd,
                otp: otp,
            });

            var config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate",
                headers: {
                    accept: "*/*",
                    sid: client.kotakneo_sid,
                    Auth: client.authtoken,
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + client.oneTimeToken,
                },
                data: data2,
            };


            const response = await axios.request(config);




            if (response.status === 201) {
                // Update Client Information
                let AccessToken = response.data.data.token;
                await Clients_Modal.findByIdAndUpdate(
                    id,
                    {
                        authtoken: AccessToken,
                        dlinkstatus: 1,
                        tradingstatus: 1,
                    },
                    { new: true }
                );

                return res.json({ status: true, message: "Broker login successfully" });
            } else {
                return res.status(500).json({ status: false, message: "OTP generation failed" });
            }
        } catch (error) {
            // Handle Errors
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error
                    ? error.response.data.error[0]?.message || "Error occurred"
                    : JSON.stringify(error.response.data);
                return res.status(500).json({ status: false, message: errorMessage });
            }
            return res.status(500).json({ status: false, message: error.message || "Server error" });
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


            const apikey = client.apikey;

            const authToken = client.authtoken;
            let optiontype, exchange, producttype, exchangess;

            if (signal.segment === "C") {
                exchange = "NSE_EQ";
                exchangess: "NSE"

            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NSE_FNO";
                exchangess: "NFO"

            }

            // Determine product type based on segment and call duration
            if (signal.callduration === "Intraday") {
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "CNC" : "MARGIN";
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

                    const correlationId = crypto.randomBytes(12).toString('hex').substring(0, 25);

                    var data = JSON.stringify({
                        "dhanClientId": apikey,
                        "transactionType": signal.calltype,
                        "exchangeSegment": exchange,
                        "productType": producttype,
                        "orderType": "MARKET",
                        "validity": "DAY",
                        "securityId": stock.instrument_token,
                        "quantity": parseInt(quantity),
                        "disclosedQuantity": 0,
                        "price": 0,
                        "triggerPrice": 0,
                        "afterMarketOrder": true,
                        "amoTime": "OPEN",
                        "boProfitValue": 0,
                        "boStopLossValue": 0
                      });



                      let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api.dhan.co/orders',
                        headers: {
                            'access-token': authToken,
                            'Content-Type': 'application/json'
                        },
                        data: data
                
                    };



                    axios(config)
                    .then(async (response) => {
                        if (response.data.orderStatus != undefined) {


                            const finalExitQuantity = exitquantity && exitquantity > 0 ? exitquantity : quantity;

                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.orderId,
                                ordertype: signal.calltype,
                                borkerid: 7,
                                quantity: quantity,
                                ordertoken: stock.instrument_token,
                                tsprice: tsprice,
                                tsstatus: tsstatus,
                                slprice: slprice,
                                exitquantity: finalExitQuantity,
                                exchange: exchangess
                            });

                            await order.save();

                            return res.json({
                                status: true,
                                data: response.data,
                                message: "Order Placed Successfully"
                            });
                        } else {
                            
                            return res.status(500).json({
                                status: false,
                                message: response.data || 'Unknown error in response'
                            });
                        }
                    })
                    .catch((error) => {
                      if (error.response) {

                        return res.status(500).json({
                            status: false,
                            message: error.response.data,
                        });


                      } else if (error.request) {
                        return res.status(500).json({
                            status: false,
                            message: error.request,
                        });

                      } else {
                        return res.status(500).json({
                            status: false,
                            message: error.message,
                        });


                      }
                    });
              
        } catch (error) {
            // console.error("Error placing order:", error); // Log the error
            return res.status(500).json({
                status: false,
                count: 3,
                message: error.response ? error.response.data : "An error occurred while placing the order"
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


            const apikey = client.apikey;

            const authToken = client.authtoken;
            let optiontype, exchange, producttype, exchangess;

            if (signal.segment === "C") {
                exchange = "NSE_EQ";
                exchangess: "NSE"

            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NSE_FNO";
                exchangess: "NFO"

            }

            // Determine product type based on segment and call duration
            if (signal.callduration === "Intraday") {
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "CNC" : "MARGIN";
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


            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                const positionData = await CheckPosition(authToken, stock.segment, stock.instrument_token);
            } catch (error) {
         

            }

            if (stock.segment == "C") {
                try {
                    const holdingData = await CheckHolding(authToken, stock.segment, stock.instrument_token);
                } catch (error) {
                
                }
                totalValue = Math.abs(positionData.qty) + holdingData.qty;
            }
            else {
                totalValue = Math.abs(positionData.qty)
            }

            let calltypess;
            if (signal.calltype === 'BUY') {
                calltypess = "SEll";
            }
            else {
                calltypess = "BUY";
            }

            if (totalValue >= quantity) {





                var data = JSON.stringify({
                    "dhanClientId": apikey,
                    "transactionType": calltypess,
                    "exchangeSegment": exchange,
                    "productType": producttype,
                    "orderType": "MARKET",
                    "validity": "DAY",
                    "securityId": stock.instrument_token,
                    "quantity": parseInt(quantity),
                    "disclosedQuantity": 0,
                    "price": 0,
                    "triggerPrice": 0,
                    "afterMarketOrder": true,
                    "amoTime": "OPEN",
                    "boProfitValue": 0,
                    "boStopLossValue": 0
                  });



                  let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.dhan.co/orders',
                    headers: {
                        'access-token': authToken,
                        'Content-Type': 'application/json'
                    },
                    data: data
            
                };



                axios(config)
                .then(async (response) => {
                    if (response.data.orderStatus != undefined) {


                        const order = new Order_Modal({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.orderId,
                            ordertype: calltypess,
                            borkerid: 7,
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




                    } else {
                        
                        return res.status(500).json({
                            status: false,
                            message: response.data || 'Unknown error in response'
                        });
                    }
                })
                .catch((error) => {
                  if (error.response) {

                    return res.status(500).json({
                        status: false,
                        message: error.response.data,
                    });


                  } else if (error.request) {
                    return res.status(500).json({
                        status: false,
                        message: error.request,
                    });

                  } else {
                    return res.status(500).json({
                        status: false,
                        message: error.message,
                    });


                  }
                });
                   
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


            if (order.borkerid != 7) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;



            var config = {
                method: 'get',
                url: 'https://api.dhan.co/orders/' + order.orderid,
                headers: {
                    'access-token': authToken,
                    'Content-Type': 'application/json'
                },
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

    async orderexitdhan(item) {

        try {
            const { clientid, signalid, quantity, stockInfo_lp, exitquantity, _id } = item;

            const orderss = await Order_Modal.findById(_id);
            if (orderss) {
                orderss.tsstatus = 0;
                await orderss.save();
              }

            const price = stockInfo_lp;

          

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


            const apikey = client.apikey;

            const authToken = client.authtoken;
            let optiontype, exchange, producttype, exchangess;

            if (signal.segment === "C") {
                exchange = "NSE_EQ";
                exchangess: "NSE"

            } else {
                optiontype = signal.segment === "F" ? "UT" : signal.optiontype;
                exchange = "NSE_FNO";
                exchangess: "NFO"

            }

            // Determine product type based on segment and call duration
            if (signal.callduration === "Intraday") {
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "CNC" : "MARGIN";
            }

            let stock;
            if (signal.segment === "C") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                });
            } else if (signal.segment === "F") {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                });
            } else {
                stock = await Stock_Modal.findOne({
                    symbol: signal.stock,
                    segment: signal.segment,
                    expiry: signal.expirydate,
                    strike: signal.strikeprice
                });
            }


            if (!stock) {
                return {
                    status: false,
                    message: "Stock not found"
                };
            }


            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                const positionData = await CheckPosition(authToken, stock.segment, stock.instrument_token);
            } catch (error) {
                

            }

            if (stock.segment == "C") {
                try {
                    const holdingData = await CheckHolding(authToken, stock.segment, stock.instrument_token);
                } catch (error) {
                    
                }
                totalValue = Math.abs(positionData.qty) + holdingData.qty;
            }
            else {
                totalValue = Math.abs(positionData.qty)
            }

            let calltypess;
            if (signal.calltype === 'BUY') {
                calltypess = "SEll";
            }
            else {
                calltypess = "BUY";
            }

            if (totalValue >= exitquantity) {






                var data = JSON.stringify({
                    "dhanClientId": apikey,
                    "transactionType": calltypess,
                    "exchangeSegment": exchange,
                    "productType": producttype,
                    "orderType": "MARKET",
                    "validity": "DAY",
                    "securityId": stock.instrument_token,
                    "quantity": parseInt(quantity),
                    "disclosedQuantity": 0,
                    "price": 0,
                    "triggerPrice": 0,
                    "afterMarketOrder": true,
                    "amoTime": "OPEN",
                    "boProfitValue": 0,
                    "boStopLossValue": 0
                  });



                  let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.dhan.co/orders',
                    headers: {
                        'access-token': authToken,
                        'Content-Type': 'application/json'
                    },
                    data: data
            
                };



                axios(config)
                .then(async (response) => {
                    if (response.data.orderStatus != undefined) {


                        const order = new Order_Modal({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.orderId,
                            ordertype: calltypess,
                            borkerid: 7,
                            quantity: exitquantity,
                        });



                        return res.json({
                            status: true,
                            data: response.data,
                            message: "Order Placed Successfully"
                        });




                    } else {
                        
                        return res.status(500).json({
                            status: false,
                            message: response.data || 'Unknown error in response'
                        });
                    }
                })
                .catch((error) => {
                  if (error.response) {

                    return res.status(500).json({
                        status: false,
                        message: error.response.data,
                    });


                  } else if (error.request) {
                    return res.status(500).json({
                        status: false,
                        message: error.request,
                    });

                  } else {
                    return res.status(500).json({
                        status: false,
                        message: error.message,
                    });


                  }
                });
                   
                   
            }
        } catch (error) {
            return {
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the order"
            };
        }


    }


    async dhanorderplace(item) {
       
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

            if (brokerid != 7) {
                return {
                    status: false,
                    message: "Invalid Broker Place Order"
                };
            }

            const authToken = client.authtoken;
            const apikey = client.apikey;

            let exchange, producttype;
            exchange = "NSE_EQ";
            producttype = "CNC";



            if (calltype == "BUY") { } else {
                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;  // Declare totalValue outside the blocks
                try {
                    positionData = await CheckPosition(authToken, "C", instrumentToken);

                } catch (error) {
                }

              
                    try {
                        holdingData = await CheckHolding(authToken, "C", instrumentToken);

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
                "dhanClientId": apikey,
                "transactionType": calltype,
                "exchangeSegment": exchange,
                "productType": producttype,
                "orderType": "MARKET",
                "validity": "DAY",
                "securityId": instrumentToken,
                "quantity": parseInt(quantity),
                "disclosedQuantity": 0,
                "price": 0,
                "triggerPrice": 0,
                "afterMarketOrder": true,
                "amoTime": "OPEN",
                "boProfitValue": 0,
                "boStopLossValue": 0
              });



              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.dhan.co/orders',
                headers: {
                    'access-token': authToken,
                    'Content-Type': 'application/json'
                },
                data: data
        
            };



            return axios(config)
                .then(async (response) => {
                    // Log full response for debugging purposes

                    if (response.data.orderStatus != undefined) {
                        const order = new Basketorder_Modal({
                            clientid: client._id,
                            tradesymbol: tradesymbol,
                            orderid: response.data.orderId,
                            ordertype: calltype,
                            borkerid: 7,
                            price: price,
                            quantity: quantity,
                            ordertoken: instrumentToken,
                            exchange: exchange,
                            version: version,
                            basket_id: basket_id,
                            howmanytimebuy:howmanytimebuy
                        });

                        await order.save();



                        if(calltype =="SELL") {
                            await Basketorder_Modal.updateMany(
                                {
                                  version: version,
                                  clientid: client._id,
                                  basket_id: basket_id,
                                  brokerid: '7',
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
                            data: "Order Successfully",
                        };
                    }
                    else {
                        return res.status(500).json({
                            status: false,
                            message: response.data || 'Unknown error in response'
                        });
                    }

                })
                .catch((error) => {
                    if (error.response) {
  
                      return res.status(500).json({
                          status: false,
                          message: error.response.data,
                      });
  
  
                    } else if (error.request) {
                      return res.status(500).json({
                          status: false,
                          message: error.request,
                      });
  
                    } else {
                      return res.status(500).json({
                          status: false,
                          message: error.message,
                      });
  
  
                    }
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


            if (order.borkerid != 7) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;


            var config = {
                method: 'get',
                url: 'https://api.dhan.co/orders/' + order.orderid,
                headers: {
                    'access-token': authToken,
                    'Content-Type': 'application/json'
                },
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
                return res.status(404).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) return res.status(404).json({ status: false, message: "Signal not found" });
    
            // ✅ Fetch Stocks
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) return res.status(404).json({ status: false, message: "No stock found for this signal" });
    
            // ✅ Authorization Data
            const apikey = client.apikey;
            const authToken = client.authtoken;
    
            let ordersData = [];
            let failedOrders = [];
            for (let stock of stocks) {
                let optiontype, exchange, exchangess, producttype;
    
                if (stock.segment === "C") {
                    exchange = "NSE_EQ";
                    exchangess = "NSE";
                } else {
                    optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NSE_FNO";
                    exchangess = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "INTRADAY" : (stock.segment === "C" ? "CNC" : "MARGIN");
    
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
    
                if (!stockData)
                    { 
                        failedOrders.push({ stock: stock.tradesymbol, message: "Stock not found" });
                        continue;
            }
                // ✅ Unique Correlation ID
                const correlationId = crypto.randomBytes(12).toString('hex').substring(0, 25);
    
                let orderPayload = {
                    "dhanClientId": apikey,
                    "transactionType": stock.calltype,
                    "exchangeSegment": exchange,
                    "productType": producttype,
                    "orderType": "MARKET",
                    "validity": "DAY",
                    "securityId": stockData.instrument_token,
                    "quantity": parseInt(quantity),
                    "disclosedQuantity": 0,
                    "price": 0,
                    "triggerPrice": 0,
                    "afterMarketOrder": true,
                    "amoTime": "OPEN",
                    "boProfitValue": 0,
                    "boStopLossValue": 0
                };
    
                let config = {
                    method: 'post',
                    url: 'https://api.dhan.co/orders',
                    headers: {
                        'access-token': authToken,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(orderPayload)
                };
    
                try {
                    let response = await axios(config);
    
                    if (response.data.orderStatus != undefined) {

                        let orderRecord = {
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.orderId,
                            uniqueorderid: correlationId, // ✅ Unique Order ID
                            ordertype: stock.calltype,
                            borkerid: 7,
                            quantity: quantity,
                            ordertoken: stockData.instrument_token,
                            exchange: exchangess
                        };
    
                        await Order_Modal.create(orderRecord);
                        ordersData.push(orderRecord);
                    }
                } catch (error) {

                    failedOrders.push({ stock: stock.tradesymbol, message: `Error placing order for ${stock.tradesymbol}` });
                 
                }
            }
    
            // return res.json({
            //     status: true,
            //     message: "Orders processed",
            //     data: ordersData
            // });

            return res.json({
                status: true,
                message: `Orders Processed: ${ordersData.length} Success, ${failedOrders.length} Failed`,
                successOrders: ordersData,
                failedOrders: failedOrders
            })
    
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
                return res.status(404).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) return res.status(404).json({ status: false, message: "Signal not found" });
    
            // ✅ Fetch Stocks
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) return res.status(404).json({ status: false, message: "No stock found for this signal" });
    
            // ✅ Authorization Data
            const apikey = client.apikey;
            const authToken = client.authtoken;
    
            let ordersData = [];
            let failedOrders = [];

            for (let stock of stocks) {
                let optiontype, exchange, exchangess, producttype;
    
                if (stock.segment === "C") {
                    exchange = "NSE_EQ";
                    exchangess = "NSE";
                } else {
                    optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NSE_FNO";
                    exchangess = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "INTRADAY" : (stock.segment === "C" ? "CNC" : "MARGIN");
    
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
    
                if (!stockData)
                    { 
                        failedOrders.push({ stock: stock.tradesymbol, message: "Stock not found" });
                        continue;
                    }
    
                // ✅ Check Holding & Position
                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
    
                try {
                    positionData = await CheckPosition(authToken, stock.segment, stockData.instrument_token);
                } catch (error) {
                    failedOrders.push({ stock: stock.tradesymbol, message: error.message });
                        continue;
                }
    
                if (stock.segment === "C") {
                    try {
                        holdingData = await CheckHolding(authToken, stock.segment, stockData.instrument_token);
                    } catch (error) {
                        failedOrders.push({ stock: stock.tradesymbol, message: error.message });
                        continue;
                    }
                }
    
                let totalValue = Math.abs(positionData.qty) + (stock.segment === "C" ? holdingData.qty : 0);
    
                // ✅ Exit Order Type (Opposite of Buy/Sell)
                let calltypess = stock.calltype === 'BUY' ? 'SELL' : 'BUY';
    
                if (totalValue >= quantity) {
                    // ✅ Unique Correlation ID
                    const correlationId = crypto.randomBytes(12).toString('hex').substring(0, 25);
    
                    let orderPayload = {
                        "dhanClientId": apikey,
                        "transactionType": calltypess,
                        "exchangeSegment": exchange,
                        "productType": producttype,
                        "orderType": "MARKET",
                        "validity": "DAY",
                        "securityId": stockData.instrument_token,
                        "quantity": parseInt(quantity),
                        "disclosedQuantity": 0,
                        "price": 0,
                        "triggerPrice": 0,
                        "afterMarketOrder": true,
                        "amoTime": "OPEN",
                        "boProfitValue": 0,
                        "boStopLossValue": 0
                    };
    
                    let config = {
                        method: 'post',
                        url: 'https://api.dhan.co/orders',
                        headers: {
                            'access-token': authToken,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(orderPayload)
                    };
    
                    try {
                        let response = await axios(config);
    
                        if (response.data.orderStatus != undefined) {

                            let orderRecord = {
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.orderId,
                                uniqueorderid: correlationId, // ✅ Unique Order ID
                                ordertype: calltypess,
                                borkerid: 7,
                                quantity: quantity,
                                ordertoken: stockData.instrument_token,
                                exchange: exchangess
                            };
    
                            await Order_Modal.create(orderRecord);
                            ordersData.push(orderRecord);
                        }
                    } catch (error) {

                        failedOrders.push({ stock: stock.tradesymbol, message: error.message });

                     
                    }
                } else {
                    failedOrders.push({ stock: stock.tradesymbol, message: `Insufficient quantity for ${stock.tradesymbol}` });
                   
                }
            }
    
            // return res.json({
            //     status: true,
            //     message: "Exit Orders processed",
            //     data: ordersData
            // });

            return res.json({
                status: true,
                message: `Orders Processed: ${ordersData.length} Success, ${failedOrders.length} Failed`,
                successOrders: ordersData,
                failedOrders: failedOrders
            })
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the exit order"
            });
        }
    }

}

async function CheckPosition(authToken, segment, instrument_token) {



    var config = {
        method: 'get',
        url: 'https://api.dhan.co/positions',
        headers: {
            'access-token': authToken,
            'Content-Type': 'application/json'
        },
    };
      
      
    try {
        const response = await axios(config);  // Wait for the response


        if (Array.isArray(response.data)) {
            const Exist_entry_order = response.data.find(item1 => item1.securityId === instrument_token);
            if (Exist_entry_order !== undefined) {
                let possition_qty;

                possition_qty = parseInt(Exist_entry_order.buyQty) - parseInt(Exist_entry_order.sellQty);


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
        // console.error('Error in CheckPosition:', error.message);
        return {
            status: false,
            qty: 0
        };
    }

}



async function CheckHolding(authToken, segment, instrument_token) {
   

    var config = {
        method: 'get',
        url: 'https://api.dhan.co/positions',
        headers: {
            'access-token': authToken,
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await axios(config);


        if (Array.isArray(response.data)) {

            const existEntryOrder = response.data.find(item1 => item1.securityId === instrument_token);

            let possition_qty = 0;
            if (existEntryOrder != undefined) {
                if (segment.toUpperCase() == 'C') {
                    possition_qty = parseInt(existEntryOrder.availableQty);
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
        // console.error('Error fetching position:', error.response ? error.response.data : error.message);
        return {
            status: false,
            qty: 0,
        };
    }

}

module.exports = new Dhan();