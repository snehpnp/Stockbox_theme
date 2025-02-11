const db = require("../Models");
const upload = require('../Utils/multerHelper'); 
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Notification_Modal = db.Notification;
const Planmanage = db.Planmanage;
const Order_Modal = db.Order;
const Plancategory_Modal = db.Plancategory;
const PlanSubscription_Modal = db.PlanSubscription;

mongoose  = require('mongoose');
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


            const { price,calltype,stock,tag1,tag2,tag3,stoploss,description,callduration,callperiod,add_by,expirydate,segment,optiontype,strikeprice,tradesymbol,lotsize,entrytype,lot } = req.body;
        
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
              callduration:callduration,
              callperiod:callperiod,
              stock: stock,
              tag1: tag1,
              tag2: tag2,
              tag3:tag3,
              targetprice1: tag1,
              targetprice2: tag2,
              targetprice3: tag3,
              stoploss: stoploss,
              description: description,
              report: report,
              add_by:add_by,
              expirydate: expirydate,
              segment:segment,
              optiontype: optiontype,
              tradesymbol:stocks.tradesymbol,
              lotsize: stocks.lotsize,
              entrytype:entrytype,
              lot:lot,
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
            const notificationBody =`${serviceName} ${stock} ${calltype} AT ${price} OPEN`;
              const resultn = new Notification_Modal({
                segmentid:service,
                type:'open signal',
                title: notificationTitle,
                message: notificationBody
            });
    
            await resultn.save();


            try {
            
              await sendFCMNotification(notificationTitle, notificationBody, tokens,"open signal");
            
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

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
*/


async getSignal(req, res) {
  
  try {
    const { from, to, service, stock } = req.query;
    // Set today's date and midnight time for filtering

    // Default date range is today
 


    let fromDate;
    if (from) {
      fromDate = new Date(from) ;
    } 

    let toDate;
    if (to) {
      toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // End of the specified date
    } 


    

    // Build the query object with dynamic filters
    let query = { del: 0 }; // Default query

    if (fromDate && toDate) {
      query.created_at = { $gte: fromDate, $lt: toDate };
    }

    if (service) {
      query.service = service; // Convert service ID to ObjectId
    }

    if (stock) {
      query.stock = stock; // Convert stock ID to ObjectId
    }

    // Log the query for debugging

    // Execute the query and populate service and stock details
   const result = await Signal_Modal.find(query)
      .populate({ path: 'service', select: 'title' }) // Populate only the title from service
      .populate({ path: 'stock', select: 'title' })
      .sort({ created_at: -1 }); // Sort in descending order


    

    return res.json({
      status: true,
      message: "Signals fetched successfully",
      data: result
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}


async getSignalWithFilter(req, res) {
  try {
    const { from, to, service, stock, closestatus, search, add_by, page = 1 } = req.body;
    let limit = 10;
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
    const pageNumber = parseInt(page);
    const limitValue = parseInt(limit);
    const skip = (pageNumber - 1) * limitValue;

    // Get total count for pagination
    const totalRecords = await Signal_Modal.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitValue);

    // Fetch data with pagination
    const result = await Signal_Modal.find(query)
      .populate({ path: 'service', select: 'title' }) // Populate only the title from service
      .populate({ path: 'stock', select: 'title' })
      .sort(sortCriteria) // Sort in descending order
      .skip(skip) // Pagination: skip items
      .limit(limitValue); // Pagination: limit items

    return res.json({
      status: true,
      message: "Signals fetched successfully",
      data: result,
      pagination: {
        totalRecords,
        page: pageNumber,
        limit: limitValue,
        totalPages
      }
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}




  async detailSignal(req, res) {try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({
            status: false,
            message: "Signal ID is required",
        });
    }

    // Fetch the signal document by ID
    const signal = await Signal_Modal.findById(id);

    // Check if signal exists
    if (!signal) {
        return res.status(404).json({
            status: false,
            message: "Signal not found",
        });
    }

    // Construct the full URL for the report file
    const protocol = req.protocol; // 'http' or 'https'
    const baseUrl = `${protocol}://${req.headers.host}`; // Construct base URL dynamically
    const enrichedSignal = {
        ...signal._doc, // Spread the original signal document
        report: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Append full report URL
    };

    // Return the enriched signal
    return res.json({
        status: true,
        message: "Signal details fetched successfully",
        data: enrichedSignal,
    });

} catch (error) {
    // console.error("Error fetching Signal details:", error);
    return res.status(500).json({
        status: false,
        message: "Server error",
        data: [],
    });
}
}


  
  async deleteSignal(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Signal ID is required",
        });
      }

     // const deletedSignal = await Signal_Modal.findByIdAndDelete(id);

      const deletedSignal = await Signal_Modal.findByIdAndUpdate(
        id, 
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedSignal) {
        return res.status(404).json({
          status: false,
          message: "Signal not found",
        });
      }

      // console.log("Deleted Signal:", deletedSignal);
      return res.json({
        status: true,
        message: "Signal deleted successfully",
        data: deletedSignal,
      });
    } catch (error) {
      // console.error("Error deleting Signal:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  
  async closeSignal(req, res) {
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
        { signal: true, runValidators: true } // Options: return the updated document and run validators
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
          segmentid:service,
          type:"close signal",
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
  

  async targethitSignal(req, res) {
    try {
      const { id, targethit, targetprice } = req.body;
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Signal ID is required",
        });
      }
  
      const updatedSignal = await Signal_Modal.findByIdAndUpdate(
        id,
        {
          targethit,
          targetprice,
        },
        { signal: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedSignal) {
        return res.status(404).json({
          status: false,
          message: "Signal not found",
        });
      }
  
      // console.log("Close Signal:", updatedSignal);
      return res.json({
        status: true,
        message: "Signal Target Hit successfully",
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


async updateReport(req, res) {
    try {

        // Handle file upload
        await new Promise((resolve, reject) => {
            upload('report').fields([{ name: 'report', maxCount: 1 }])(req, res, (err) => {
                if (err) {
                    // console.log('File upload error:', err);
                    return reject(err);
                }
                resolve();
            });
        });
        const { id,description } = req.body;
       
 
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Signal ID is required",
            });
        }

        // Extract the uploaded file information
        const reportFile = req.files && req.files['report'] ? req.files['report'][0].filename : null;

        // Prepare the update object
        const updateFields = {}; // Initialize as an empty object
        if (reportFile) {
            updateFields.report = reportFile;
            
        }
        updateFields.description = description;
        // Update the report in the database
        const updatedreport = await Signal_Modal.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        // If the report is not found
        if (!updatedreport) {
            return res.status(404).json({
                status: false,
                message: "Report not found",
            });
        }

        return res.json({
            status: true,
            message: "Report updated successfully",
            data: updatedreport,
        });

    } catch (error) {
        // console.log("Error updating Report:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
}

/*
async showSignalsToClients(req, res) {
  try {
    const { service_id, client_id, search, type, page = 1 } = req.body;
    const limit = 10;
    const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
    const limitValue = parseInt(limit); // Items per page

    const plans = await Planmanage.find({ serviceid: service_id, clientid: client_id });
    if (plans.length === 0) {
      return res.json({
        status: false,
        message: "No plans found for the given service and client IDs",
        data: []
      });
    }

    const startDates = plans.map(plan => new Date(plan.startdate));
    const endDates = plans.map(plan => new Date(plan.enddate));

    const query = {
      service: service_id,
      close_status: type === 1,
      created_at: {
        $gte: startDates[0], // Assuming all plans have the same startdate
        $lte: endDates[0] // Assuming all plans have the same enddate
      }
    };

    const protocol = req.protocol; // Will be 'http' or 'https'

    const baseUrl = `${protocol}://${req.headers.host}`; // Construct the base URL



    if (search && search.trim() !== '') {
      query.$or = [
        { tradesymbol: { $regex: search, $options: 'i' } },
        { calltype: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
        { closeprice: { $regex: search, $options: 'i' } }
      ];
    }

    const signals = await Signal_Modal.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitValue)
      .lean();
   

    const totalSignals = await Signal_Modal.countDocuments(query);

    const signalsWithReportUrls = await Promise.all(signals.map(async (signal) => {
      // Check if the signal was bought by the client
      const order = await Order_Modal.findOne({
        clientid: client_id,
        signalid: signal._id
      }).lean();


      return {
        ...signal,
        report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Append full report URL
        purchased: order ? true : false,
        order_quantity: order ? order.quantity : 0
      };
    }));


    return res.json({
      status: true,
      message: "Signals retrieved successfully",
      data: signalsWithReportUrls,
      pagination: {
        total: totalSignals,
        page: parseInt(page), // Current page
        limit: parseInt(limit), // Items per page
        totalPages: Math.ceil(totalSignals / limit), // Total number of pages
      }
    });

  } catch (error) {
    console.error("Error fetching signals:", error);
    return res.json({ status: false, message: "Server error", data: [] });
  }
}

*/


async showSignalsToClients(req, res) {
  try {
    const { service_id, client_id, search, type, stock, from, to, page = 1 } = req.body;


    const limit = 10;
    const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
    const limitValue = parseInt(limit); // Items per page

    const service_ids = service_id
    ? [service_id] // If service_id is provided, use it as an array
    : ["66d2c3bebf7e6dc53ed07626", "66dfede64a88602fbbca9b72", "66dfeef84a88602fbbca9b79"];


    // Ensure service_ids is an array
    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      return res.json({
        status: false,
        message: "Invalid or missing service IDs",
        data: []
      });
    }

    // Fetch plans for all services and the given client
    const plans = await Planmanage.find({ serviceid: { $in: service_ids }, clientid: client_id });
    if (plans.length === 0) {
      return res.json({
        status: false,
        message: "No plans found for the given services and client ID",
        data: []
      });
    }


    const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });


    const startDates = plans.map(plan => new Date(plan.startdate));
    const endDates = plans.map(plan => new Date(plan.enddate));

    const minStartDate = new Date(Math.min(...startDates)); // Earliest start date
    const maxEndDate = new Date(Math.max(...endDates)); // Latest end date

    // const query = {
    //   service: { $in: service_ids }, // Match any of the service IDs
    //   created_at: {
    //     $gte: minStartDate, // Earliest start date
    //     $lte: maxEndDate    // Latest end date
    //   }
    // };





    const query = {
      service: { $in: service_ids }
    };
    
    if (client.deliverystatus === true) {
      query.created_at = {
        $lte: maxEndDate, // Only keep the end date condition
      };

      if(type === true)
        {
        query.closedate= {
          $gte: minStartDate, 
         }
        }


    } else {
      query.created_at = {
        $gte: minStartDate, // Include both start and end date conditions
        $lte: maxEndDate,
      };
    }

    if (type === true || type === false) {
      query.close_status = type; 
    }



    const protocol = req.protocol; // Will be 'http' or 'https'
    const baseUrl = `${protocol}://${req.headers.host}`; // Construct the base URL

    if (search && search.trim() !== '') {
      query.$or = [
        { tradesymbol: { $regex: search, $options: 'i' } },
        { calltype: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
        { closeprice: { $regex: search, $options: 'i' } }
      ];
    }


    if (stock) {
      query.stock = stock; 
    }

   
    
    if (from || to) {
      query.created_at = {};
    
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
        query.created_at.$gte = fromDate;
      }
    
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999); // Set time to 23:59:59
        query.created_at.$lte = toDate;
      }
    }
   
    const signals = await Signal_Modal.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitValue)
      .lean();

    const totalSignals = await Signal_Modal.countDocuments(query);

    const signalsWithReportUrls = await Promise.all(signals.map(async (signal) => {
      // Check if the signal was bought by the client
      const order = await Order_Modal.findOne({
        clientid: client_id,
        signalid: signal._id
      }).lean();

      return {
        ...signal,
        report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Append full report URL
        purchased: order ? true : false,
        order_quantity: order ? order.quantity : 0
      };
    }));

    return res.json({
      status: true,
      message: "Signals retrieved successfully",
      data: signalsWithReportUrls,
      pagination: {
        total: totalSignals,
        page: parseInt(page), // Current page
        limit: parseInt(limit), // Items per page
        totalPages: Math.ceil(totalSignals / limit), // Total number of pages
      }
    });

  } catch (error) {
    console.error("Error fetching signals:", error);
    return res.json({ status: false, message: "Server error", data: [] });
  }
}


