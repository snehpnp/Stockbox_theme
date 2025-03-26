const db = require("../Models");
const upload = require('../Utils/multerHelper');
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Notification_Modal = db.Notification;
const Planmanage = db.Planmanage;
const Order_Modal = db.Order;
const Plancategory_Modal = db.Plancategory;
const PlanSubscription_Modal = db.PlanSubscription;

mongoose = require('mongoose');
const Clients_Modal = db.Clients;
const { sendFCMNotification } = require('./Pushnotification'); // Adjust if necessary

var axios = require('axios');


class Signal {

    async AddSignal(req, res) {
        try {

            await new Promise((resolve, reject) => {
                upload('report').fields([{ name: 'report', maxCount: 1 }])(req, res, (err) => {
                    if (err) {

                        return reject(err);
                    }

                    resolve();
                });
            });


            const { price, calltype, stock, tag1, tag2, tag3, stoploss, description, callduration, callperiod, add_by, expirydate, segment, optiontype, strikeprice, tradesymbol, lotsize, entrytype, lot } = req.body;

            //    const report = req.files['report'] ? req.files['report'][0].filename : null;



            const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            const reportFile = req.files['report'] ? req.files['report'][0] : null;

            if (reportFile) {
                const fileMimeType = reportFile.mimetype; // Get the MIME type of the uploaded file
                if (!allowedMimeTypes.includes(fileMimeType)) {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid file type. Only PDF and Word files are allowed.",
                    });
                }
            }

            // If validation passes, extract the filename
            const report = reportFile ? reportFile.filename : null;

            var service;
            var serviceName;
            // Set the service value based on the segment
            if (segment == "C") {
                service = "66d2c3bebf7e6dc53ed07626";
                serviceName = "Cash";

            } else if (segment == "O") {
                service = "66dfeef84a88602fbbca9b79";
                serviceName = "Option";
            } else {
                service = "66dfede64a88602fbbca9b72";
                serviceName = "Future";
            }



            let stocks;
            let tradesymbols;

            if (segment === "C") {
                stocks = await Stock_Modal.findOne({
                    symbol: stock,
                    segment: segment,
                });
            } else if (segment === "F") {
                stocks = await Stock_Modal.findOne({
                    symbol: stock,
                    segment: segment,
                    expiry: expirydate,
                });
            } else {
                stocks = await Stock_Modal.findOne({
                    symbol: stock,
                    segment: segment,
                    expiry: expirydate,
                    option_type: optiontype,
                    strike: strikeprice
                });


                tradesymbols = `${stocks.symbol} ${stocks.expiry_str} ${stocks.strike} ${stocks.option_type}`;

            }


            if (!stocks) {
                return res.status(404).json({
                    status: false,
                    message: "Stock not found"
                });
            }


            const result = new Signal_Modal({
                price: price,
                service: service,
                strikeprice: strikeprice,
                calltype: calltype,
                callduration: callduration,
                callperiod: callperiod,
                stock: stock,
                tag1: tag1,
                tag2: tag2,
                tag3: tag3,
                targetprice1: tag1,
                targetprice2: tag2,
                targetprice3: tag3,
                stoploss: stoploss,
                description: description,
                report: report,
                add_by: add_by,
                expirydate: expirydate,
                segment: segment,
                optiontype: optiontype,
                tradesymbol: stocks.tradesymbol,
                tradesymbols: tradesymbols,
                lotsize: stocks.lotsize,
                entrytype: entrytype,
                lot: lot,
            });


            await result.save();


            // const clients = await Clients_Modal.find({
            //   del: 0,
            //   ActiveStatus: 1,
            //   devicetoken: { $exists: true, $ne: null }
            // }).select('devicetoken');



            const today = new Date();

            const clients = await Clients_Modal.find({
                del: 0,
                ActiveStatus: 1,
                devicetoken: { $exists: true, $ne: null },
                _id: {
                    $in: await Planmanage.find({
                        serviceid: service,  // Replace `service` with your actual service value
                        enddate: { $gte: today }
                    }).distinct('clientid')  // Assuming 'clientid' is the field linking to Clients_Modal
                }
            }).select('devicetoken');

