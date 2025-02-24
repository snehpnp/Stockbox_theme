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

class Angle {

    async GetAccessToken(req, res) {
        try {
            var keystr = req.query.key;


            if (keystr != undefined) {
                var key = keystr.split('?auth_token=')[0];

                const client = await Clients_Modal.findById(key);

                if (!client) {
                    return res.status(404).json({
                        status: false,
                        message: "Client not found"
                    });
                }

                var auth_token = keystr.split('?auth_token=')[1];

                if (!auth_token) {
                    return res.status(404).json({
                        status: false,
                        message: "Auth Token is required"
                    });
                }

                const brokerlink = await Clients_Modal.findByIdAndUpdate(
                    key,
                    {
                        authtoken: auth_token,  // Update authtoken
                        dlinkstatus: 1,                        // Update dlinkstatus
                        tradingstatus: 1                       // Update tradingstatus
                    },
                    {
                        new: true, // Return the updated document
                        useFindAndModify: false // Prevent deprecation warning (optional)
                    }
                );

                return res.json({
                    status: true,
                    message: "Broker login successfully",
                });


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
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "DELIVERY" : "CARRYFORWARD";
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



            var data = JSON.stringify({
                "variety": "NORMAL",
                "tradingsymbol": stock.tradesymbol,
                "symboltoken": stock.instrument_token,
                "transactiontype": signal.calltype,
                "exchange": exchange,
                "ordertype": "MARKET",
                "producttype": producttype,
                "duration": "DAY",
                "price": 0,
                "squareoff": "0",
                "stoploss": "0",
                "quantity": quantity
            });





            const config = {
                method: 'post',
                url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder',
                //  url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getOrderBook',

                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP', // Replace with actual IP
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP', // Replace with actual IP
                    'X-MACAddress': 'MAC_ADDRESS', // Replace with actual MAC address
                    'X-PrivateKey': client.apikey // Replace with actual API key
                },
                data: data
            };


            //  const response = await axios(config);

            axios(config)
                .then(async (response) => {

                    if (response.data.message == 'SUCCESS') {

                        const finalExitQuantity = exitquantity && exitquantity > 0 ? exitquantity : quantity;


                        const order = new Order_Modal({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: response.data.data.orderid,
                            uniqueorderid: response.data.data.uniqueorderid,
                            ordertype: signal.calltype,
                            borkerid: 1,
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
                        if (response.data.message == "Invalid Token") {
                            url = `https://smartapi.angelone.in/publisher-login?api_key=${client.apikey}`;
                        }
                        return res.status(500).json({
                            status: false,
                            url: url,
                            message: response.data.message
                        });
                    }

                })
                .catch(async (error) => {
                    return res.status(500).json({
                        status: false,
                        message: response.data.message
                    });

                });

        } catch (error) {
            // console.error("Error placing order:", error); // Log the error
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
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "DELIVERY" : "CARRYFORWARD";
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
                positionData = await CheckPosition(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol);
            } catch (error) {
                //   console.error('Error in CheckPosition:', error.message);

            }


            if (stock.segment == "C") {
                try {
                    holdingData = await CheckHolding(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype);

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
                    "variety": "NORMAL",
                    "tradingsymbol": stock.tradesymbol,
                    "symboltoken": stock.instrument_token,
                    "transactiontype": calltypes,
                    "exchange": exchange,
                    "ordertype": "MARKET",
                    "producttype": producttype,
                    "duration": "DAY",
                    "price": 0,
                    "squareoff": "0",
                    "stoploss": "0",
                    "quantity": quantity
                });


                const config = {
                    method: 'post',
                    url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder',

                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-UserType': 'USER',
                        'X-SourceID': 'WEB',
                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                        'X-MACAddress': 'MAC_ADDRESS',
                        'X-PrivateKey': client.apikey
                    },
                    data: data
                };

                axios(config)
                    .then(async (response) => {

                        if (response.data.message == 'SUCCESS') {


                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.orderid,
                                uniqueorderid: response.data.data.uniqueorderid,
                                ordertype: calltypes,
                                borkerid: 1,
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
                            if (response.data.message == "Invalid Token") {
                                url = `https://smartapi.angelone.in/publisher-login?api_key=${client.apikey}`;
                            }
                            return res.status(500).json({
                                status: false,
                                url: url,
                                message: response.data.message
                            });
                        }

                    })
                    .catch(async (error) => {
                        return res.status(500).json({
                            status: false,
                            message: response.data.message
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


            if (order.borkerid != 1) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;


            const uniorderId = order.uniqueorderid;
            const config = {
                method: 'get',
                url: `https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/details/${uniorderId}`, // Use dynamic orderid
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': userId
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




    async orderexitangle(item) {

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
                producttype = "INTRADAY";
            } else {
                producttype = signal.segment === "C" ? "DELIVERY" : "CARRYFORWARD";
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



            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol);
            } catch (error) {
                //   console.error('Error in CheckPosition:', error.message);

            }


            if (stock.segment == "C") {
                try {
                    holdingData = await CheckHolding(client.apikey, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype);

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
                    "variety": "NORMAL",
                    "tradingsymbol": stock.tradesymbol,
                    "symboltoken": stock.instrument_token,
                    "transactiontype": calltypes,
                    "exchange": exchange,
                    "ordertype": "MARKET",
                    "producttype": producttype,
                    "duration": "DAY",
                    "price": 0,
                    "squareoff": "0",
                    "stoploss": "0",
                    "quantity": exitquantity
                });


                const config = {
                    method: 'post',
                    url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder',

                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-UserType': 'USER',
                        'X-SourceID': 'WEB',
                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                        'X-MACAddress': 'MAC_ADDRESS',
                        'X-PrivateKey': client.apikey
                    },
                    data: data
                };

                return axios(config)
                    .then(async (response) => {

                        if (response.data.message == 'SUCCESS') {


                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: response.data.data.orderid,
                                uniqueorderid: response.data.data.uniqueorderid,
                                ordertype: calltypes,
                                borkerid: 1,
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
                                url = `https://smartapi.angelone.in/publisher-login?api_key=${client.apikey}`;
                            }
                            return {
                                status: false,
                                url: url,
                                message: response.data.message
                            };
                        }

                    })
                    .catch(async (error) => {
                        return {
                            status: false,
                            message: response.data.message
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
                message: error.response ? error.response.data : "An error occurred while placing the order"
            };
        }
    }




    async angleorderplace(item) {

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

            if (brokerid != 1) {
                return {
                    status: false,
                    message: "Invalid Broker Place Order"
                };
            }
            const authToken = client.authtoken;

            let exchange, producttype;
            exchange = "NSE";
            producttype = "DELIVERY";

            if (calltype == "BUY") { } else {
                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;  // Declare totalValue outside the blocks
                try {
                    positionData = await CheckPosition(userId, authToken, "C", instrumentToken, producttype, calltype, tradesymbol);

                } catch (error) {
                }

                try {
                    holdingData = await CheckHolding(userId, authToken, "C", instrumentToken, producttype, calltype);

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
                "variety": "NORMAL",
                "tradingsymbol": tradesymbol,
                "symboltoken": instrumentToken,
                "transactiontype": calltype,
                "exchange": exchange,
                "ordertype": "MARKET",
                "producttype": producttype,
                "duration": "DAY",
                "price": 0,
                "squareoff": "0",
                "stoploss": "0",
                "quantity": quantity
            });





            const config = {
                method: 'post',
                url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder',
                //  url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getOrderBook',

                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP', // Replace with actual IP
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP', // Replace with actual IP
                    'X-MACAddress': 'MAC_ADDRESS', // Replace with actual MAC address
                    'X-PrivateKey': client.apikey // Replace with actual API key
                },
                data: data
            };



            //  const response = await axios(config);

            return axios(config)
                .then(async (response) => {



                    if (response.data.message == 'SUCCESS') {



                        const order = new Basketorder_Modal({
                            clientid: client._id,
                            tradesymbol: tradesymbol,
                            orderid: response.data.data.orderid,
                            uniqueorderid: response.data.data.uniqueorderid,
                            ordertype: calltype,
                            borkerid: 1,
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
                                    brokerid: '1',
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


            if (order.borkerid != 1) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;


            const uniorderId = order.uniqueorderid;

            const config = {
                method: 'get',
                url: `https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/details/${uniorderId}`, // Use dynamic orderid
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': userId
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




}




async function CheckPosition(userId, authToken, segment, instrument_token, producttype, calltype, trading_symbol) {


    var config = {
        method: 'get',
        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': userId
        },
    };

    try {
        const response = await axios(config);  // Wait for the response


        if (response.data.data != null && response.data.message == "SUCCESS") {
            const Exist_entry_order = response.data.data.find(item1 => item1.symboltoken === instrument_token);

            if (Exist_entry_order !== undefined) {
                let possition_qty;
                if (segment.toUpperCase() === 'C') {
                    possition_qty = parseInt(Exist_entry_order.buyqty) - parseInt(Exist_entry_order.sellqty);
                } else {
                    possition_qty = Exist_entry_order.netqty;
                }

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



async function CheckHolding(userId, authToken, segment, instrument_token, producttype, calltype) {


    var config = {
        method: 'get',
        url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/portfolio/v1/getAllHolding',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': userId
        },
    };

    try {
        const response = await axios(config);

        if (response.data.message == "SUCCESS") {

            const existEntryOrder = response.data.data.holdings.find(item1 => item1.symboltoken === instrument_token && item1.product === producttype);
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

module.exports = new Angle();