const db = require("../Models");
const Users_Modal = db.Users;
const Clients_Modal = db.Clients;
const Service_Modal = db.Service;
const Plan_Modal = db.Plan;
const Signal_Modal = db.Signal;
const License_Modal = db.License;
const Planmanage = db.Planmanage;
const BasicSetting_Modal = db.BasicSetting;
const Freetrial_Modal = db.Freetrial;
const Adminnotification_Modal = db.Adminnotification;




class Dashboard {
  async getcount(req, res) {
    try {
      // Count documents in the Clients_Modal collection where del is false
      const client = await Clients_Modal.countDocuments({ del: 0 });
      const user = await Users_Modal.countDocuments({
        del: 0,
        _id: { $ne: "66bc8b0c3fb6f1724c02bfec" }
      });
      const clientactive = await Clients_Modal.countDocuments({ del: 0, ActiveStatus: 1 });
      const useractive = await Users_Modal.countDocuments({ del: 0, ActiveStatus: 1 });

      const plan = await Plan_Modal.countDocuments({ del: false });
      const activeplan = await Plan_Modal.countDocuments({ del: false, status: "active" });

      const opensignal = await Signal_Modal.countDocuments({ close_status: false });
      const closesignal = await Signal_Modal.countDocuments({ close_status: true });


      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Set to the start of the next day

      // Count open signals created today
      const todayOpenSignal = await Signal_Modal.countDocuments({
        close_status: false,
        created_at: { $gte: today, $lt: tomorrow }
      });

      // Count closed signals with today's close date
      const todayCloseSignal = await Signal_Modal.countDocuments({
        close_status: true,
        closedate: { $gte: today, $lt: tomorrow }
      });


      const result = await Clients_Modal.find({ del: 0 })
        .sort({ _id: -1 })
        .limit(10);


      const activefreetrial = await Freetrial_Modal.aggregate([
        {
          $match: {
            enddate: { $gte: today } // Only trials ending today or later
          }
        },
        {
          $addFields: {
            clientid: { $toObjectId: "$clientid" } // Convert clientid to ObjectId for matching
          }
        },
        {
          $lookup: {
            from: "clients", // Assuming the collection for clients is named 'clients'
            localField: "clientid",
            foreignField: "_id",
            as: "clientInfo"
          }
        },
        {
          $match: {
            "clientInfo.ActiveStatus": 1, // Only clients with ActiveStatus = 1
            "clientInfo.del": 0          // Only clients with del = 0
          }
        },
        {
          $lookup: {
            from: 'plansubscriptions',
            localField: 'clientid',
            foreignField: 'client_id',
            as: 'subscriptionInfo'
          }
        },
        {
          $addFields: {
            subscriptionCount: { $size: "$subscriptionInfo" } // Count the entries in subscriptionInfo
          }
        },
        {
          $match: {
            subscriptionCount: 0 // Only clients with no subscriptions in plansubscriptions
          }
        },
        {
          $group: {
            _id: null,
            clientCount: { $sum: 1 } // Count of active clients
          }
        }
      ]);

      // Get the count of clients with inactive free trials (enddate is before today)
      const inactivefreetrial = await Freetrial_Modal.aggregate([
        {
          $match: {
            enddate: { $lt: today } // Only trials that have already expired
          }
        },
        {
          $addFields: {
            clientid: { $toObjectId: "$clientid" } // Convert clientid to ObjectId for matching
          }
        },
        {
          $lookup: {
            from: "clients", // Assuming the collection for clients is named 'clients'
            localField: "clientid",
            foreignField: "_id",
            as: "clientInfo"
          }
        },
        {
          $match: {
            "clientInfo.ActiveStatus": 1, // Only clients with ActiveStatus = 1
            "clientInfo.del": 0          // Only clients with del = 0
          }
        },
        {
          $lookup: {
            from: 'plansubscriptions',
            localField: 'clientid',
            foreignField: 'client_id',
            as: 'subscriptionInfo'
          }
        },
        {
          $addFields: {
            subscriptionCount: { $size: "$subscriptionInfo" } // Count the entries in subscriptionInfo
          }
        },
        {
          $match: {
            subscriptionCount: 0 // Only clients with no subscriptions in plansubscriptions
          }
        },
        {
          $group: {
            _id: null,
            clientCount: { $sum: 1 } // Count of inactive clients
          }
        }
      ]);

      // Retrieve total active and inactive client counts
      const totalActiveClients = activefreetrial.length > 0 ? activefreetrial[0].clientCount : 0;
      const totalInactiveClients = inactivefreetrial.length > 0 ? inactivefreetrial[0].clientCount : 0;

      const matchConditions = { del: 0 };
      const resultclient = await Clients_Modal.aggregate([
        {
          $match: matchConditions // Match the conditions for active clients (e.g., del: 0)
        },
        {
          $lookup: {
            from: 'planmanages', // Planmanage collection
            let: { clientId: { $toObjectId: "$_id" } }, // Convert Clients_Modal _id to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: "$clientid" }, "$$clientId"] // Match clientid in planmanages
                  }
                }
              }
            ],
            as: 'plans'
          }
        },
        {
          $addFields: {
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  status: {
                    $cond: {
                      if: { $gte: ["$$plan.enddate", new Date()] }, // Active if enddate >= today
                      then: "active", // Plan is active
                      else: "expired" // Plan is expired
                    }
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            clientStatus: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: {
                            $ifNull: ["$plansStatus", []] // Default to an empty array if plansStatus is null or missing
                          },
                          as: "plan",
                          cond: { $eq: ["$$plan.status", "active"] }
                        }
                      }
                    },
                    0
                  ]
                },
                then: "active", // At least one "active" plan
                else: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: ["$plansStatus", null] }, // Check if plansStatus is null
                        { $eq: [{ $size: "$plansStatus" }, 0] } // Check if plansStatus is an empty array
                      ]
                    },
                    then: "NA", // Default to "NA" if plansStatus is empty or missing
                    else: "expired" // Otherwise, set to "expired"
                  }
                }
              }
            }
          }
        },
        {
          $group: {
            _id: "$clientStatus", // Group by clientStatus (active, expired, or NA)
            count: { $sum: 1 } // Count the number of clients in each group
          }
        },
        {
          $sort: { '_id': 1 } // Sort the results by status (active, expired, etc.)
        }
      ]);

      // To separate active and expired count
      const activeCount = resultclient.find(item => item._id === 'active')?.count || 0;
      const inactiveCount = resultclient.find(item => item._id === 'expired')?.count || 0;
      const naCount = resultclient.find(item => item._id === 'NA')?.count || 0;




      return res.json({
        status: true,
        message: "Count retrieved successfully",
        data: {
          clientCountTotal: client,
          userCountTotal: user,
          clientCountActive: clientactive,
          userCountActive: useractive,
          PlanCountTotal: plan,
          PlanCountActive: activeplan,
          OpensignalCountTotal: opensignal,
          CloseSignalCountTotal: closesignal,
          todayOpenSignal: todayOpenSignal,
          todayCloseSignal: todayCloseSignal,
          activeFreetrial: totalActiveClients,
          inActiveFreetrial: totalInactiveClients,
          activePlanclient: activeCount,
          inActivePlanclient: inactiveCount,
          Clientlist: result
        }
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async getLicense(req, res) {
    try {
      const { key } = req.body;



      const basicSetting = await BasicSetting_Modal.findOne({ company_key: key });

      if (!basicSetting) {

        return res.status(500).json({
          status: false,
          message: "Company Key Not Forund",
          error: error.message
        });
      }

      const license = await License_Modal.find();

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: license
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async CompanyStatus(req, res) {
    try {
      const { key, status } = req.body;
      // console.log(req.body);
      const basicSetting = await BasicSetting_Modal.findOne({ company_key: key });

      if (!basicSetting) {

        return res.status(500).json({
          status: false,
          message: "Company Key Not Forund",
          error: error.message
        });
      }

      const update = {
        staffstatus: status,
      };

      const options = { new: true, upsert: true, runValidators: true };
      const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);



      return res.json({
        status: true,
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async pastPerformance(req, res) {
    try {
      const { id } = req.params;
      // Query to find signals based on the service ID
      const signals = await Signal_Modal.find({
        del: 0,
        close_status: true,
        service: new mongoose.Types.ObjectId(id) // Ensure service is an ObjectId
      });

      // Count the number of signals
      const count = signals.length;
      if (count === 0) {
        return res.status(404).json({
          status: false,
          message: "No signals found"
        });
      }

      let totalProfit = 0;
      let totalLoss = 0;
      let profitCount = 0;
      let lossCount = 0;
      let avgreturnpermonth = 0;

      const [firstSignal, lastSignal] = await Promise.all([
        Signal_Modal.findOne({
          del: 0,
          close_status: true,
          service: new mongoose.Types.ObjectId(id)
        }).sort({ created_at: 1 }), // Sort by created_at in ascending order

        Signal_Modal.findOne({
          del: 0,
          close_status: true,
          service: new mongoose.Types.ObjectId(id)
        }).sort({ created_at: -1 }) // Sort by created_at in descending order
      ]);

      if (!firstSignal || !lastSignal) {
        return res.status(404).json({
          status: false,
          message: "No signals found"
        });
      }

      const firstCreatedAt = firstSignal.created_at;
      const lastCreatedAt = lastSignal.created_at;

      const startYear = firstCreatedAt.getFullYear();
      const startMonth = firstCreatedAt.getMonth();
      const endYear = lastCreatedAt.getFullYear();
      const endMonth = lastCreatedAt.getMonth();

      const yearDifference = endYear - startYear;
      const monthDifference = endMonth - startMonth;
      const monthsBetween = yearDifference * 12 + monthDifference;

      signals.forEach(signal => {
        const entryPrice = parseFloat(signal.price); // Entry price
        const exitPrice = parseFloat(signal.closeprice); // Exit price


        const callType = signal.calltype; // "BUY" or "SELL"

        if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
          // const profitOrLoss = exitPrice - entryPrice;
          let profitOrLoss;
          if (callType === "BUY") {
            profitOrLoss = exitPrice - entryPrice; // Profit when exit is greater
          } else if (callType === "SELL") {
            profitOrLoss = entryPrice - exitPrice; // Profit when exit is less
          }


          if (profitOrLoss >= 0) {
            //   totalProfit += profitOrLoss;

            if (id == "66dfede64a88602fbbca9b72" || id == "66dfeef84a88602fbbca9b79") {
              totalProfit += profitOrLoss * signal.lotsize;
            }
            else {
              totalProfit += profitOrLoss;
            }
            profitCount++;
          } else {

            if (id == "66dfede64a88602fbbca9b72" || id == "66dfeef84a88602fbbca9b79") {
              totalLoss += Math.abs(profitOrLoss) * signal.lotsize;
            }
            else {
              totalLoss += Math.abs(profitOrLoss);
            }
            lossCount++;
          }
        }
      });

      const accuracy = (profitCount / count) * 100;
      const avgreturnpertrade = (totalProfit - totalLoss) / count;

      if (monthsBetween > 0) {
        avgreturnpermonth = (totalProfit - totalLoss) / monthsBetween;
      } else {
        avgreturnpermonth = totalProfit - totalLoss;
      }


      return res.json({
        status: true,
        message: "Past performance data fetched successfully",
        data: {
          count: count || 0,
          totalProfit: totalProfit || 0,
          totalLoss: totalLoss || 0,
          profitCount: profitCount || 0,
          lossCount: lossCount || 0,
          accuracy: accuracy || 0,
          avgreturnpertrade: avgreturnpertrade || 0,
          avgreturnpermonth: avgreturnpermonth || 0
        }
      });
    } catch (error) {
      // console.log("Error fetching signal details:", error);

      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  async pastPerformances(req, res) {
    try {
      // Define fixed service IDs
      const serviceIds = [
        '66d2c3bebf7e6dc53ed07626', // Replace with actual service IDs
        '66dfede64a88602fbbca9b72',
        '66dfeef84a88602fbbca9b79'
      ].map(id => new mongoose.Types.ObjectId(id)); // Convert to ObjectId

      // Query to find signals based on the service IDs
      const signals = await Signal_Modal.find({
        del: 0,
        close_status: true,
        service: { $in: serviceIds } // Match any of the services
      });

      // Group signals by service ID
      const groupedSignals = signals.reduce((acc, signal) => {
        const serviceId = signal.service.toString();
        if (!acc[serviceId]) {
          acc[serviceId] = [];
        }
        acc[serviceId].push(signal);
        return acc;
      }, {});

      const results = {};

      // Process each service
      for (const serviceId of serviceIds) {
        const serviceIdStr = serviceId.toString();
        const serviceSignals = groupedSignals[serviceIdStr] || [];
        const count = serviceSignals.length;

        if (count === 0) {
          results[serviceIdStr] = {
            status: false,
            message: "No signals found"
          };
          continue;
        }

        let totalProfit = 0;
        let totalLoss = 0;
        let profitCount = 0;
        let lossCount = 0;
        let avgreturnpermonth = 0;

        const [firstSignal, lastSignal] = await Promise.all([
          Signal_Modal.findOne({ del: 0, close_status: true, service: serviceId }).sort({ created_at: 1 }),
          Signal_Modal.findOne({ del: 0, close_status: true, service: serviceId }).sort({ created_at: -1 })
        ]);

        if (!firstSignal || !lastSignal) {
          results[serviceIdStr] = {
            status: false,
            message: "No signals found"
          };
          continue;
        }

        const firstCreatedAt = firstSignal.created_at;
        const lastCreatedAt = lastSignal.created_at;

        const startYear = firstCreatedAt.getFullYear();
        const startMonth = firstCreatedAt.getMonth();
        const endYear = lastCreatedAt.getFullYear();
        const endMonth = lastCreatedAt.getMonth();

        const yearDifference = endYear - startYear;
        const monthDifference = endMonth - startMonth;
        const monthsBetween = yearDifference * 12 + monthDifference;

        serviceSignals.forEach(signal => {
          const entryPrice = parseFloat(signal.price); // Entry price
          const exitPrice = parseFloat(signal.closeprice); // Exit price


          const callType = signal.calltype; // "BUY" or "SELL"

          if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
            // const profitOrLoss = exitPrice - entryPrice;
            let profitOrLoss;
            if (callType === "BUY") {
              profitOrLoss = exitPrice - entryPrice; // Profit when exit is greater
            } else if (callType === "SELL") {
              profitOrLoss = entryPrice - exitPrice; // Profit when exit is less
            }


            if (profitOrLoss >= 0) {

              if (serviceId == "66dfede64a88602fbbca9b72" || serviceId == "66dfeef84a88602fbbca9b79") {
                totalProfit += profitOrLoss * signal.lotsize;
              }
              else {
                totalProfit += profitOrLoss;
              }
              profitCount++;
            } else {
              if (serviceId == "66dfede64a88602fbbca9b72" || serviceId == "66dfeef84a88602fbbca9b79") {
                totalLoss += Math.abs(profitOrLoss) * signal.lotsize;
              }
              else {
                totalLoss += Math.abs(profitOrLoss);
              }
              lossCount++;
            }
          }


        });

        const accuracy = (profitCount / count) * 100;
        let avgreturnpertrade = 0;


        avgreturnpertrade = (totalProfit - totalLoss) / count;


        // console.log("avgreturnpertrade",avgreturnpertrade);

        if (monthsBetween > 0) {
          avgreturnpermonth = (totalProfit - totalLoss) / monthsBetween;
        } else {
          avgreturnpermonth = totalProfit - totalLoss;
        }

        results[serviceIdStr] = {
          status: true,
          message: "Past performance data fetched successfully",
          data: {
            count,
            totalProfit,
            totalLoss,
            profitCount,
            lossCount,
            accuracy,
            avgreturnpertrade,
            avgreturnpermonth
          }
        };
      }

      return res.json({
        status: true,
        results
      });

    } catch (error) {
      // console.error("Error fetching signal details:", error);

      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  async CloseSignal(req, res) {
    try {
      const { service_id } = req.body;

      const query = {
        service: service_id,
        close_status: true,
      };
      // Fetch signals and sort by createdAt in descending order
      const signals = await Signal_Modal.find(query).sort({ created_at: -1 }).lean();

      return res.json({
        status: true,
        message: "Signals retrieved successfully",
        data: signals,
      });
    } catch (error) {
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async CloseSignalWithFilter(req, res) {
    try {
      const { service_id, page = 1 } = req.body;
      let limit = 10;
      // Calculate the number of records to skip based on the page and limit
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitValue = parseInt(limit);

      // Define the query for closed signals by service
      const query = {
        service: service_id,
        close_status: true,
      };

      // Get the total number of matching records
      const totalRecords = await Signal_Modal.countDocuments(query);

      // Fetch signals with pagination and sorting
      const signals = await Signal_Modal.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitValue)
        .lean();

      // Calculate total pages
      const totalPages = Math.ceil(totalRecords / limitValue);

      // Return the response with pagination info
      return res.json({
        status: true,
        message: "Signals retrieved successfully",
        data: signals,
        pagination: {
          totalRecords,
          currentPage: page,
          limit: limitValue,
          totalPages
        }
      });
    } catch (error) {
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async PlanExipreList(req, res) {
    try {




      // Fetch all plans based on the filter
      const plans = await Planmanage.find();

      const enrichedPlans = [];

      // Enrich plans with service and client details
      for (let plan of plans) {
        const service = await Service_Modal.findById(plan.serviceid).select('title');
        const client = await Clients_Modal.findById(plan.clientid).select('FullName PhoneNo Email');

        enrichedPlans.push({
          ...plan.toObject(),
          serviceTitle: service ? service.title : null,
          clientFullName: client ? client.FullName : null,
          clientMobile: client ? client.PhoneNo : null,
          clientEmail: client ? client.Email : null
        });
      }

      return res.json({
        status: true,
        message: "get",
        data: enrichedPlans,
      });
    } catch (error) {
      // console.error("Error fetching plans:", error);
      return res.status(500).json({ status: false, message: "Server error", data: [] });
    }
  }

  async PlanExipreListWithFilter(req, res) {
    try {
      const { serviceid, startdate, enddate, search, page = 1 } = req.body;

      let limit = 10;
      // Build the filter object dynamically
      const filter = {};
      if (serviceid) {
        filter.serviceid = serviceid;
      }
      if (startdate) {
        const startOfStartDate = new Date(startdate);
        startOfStartDate.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
        filter.enddate = { $gte: startOfStartDate }; // Ensure enddate is greater than or equal to startdate
      }

      // If enddate is provided
      if (enddate) {
        const endOfEndDate = new Date(enddate);
        endOfEndDate.setHours(23, 59, 59, 999); // End of the day (23:59:59)

        // Combine the conditions to make sure the enddate is between startdate and enddate
        filter.enddate = filter.enddate || {}; // Ensure we don't overwrite existing filter conditions
        filter.enddate.$lte = endOfEndDate; // Ensure enddate is less than or equal to enddate
      }
      // If search term is provided, apply it to client fields (FullName, PhoneNo, Email)
      let clientFilter = {};
      if (search && search.trim() !== "") {
        const regex = new RegExp(search, "i"); // Case-insensitive search
        clientFilter = {
          $or: [
            { FullName: regex },
            { PhoneNo: regex },
            { Email: regex }
          ]
        };
      }
      // Fetch matching client IDs based on the search filter
      const matchingClients = await Clients_Modal.find(clientFilter).select('_id');

      // If there are no clients that match the search criteria, return an empty response
      if (matchingClients.length === 0) {
        return res.json({
          status: true,
          message: "No plans found for the given search criteria",
          data: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 0
          }
        });
      }

      // Add clientid filter to the plan query based on matching clients
      filter.clientid = { $in: matchingClients.map(client => client._id) };

      // Fetch paginated plans that match the filter
      const plans = await Planmanage.find(filter)
        .sort({ enddate: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      // Get total count of matching plans for pagination metadata
      const totalCount = await Planmanage.countDocuments(filter);

      // Prepare an array to store the enriched data
      const enrichedPlans = [];

      for (let plan of plans) {
        const service = await Service_Modal.findById(plan.serviceid).select('title');
        const client = await Clients_Modal.findById(plan.clientid).select('FullName PhoneNo Email');

        enrichedPlans.push({
          ...plan.toObject(),
          serviceTitle: service ? service.title : null,
          clientFullName: client ? client.FullName : null,
          clientMobile: client ? client.PhoneNo : null,
          clientEmail: client ? client.Email : null
        });
      }

      return res.json({
        status: true,
        message: "get",
        data: enrichedPlans,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async Notification(req, res) {
    try {

      const result = await Adminnotification_Modal.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const unreadCount = await Adminnotification_Modal.countDocuments({ status: 0 });

      return res.json({
        status: true,
        message: "get",
        data: result,
        unreadCount
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async NotificationList(req, res) {
    try {

      const { page } = req.body;
      const limit = 10; // Default to 10 items per page
      const skip = (page - 1) * limit; // Calculate the number of documents to skip

      const result = await Adminnotification_Modal.find({})
        .sort({ createdAt: -1 })
        .skip(skip) // Skip the required number of documents
        .limit(limit) // Limit the number of documents
        .lean();

      // Get total count for pagination metadata
      const totalCount = await Adminnotification_Modal.countDocuments({});
      const totalPages = Math.ceil(totalCount / limit);

      return res.json({
        status: true,
        message: "get",
        data: result,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
        },
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async statusChangeNotifiction(req, res) {
    try {
      const { id, status } = req.body;
      // Find and update the plan
      const result = await Adminnotification_Modal.findByIdAndUpdate(
        id,
        { status: status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Notification not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      // console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async allStatusChangeNotifiction(req, res) {
    try {
      // Update all documents where status is 0 to set status to 1
      const result = await Adminnotification_Modal.updateMany(
        { status: 0 }, // Condition: status is 0
        { $set: { status: 1 } } // Update: set status to 1
      );

      if (result.matchedCount === 0) {
        return res.json({
          status: false,
          message: "No notifications found with status 0"
        });
      }

      return res.json({
        status: true,
        message: "All statuses updated successfully",
        data: result // Return the result of the operation
      });

    } catch (error) {
      // Log and return error response
      console.error("Error updating all statuses:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async totalClient(req, res) {
    try {

      const license = await License_Modal.find()
        .sort({ created_at: -1 })
        .lean();

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: license
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async pastPerformancewithtype(req, res) {
    try {
      const { id, callduration } = req.params;
      const callDurationValue = callduration ? callduration : null;
      // Base query
      let query = {
        del: 0,
        close_status: true,
        closeprice: { $ne: 0 },
        service: new mongoose.Types.ObjectId(id),
      };
  
      // Agar callduration available ho, to usko filter me add karein
      if (callDurationValue !== null) {
        query.callduration = callDurationValue;
      }
  
      // Signals fetch karein
      const signals = await Signal_Modal.find(query);
      const count = signals.length;
  
      if (count === 0) {
        return res.status(404).json({
          status: false,
          message: "No signals found",
        });
      }
  
      let totalProfit = 0;
      let totalLoss = 0;
      let profitCount = 0;
      let lossCount = 0;
      let avgreturnpermonth = 0;
  
      const [firstSignal, lastSignal] = await Promise.all([
        Signal_Modal.findOne(query).sort({ created_at: 1 }),
        Signal_Modal.findOne(query).sort({ created_at: -1 }),
      ]);
  
      if (!firstSignal || !lastSignal) {
        return res.status(404).json({
          status: false,
          message: "No signals found",
        });
      }
  
      const firstCreatedAt = firstSignal.created_at;
      const lastCreatedAt = lastSignal.created_at;
  
      const startYear = firstCreatedAt.getFullYear();
      const startMonth = firstCreatedAt.getMonth();
      const endYear = lastCreatedAt.getFullYear();
      const endMonth = lastCreatedAt.getMonth();
  
      const yearDifference = endYear - startYear;
      const monthDifference = endMonth - startMonth;
      const monthsBetween = yearDifference * 12 + monthDifference;
  
      signals.forEach((signal) => {
        const entryPrice = parseFloat(signal.price);
        const exitPrice = parseFloat(signal.closeprice);
        const callType = signal.calltype;
  
        if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
          let profitOrLoss = callType === "BUY" ? exitPrice - entryPrice : entryPrice - exitPrice;
  
          if (profitOrLoss >= 0) {
            totalProfit += ["66dfede64a88602fbbca9b72", "66dfeef84a88602fbbca9b79"].includes(id)
              ? profitOrLoss * signal.lotsize
              : profitOrLoss;
            profitCount++;
          } else {
            totalLoss += ["66dfede64a88602fbbca9b72", "66dfeef84a88602fbbca9b79"].includes(id)
              ? Math.abs(profitOrLoss) * signal.lotsize
              : Math.abs(profitOrLoss);
            lossCount++;
          }
        }
      });
  
      const accuracy = (profitCount / count) * 100;
      const avgreturnpertrade = (totalProfit - totalLoss) / count;
      avgreturnpermonth = monthsBetween > 0 ? (totalProfit - totalLoss) / monthsBetween : totalProfit - totalLoss;
  
      return res.json({
        status: true,
        message: "Past performance data fetched successfully",
        data: {
          count,
          totalProfit,
          totalLoss,
          profitCount,
          lossCount,
          accuracy,
          avgreturnpertrade,
          avgreturnpermonth,
        },
      });
    } catch (error) {
      console.log("Error fetching signal details:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  

  async CloseSignalwithtype(req, res) {
    try {
      const { service_id, search, page = 1, callduration } = req.body;
  
      const limit = 15;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitValue = parseInt(limit);
  
      // Base query
      const query = {
        service: service_id,
        close_status: true,
        closeprice: { $ne: 0 }
      };
  
      // Agar callduration exist karta hai to query me add karein
      if (callduration) {
        query.callduration = callduration;
      }
  
      // Agar search filter exist karta hai to query me add karein
      if (search && search.trim() !== '') {
        query.$or = [
          { tradesymbol: { $regex: search, $options: 'i' } },
          { calltype: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
          { closeprice: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Fetch signals and sort by createdAt in descending order
      const signals = await Signal_Modal.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitValue)
        .lean();
  
      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`; // Base URL for constructing report path
  
      const signalsWithReportUrls = signals.map(signal => ({
        ...signal,
        report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null
      }));
  
      const totalSignals = await Signal_Modal.countDocuments(query);
  
      return res.json({
        status: true,
        message: "Signals retrieved successfully",
        data: signalsWithReportUrls,
        pagination: {
          total: totalSignals,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalSignals / limit),
        }
      });
    } catch (error) {
      console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
  



}
module.exports = new Dashboard();