            const tokens = clients.map(client => client.devicetoken);

            if (tokens.length > 0) {


                const notificationTitle = 'Important Update';
                const notificationBody = `${serviceName} ${stock} ${calltype} AT ${price} OPEN`;
                const resultn = new Notification_Modal({
                    segmentid: service,
                    type: 'open signal',
                    title: notificationTitle,
                    message: notificationBody
                });

                await resultn.save();


                try {

                    await sendFCMNotification(notificationTitle, notificationBody, tokens, "open signal");

                } catch (error) {

                }


            }


            return res.json({
                status: true,
                message: "Signal added successfully",
                data: result,
            });



        } catch (error) {
            // Enhanced error logging
            // console.error("Error adding Signal:", error);

            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }


    /*async getSignal(req, res) {
      try {
  
       
       
        const { } = req.body;
  
      //  const result = await Signal_Modal.find()
        const result = await Signal_Modal.find({ del: 0 });
  
  
        return res.json({
          status: true,
          message: "get",
          data:result
        });
  
async closeSignalwithplan(req, res) {
  try {

   
    const { id, targethit1,targethit2,targethit3,targetprice1,targetprice2,targetprice3,slprice,exitprice,closestatus,closetype, close_description } = req.body;
   

    const Signal = await Signal_Modal.findById(id);

    if (!Signal) {
        return res.status(404).json({
            status: false,
            message: "Signal not found"
        });
    }
  let serviceName;
  let service;
    if (Signal.segment == "C") {
      serviceName = "Cash";
      service = "66d2c3bebf7e6dc53ed07626";
    
    } else if (Signal.segment == "O") {
      serviceName = "Option";
      service = "66dfeef84a88602fbbca9b79";
    } else {
      serviceName = "Future";
      service = "66dfede64a88602fbbca9b72";
    }

    let stock = Signal.stock;



    let close_status = false;
    let closeprice = null;
    let closedate = null;
   
    let  notificationTitle;
    let notificationBody;
    if (closetype === "1") {
      // Close at target price
      close_status = true;
      closeprice = targetprice3 || targetprice2 || targetprice1;
      closedate = new Date();
    

       notificationTitle = 'Important Update';
       notificationBody =`${serviceName} ${stock} CLOSED All Target Achieved`;



    } else if (closetype === "2") {

      
      // Close based on closestatus and target price
      close_status = closestatus;
    
      if (close_status=="true") {
        closeprice = targetprice3 || targetprice2 || targetprice1;
        closedate = new Date();
      }

      if(targetprice3)
      {
        notificationBody =`${serviceName} ${stock} CLOSED All Target Achieved`;
      }
      else 
      if(targetprice2)
      {
        var targetachive ="2nd";
        if(close_status=="true") {
         notificationBody =`${serviceName} ${stock} CLOSED Book Profits ${targetachive} Target Achived`;
         }
        else {
        notificationBody =`${serviceName} ${stock} PARTIALLY CLOSED Book Partial Profits ${targetachive} Target Achived`;
        }
      }
      else
      {
        var targetachive ="1st";
        
        if(close_status=="true") {
            notificationBody =`${serviceName} ${stock} CLOSED Book Profits ${targetachive} Target Achived`;
             }
            else {
            notificationBody =`${serviceName} ${stock} PARTIALLY CLOSED Book Partial Profits ${targetachive} Target Achived`;
            }
      }

       notificationTitle = 'Important Update';

    } else if (closetype === "3") {
      // Close at stop-loss price
      close_status = true;
      closeprice = slprice;
      closedate = new Date();
    
       notificationTitle = 'Important Update';
      notificationBody =`${serviceName} ${stock} CLOSED SL Triggered`;
        

    } else if (closetype === "4") {
      // Close at exit price
      close_status = true;
      closeprice = exitprice;
      closedate = new Date();

       notificationTitle = 'Important Update';
       notificationBody =`${serviceName} ${stock} CLOSED Exit Position AT ${exitprice}`;

    }
    else if (closetype === "5") {
      // Close at exit price
      close_status = true;
      closeprice = 0;
      closedate = new Date();

       notificationTitle = 'Important Update';
       notificationBody =`Avoid This Signal`;

    }
    
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Signal ID is required",
      });
    }

    const updatedSignal = await Signal_Modal.findByIdAndUpdate(
      id,
      {
          closeprice:closeprice,
          close_status:close_status,
          close_description,
          targethit1,
          targethit2,
          targethit3,
          targetprice1,
          targetprice2,
          targetprice3,
          closedate: closedate
      },
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    // const clients = await Clients_Modal.find({
    //   del: 0,
    //   ActiveStatus: 1,
    //   devicetoken: { $exists: true, $ne: null }
    // }).select('devicetoken');
    
    const today = new Date();

    const clients = await Clients_Modal.find({
      del: 0,
      ActiveStatus: 1,
      devicetoken: { $exists: true, $ne: null },
      _id: {
        $in: await Planmanage.find({
          serviceid: service,  // Replace `service` with your actual service value
          enddate: { $gte: today }
        }).distinct('clientid')  // Assuming 'clientid' is the field linking to Clients_Modal
      }
    }).select('devicetoken');


    const tokens = clients.map(client => client.devicetoken);

    if (tokens.length > 0) {

      const resultn = new Notification_Modal({
        segmentid: Signal.planid,
        type: close_status == "true" ? "close signal" : "open signal",
        title: notificationTitle,
        message: notificationBody
    });
    
    await resultn.save();


    try {
      // Send notifications to all device tokens
      await sendFCMNotification(notificationTitle, notificationBody, tokens,"close signal");
      // console.log('Notifications sent successfully');
    } catch (error) {
  
    }


    }

    if (!updatedSignal) {
      return res.status(404).json({
        status: false,
        message: "Signal not found",
      });
    }

    return res.json({
      status: true,
      message: "Signal Closed successfully",
      data: updatedSignal,
    });

  } catch (error) {
    // console.error("Error updating Signal:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}



async getSignalWithFilterExport(req, res) {
  try {
    const { from, to, service, stock, closestatus, search, add_by } = req.body;
    // let limit = 10;
    // Date filtering
    let fromDate;
    if (from) {
      fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0); // दिन की शुरुआत (00:00:00)
    }
    
    let toDate;
    if (to) {
      toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // दिन का अंत (23:59:59)
    }

    
    
    // Query को बनाएं
    let query = { del: 0 };
    // console.log(typeof closestatus, closestatus);
    
    if (closestatus === "true") {
      if (fromDate && toDate) {
        query.closedate = { $gte: fromDate, $lte: toDate }; 
      }
    }
    else {
    if (fromDate && toDate) {
      query.created_at = { $gte: fromDate, $lte: toDate }; 
    }
  }
    
    if (service) {
      query.service = service;
    }

    if (stock) {
      query.stock = stock;
    }

    if (closestatus) {
      query.close_status = closestatus;
    }

    if (add_by) {
      query.add_by = add_by;
    }

    if (search && search.trim() !== '') {
      query.$or = [
          { tradesymbol: { $regex: search, $options: 'i' } },
          { calltype: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
          { closeprice: { $regex: search, $options: 'i' } }
      ];
  }

    let sortCriteria = { created_at: -1 }; // Default sorting by created_at in descending order
    if (closestatus === true) {
      sortCriteria = { closedate: -1 }; // Sort by close_date in descending order if closestatus is true
    }

    // Convert page and limit to integers and calculate skip
    // const pageNumber = parseInt(page);
    // const limitValue = parseInt(limit);
    // const skip = (pageNumber - 1) * limitValue;

    // Get total count for pagination
    // const totalRecords = await Signal_Modal.countDocuments(query);
    // const totalPages = Math.ceil(totalRecords / limitValue);

    // Fetch data with pagination
    const result = await Signal_Modal.find(query)
      .populate({ path: 'service', select: 'title' }) // Populate only the title from service
      .populate({ path: 'stock', select: 'title' })
      .sort(sortCriteria) // Sort in descending order
      // .skip(skip) // Pagination: skip items
      // .limit(limitValue); // Pagination: limit items

    return res.json({
      status: true,
      message: "Signals fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}



async getSignalWithFilterplanExport(req, res) {
  try {
    const { from, to, service, stock, closestatus, search, add_by } = req.body;
    // Date filtering
    let fromDate;
    if (from) {
      fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0); 
    }
    
    let toDate;
    if (to) {
      toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); 
    }

    

    let query = { del: 0 };
    // console.log(typeof closestatus, closestatus);
    
    if (closestatus === "true") {
      if (fromDate && toDate) {
        query.closedate = { $gte: fromDate, $lte: toDate }; 
      }
    }
    else {
    if (fromDate && toDate) {
      query.created_at = { $gte: fromDate, $lte: toDate }; 
    }
  }


    
    if (service) {
      query.service = service;
    }

    if (stock) {
      query.stock = stock;
    }


    if (closestatus) {
      query.close_status = closestatus;
    }

    if (add_by) {
      query.add_by = add_by;
    }

    if (search && search.trim() !== '') {


      const matchingPlans = await Plancategory_Modal.find(
        { title: { $regex: search, $options: 'i' } },
        { _id: 1 }
    );

    const matchingPlanIds = matchingPlans.map(plan => plan._id.toString());

      query.$or = [
          { tradesymbol: { $regex: search, $options: 'i' } },
          { calltype: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
          { closeprice: { $regex: search, $options: 'i' } },
          { planid: { $in: matchingPlanIds } }
      ];
  }

    let sortCriteria = { created_at: -1 }; // Default sorting by created_at in descending order
    if (closestatus === true) {
      sortCriteria = { closedate: -1 }; // Sort by close_date in descending order if closestatus is true
    }

    // Convert page and limit to integers and calculate skip
    // const pageNumber = parseInt(page);
    // const limitValue = parseInt(limit);
    // const skip = (pageNumber - 1) * limitValue;

    // // Get total count for pagination
    // const totalRecords = await Signal_Modal.countDocuments(query);
    // const totalPages = Math.ceil(totalRecords / limitValue);

    // Fetch data with pagination
    const result = await Signal_Modal.find(query)
      .populate({ path: 'service', select: 'title' }) // Populate only the title from service
      .populate({ path: 'stock', select: 'title' })
      .sort(sortCriteria); // Sort in descending order
      



// Extract unique plan IDs
const planIds = [...new Set(result.map(item => item.planid).filter(id => id))];

// Fetch plan category titles for these planIds
const planCategories = await Plancategory_Modal.find({ _id: { $in: planIds } }, { _id: 1, title: 1 });

// Convert to a lookup object
const planCategoryMap = planCategories.reduce((acc, category) => {
  acc[category._id.toString()] = category.title;
  return acc;
}, {});

// Attach plan category titles to result
const finalResult = result.map(item => ({
  ...item._doc,
  plan_category_title: planCategoryMap[item.planid] || null, // Add title or null if not found
}));

    return res.json({
      status: true,
      message: "Signals fetched successfully",
      data: finalResult,
    
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}

async AddSignals(req, res) {
  try {
    // Optional file upload for report using multer
    await new Promise((resolve, reject) => {
      upload('report').fields([{ name: 'report', maxCount: 1 }])(req, res, (err) => {
          if (err) {
            
              return reject(err);
          }

          resolve();
      });
  });
    // Destructure required fields from req.body, including stocks array
    const { stock, strategy_name, callduration, service, description, planid, profitlosstype, stocks } = req.body;

    // Validate required fields (planid and stocks)
    if (!planid) {
      return res.status(400).json({ status: false, message: 'Missing required fields: planid' });
    }

    // Agar stocks ek JSON string hai, then parse it into an array
    let stocksArray;

    try {
      stocksArray = typeof stocks === "string" ? JSON.parse(stocks) : stocks;
  } catch (err) {
      return res.status(400).json({ status: false, message: "Invalid JSON in stocks field", error: err.message });
  }
    if (!stocksArray || !Array.isArray(stocksArray) || stocksArray.length === 0) {
      return res.status(400).json({ status: false, message: 'Stocks data missing or invalid' });
    }

    // Allowed MIME types check for report file (if present)
   
    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const reportFile = req.files['report'] ? req.files['report'][0] : null;
    
    if (reportFile) {
        const fileMimeType = reportFile.mimetype; // Get the MIME type of the uploaded file
        if (!allowedMimeTypes.includes(fileMimeType)) {
            return res.status(400).json({
                status: false,
                message: "Invalid file type. Only PDF and Word files are allowed.",
            });
        }
    }
    
    // If validation passes, extract the filename
    const report = reportFile ? reportFile.filename : null;
    

    // Split planid into an array of plan IDs
    const planIds = planid.split(',');

    // Create signal entries for each plan id using Signalsdata_Modal
    const signalEntries = planIds.map(id => {
      return new Signalsdata_Modal({
        stock: stock,
        strategy_name: strategy_name,
        service: service, // Hardcoded service value
        callduration: callduration,
        description: description,
        planid: id,
        profitlosstype: profitlosstype,
        report: report,
      });
    });
    // Insert all signal entries at once
    const insertedSignals = await Signalsdata_Modal.insertMany(signalEntries);

    // Prepare bulk operations for inserting stock information linked to signals
    const bulkOps = [];
    // For each inserted signal, loop through the stocks array
    for (const signal of insertedSignals) {
      for (const st of stocksArray) {

        const { segment, expirydate, calltype, price, optiontype, lot, strikeprice } = st;

        var services;
        var serviceName;
// Set the service value based on the segment
if (segment == "C") {
  services = "66d2c3bebf7e6dc53ed07626";
serviceName = "Cash";

} else if (segment == "O") {
  services = "66dfeef84a88602fbbca9b79";
serviceName = "Option";
} else {
  services = "66dfede64a88602fbbca9b72";
serviceName = "Future";
}


console.log("stock",stock);
let stockss;
let tradesymbols;

if (segment === "C") {
stockss = await Stock_Modal.findOne({ 
    symbol: stock, 
    segment: segment, 
});
} else if (segment === "F") {
stockss = await Stock_Modal.findOne({ 
    symbol: stock, 
    segment: segment, 
    expiry: expirydate, 
});
} else {
stockss = await Stock_Modal.findOne({ 
    symbol: stock, 
    segment: segment, 
    expiry: expirydate, 
     option_type: optiontype, 
    strike: strikeprice 
});

console.log("stocks.symbol",stockss.symbol);
tradesymbols = `${stockss.symbol} ${stockss.expiry_str} ${stockss.strike} ${stockss.option_type}`;

}


if (!stocks) {
return res.status(404).json({
   status: false,
   message: "Stock not found"
});
}


        bulkOps.push({
          insertOne: {
            document: {
              signal_id: signal._id,
              calltype: calltype,
              price: price,
              expirydate: expirydate,
              segment:segment,
              optiontype: optiontype,
              tradesymbol:stockss.tradesymbol,
              tradesymbols:tradesymbols,
              lotsize: stockss.lotsize,
              lot:lot,
              strikeprice:strikeprice,
            },
          },
        });
      }
    }

    // Bulk insert stock entries if any operations exist
    if (bulkOps.length > 0) {
      await Signalstock_Modal.bulkWrite(bulkOps);
    }

    // Notification logic (example)
    const today = new Date();
    const clients = await Clients_Modal.find({
      del: 0,
      ActiveStatus: 1,
      devicetoken: { $exists: true, $ne: null },
      _id: {
        $in: await PlanSubscription_Modal.find({
          client_id: { $ne: null },
          plan_category_id: { $in: planIds },
          plan_end: { $gte: today },
          del: false,
        }).distinct('client_id'),
      },
    }).select('devicetoken');

    const tokens = clients.map(client => client.devicetoken);
    if (tokens.length > 0) {
      const notificationTitle = 'Important Update';
      const notificationBody = `New STRATEGY:- ${strategy_name}, Symbol ${stock} OPEN`;
      const resultn = new Notification_Modal({
        segmentid: planid,
        type: 'open signal',
        title: notificationTitle,
        message: notificationBody,
      });
      await resultn.save();

      try {
        await sendFCMNotification(notificationTitle, notificationBody, tokens, "open signal");
      } catch (error) {
        return res.json({ status: false, message: "Server error", data: [] });
      }
    }
  */


