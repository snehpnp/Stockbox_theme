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

class Mastertrust {

    async GetAccessToken(req, res) {
        try {
            const alice_userid = req.query.userId;
            const client = await Clients_Modal.findOne({ alice_userid });
    
            // Check if the client exists
            if (!client) {
                return res.status(404).json({
                    status: false,
                    message: "Client not found"
                });
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
                        return res.status(500).json({ status: false, message: response.data.emsg });
                    }
    
                    // If userSession exists, update the client's data
                    if (response.data.userSession) {
                        const brokerlink = await Clients_Modal.findOneAndUpdate(
                            { alice_userid }, // Find by alice_userid
                            { 
                                authtoken: response.data.userSession,  // Update authtoken
                                dlinkstatus: 1,         // Update dlinkstatus
                                tradingstatus: 1        // Update tradingstatus
                            }, 
                            { new: true }  // Return the updated document
                        );
    
                        return res.json({
                            status: true,
                            message: "Broker login successfully",
                        });
                    }
    
                } catch (error) {
                    return res.status(500).json({ status: false, message: "Server error" });
                }
    
            } else {
                return res.status(400).json({ status: false, message: "authCode is required" });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message || "Server error" });
        }
    }

    async placeOrder(req, res) {
        
        try {
            const { id, signalid, quantity, price } = req.body;
    
            const client = await Clients_Modal.findById(id);
            if (!client) {
                return res.status(404).json({
                    status: false,
                    message: "Client not found"
                });
            }


            if(client.tradingstatus == 0)
            {
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
    
    

                if (responseData[0].stat == 'Ok') {
    
                    const order = new Order_Modal({
                        clientid: client._id,
                        signalid:signal._id,
                        orderid:responseData[0].NOrdNo,
                        borkerid:2,
                        quantity:quantity,
                    });
    
    
                    
                   await order.save();
                    return res.json({
                        status: true,
                        data: response.data 
                    });
                }
                else{
                   
                       return res.status(500).json({ 
                        status: false, 
                        message: response.data 
                    });
                }
        
                })
                .catch(async (error) => {
                    const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                    let url;
                    if(message=="") {
                        url =  `https://ant.aliceblueonline.com/?appcode=${client.apikey}`; 
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


            if(client.tradingstatus == 0)
            {
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


           
             
                
                               
              let positionData=0;
                  try {
                    const positionData = await CheckPosition(userId, authToken, stock.segment,stock.instrument_token,producttype,signal.calltype,stock.tradesymbol);
                  
                } catch (error) {
                    // console.error('Error in CheckPosition:', error.message);
                }

                let totalValue=0;
          let holdingData=0;
        if(stock.segment=="C") {
                try {
                    const holdingData = await CheckHolding(userId, authToken, stock.segment,stock.instrument_token,producttype,signal.calltype);
                } catch (error) {
                    // console.error('Error in CheckHolding:', error.message);
                }
                totalValue = Math.abs(positionData)+holdingData;
            }
            else
            {
                totalValue = Math.abs(positionData)
            }


            let calltypes;
                if(signal.calltype === 'BUY')
                {
                    calltypes = "SELL";
                }
                else {
                    calltypes = "BUY";
                }
          

         if(totalValue>=quantity) {

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
    
    
                if (responseData[0].stat == 'Ok') {
    
                    const order = new Order_Modal({
                        clientid: client._id,
                        signalid:signal._id,
                        orderid:responseData[0].NOrdNo,
                        borkerid:2,
                    });
    
    
                   await order.save();
                    return res.json({
                        status: true,
                        data: response.data 
                    });
                }
                else{
                   
                       return res.status(500).json({ 
                        status: false, 
                        message: response.data 
                    });
                }
        
                })
                .catch(async (error) => {
                    const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                    let url;
                    if(message=="") {
                        url =  `https://ant.aliceblueonline.com/?appcode=${client.apikey}`; 
                    }

                    return res.status(500).json({ 
                        status: false, 
                        url: url, 
                        message: message 
                    });
        
                });
            }
            else{

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


      
    

if(order.status==1) {

    return res.json({
        status: true,
        response: order.data
    });
}

if(client.tradingstatus == 0)
    {
        return res.status(404).json({
            status: false,
            message: "Client Broker Not Login, Please Login With Broker"
        });
    }


    if (order.borkerid!=2) {
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

  

}


async function CheckPosition(userId, authToken, segment, instrument_token, producttype, calltype, trading_symbol) {
    

    var data_possition = {
        "ret": "NET"
    }
    var config = {
        method: 'post',
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/positionBook',
        headers: {
            'Authorization': 'Bearer ' + userId + ' ' + authToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data_possition)
    };
    axios(config)
        .then(async (response) => {
 
            if (Array.isArray(response.data)) {

                const Exist_entry_order = response.data.find(item1 => item1.Token === instrument_token && item1.Pcode == producttype);

                if(Exist_entry_order != undefined){
                    if (segment.toUpperCase() == 'C') {

                        const possition_qty = parseInt(Exist_entry_order.Bqty) - parseInt(Exist_entry_order.Sqty);
                     
                        if (possition_qty == 0) {
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
                        const possition_qty = Exist_entry_order.Netqty;                         
                        if (possition_qty == 0) {
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

                    }
                }else{
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




        })
        .catch(async (error) => {
            
            return {
                status: false,
                message:err,
                qty: 0,
            };

            });

}

async function CheckHolding(userId, authToken, segment, instrument_token, producttype, calltype) {
    const config = {
        method: 'get',
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/holdings',
        headers: {
            'Authorization': `Bearer ${userId} ${authToken}`, // Ensure this format is correct for the API you're using
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);

        if (response.data.stat == "Ok") {

            const existEntryOrder = response.data.HoldingVal.find(item1 => item1.Token1 === instrument_token && item1.Pcode === producttype);
let possition_qty = 0;
            if (existEntryOrder != undefined) {
                if (segment.toUpperCase() == 'C') {
                     possition_qty = parseInt(existEntryOrder.SellableQty);
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


module.exports = new Mastertrust();