async allShowSignalsToClients(req, res) {
  try {
    const { service_id, client_id} = req.body;


    const service_ids = service_id
    ? [service_id] // If service_id is provided, use it as an array
    : ["66d2c3bebf7e6dc53ed07626", "66dfede64a88602fbbca9b72", "66dfeef84a88602fbbca9b79"];


    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      return res.json({
        status: false,
        message: "Invalid or missing service IDs",
        data: []
      });
    }

    const plans = await Planmanage.find({ serviceid: { $in: service_ids }, clientid: client_id });
    if (plans.length === 0) {
      return res.json({
        status: false,
        message: "No plans found for the given services and client ID",
        data: []
      });
    }

    const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });


    const startDates = plans.map(plan => new Date(plan.startdate));
    const endDates = plans.map(plan => new Date(plan.enddate));

    const minStartDate = new Date(Math.min(...startDates)); // Earliest start date
    const maxEndDate = new Date(Math.max(...endDates)); // Latest end date

    // const query = {
    //   service: { $in: service_ids }, // Match any of the service IDs
    //   created_at: {
    //     $gte: minStartDate, // Earliest start date
    //     $lte: maxEndDate    // Latest end date
    //   }
    // };




    const query = {
      service: { $in: service_ids }, 
    };
    
    // Check if deliverystatus is true
    if (client.deliverystatus === true) {
      query.created_at = {
        $lte: maxEndDate, // Only keep the end date condition
      };
    } else {
      query.created_at = {
        $gte: minStartDate, // Include both start and end date conditions
        $lte: maxEndDate,
      };
    }

   
    const signals = await Signal_Modal.find(query)
      .sort({ created_at: -1 })
      .lean();

    
    return res.json({
      status: true,
      message: "Signals retrieved successfully",
      data: signals,
    });

  } catch (error) {
    console.error("Error fetching signals:", error);
    return res.json({ status: false, message: "Server error", data: [] });
  }
}



