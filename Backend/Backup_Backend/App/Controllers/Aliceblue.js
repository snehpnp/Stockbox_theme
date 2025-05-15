var axios = require('axios');
var dateTime = require('node-datetime');
const sha256 = require('js-sha256');
"use strict";
const db = require("../Models");
const { Alice_Socket } = require("../Utils/AliceSocket");

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

class Aliceblue {

    async GetAccessToken(req, res) {


        try {
            const alice_userid = req.query.userId;
            const client = await Clients_Modal.findOne({ alice_userid:alice_userid,ActiveStatus:1,del:0 });

            // Check if the client exists
            if (!client) {


               if (client.devicetoken) {
                    return res.status(404).json({
                        status: false,
                        message: "Client not found"
                    });
                } else {
                    const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                    return res.redirect(dynamicUrl);
                }


            }

            // Check for authCode in the request
            if (req.query.authCode) {
                const authCode = req.query.authCode;
                const appcode = req.query.appcode;

                // Create the encrypted data using sha256
                const encryptedData = sha256(alice_userid + authCode + client.apisecret);
                const data = { checkSum: encryptedData };

                // Axios configuration
                const config = {
                    method: "post",
                    url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: data,
                };

                try {
                    const response = await axios(config);
                    // Check if the response status is not OK
                    if (response.data.stat === "Not_ok") {

                        if (client.devicetoken) {
                        return res.status(500).json({ status: false, message: response.data.emsg });
                         } else {
                            const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                            return res.redirect(dynamicUrl);
                        }
                    }

                    // If userSession exists, update the client's data
                    if (response.data.userSession) {
                        const brokerlink = await Clients_Modal.findOneAndUpdate(
                            { alice_userid:alice_userid,ActiveStatus:1,del:0 }, // Find by alice_userid
                            {
                                authtoken: response.data.userSession,  // Update authtoken
                                dlinkstatus: 1,         // Update dlinkstatus
                                tradingstatus: 1        // Update tradingstatus
                            },
                            { new: true }  // Return the updated document
                        );

                       
                        if (client.devicetoken) {
                            return res.json({
                                status: true,
                                message: "Broker login successfully",
                            });
                        } else {
                            const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                            return res.redirect(dynamicUrl);
                        }



                    }

                } catch (error) {


                    if (client.devicetoken) {
                        return res.status(500).json({ status: false, message: error.message || "Server error" });
                    } else {
                        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                        return res.redirect(dynamicUrl);
                    }

                }

            } else {

                if (client.devicetoken) {
                    return res.status(400).json({ status: false, message: "authCode is required" });
                } else {
                    const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                    return res.redirect(dynamicUrl);
                }

            }
        } catch (error) {

            if (client.devicetoken) {
                return res.status(500).json({ status: false, message: error.message || "Server error" });
            } else {
                const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                return res.redirect(dynamicUrl);
            }


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
            const userId = client.alice_userid;


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
            let quantitys = quantity; // Declare quantitys outside the blocks
            // if(stock.segment !== "C") {
            //     quantitys=  quantitys*stock.lotsize;
            // }


            var data = JSON.stringify([
                {
                    "complexty": "regular",
                    "discqty": "0",
                    "exch": exchange,
                    "pCode": producttype,
                    "prctyp": "MKT",
                    "price": price,
                    "qty": quantitys,
                    "ret": "DAY",
                    "symbol_id": stock.instrument_token,
                    "trading_symbol": stock.tradesymbol,
                    "transtype": signal.calltype,
                    "trigPrice": "00.00",
                    "orderTag": "order1"
                }
            ]);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                headers: {
                    'Authorization': 'Bearer ' + userId + ' ' + authToken,
                    'Content-Type': 'application/json',
                },
                data: data
            };

            axios(config)
                .then(async (response) => {

                    const responseData = response.data;


                    if (responseData.length >0 && responseData[0].stat == 'Ok') {
                        const finalExitQuantity = exitquantity && exitquantity > 0 ? exitquantity : quantity;
                        const order = new Order_Modal({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: responseData[0].NOrdNo,
                            ordertype: signal.calltype,
                            borkerid: 2,
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
                            message: `${response.data?.emsg || "Unknown error occurred"}`
                        });
                    }

                })
                .catch(async (error) => {
                    const message = error.response?.data
                    ? JSON.stringify(error.response.data).replace(/["',]/g, '')
                    : error.message;

                    let url;
                    if (message == "") {
                        url = `https://ant.aliceblueonline.com/?appcode=${client.apikey}`;
                    }

                    return res.status(500).json({
                        status: false,
                        url: url,
                        message: message
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
            const userId = client.alice_userid;


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
                return res.status(404).json({
                    status: false,
                    message: "Stock not found"
                });
            }


            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(userId, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol);

            } catch (error) {
            }

            if (stock.segment === "C") {
                try {
                    holdingData = await CheckHolding(userId, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype);

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

            if (totalValue >= quantity) {


                let quantitys = quantity; // Declare quantitys outside the blocks
                // if(stock.segment !== "C") {
                //     quantitys=  quantitys*stock.lotsize;
                // }



                var data = JSON.stringify([
                    {
                        "complexty": "regular",
                        "discqty": "0",
                        "exch": exchange,
                        "pCode": producttype,
                        "prctyp": "MKT",
                        "price": price,
                        "qty": quantitys,
                        "ret": "DAY",
                        "symbol_id": stock.instrument_token,
                        "trading_symbol": stock.tradesymbol,
                        "transtype": calltypes,
                        "trigPrice": "00.00",
                        "orderTag": "order1"
                    }
                ]);

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                    headers: {
                        'Authorization': 'Bearer ' + userId + ' ' + authToken,
                        'Content-Type': 'application/json',
                    },
                    data: data
                };


                axios(config)
                    .then(async (response) => {
                        const responseData = response.data;


                        if (responseData.length >0 && responseData[0].stat == 'Ok') {

                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: responseData[0].NOrdNo,
                                ordertype: calltypes,
                                borkerid: 2,
                                quantity: quantity,
                            });

                            await order.save();

                            
                   const orderupdate = await Order_Modal.findOne({ 
                    clientid:id, 
                    signalid, 
                    borkerid 
                });
        
                if (orderupdate) {
                  orderupdate.tsstatus = 0;
                  await orderupdate.save();
                }
               

                            return res.json({
                                status: true,
                                data: response.data ? null : "Order Successfully",
                            });
                        }
                        else {

                            return res.status(500).json({
                                status: false,
                                message: `${response.data?.emsg || "Unknown error occurred"}`
                            });
                        }

                    })
                    .catch(async (error) => {
                        const message = error.response?.data
                        ? JSON.stringify(error.response.data).replace(/["',]/g, '')
                        : error.message;

                        let url;
                        if (message == "") {
                            url = `https://ant.aliceblueonline.com/?appcode=${client.apikey}`;
                        }

                        return res.status(500).json({
                            status: false,
                            url: url,
                            message: message
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
                const firstData = order.data?.[0]; // safe access
                if (firstData?.stat) {
                    return res.json({
                        status: true,
                        response: order.data
                    });
                } else {
                    return res.json({
                        status: false,
                        response: order.data
                    });
                }
            }

            if (client.tradingstatus == 0) {
                return res.status(404).json({
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                });
            }


            if (order.borkerid != 2) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }


            const authToken = client.authtoken;
            const userId = client.apikey;





            var data = JSON.stringify(
                {
                    "nestOrderNumber": orderid
                }
            );

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                headers: {
                    'Authorization': 'Bearer ' + userId + ' ' + authToken,
                    'Content-Type': 'application/json',
                },
                data: data
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

    async GetAccessTokenAdmin(req, res) {
        try {

            const aliceuserid = req.query.userId;
            const alice = await BasicSetting_Modal.findOne();

            // Check if the client exists
            if (!alice.aliceuserid) {
                return res.status(404).json({
                    status: false,
                    message: "Userid not found"
                });
            }

            if (req.query.authCode) {
                const authCode = req.query.authCode;
                const appcode = req.query.appcode;
                const encryptedData = sha256(aliceuserid + authCode + alice.secretkey);


                const data = { checkSum: encryptedData };
                // Axios configuration
                const config = {
                    method: "post",
                    url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: data,
                };

                try {
                    const response = await axios(config);
                    // Check if the response status is not OK
                    if (response.data.stat === "Not_ok") {
                        return res.status(500).json({ status: false, message: response.data.emsg });
                    }

                    if (response.data.userSession) {
                        const brokerlink = await BasicSetting_Modal.findOneAndUpdate(
                            { aliceuserid }, // Find by alice_userid
                            {
                                authtoken: response.data.userSession,  // Update authtoken
                                brokerloginstatus: 1        // Update tradingstatus
                            },
                            { new: true }  // Return the updated document
                        );

                        Alice_Socket();
                        const dynamicUrl = `${req.protocol}://${req.headers.host}`;
                        return res.redirect(dynamicUrl);
                        // return res.json({
                        //     status: true,
                        //     message: "Broker login successfully",
                        // });
                    }

                } catch (error) {
                    return res.status(500).json({ status: false, message: error.message || "Server error" });
                }

            } else {
                return res.status(400).json({ status: false, message: "authCode is required" });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message || "Server error" });
        }
    }

    async brokerLink(req, res) {
        try {
            const { apikey, secretkey, aliceuserid } = req.body;



            if (!apikey && !secretkey && !aliceuserid) {
                return res.status(404).json({
                    status: false,
                    message: "appcode,userid and secret is required",
                });
            }

            const existingSetting = await BasicSetting_Modal.findOne({});

            if (!existingSetting) {
                return res.status(404).json({
                    status: false,
                    message: "Userid not found",
                });
            }

            // Update client details
            existingSetting.apikey = apikey;
            existingSetting.secretkey = secretkey;
            existingSetting.aliceuserid = aliceuserid;
            await existingSetting.save();


            let url = `https://ant.aliceblueonline.com/?appcode=${apikey}`;

            return res.json({
                status: true,
                url: url
            });

        } catch (error) {
          
            return res.status(500).json({ status: false, message: error.message || "Server error" });

        }
    }

    async orderexit(item){
      

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
            const userId = client.alice_userid;


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



            let holdingData = { qty: 0 };
            let positionData = { qty: 0 };
            let totalValue = 0;  // Declare totalValue outside the blocks
            try {
                positionData = await CheckPosition(userId, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype, stock.tradesymbol);

            } catch (error) {
            }

            if (stock.segment === "C") {
                try {
                    holdingData = await CheckHolding(userId, authToken, stock.segment, stock.instrument_token, producttype, signal.calltype);

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
              

                var data = JSON.stringify([
                    {
                        "complexty": "regular",
                        "discqty": "0",
                        "exch": exchange,
                        "pCode": producttype,
                        "prctyp": "MKT",
                        "price": price,
                        "qty": exitquantity,
                        "ret": "DAY",
                        "symbol_id": stock.instrument_token,
                        "trading_symbol": stock.tradesymbol,
                        "transtype": calltypes,
                        "trigPrice": "00.00",
                        "orderTag": "order1"
                    }
                ]);

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                    headers: {
                        'Authorization': 'Bearer ' + userId + ' ' + authToken,
                        'Content-Type': 'application/json',
                    },
                    data: data
                };


                return axios(config)
                    .then(async (response) => {
                        const responseData = response.data;


                        if (responseData.length >0 && responseData[0].stat == 'Ok') {

                            const order = new Order_Modal({
                                clientid: client._id,
                                signalid: signal._id,
                                orderid: responseData[0].NOrdNo,
                                ordertype: calltypes,
                                borkerid: 2,
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
                                data: response.data ? null : "Order Successfully",
                            };
                        }
                        else {

                            return {
                                status: false,
                                message: `${response.data?.emsg || "Unknown error occurred"}`
                            };
                        }

                    })
                    .catch(async (error) => {
                        const message = error.response?.data
                        ? JSON.stringify(error.response.data).replace(/["',]/g, '')
                        : error.message;

                        let url;
                        if (message == "") {
                            url = `https://ant.aliceblueonline.com/?appcode=${client.apikey}`;
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


    async orderplace(item) {
       
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
            if (brokerid != "2") {
                return {
                    status: false,
                    message: "Invalid Broker Place Order"
                };
            }
            const authToken = client.authtoken;
            const userId = client.alice_userid;

            let exchange, producttype;
                exchange = "NSE";
                producttype = "CNC";
                if(calltype =="BUY") {} else {



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


           
          
            var data = JSON.stringify([
                {
                    "complexty": "regular",
                    "discqty": "0",
                    "exch": exchange,
                    "pCode": producttype,
                    "prctyp": "MKT",
                    "price": price,
                    "qty": quantity,
                    "ret": "DAY",
                    "symbol_id": instrumentToken,
                    "trading_symbol": tradesymbol,
                    "transtype": calltype,
                    "trigPrice": "00.00",
                    "orderTag": "order1"
                }
            ]);

            


            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                headers: {
                    'Authorization': 'Bearer ' + userId + ' ' + authToken,
                    'Content-Type': 'application/json',
                },
                data: data
            };
          
            return axios(config)
                .then(async (response) => {

                    const responseData = response.data;

                    if (responseData.length >0 && responseData[0].stat == 'Ok') {

   

                       

                        const order = new Basketorder_Modal({
                            clientid: client._id,
                            tradesymbol: tradesymbol,
                            orderid: responseData[0].NOrdNo,
                            ordertype: calltype,
                            borkerid: 2,
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
                                  brokerid: '2',
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
                            message: `${response.data?.emsg || "Unknown error occurred"}`
                        };
                    }

                })
                .catch(async (error) => {


                    const message = error.response?.data
                    ? JSON.stringify(error.response.data).replace(/["',]/g, '')
                    : error.message;
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
                const firstData = order.data?.[0]; // safe access
                if (firstData?.stat) {
                    return res.json({
                        status: true,
                        response: order.data
                    });
                } else {
                    return res.json({
                        status: false,
                        response: order.data
                    });
                }
            }
            
            if (client.tradingstatus == 0) {
                return res.status(404).json({
                    status: false,
                    message: "Client Broker Not Login, Please Login With Broker"
                });
            }

            if (order.borkerid != 2) {
                return res.status(404).json({
                    status: false,
                    message: "Order not found for this Broker"
                });
            }

            const authToken = client.authtoken;
            const userId = client.apikey;

            var data = JSON.stringify(
                {
                    "nestOrderNumber": orderid
                }
            );

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                headers: {
                    'Authorization': 'Bearer ' + userId + ' ' + authToken,
                    'Content-Type': 'application/json',
                },
                data: data
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
                return res.status(403).json({ status: false, message: "Client Broker Not Logged In" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) {
                return res.status(404).json({ status: false, message: "Signal not found" });
            }
    
            // ✅ Multiple Stocks Fetch (Ascending Order)
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (stocks.length === 0) {
                return res.status(404).json({ status: false, message: "No stock found for this signal" });
            }

            // ✅ Authorization Data
            const authToken = client.authtoken;
            const userId = client.alice_userid;
    
            let orderRecords = []; // ✅ To Store Orders for Database
            let failedOrders = []; // ❌ To Track Failed Orders
    
            // ✅ Loop Through Stocks and Place Orders One by One
            for (let stock of stocks) {
           
                let optiontype, exchange, producttype;
    
                if (stock.segment === "C") {
                    optiontype = "EQ";
                    exchange = "NSE";
                } else {
                    optiontype = stock.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "MIS" : (stock.segment === "C" ? "CNC" : "NRML");
              

                // ✅ Fetch Stock Data from DB
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
                    failedOrders.push({ stock: stock.tradesymbol, message: "Stock not found" });
                    continue; // ❌ Skip this stock and move to the next
                }


                

                let quantitys = quantity; // Declare quantitys outside the blocks
                if(stockData.segment !== "C") {
                    quantitys=  quantitys*stockData.lotsize*stock.lot;
                }
                
                // ✅ Order Object
                var dataorder = JSON.stringify([
                    {
                    "complexty": "regular",
                    "discqty": "0",
                    "exch": exchange,
                    "pCode": producttype,
                    "prctyp": "MKT",
                    "price": stock.price,
                    "qty": quantitys,
                    "ret": "DAY",
                    "symbol_id": stockData.instrument_token,
                    "trading_symbol": stockData.tradesymbol,
                    "transtype": stock.calltype,
                    "trigPrice": "00.00",
                    "orderTag": "order_" + Date.now() + "_" + Math.floor(Math.random() * 1000)
                }
            ]);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                headers: {
                    'Authorization': 'Bearer ' + userId + ' ' + authToken,
                    'Content-Type': 'application/json',
                },
                data: dataorder
            };


                try {
                    let response = await axios(config);


                    let responseData = response.data;

                    if (responseData.length >0 && responseData[0].stat == 'Ok') {
                        orderRecords.push({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: responseData[0].NOrdNo,
                            ordertype: stock.calltype,
                            borkerid: 2,
                            quantity: quantity,
                            ordertoken: stockData.instrument_token,
                            exchange: stockData.exchange
                        });
                    } else {
                        
                        failedOrders.push({ stock: stock.tradesymbol, message: responseData });
                    }
                } catch (error) {
                    failedOrders.push({
                        stock: stock.tradesymbol,
                        message: error.response ? JSON.stringify(error.response.data) : error.message
                    });
                }
            }
            // ✅ Insert Successful Orders into Database
            if (orderRecords.length > 0) {
                await Order_Modal.insertMany(orderRecords);
            }
    
            // ✅ Final Response
            return res.json({
                status: true,
                message: `Orders Processed: ${orderRecords.length} Success, ${failedOrders.length} Failed`,
                successOrders: orderRecords,
                failedOrders: failedOrders
            });
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the orders"
            });
        }
    }
    
    async MultipleExitplaceOrder(req, res) {
        try {
            const { id, signalid, quantity } = req.body;
    
            // ✅ Client Check
            const client = await Clients_Modal.findById(id);
            if (!client) return res.status(404).json({ status: false, message: "Client not found" });
    
            if (client.tradingstatus === 0) {
                return res.status(400).json({ status: false, message: "Client Broker Not Login, Please Login With Broker" });
            }
    
            // ✅ Signal Check
            const signal = await Signalsdata_Modal.findById(signalid);
            if (!signal) return res.status(404).json({ status: false, message: "Signal not found" });
    
            const stocks = await Signalstock_Modal.find({ signal_id: signalid }).sort({ createdAt: 1 }).lean();
            if (!stocks.length) return res.status(404).json({ status: false, message: "No stocks found for this signal" });
    
            const authToken = client.authtoken;
            const userId = client.alice_userid;
    
            let totalQuantityAvailable = 0;
            let orderRecords = [];
            let failedOrders = [];
    
            for (let stock of stocks) {
                let optiontype, exchange, producttype;
    
                if (signal.segment === "C") {
                    optiontype = "EQ";
                    exchange = "NSE";
                } else {
                    optiontype = signal.segment === "F" ? "UT" : stock.optiontype;
                    exchange = "NFO";
                }
    
                producttype = signal.callduration === "Intraday" ? "MIS" : (signal.segment === "C" ? "CNC" : "NRML");
    
                let stockData;
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
                    failedOrders.push({ stock: stock.tradesymbol, message: "Stock not found" });
                    continue;
                }
    
                let holdingData = { qty: 0 };
                let positionData = { qty: 0 };
                let totalValue = 0;
    
                try {
                    positionData = await CheckPosition(userId, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype, stockData.tradesymbol);
                } catch (error) {}
    
                if (stock.segment === "C") {
                    try {
                        holdingData = await CheckHolding(userId, authToken, stock.segment, stockData.instrument_token, producttype, stock.calltype);
                    } catch (error) {}
    
                    totalValue = (Number(positionData.qty) || 0) + (Number(holdingData.qty) || 0);
                } else {
                    totalValue = Math.abs(positionData.qty);
                }
    
                totalQuantityAvailable += totalValue;
    
                const calltypes = stock.calltype === "BUY" ? "SELL" : "BUY";
    
                if (totalValue < quantity) {
                    failedOrders.push({ stock: stock.tradesymbol, message: "Requested quantity not available" });
                    continue;
                }
    
                let quantitys = quantity;
                // if (stock.segment !== "C") quantitys *= stockData.lotsize;
                if(stockData.segment !== "C") {
                    quantitys=  quantitys*stockData.lotsize*stock.lot;
                }
    
                const dataorder = JSON.stringify([{
                    complexty: "regular",
                    discqty: "0",
                    exch: exchange,
                    pCode: producttype,
                    prctyp: "MKT",
                    price: stock.price,
                    qty: quantitys,
                    ret: "DAY",
                    symbol_id: stockData.instrument_token,
                    trading_symbol: stockData.tradesymbol,
                    transtype: calltypes,
                    trigPrice: "00.00",
                    orderTag: "order_" + Date.now() + "_" + Math.floor(Math.random() * 1000)
                }]);
    
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                    headers: {
                        'Authorization': 'Bearer ' + userId + ' ' + authToken,
                        'Content-Type': 'application/json',
                    },
                    data: dataorder
                };
    
                try {
                    const response = await axios(config);
                    const responseData = response.data;
    
                    if (responseData.length >0 && responseData[0].stat === 'Ok') {
                        orderRecords.push({
                            clientid: client._id,
                            signalid: signal._id,
                            orderid: responseData[0].NOrdNo,
                            ordertype: calltypes,
                            borkerid: 2,
                            quantity: quantity
                        });
                    } else {
                        failedOrders.push({ stock: stock.tradesymbol, message: responseData });
                    }
                } catch (error) {
                    failedOrders.push({
                        stock: stock.tradesymbol,
                        message: error.response ? JSON.stringify(error.response.data) : error.message
                    });
                }
            }
    
            // ✅ Insert All Successful Orders at the End
            if (orderRecords.length) {
                await Order_Modal.insertMany(orderRecords);
                await Order_Modal.updateMany(
                    { clientid: id, signalid, borkerid: 2 },
                    { $set: { tsstatus: 0 } }
                );
            }
    
            return res.json({
                status: true,
                message: `Orders Processed: ${orderRecords.length} Success, ${failedOrders.length} Failed`,
                successOrders: orderRecords,
                failedOrders: failedOrders
            });
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.response ? error.response.data : "An error occurred while placing the exit order"
            });
        }
    }
    


}


async function CheckPosition(userId, authToken, segment, instrument_token, producttype, calltype, trading_symbol) {
    var data_possition = {
        "ret": "NET"
    };

    var config = {
        method: 'post',
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/positionBook',
        headers: {
            'Authorization': 'Bearer ' + userId + ' ' + authToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data_possition)
    };

    try {
        const response = await axios(config);  // Wait for the response

        if (Array.isArray(response.data)) {
            const Exist_entry_order = response.data.find(item1 => item1.Token === instrument_token && item1.Pcode == producttype);

            if (Exist_entry_order != undefined) {
                if (segment.toUpperCase() === 'C') {
                    const possition_qty = parseInt(Exist_entry_order.Bqty) - parseInt(Exist_entry_order.Sqty);

                    return {
                        status: possition_qty !== 0,
                        qty: Math.abs(possition_qty)
                    };
                } else {
                    const possition_qty = Exist_entry_order.Netqty;

                    return {
                        status: possition_qty !== 0,
                        qty: Math.abs(possition_qty)
                    };
                }
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

async function CheckHolding(userId, authToken, segment, instrument_token, producttype, calltype) {
    const config = {
        method: 'get',
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/holdings',
        headers: {
            'Authorization': `Bearer ${userId} ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);

        // Check if the response is valid
        if (response.data.stat === "Ok") {

            // Find the matching entry in the holding data
            const existEntryOrder = response.data.HoldingVal.find(item1 => item1.Token1 === instrument_token && item1.Pcode === producttype);

            let position_qty = 0;

            if (existEntryOrder !== undefined) {
                // Check for the segment and get the appropriate quantity
                if (segment.toUpperCase() === 'C') {
                    position_qty = parseInt(existEntryOrder.SellableQty);
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




module.exports = new Aliceblue();