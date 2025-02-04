const db = require("../Models");
const multer = require('multer');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');
const Papa = require('papaparse');
const fs = require('fs');
var dateTime = require('node-datetime');
const cron = require('node-cron');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");
const Stock_Modal = db.Stock;
const Clients_Modal = db.Clients;
const Signal_Modal = db.Signal;
const BasicSetting_Modal = db.BasicSetting;
const Notification_Modal = db.Notification;
const Planmanage = db.Planmanage;
const Basket_Modal = db.Basket;
const Order_Modal = db.Order;


//const JsonFile = require("../../uploads/json/config.json");
const { sendFCMNotification } = require('./Pushnotification'); 
const Adminnotification_Modal = db.Adminnotification;


let ws;
const url = "wss://ws1.aliceblueonline.com/NorenWS/"

cron.schedule('0 7 * * *', async () => {
    await DeleteTokenAliceToken();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

cron.schedule('0 8 * * *', async () => {
    await AddBulkStockCron();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

cron.schedule('0 6 * * *', async () => {
    await downloadKotakNeotoken();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


cron.schedule('0 4 * * *', async () => {
    await TradingStatusOff();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


cron.schedule('0 17 * * *', async () => {
    await calculateCAGRForBaskets();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


cron.schedule('0 16 * * *', async () => {
    await processPendingOrders();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


// cron.schedule(`${JsonFile.cashexpiretime} ${JsonFile.cashexpirehours} * * *`, async () => {
//     await CheckExpireSignalCash();

// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
// });

// // Schedule for future option expiry
// cron.schedule(`${JsonFile.foexpiretime} ${JsonFile.foexpirehours} * * *`, async () => {
//     await CheckExpireSignalFutureOption();
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
// });


const jsonFilePath = path.join(__dirname, "../../uploads/json/config.json");

let JsonFile = require(jsonFilePath); 
let cashExpireCron;
let foExpireCron;

function reloadCronJobs() {
  if (cashExpireCron) cashExpireCron.stop();
  if (foExpireCron) foExpireCron.stop();

  cashExpireCron = cron.schedule(
    `${JsonFile.cashexpiretime} ${JsonFile.cashexpirehours} * * *`,
    async () => {
    //   console.log("Running CheckExpireSignalCash...");
      await CheckExpireSignalCash();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );

//   console.log(
//     `Cash Expiry Cron rescheduled with time: ${JsonFile.cashexpiretime} and hour: ${JsonFile.cashexpirehours}`
//   );

  foExpireCron = cron.schedule(
    `${JsonFile.foexpiretime} ${JsonFile.foexpirehours} * * *`,
    async () => {
    //   console.log("Running CheckExpireSignalFutureOption...");
      await CheckExpireSignalFutureOption();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );

//   console.log(
//     `Future Option Expiry Cron rescheduled with time: ${JsonFile.foexpiretime} and hour: ${JsonFile.foexpirehours}`
//   );
}

reloadCronJobs();

fs.watch(jsonFilePath, (eventType) => {
  if (eventType === "change") {
    // console.log("Config file updated. Reloading cron jobs...");
    delete require.cache[require.resolve(jsonFilePath)]; // Clear the cache
    JsonFile = require(jsonFilePath); // Reload the JSON file
    reloadCronJobs(); // Reload all cron jobs
  }
});


cron.schedule('0 9 * * *', async () => {
    await PlanExpire();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


async function AddBulkStockCron(req, res) {
    try {
      const config = {
          method: 'get',
          url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
      };
  
      const response = await axios(config);


      if (response.data.length > 0) {
  
  
          const filteredDataO = response.data.filter(element =>
              (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
              element.exch_seg === "NFO" && element.name != ""
          );


        //   const filteredDataOO = filteredDataO.filter(element =>
        //     (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
        //     element.exch_seg === "NFO" && element.name == "RELIANCE" &&  element.expiry=='28NOV2024'
            
        // );

// console.log(filteredDataOO);
         
          const filteredDataF = response.data.filter(element =>
              (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
              element.exch_seg === "NFO" && element.name != ""
          );
  
          // const filteredDataMF = response.data.filter(element =>
          //     element.instrumenttype === 'FUTCOM' && element.name != ""
          // );
          // const filteredDataMO = response.data.filter(element =>
          //     (element.instrumenttype === 'OPTFUT' || element.instrumenttype === 'OPTCOM') && element.name != ""
          // );
          // const filteredDataCO = response.data.filter(element =>
          //     element.instrumenttype === 'OPTCUR' && element.name != ""
          // );
          // const filteredDataCF = response.data.filter(element =>
          //     element.instrumenttype === 'FUTCUR' && element.name != ""
          // );
          const filteredDataC = response.data.filter(element =>
              (element.symbol.slice(-3) === '-EQ' || element.symbol.slice(-3) === '-BE') && element.name != ""
          );
  
          // const filteredDataBO = response.data.filter(element =>
          //     (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
          //     element.exch_seg === "BFO" && element.name != ""
          // );
  
          // const filteredDataBF = response.data.filter(element =>
          //     (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
          //     element.exch_seg === "BFO" && element.name != ""
          // );
          // const filteredDataBC = response.data.filter(element =>
          //     element.instrumenttype === "" && element.exch_seg === "BSE" && element.name != ""
          // );
  
          // console.log("filteredDataBC", filteredDataBC.length)
      
          // Segment O -OPTION
          const userDataSegment_O = await createUserDataArray(filteredDataO, "O");
          console.log("O")
          await insertData(userDataSegment_O);
        //   console.log("O")
          // Segment F - FUTURE
          const userDataSegment_F = await createUserDataArray(filteredDataF, "F");
          await insertData(userDataSegment_F);
          console.log("F")
          // Segment C -CASH
          const userDataSegment_C = await createUserDataArray(filteredDataC, "C");
          await insertData(userDataSegment_C);
          console.log("C")
  
  
          // Segment MF MCX FUTURE
          // const userDataSegment_MF = await createUserDataArray(filteredDataMF, "MF");
          // await insertData(userDataSegment_MF);
          // console.log("MF")
          // // Segment MO  MCX OPTION
          // const userDataSegment_MO = createUserDataArray(filteredDataMO, "MO");
          // await insertData(userDataSegment_MO);
          // console.log("MO")
  
  
  
  
          // Segment CO CURRENCY OPTION
          // const userDataSegment_CO = await createUserDataArray(filteredDataCO, "CO");
          // await insertData(userDataSegment_CO);
          // console.log("CO")
  
          // // Segment CF  CURRENCY FUTURE
          // const userDataSegment_CF = await createUserDataArray(filteredDataCF, "CF");
          // await insertData(userDataSegment_CF);
          // console.log("CF")
  
          // // Segment BF
          // const userDataSegment_BF = await createUserDataArray(filteredDataBF, "BF");
          // await insertData(userDataSegment_BF);
          // console.log("BF")
          // // Segment BO
          // const userDataSegment_BO = await createUserDataArray(filteredDataBO, "BO");
          // await insertData(userDataSegment_BO);
          // console.log("BO")
  
          // // Segment BC
          // const userDataSegment_BC = await createUserDataArray(filteredDataBC, "BC");
          // await insertData(userDataSegment_BC);
          // console.log("BC")
          
  
    
          res.json({ 
            status: true, 
        });
      } else {
        res.json({ 
            status: true, 
        });
      }
  } catch (error) {
    res.json({ 
        status: false, 
    });
  }
  }
  
const DeleteTokenAliceToken = async (req, res) => {
    const pipeline = [
        {
            $addFields: {
                expiryDate: {
                    $dateFromString: {
                        dateString: {
                            $concat: [
                                { $substr: ["$expiry", 4, 4] }, // Year
                                "-",
                                { $substr: ["$expiry", 2, 2] }, // Month
                                "-",
                                { $substr: ["$expiry", 0, 2] } // Day
                            ]
                        },
                        format: "%Y-%m-%d"
                    }
                }
            }
        },
        {
            $match: {
                expiryDate: { $lt: new Date() }
            }
        },
        {
            $group: {
                _id: null,
                idsToDelete: { $push: "$_id" } // Collecting all matching _id values
            }
        },
        {
            $project: {
                _id: 0,
                idsToDelete: 1
            }
        },
  
    ];
    const result = await Stock_Modal.aggregate(pipeline)
    if (result.length > 0) {
        const idsToDelete = result.map(item => item._id);
        await Stock_Modal.deleteMany({ _id: { $in: result[0].idsToDelete } });
        console.log(`${result.length} expired tokens deleted.`);
        res.json({ 
            status: true, 
            message: `${result[0].idsToDelete.length} expired tokens deleted.` 
        });
    } else {
        res.json({ 
            status: true, 
            message: 'No expired tokens found.' 
        });
       }
  
  }
  
  function createUserDataArray(data, segment) {
    let count = 0
    return data.map(element => {
        //   count++
        //   console.log("element.symbol",element , "count - ",count)
        // if (!element.name) {
        //     console.log(`Skipping element with empty name: ${element}`);
        //     console.log(`token: ${element.token}`);
        //     return null;
        // }
        const option_type = element.symbol.slice(-2);
        const expiry_s = dateTime.create(element.expiry);
        const expiry = expiry_s.format('dmY');
        const strike_s = parseInt(element.strike);
        const strike = parseInt(strike_s.toString().slice(0, -2));
        const day_start = element.expiry.slice(0, 2);
        const moth_str = element.expiry.slice(2, 5);
        const year_end = element.expiry.slice(-2);
        const Dat = new Date(element.expiry);
        const moth_count = Dat.getMonth() + 1;
  
        const tradesymbol_m_w = `${element.name}${year_end}${moth_count}${day_start}${strike}${option_type}`;
  
        return {
            symbol: element.name,
            // expiry: expiry,
            // expiry_month_year: expiry.slice(2),
            // expiry_date: expiry.slice(0, -6),
            // expiry_str: element.expiry,
            expiry: segment === "C" ? null : expiry,
            expiry_date: segment === "C" ? null : expiry.slice(0, -6),
            expiry_month_year: segment === "C" ? null : expiry.slice(2),
            expiry_str: segment === "C" ? null : element.expiry,
            strike: strike,
            option_type: option_type,
            segment: segment,  // Default segment
            instrument_token: element.token,
            lotsize: element.lotsize,
            tradesymbol: element.symbol,
            tradesymbol_m_w: tradesymbol_m_w,
            exch_seg: element.exch_seg
        }; 
    });
  }
  async function insertData(dataArray) {
    //console.log("dataArray ",dataArray)
    try {
        const existingTokens = await Stock_Modal.distinct("instrument_token", {});
        const filteredDataArray = dataArray.filter(userData => {
            return !existingTokens.includes(userData.instrument_token);
        });
        await Stock_Modal.insertMany(filteredDataArray);
    } catch (error) {
        // console.log("Error in insertData:", error)
    }
  
  }



  async function TradingStatusOff() {
    try {
        // Find active clients
        const result = await Clients_Modal.find({ del: 0, ActiveStatus: 1 });
        
        // Update trading status for each active client
        if (result.length > 0) {
            const updateResult = await Clients_Modal.updateMany(
                { del: 0, ActiveStatus: 1 },
                { $set: { tradingstatus: 0 } }
            );

            // console.log(`Updated trading status for ${updateResult.modifiedCount} active clients.`);
        } else {
            // console.log('No active clients found to update.');
            
        }


        const existingSetting = await BasicSetting_Modal.findOne({});
        if (!existingSetting) {
          return;
        }

        if (existingSetting) {
            existingSetting.brokerloginstatus = 0;
            await existingSetting.save();
        
            // console.log(`Updated trading status ....`);
        } 


    } catch (error) {
        // console.log('Error updating trading status:', error);
    }
}




async function CheckExpireSignalCash(req, res) {
    try {

        const today = new Date();
        const signals = await Signal_Modal.find({
            del: 0,
            close_status: false,
            segment: "C",
            callduration:"Intraday",
          });


          for (const signal of signals) {
            try {
                // Get the CPrice for each signal's stock symbol
                const cPrice = await returnstockcloseprice(signal.stock);
                // Update the signal with close_status and close_price
                await Signal_Modal.updateOne(
                    { _id: signal._id },
                    { $set: { close_status: true, closeprice: cPrice, closedate: today } }
                );
            } catch (error) {
                // console.log(`Failed to update signal for ${signal.stock}:`, error.message);
            }
        }

        return;
      
    } catch (error) {
        // console.log('Error:', error);
        return;

    } 
}


async function CheckExpireSignalFutureOption(req, res) {
    try {

        const existingSetting = await BasicSetting_Modal.findOne({});

        if (!existingSetting.brokerloginstatus) {
            // console.log("Broker not Login");
          return;
         
        }



        const today = new Date();
        const formattedToday = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

        // Fetch signals based on criteria
        const signals = await Signal_Modal.aggregate([
            {
                $match: {
                    del: 0,
                    close_status: false,
                    segment: { $in: ["F", "O"] },
                 $or: [
                    { expirydate: formattedToday },
                    { callduration: "Intraday" }
                ]
                }
            },
            {
                $lookup: {
                    from: "stocks",  // Stock details collection
                    localField: "tradesymbol",
                    foreignField: "tradesymbol",
                    as: "stockDetails"
                }
            },
            {
                $unwind: {
                    path: "$stockDetails",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        // Generate channel string for the socket connection
        const channelStradd = signals
            .map(signal => `NFO|${signal.stockDetails?.instrument_token || ''}`)
            .join('#');
        // Check if we have any valid signals
        if (!channelStradd) {
            return;
        }

        // Socket session setup parameters
        const userid = existingSetting.aliceuserid;
        const userSession1 = existingSetting.authtoken;  // Replace with actual token
        const type = { loginType: "API" };

        try {
            const response = await axios.post(
                `https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/ws/createSocketSess`,
                type,
                {
                    headers: {
                        'Authorization': `Bearer ${userid} ${userSession1}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.stat === "Ok") {
                // If session creation is successful, open socket connection
                await openSocketConnection(channelStradd, userid, userSession1);

                return;
            } else {
                return;
            }
        } catch (sessionError) {
            return;
        }

    } catch (error) {
        return;
    }
}

async function openSocketConnection(channelList, userid, userSession1) {

  ws = new WebSocket(url);
  ws.onopen = function () {
    var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userid + "_" + "API",
      uid: userid + "_" + "API",
      source: "API"
    }
    ws.send(JSON.stringify(initCon))
  };

  ws.onmessage = async function (msg) {
    const response = JSON.parse(msg.data)
    if (response.lp != undefined) {
      const Cprice = response.lp;


      const today = new Date();
      const formattedToday = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;
    
      const stock = await Stock_Modal.findOne({ instrument_token: response.tk });


      
      await Signal_Modal.updateOne(
        {
            $or: [
                { tradesymbol: stock.tradesymbol, expirydate: formattedToday, close_status: false },
                { tradesymbol: stock.tradesymbol, callduration: "Intraday", close_status: false }
            ]
        },
        { $set: { close_status: true, closeprice: Cprice, closedate: today } }
    );

    }
    if (response.s === 'OK') {

      let json = {
      k: channelList,
      t: 't'
      };
      
      await ws.send(JSON.stringify(json))
      }

  };

  ws.onerror = function (error) {
    // console.log(`WebSocket error: ${error}`);
  };

  ws.onclose = async function () {
    
  };

}
  
async function returnstockcloseprice(symbol) {
    try {
        if (!symbol) {
         //   throw new Error("Symbol is required.");
        }

        const csvFilePath = "https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv";
        const { data } = await axios.get(csvFilePath);
        
        // Return a promise that resolves with the CPrice after parsing
        return new Promise((resolve, reject) => {
            Papa.parse(data, {
                header: true,
                complete: (result) => {
                    let sheetData = result.data;

                    // Map symbol names as needed
                    sheetData.forEach(item => {
                        switch (item.SYMBOL) {
                            case "NIFTY_BANK":
                                item.SYMBOL = "BANKNIFTY";
                                break;
                            case "NIFTY_50":
                                item.SYMBOL = "NIFTY";
                                break;
                            case "NIFTY_FIN_SERVICE":
                                item.SYMBOL = "FINNIFTY";
                                break;
                        }
                    });

                    // Find the requested symbol and return its CPrice
                   // const stockData = sheetData.find(item => item.SYMBOL === symbol);

                      const stockData = sheetData.find(item => 
                        item.SYMBOL === symbol.trim() || 
                        item.SYMBOL === `NSE:${symbol.trim()}`
                    );

                    // console.log("Searching for Symbol:", symbol.trim());
                    // console.log("Matched Stock Data:", stockData);

                    if (stockData && stockData.CPrice && stockData.CPrice !== "#N/A") {
                        resolve(stockData.CPrice);
                    } else {
                        reject(new Error("CPrice unavailable or symbol not found."));
                    }
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        // console.log("Error in returnstockcloseprice:", error.message);
       // throw error;
       return;
    }
}


async function PlanExpire(req, res) {
    try {
        // Get the current date at midnight (start of the day)
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to start of the day (midnight)
    
        // Calculate the future dates (5, 3, and 1 days later)
        const futureDates = [
            new Date(currentDate),
            new Date(currentDate),
            new Date(currentDate)
        ];
    
        futureDates[0].setDate(currentDate.getDate() + 5); // 5 days later
        futureDates[1].setDate(currentDate.getDate() + 3); // 3 days later
        futureDates[2].setDate(currentDate.getDate() + 1); // 1 day later
    
        // Normalize each date to midnight (00:00:00)
        futureDates.forEach(date => {
            date.setHours(0, 0, 0, 0); // Resetting to midnight for each date
        });
    
      
    
        // Find plans with `enddate` within the range of the future dates (5, 3, or 1 days)
        const plans = await Planmanage.find({
            enddate: { 
                $gte: futureDates[2], // greater than or equal to 1 day from now
                $lt: futureDates[0]  // less than 5 days from now
            }
        });
    
        // Iterate over each expiring plan
        for (const plan of plans) {
            const planEndDate = new Date(plan.enddate);
            planEndDate.setHours(0, 0, 0, 0); // Normalize the plan's end date to midnight
    
            const timeDifference = planEndDate - currentDate;
            const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
         


            if (plan.serviceid == "66d2c3bebf7e6dc53ed07626") {
                serviceName = "Cash";
              
              } else if (plan.serviceid == "66dfeef84a88602fbbca9b79") {
                serviceName = "Option";
              } else {
                serviceName = "Future";
              }
              
            let message;
            const titles = 'Plan Expiry Notification';

            const client = await Clients_Modal.findById(plan.clientid); // Fetch the client
    
            if (daysRemaining === 5) {
                message = `Reminder ${client.FullName}, ${serviceName} Plan will expire in 5 days.`;
            } else if (daysRemaining === 3) {
                message = `Reminder ${client.FullName}, ${serviceName} Plan will expire in 3 days.`;
            } else if (daysRemaining === 1) {
                message = `Reminder ${client.FullName}, ${serviceName} Plan will expire tomorrow.`;
            }
    
             if (message) {
                try {
              
                  
                  const resultn = new Notification_Modal({
                    clientid: plan.clientid,
                    segmentid:plan._id,
                    type:"plan expire",
                    title: titles,
                    message: message
                });
    
                await resultn.save();




                const resultnm = new Adminnotification_Modal({
                    clientid:plan.clientid,
                    segmentid:plan._id,
                    type:'plan expire',
                    title: titles,
                    message: message
                });
            
            
                await resultnm.save();
            

    
                    if (client && client.devicetoken) {
                        const tokens = [client.devicetoken];
                        await sendFCMNotification(title, message,tokens,"plan expire");
                       
                    }
                        
                } catch (error) {
                }
            }
        }
    
      return;
    
    } catch (error) {
        // console.log('Error:', error);
        return;
    }
}




async function downloadKotakNeotoken(req, res) {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
        const day = currentDate.getDate().toString().padStart(2, '0');

        // Format the date
        const formattedDate = `${year}-${month}-${day}`;

        const TokenUrl = [
            {
                url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_fo.csv`,
                key: "KOTAK_NFO"
            },
            {
                url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_cm.csv`,
                key: "KOTAK_NSE"
            },
        ];

        // Use Promise.all to handle all download requests concurrently
        const downloadPromises = TokenUrl.map((data) => {
            const filePath = path.join(__dirname, '../../', 'tokenkotakneo', `${data.key}.csv`);
            const fileUrl = data.url;
            
            return axios({
                method: 'get',
                url: fileUrl,
                responseType: 'stream',
            })
                .then((response) => {
                    return new Promise((resolve, reject) => {
                        const writer = fs.createWriteStream(filePath);
                        response.data.pipe(writer);
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                })
                .catch((error) => {
                    // console.log(`Error downloading file from ${fileUrl}:`, error);
                  //  throw new Error(`Error downloading file from ${fileUrl}`);
                });
        });

        // Wait for all downloads to complete
        await Promise.all(downloadPromises);

        // Send the response once all files are downloaded
        return;

    } catch (error) {
        // console.log('An unexpected error occurred:', error);
        return;
    }
}


async function calculateCAGRForBaskets() {
    const result = await Basket_Modal.aggregate([
        {
            $match: {
                del: false,
            }
        },
        {
            $lookup: {
                from: "basketstocks",
                let: { basketId: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$basket_id", "$$basketId"] },
                                    { $eq: ["$status", 1] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$basket_id",
                            maxVersion: { $max: "$version" }
                        }
                    },
                    {
                        $lookup: {
                            from: "basketstocks",
                            let: { basketId: "$_id", maxVer: "$maxVersion" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$basket_id", "$$basketId"] },
                                                { $eq: ["$version", "$$maxVer"] },
                                                { $eq: ["$status", 1] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "latestStocks"
                        }
                    },
                    {
                        $unwind: "$latestStocks"
                    },
                    {
                        $replaceRoot: { newRoot: "$latestStocks" }
                    },
                    {
                        $lookup: {
                            from: "stocks",
                            localField: "tradesymbol",
                            foreignField: "tradesymbol",
                            as: "stock_info"
                        }
                    },
                    {
                        $unwind: {
                            path: "$stock_info",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "stockliveprices",
                            localField: "stock_info.instrument_token",
                            foreignField: "token",
                            as: "live_price_info"
                        }
                    },
                    {
                        $unwind: {
                            path: "$live_price_info",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $addFields: {
                            livePrice: {
                                $ifNull: ["$live_price_info.lp", "$price"] // Use live price if available, fallback to original price
                            }
                        }
                    }
                ],
                as: "stock_details"
            }
        },
        {
            $project: {
                basket_id: "$_id",
                title: 1,
                created_at: 1,
                stock_details: {
                    $filter: {
                        input: "$stock_details",
                        as: "stock",
                        cond: { $eq: ["$$stock.del", false] }
                    }
                },
            }
        }
    ]);

    const currentDate = new Date();

    for (const basket of result) {
        const { stock_details, created_at, _id } = basket;

        // Calculate starting price
        const startingPrice = stock_details.reduce((sum, stock) => {
            return sum + (stock.price * stock.quantity);
        }, 0);

        // Calculate current price
        const currentPrice = stock_details.reduce((sum, stock) => {
            return sum + (stock.livePrice * stock.quantity);
        }, 0);

        // Calculate years difference
        const createdAt = new Date(created_at);
        const years = (currentDate - createdAt) / (1000 * 60 * 60 * 24 * 365.25); // Approximate years

        // Calculate CAGR
        let cagr = null;
        if (years >= 1 && startingPrice > 0) {
            cagr = ((Math.pow(currentPrice / startingPrice, 1 / years) - 1) * 100).toFixed(2);
        }

        // Update the basket with the calculated CAGR
        await Basket_Modal.updateOne(
            { _id },
            { $set: { cagr_live: cagr ? parseFloat(cagr) : null } }
        );
    }
    
    return;

}


////////////////////////// auto respose for order //////////////////////////
async function handleExpiredToken(client, order, error) {
    console.error(`Error processing order ${order.orderid} for client ${client._id}:`, error.message);

    // order.status = -1;
    // await order.save();

    console.log(`Notifying client ${client._id} about expired token.`);
}

// Fetch order for Alice Blue broker
async function fetchAliceBlueOrder(client, order) {
    const authToken = client.authtoken;
    const userId = client.apikey;

    const data = JSON.stringify({ "nestOrderNumber": order.orderid });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
        headers: {
            'Authorization': `Bearer ${userId} ${authToken}`,
            'Content-Type': 'application/json',
        },
        data: data
    };

    return await axios(config);
}

async function fetchAngelOneOrder(client, order) {
    const authToken = client.authtoken;
    const userId = client.apikey;

    const config = {
        method: 'get',
        url: `https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/details/${order.uniqueorderid}`,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': userId,
        },
    };

    return await axios(config);
}

async function fetchKotakOrder(client, order) {
    const authToken = client.authtoken;
    const userId = client.apikey;

    const data_orderHistory = qs.stringify({
        jData: '{"nOrdNo":"' + order.orderid + '"}',
    });
    const url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/order/history?sId=${client.hserverid}`;

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: url,
        headers: {
            accept: "application/json",
            Sid: client.kotakneo_sid,
            Auth: client.authtoken,
            "neo-fin-key": "neotradeapi",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + client.oneTimeToken,
        },
        data: data_orderHistory,
    };

    return await axios(config);
}

async function fetchMarketHubOrder(client, order) {
    const authToken = client.authtoken;

    const data = JSON.stringify({ "orderId": order.orderid });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://fund.markethubonline.com/middleware/api/v2/OrderHistory',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        data: data
    };

    return await axios(config);
}


async function processPendingOrders(req, res) {
    const summary = { processed: 0, failed: 0, skipped: 0, errors: [] };

    try {
        // Set start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch orders for the day with status 0
        const orders = await Order_Modal.find({
            status: 0,
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        if (!orders.length) {
            console.log("No pending orders to process.");
            return res.json({ 
                status: true, 
                message: "No pending orders to process.",
                summary: summary
            });
        }

        // Process each order
        await Promise.all(orders.map(async (order) => {
            try {
                const client = await Clients_Modal.findById(order.clientid);

                if (!client || client.tradingstatus === 0) {
                    console.log(`Skipping order ${order.orderid}: Client not found or not logged in.`);
                    summary.skipped += 1;
                    return; // Skip this order
                }

                let response;

                switch (order.borkerid) {
                    case 2:
                        response = await fetchAliceBlueOrder(client, order);
                        break;
                    case 1:
                        response = await fetchAngelOneOrder(client, order);
                        break;
                    case 3:
                        response = await fetchKotakOrder(client, order);
                        break;
                    case 4:
                        response = await fetchMarketHubOrder(client, order);
                        break;
                    default:
                        console.log(`Skipping order ${order.orderid}: Unsupported broker ID.`);
                        summary.skipped += 1;
                        return; // Skip this order
                }

                // Update the order data and status
                order.data = response.data;
                order.status = 1;
                await order.save();

                summary.processed += 1;
                console.log(`Order ${order.orderid} updated successfully.`);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Handle expired token
                    await handleExpiredToken(client, order, error);
                } else {
                    console.error(`Error processing order ${order.orderid}:`, error.message);
                    summary.errors.push({ orderid: order.orderid, error: error.message });
                }
                summary.failed += 1;
            }
        }));

        // Send summary response after all processing is complete
        return res.json({ 
            status: true, 
            message: "Processing completed.",
            summary: summary 
        });

    } catch (error) {
        console.error("Error in processPendingOrders:", error.message);
        return res.status(500).json({ 
            status: false, 
            message: "An error occurred while processing orders.", 
            error: error.message 
        });
    }
}


////////////////////////// auto respose for order //////////////////////////









  module.exports = { AddBulkStockCron,DeleteTokenAliceToken,TradingStatusOff,CheckExpireSignalCash,CheckExpireSignalFutureOption,PlanExpire,downloadKotakNeotoken,calculateCAGRForBaskets,processPendingOrders };