async AddSignalwithPlan(req, res) {
  try {

    await new Promise((resolve, reject) => {
      upload('report').fields([{ name: 'report', maxCount: 1 }])(req, res, (err) => {
          if (err) {
            
              return reject(err);
          }

          resolve();
      });
  });


      const { price,calltype,stock,tag1,tag2,tag3,stoploss,description,callduration,callperiod,add_by,expirydate,segment,optiontype,strikeprice,tradesymbol,lotsize,entrytype,lot,planid } = req.body;
  
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
}


if (!stocks) {
return res.status(404).json({
 status: false,
 message: "Stock not found"
});
}

   
     /* const result = new Signal_Modal({
        price: price,
        service: service,
        strikeprice: strikeprice,
        calltype: calltype,
        callduration:callduration,
        callperiod:callperiod,
        stock: stock,
        tag1: tag1,
        tag2: tag2,
        tag3:tag3,
        targetprice1: tag1,
        targetprice2: tag2,
        targetprice3: tag3,
        stoploss: stoploss,
        description: description,
        report: report,
        add_by:add_by,
        expirydate: expirydate,
        segment:segment,
        optiontype: optiontype,
        tradesymbol:stocks.tradesymbol,
        lotsize: stocks.lotsize,
        entrytype:entrytype,
        lot:lot,
        planid:planid,
    });


      await result.save(); */
      
      const planIds = planid.split(','); 


      const signalEntries = planIds.map(id => {

      
        return new Signal_Modal({
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
            lotsize: stocks.lotsize,
            entrytype: entrytype,
            lot: lot,
            planid: id, // Use individual plan ID
        });
    });
    
    // Save all entries in one go
    await Signal_Modal.insertMany(signalEntries);



      const today = new Date();

      const clients = await Clients_Modal.find({
        del: 0,
        ActiveStatus: 1,
        devicetoken: { $exists: true, $ne: null },
        _id: {
          $in: await PlanSubscription_Modal.find({
            client_id: { $ne: null },  
            plan_category_id: { $in: planIds },
            plan_end: { $gte: today }, // Filter by plan_end date
            del: false  // Optional: Ensure the plan subscription is not deleted
          }).distinct('client_id')  // Get distinct client_ids
        }
      }).select('devicetoken');


      const tokens = clients.map(client => client.devicetoken);
      
      if (tokens.length > 0) {


      const notificationTitle = 'Important Update';
      const notificationBody =`${serviceName} ${stock} ${calltype} AT ${price} OPEN`;
        const resultn = new Notification_Modal({
          segmentid:planid,
          type:'open signal',
          title: notificationTitle,
          message: notificationBody
      });

      await resultn.save();


      try {
      
        await sendFCMNotification(notificationTitle, notificationBody, tokens,"open signal");
      
      } catch (error) {
     
      }

      }
    

    return res.json({
      status: true,
      message: "Signal added successfully",
    //  data: result,
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
async getPlansByService(req, res) {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({
        status: false,
        message: "Service ID is required",
      });
    }

    let serviceIdString = "";
    if (serviceId == "C") {
      serviceIdString = "66d2c3bebf7e6dc53ed07626";
    } else if (serviceId == "O") {
      serviceIdString = "66dfeef84a88602fbbca9b79";
    } else {
      serviceIdString = "66dfede64a88602fbbca9b72";
    }

    const result = await Plancategory_Modal.aggregate([
      {
        $match: {
          service: { $regex: `(^|,)${serviceIdString}(,|$)` }, 
          del: false,
          status: true,
        },
      },
      {
        $lookup: {
          from: "plans", 
          localField: "_id",
          foreignField: "category",
          as: "plans",
        },
      },
      {
        $addFields: {
          plans: {
            $filter: {
              input: "$plans",
              as: "plan",
              cond: {
                $and: [
                //  { $eq: ["$$plan.status", "active"] }, // Active plans only
                  { $eq: ["$$plan.del", false] } // Plans where del is false
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          "plans.0": { $exists: true } // Only categories having active plans
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
         
        },
      },
    ]);

    console.log("Query result:", result);

    return res.json({
      status: true,
      message: "Data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}



async getSymbol(req, res) {
  try {
    const bseResponse = await axios.get("http://stockboxapis.cmots.com/api/BseNseDelayedData/NSE");
    
    const data = bseResponse.data;  

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}



async getSignalWithFilterplan(req, res) {
  try {
    const { from, to, service, stock, closestatus, search, add_by, page = 1 } = req.body;
    let limit = 10;
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
    const pageNumber = parseInt(page);
    const limitValue = parseInt(limit);
    const skip = (pageNumber - 1) * limitValue;

    // Get total count for pagination
    const totalRecords = await Signal_Modal.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitValue);

    // Fetch data with pagination
    const result = await Signal_Modal.find(query)
      .populate({ path: 'service', select: 'title' }) // Populate only the title from service
      .populate({ path: 'stock', select: 'title' })
      .sort(sortCriteria) // Sort in descending order
      .skip(skip) // Pagination: skip items
      .limit(limitValue); // Pagination: limit items



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
      pagination: {
        totalRecords,
        page: pageNumber,
        limit: limitValue,
        totalPages
      }
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Server error",
      data: []
    });
  }
}




}
module.exports = new Signal();