async getSignalsListWithFilte(req, res) {
  try {
    let { from, to, service, stock, closestatus, search, add_by, page = 1, limit = 10 } = req.body;

    // ✅ Convert Page & Limit to Integers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Date Filtering
    let query = { del: 0 };
    if (from && to) {
      let fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      let toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      // ✅ Check CloseStatus to Filter by Closedate or CreatedAt
      if (closestatus == true) {
        query.closedate = { $gte: fromDate, $lte: toDate };
      } else {
        query.created_at = { $gte: fromDate, $lte: toDate };
      }
    }

    // ✅ Apply Other Filters
    if (service) query.service = service;
    if (stock) query.stock = stock;
    if (closestatus) query.close_status = closestatus;
    if (add_by) query.add_by = add_by;

    // ✅ Search Filters (tradesymbol, calltype, price, planid)
    if (search && search.trim() !== '') {
      const matchingPlans = await Plancategory_Modal.find(
        { title: { $regex: search, $options: 'i' } },
        { _id: 1 }
      );
      const matchingPlanIds = matchingPlans.map(plan => plan._id.toString());

      query.$or = [
        { tradesymbol: { $regex: search, $options: 'i' } },
        { calltype: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
        { closeprice: { $regex: search, $options: 'i' } },
        { planid: { $in: matchingPlanIds } }
      ];
    }

    // ✅ Sorting Logic
    let sortCriteria = { created_at: -1 };
    if (closestatus == true) {
      sortCriteria = { closedate: -1 };
    }

    // ✅ Fetch Signals With Pagination
    const signals = await Signalsdata_Modal.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortCriteria)
      .populate({ path: "stock", select: "title" })
      .populate({ path: "service", select: "title" })
      .lean();

    // ✅ Extract Signal IDs for Bulk Stock Query
    const signalIds = signals.map(signal => signal._id);

    // ✅ Fetch Stock Data in Bulk
    const stockDetails = await Signalstock_Modal.find({ signal_id: { $in: signalIds } })
      .select("signal_id tradesymbol calltype segment expirydate optiontype strikeprice price")
      .lean();

    // ✅ Map Stocks to Signals
    const stockMap = {};
    stockDetails.forEach(stock => {
      if (!stockMap[stock.signal_id]) {
        stockMap[stock.signal_id] = [];
      }
      stockMap[stock.signal_id].push(stock);
    });

    // ✅ Attach Stocks to Signals
    const finalSignals = signals.map(signal => ({
      ...signal,
      stocks: stockMap[signal._id] || []
    }));

    // ✅ Total Records for Pagination
    const totalCount = await Signalsdata_Modal.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      status: true,
      message: "Signals fetched successfully",
      data: {
        signals: finalSignals,
        pagination: {
          totalRecords: totalCount,
          totalPages,
          currentPage: page
        }
      }
    });

  } catch (error) {
    console.error("Error fetching signals:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Server error", 
      error: error.message 
    });
  }
}



}
module.exports = new Signal();