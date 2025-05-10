const db = require("../Models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../Utils/emailService');
const path = require('path');
const fs = require('fs');

const Payout_Modal = db.Payout;
const Clients_Modal = db.Clients;
const Mailtemplate_Modal = db.Mailtemplate;
const BasicSetting_Modal = db.BasicSetting;
const Freetrial_Modal = db.Freetrial;
const Helpdesk_Modal = db.Helpdesk;
const PlanSubscription_Modal = db.PlanSubscription;
const Planmanage = db.Planmanage;
const Service_Modal = db.Service;
const Requestclient_Modal = db.Requestclient;
const Order_Modal = db.Order;
const Addtocart_Modal = db.Addtocart;
const Plancategory_Modal = db.Plancategory;



const Notification_Modal = db.Notification;
const { sendFCMNotification } = require('./Pushnotification');
const { resolve } = require("path/win32");

class Clients {


  async AddClient(req, res) {

    try {

      const { FullName, Email, PhoneNo, password, add_by, freetrial, state, city } = req.body;
      if (!FullName) {
        return res.status(400).json({ status: false, message: "fullname is required" });
      }

      if (!Email) {
        return res.status(400).json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
      }

      if (!PhoneNo) {
        return res.status(400).json({ status: false, message: "phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.status(400).json({ status: false, message: "Invalid phone number format" });
      }
      if (!password || password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[@$!%*?&#]/.test(password)) {
        return res.status(400).json({
          status: false,
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
        });
      }
      if (!add_by) {
        return res.status(400).json({ status: false, message: "Added by field is required" });
      }

      if (!state) {
        return res.status(400).json({ status: false, message: "Please select state" });
      }

      if (!city) {
        return res.status(400).json({ status: false, message: "Please select city" });
      }




      const existingUser = await Clients_Modal.findOne({
        $and: [
          { del: "0" },
          {
            $or: [{ Email }, { PhoneNo }]
          }
        ]
      });

      if (existingUser) {
        if (existingUser.Email === Email) {
          return res.status(400).json({ status: false, message: "Email already exists" });
        } else if (existingUser.PhoneNo === PhoneNo) {
          return res.status(400).json({ status: false, message: "Phone number already exists" });
        }
      }

      const refer_tokens = crypto.randomBytes(10).toString('hex');


      let cleanedName = FullName.replace(/\s+/g, '');
      let referCode = cleanedName.substring(0, 7).toUpperCase();




      const characters = '0123456789';
      let refer_token = '';
      const length = 5; // Length of the token
      while (refer_token.length < length) {
        const byte = crypto.randomBytes(1);
        const index = byte[0] % characters.length;
        refer_token += characters[index];
      }
      let refer_tokenss = referCode + refer_token;




      const hashedPassword = await bcrypt.hash(password, 10);
      const result = new Clients_Modal({
        FullName: FullName,
        Email: Email,
        PhoneNo: PhoneNo,
        password: hashedPassword,
        add_by: add_by,
        refer_token: refer_tokenss,
        token: refer_tokens,
        freetrial: freetrial,
        state: state,
        city: city,
        ActiveStatus: 1,
        clientcome: 1
      })

      await result.save();



      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.smtp_status) {
        throw new Error('SMTP settings are not configured or are disabled');
      }


      // if (freetrial) {


      //   const freetrialDays = parseInt(settings.freetrial, 10); // or you can use +settings.freetrial
      //   const start = new Date();
      //   const end = new Date(start);
      //   end.setDate(start.getDate() + freetrialDays);  // Add 7 days to the start date
      //   end.setHours(23, 59, 59, 999);

      //   const service = await Service_Modal.find({ del: false });
      //   const savePromises = service.map(async (svc) => {
      //     // Create a new plan management record
      //     const newPlanManage = new Planmanage({
      //       clientid: result._id,
      //       serviceid: svc._id,
      //       startdate: start,
      //       enddate: end,
      //     });

      //     // Save the new plan management record to the database
      //     return newPlanManage.save();

      //   })

      //   const newSubscription = new Freetrial_Modal({
      //     clientid: result._id,
      //     startdate: start,
      //     enddate: end,
      //   });

      //   const savedSubscription = await newSubscription.save();

      // }

      if (freetrial) {
        const freetrialDays = parseInt(settings.freetrial, 10);
        const start = new Date();
        const end = new Date(start);

        let addedDays = 0;

        while (addedDays < freetrialDays) {
          end.setDate(end.getDate() + 1);
          const day = end.getDay();

          if (day !== 0 && day !== 6) {
            addedDays++;
          }
        }

        end.setHours(23, 59, 59, 999);

        const service = await Service_Modal.find({ del: false });

        const savePromises = service.map(async (svc) => {
          const newPlanManage = new Planmanage({
            clientid: result._id,
            serviceid: svc._id,
            startdate: start,
            enddate: end,
          });

          return newPlanManage.save();
        });

        const newSubscription = new Freetrial_Modal({
          clientid: result._id,
          startdate: start,
          enddate: end,
        });

        const savedSubscription = await newSubscription.save();
      }


      const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'welcome_mail' }); // Use findOne if you expect a single document
      if (!mailtemplate || !mailtemplate.mail_body) {
        throw new Error('Mail template not found');
      }

      const templatePath = path.join(__dirname, '../../template', 'mailtemplate.html');

      fs.readFile(templatePath, 'utf8', async (err, htmlTemplate) => {
        if (err) {
          console.error('Error reading HTML template:', err);
          return;
        }

        let finalMailBody = mailtemplate.mail_body
          .replace('{username}', `${PhoneNo}/${Email}`)
          .replace('{password}', password)
          .replace(/{company_name}/g, settings.website_title);

        const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

        // Replace placeholders with actual values
        const finalHtml = htmlTemplate
          .replace(/{{company_name}}/g, settings.website_title)
          .replace(/{{body}}/g, finalMailBody)
          .replace(/{{logo}}/g, logo);

        const mailOptions = {
          to: result.Email,
          from: `${settings.from_name} <${settings.from_mail}>`, // Include business name
          subject: `${mailtemplate.mail_subject}`,
          html: finalHtml // Use the HTML template with dynamic variables
        };

        // Send email
        await sendEmail(mailOptions);
      });

      return res.json({
        status: true,
        message: "add",
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async getClient(req, res) {
    try {


      const { } = req.body;
      //  const result = await Clients_Modal.find({ del: 0 }).sort({ createdAt: -1 });

      const result = await Clients_Modal.aggregate([
        {
          $match: { del: 0 }
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
          }
        },
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        }
      ]);

      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async getClientFive(req, res) {
    try {


      const { } = req.body;
      //  const result = await Clients_Modal.find({ del: 0 }).sort({ createdAt: -1 });

      const result = await Clients_Modal.aggregate([
        {
          $match: { del: 0 }
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
          }
        },
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        },
        {
          $limit: 5
        }
      ]);

      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async getClientWithFilter(req, res) {
    try {
      const { status, kyc_verification, createdby, planStatus, search, add_by, fromDate, toDate, page = 1 } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      const limitValue = parseInt(limit);
      const matchConditions = { del: 0 }; // Initialize match conditions

      // Filter by KYC verification if specified
      if (kyc_verification !== "") {
        matchConditions.kyc_verification = parseInt(kyc_verification);
      }

      if (createdby) {
        matchConditions.add_by = createdby === "app" ? null : { $ne: null };
      }

      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }


      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }

      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // extend to end of the day

        matchConditions.createdAt = { $gte: from, $lte: to };
      }


      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } }, // Search in name
          { Email: { $regex: search, $options: "i" } },    // Search in email
          { PhoneNo: { $regex: search, $options: "i" } }  // Search in mobile
        ];
      }


      const result = await Clients_Modal.aggregate([
        {
          $match: matchConditions
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
          $lookup: {
            from: 'addtocarts', // Join with addtocarts collection
            let: { clientId: { $toObjectId: "$_id" } }, // Convert client _id to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toObjectId: "$client_id" }, "$$clientId"] }, // Ensure both are ObjectId
                      { $eq: ["$status", false] } // Only fetch records where status is false
                    ]
                  }
                }
              }
            ],
            as: 'cartItems'
          }
        },
        {
          $addFields: {
            hasPendingCart: { $gt: [{ $size: "$cartItems" }, 0] } // If cartItems > 0, set true; else false
          }
        },
        {
          $project: {
            _id: 1,
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            state: 1,
            city: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
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
            },
            hasPendingCart: 1
          }
        },
        ...(planStatus ? [{
          $match: { "clientStatus": planStatus } // Match only clients with the specified status
        }] : []),
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        },
        {
          $skip: skip // Pagination: Skip the first 'skip' number of items
        },
        {
          $limit: limitValue // Pagination: Limit the result to 'limit' items
        }
      ]);



      const results = await Clients_Modal.aggregate([
        {
          $match: matchConditions // Match based on the conditions
        },
        {
          $count: "totalCount" // Count the total number of matching clients
        }
      ]);

      const totalClients = results.length > 0 ? results[0].totalCount : 0;




      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result,
        pagination: {
          total: totalClients,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalClients / limit),
        }
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async getDeleteClientWithFilter(req, res) {
    try {
      const { status, kyc_verification, createdby, planStatus, search, add_by, page = 1 } = req.body;

      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      const limitValue = parseInt(limit);
      const matchConditions = { del: 1 }; // Initialize match conditions

      // Filter by KYC verification if specified
      if (kyc_verification !== "") {
        matchConditions.kyc_verification = parseInt(kyc_verification);
      }

      if (createdby) {
        matchConditions.add_by = createdby === "app" ? null : { $ne: null };
      }

      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }


      if (add_by !== "") {
        matchConditions.add_by = parseInt(add_by);
      }




      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } }, // Search in name
          { Email: { $regex: search, $options: "i" } },    // Search in email
          { PhoneNo: { $regex: search, $options: "i" } }  // Search in mobile
        ];
      }


      const result = await Clients_Modal.aggregate([
        {
          $match: matchConditions
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            state: 1,
            city: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
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
        ...(planStatus ? [{
          $match: { "clientStatus": planStatus } // Match only clients with the specified status
        }] : []),
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        },
        {
          $skip: skip // Pagination: Skip the first 'skip' number of items
        },
        {
          $limit: limitValue // Pagination: Limit the result to 'limit' items
        }
      ]);


      /*
            const results = await Clients_Modal.aggregate([
              {
                $match: matchConditions // Match based on the conditions
              },
              {
                $lookup: {
                  from: 'users', // The users collection name
                  let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
                  ],
                  as: 'addedByDetails'
                }
              },
              {
                $unwind: {
                  path: '$addedByDetails',
                  preserveNullAndEmptyArrays: true // Keeps clients without a matching user
                }
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
                $lookup: {
                  from: 'services', // Assuming services collection contains the service details
                  localField: 'plans.serviceid', // Linking serviceid in planmanages
                  foreignField: '_id', // Matching _id in services
                  as: 'serviceDetails'
                }
              },
              {
                $addFields: {
                  activePlans: {
                    $filter: {
                      input: "$plans",
                      as: "plan",
                      cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
                    }
                  },
                  expiredPlans: {
                    $filter: {
                      input: "$plans",
                      as: "plan",
                      cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
                    }
                  },
                  plansStatus: {
                    $map: {
                      input: "$plans",
                      as: "plan",
                      in: {
                        planId: "$$plan._id", // Include plan ID
                        serviceName: {
                          $switch: {
                            branches: [
                              {
                                case: {
                                  $eq: [
                                    { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                                    "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                                  ]
                                },
                                then: "Cash" // If serviceid matches, return "Cash"
                              },
                              {
                                case: {
                                  $eq: [
                                    { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                                    "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                                  ]
                                },
                                then: "Future" // If serviceid matches, return "Future"
                              },
                              {
                                case: {
                                  $eq: [
                                    { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                                    "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                                  ]
                                },
                                then: "Option" // If serviceid matches, return "Option"
                              },
                              {
                                case: {
                                  $eq: [
                                    { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                                    "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                                  ]
                                },
                                then: "Strategy" // If serviceid matches, return "Option"
                              },
                              {
                                case: {
                                  $eq: [
                                    { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                                    "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                                  ]
                                },
                                then: "Future Strategy" // If serviceid matches, return "Option"
                              }
                            ],
                            default: "Unknown Service" // Default value if no match
                          }
                        },
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
                  FullName: 1,
                  Email: 1,
                  PhoneNo: 1,
                  kyc_verification: 1,
                  add_by: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  plansStatus: 1, // Include the plans status
                  clientStatus: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ["$plansStatus", null] }, // Check if plansStatus is null
                          { $eq: [{ $size: "$plansStatus" }, 0] } // Check if plansStatus is an empty array
                        ]
                      },
                      then: "NA", // Default to "NA" if plansStatus is null or empty
                      else: {
                        $cond: {
                          if: {
                            $gt: [
                              {
                                $size: {
                                  $filter: {
                                    input: "$plansStatus",
                                    as: "plan",
                                    cond: { $eq: ["$$plan.status", "active"] }
                                  }
                                }
                              },
                              0
                            ]
                          },
                          then: "active", // At least one "active" plan
                          else: "expired" // No active plans, set to "expired"
                        }
                      }
                    }
                  }
      
                }
              },
              ...(planStatus ? [{
                $match: { "clientStatus": planStatus } // Match only clients with the specified status
              }] : []),
              {
                $count: "totalCount" // Count the total number of matching clients
              }
            ]);
      */
      // Extract the total count from the result


      const results = await Clients_Modal.aggregate([
        {
          $match: matchConditions // Match based on the conditions
        },
        {
          $count: "totalCount" // Count the total number of matching clients
        }
      ]);

      const totalClients = results.length > 0 ? results[0].totalCount : 0;




      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result,
        pagination: {
          total: totalClients,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalClients / limit),
        }
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async getClientWithFilterExcel(req, res) {
    try {
      const matchConditions = { del: 0 }; // Base condition to exclude deleted clients

      const result = await Clients_Modal.aggregate([
        {
          $match: matchConditions // Match only non-deleted clients
        },
        {
          $lookup: {
            from: 'users', // Join with users collection
            let: { userId: { $toObjectId: "$add_by" } }, // Convert `add_by` to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keep clients without a matching user
          }
        },
        {
          $lookup: {
            from: 'planmanages', // Join with planmanages collection
            let: { clientId: { $toObjectId: "$_id" } }, // Convert `_id` to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: "$clientid" }, "$$clientId"] // Match clientid
                  }
                }
              }
            ],
            as: 'plans'
          }
        },
        {
          $lookup: {
            from: 'services', // Join with services collection
            localField: 'plans.serviceid', // Match serviceid from plans
            foreignField: '_id', // Match `_id` in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active plans if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired plans if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        { case: { $eq: [{ $toString: "$$plan.serviceid" }, "66d2c3bebf7e6dc53ed07626"] }, then: "Cash" },
                        { case: { $eq: [{ $toString: "$$plan.serviceid" }, "66dfede64a88602fbbca9b72"] }, then: "Future" },
                        { case: { $eq: [{ $toString: "$$plan.serviceid" }, "66dfeef84a88602fbbca9b79"] }, then: "Option" },
                        { case: { $eq: [{ $toString: "$$plan.serviceid" }, "67e12758a0a2be895da19550"] }, then: "Strategy" },
                        { case: { $eq: [{ $toString: "$$plan.serviceid" }, "67e1279ba0a2be895da19551"] }, then: "Future Strategy" }


                      ],
                      default: "Unknown Service" // Default to "Unknown Service"
                    }
                  },
                  status: {
                    $cond: {
                      if: { $gte: ["$$plan.enddate", new Date()] }, // Active if enddate >= today
                      then: "active",
                      else: "expired"
                    }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            clientStatus: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$plansStatus", []] }, // Default to empty array if missing
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
                        { $eq: ["$plansStatus", null] }, // No plans found
                        { $eq: [{ $size: "$plansStatus" }, 0] } // Empty plans array
                      ]
                    },
                    then: "NA", // No plans associated
                    else: "expired" // All plans are expired
                  }
                }
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 } // Sort by creation date (descending)
        },
        {
          $project: {
            _id: 1,
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            state: 1,
            city: 1,
            'addedByDetails.FullName': 1, // Include addedBy user details
            plansStatus: 1,
            clientStatus: 1
          }
        }
      ]);

      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async activeClient(req, res) {
    try {


      const { } = req.body;

      //  const result = await Clients_Modal.find()
      const result = await Clients_Modal.find({ del: 0, ActiveStatus: 1 }).sort({ createdAt: -1 });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async deActiveClient(req, res) {
    try {


      const { } = req.body;

      //  const result = await Clients_Modal.find()
      const result = await Clients_Modal.find({ del: 0, ActiveStatus: 0 }).sort({ createdAt: -1 });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }





  async detailClient(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required"
        });
      }

      // Find client by ID
      const client = await Clients_Modal.findById(id);

      // If client not found
      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      return res.json({
        status: true,
        message: "Client details fetched successfully",
        data: client
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async updateClient(req, res) {
    try {
      const { id, FullName, Email, PhoneNo, state, city } = req.body;

      // Check if the required fields are provided
      if (!FullName) {
        return res.json({ status: false, message: "Fullname is required" });
      }

      if (!Email) {
        return res.json({ status: false, message: "Email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.json({ status: false, message: "Invalid Email format" });
      }

      if (!PhoneNo) {
        return res.json({ status: false, message: "Phone Number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.json({ status: false, message: "Invalid Phone Number format" });
      }


      if (!state) {
        return res.status(400).json({ status: false, message: "Please select state" });
      }

      if (!city) {
        return res.status(400).json({ status: false, message: "Please select city" });
      }


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      // Check if the email is already in use by any other client (excluding the current client)
      const existingEmail = await Clients_Modal.findOne({
        Email,
        _id: { $ne: id }, // Exclude the current client
        del: 0 // Assuming 'del' marks deleted clients
      });
      if (existingEmail) {
        return res.status(400).json({ status: false, message: "Email is already Exist" });
      }

      // Check if the phone number is already in use by any other client (excluding the current client)
      const existingPhoneNo = await Clients_Modal.findOne({
        PhoneNo,
        _id: { $ne: id }, // Exclude the current client
        del: 0 // Assuming 'del' marks deleted clients
      });
      if (existingPhoneNo) {
        return res.status(400).json({ status: false, message: "Phone Number is already Exist" });
      }


      // Proceed with the update
      const updatedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        {
          FullName,
          Email,
          PhoneNo,
          state,
          city
        },
        { new: true, runValidators: true } // Options: return the updated document and run validators
      );

      // If the client is not found
      if (!updatedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      return res.json({
        status: true,
        message: "Client updated successfully",
        data: updatedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteClient(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      const deletedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );
      if (!deletedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      return res.json({
        status: true,
        message: "Client deleted successfully",
        data: deletedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async statusChange(req, res) {
    try {
      const { id, status } = req.body;


      const validStatuses = ['1', '0'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the plan
      const result = await Clients_Modal.findByIdAndUpdate(
        id,
        { ActiveStatus: status },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }
  async processPayoutRequest(req, res) {
    try {
      const { payoutRequestId, status, remark } = req.body;

      // Validate input
      if (!payoutRequestId || !['1', '2'].includes(status)) {
        return res.json({ status: false, message: 'Invalid payout request ID or status.' });
      }

      // Fetch the payout request record
      const payoutRequest = await Payout_Modal.findById(payoutRequestId);

      if (!payoutRequest) {
        return resolve.json({ status: false, message: 'Payout request not found.' });
      }

      // Fetch the client record
      const client = await Clients_Modal.findOne({ _id: payoutRequest.clientid, del: 0, ActiveStatus: 1 });

      if (!client) {
        return res.json({ status: false, message: 'Client not found or inactive.' });
      }
      let notificationBody;
      const notificationTitle = 'Important Update';

      if (status === '1') {
        // Approve the payout request
        payoutRequest.status = '1';
        notificationBody = 'Your Payout Approved......';


      } else if (status === '2') {
        // Logic to reject the payout request
        payoutRequest.status = '2';
        payoutRequest.remark = remark;
        client.wamount += payoutRequest.amount; // Refund amount back to client's wamount
        await client.save();

        notificationBody = 'Your Payout Reject......';

      }

      await payoutRequest.save();


      const resultn = new Notification_Modal({
        clientid: client._id,
        segmentid: payoutRequest._id,
        type: 'payout',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
      try {
        if (client && client.devicetoken) {
          const tokens = [client.devicetoken];
          await sendFCMNotification(notificationTitle, notificationBody, tokens, "payout");

        }
      } catch (error) {
      }

      return res.json({
        status: true,
        message: 'Payout request updated successfully.',
        data: payoutRequest,
      });

    } catch (error) {
      // console.error('Error processing payout request:', error);
      return res.json({ status: false, message: 'Server error while processing payout request.' });
    }
  }

  async payoutList(req, res) {

    try {
      // const { } = req.body; // Not needed unless you plan to use body data

      const result = await Payout_Modal.aggregate([
        {
          $lookup: {
            from: "clients", // The collection to join
            let: { clientId: { $toObjectId: "$clientid" } }, // Convert clientid to ObjectId for matching
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$clientId"] }, // Match _id with clientId
                  ActiveStatus: 1, // Ensure client is active
                  del: 0 // Ensure client is not deleted
                }
              },
              {
                $project: { FullName: 1, Email: 1, PhoneNo: 1, wamount: 1 } // Get only required fields
              }
            ],
            as: "client_details" // The resulting array of matched documents from clients
          }
        },
        {
          $unwind: { path: "$client_details", preserveNullAndEmptyArrays: false } // Exclude documents where client_details is empty or null
        },
        {
          $project: {
            _id: 1,
            clientid: 1,
            amount: 1,
            status: 1,
            del: 1,
            created_at: 1,
            updated_at: 1,
            client_details: 1 // Include client details
          }
        }
      ]);

      // Log the result for debugging

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async freetrialList(req, res) {
    try {
      const today = new Date(); // Get today's date
      const result = await Freetrial_Modal.aggregate([
        {
          $match: { del: false } // Only active free trials
        },
        {
          $addFields: {
            clientid: { $toObjectId: "$clientid" } // Convert clientid to ObjectId
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientid',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'plansubscriptions',
            localField: 'clientid', // Converted clientid in Freetrial_Modal
            foreignField: 'client_id',
            as: 'subscriptionDetails'
          }
        },
        {
          $addFields: {
            subscriptionCount: { $size: "$subscriptionDetails" } // Check subscription array size
          }
        },
        {
          $match: {
            subscriptionCount: 0 // Only clients without any subscriptions
          }
        },
        {
          $addFields: {
            status: {
              $cond: {
                if: { $gte: ["$enddate", today] }, // Check if enddate is today or later
                then: "active",
                else: "expired"
              }
            }
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ]);

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async freetrialListWithFilter(req, res) {
    try {
      const { freestatus, search, page = 1 } = req.body; // Extract page and limit from the request body with default values
      let limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of items to skip based on page and limit
      const today = new Date(); // Get today's date


      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } },
          { "clientDetails.Email": { $regex: search, $options: "i" } },
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }
        ]
      } : {};


      const statussMatch = {
        "clientDetails.ActiveStatus": 1,
        "clientDetails.del": 0
      };

      const finalFilter = {
        ...searchMatch,
        ...statussMatch
      };

      const statusMatch = freestatus && freestatus.trim() !== "" ? {
        status: freestatus // Match only the given status (active or expired)
      } : {};



      const totalCountPipeline = [
        {
          $match: { del: false } // Only active free trials
        },
        {
          $addFields: {
            clientid: { $toObjectId: "$clientid" } // Convert clientid to ObjectId
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientid',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: finalFilter // Apply the search filter dynamically
        },
        {
          $lookup: {
            from: 'plansubscriptions',
            localField: 'clientid', // Converted clientid in Freetrial_Modal
            foreignField: 'client_id',
            as: 'subscriptionDetails'
          }
        },
        {
          $addFields: {
            subscriptionCount: { $size: "$subscriptionDetails" } // Check subscription array size
          }
        },
        {
          $match: {
            subscriptionCount: 0 // Only clients without any subscriptions
          }
        },
        {
          $addFields: {
            status: {
              $cond: {
                if: { $gte: ["$enddate", today] }, // Check if enddate is today or later
                then: "active",
                else: "expired"
              }
            }
          }
        },
        {
          $match: statusMatch // Filter by freestatus
        },
        {
          $count: "totalCount" // Count the total number of matching documents
        }
      ];

      // Get the total count
      const totalCountResult = await Freetrial_Modal.aggregate([
        ...totalCountPipeline,
        { $count: "totalCount" } // Count the total number of matching documents
      ]);
      const totalCount = totalCountResult[0] ? totalCountResult[0].totalCount : 0;


      // Now get the paginated result
      const result = await Freetrial_Modal.aggregate([
        ...totalCountPipeline.slice(0, -1), // Use the same pipeline but exclude $count for paginated results
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);


      return res.json({
        status: true,
        message: "get",
        data: result,
        pagination: {
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async deleteFreetrial(req, res) {
    try {
      const { id } = req.params;


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Freetrial ID is required",
        });
      }

      //  const deletedClient = await Clients_Modal.findByIdAndDelete(id);
      const deletedFreetrial = await Freetrial_Modal.findByIdAndUpdate(
        id,
        { del: true },
        { new: true }
      );

      if (!deletedFreetrial) {
        return res.status(404).json({
          status: false,
          message: "Freetrial not found",
        });
      }


      return res.json({
        status: true,
        message: "Freetrial deleted successfully",
        data: deletedFreetrial,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }




  async helpdeskList(req, res) {
    try {
      const result = await Helpdesk_Modal.aggregate([
        {
          $match: { del: false } // Match documents where del is false
        },
        {
          $addFields: {
            client_id: { $toObjectId: "$client_id" } // Convert clientid to ObjectId
          }
        },
        {
          $lookup: {
            from: 'clients', // Name of the clients collection
            localField: 'client_id', // Field from Freetrial_Modal
            foreignField: '_id', // Field from the clients collection
            as: 'clientDetails' // Name of the new array field
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true // Optional
          }
        },
        {
          $sort: { created_at: -1 } // Sort by created_at in descending order
        }
      ]);

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async deleteHelpdesk(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Helpdesk ID is required",
        });
      }

      const deletedHelpdesk = await Helpdesk_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );
      if (!deletedHelpdesk) {
        return res.status(404).json({
          status: false,
          message: "Helpdesk not found",
        });
      }

      return res.json({
        status: true,
        message: "Helpdesk deleted successfully",
        data: deletedHelpdesk,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async myPlan(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ status: false, message: 'Client ID is required' });
      }

      const result = await PlanSubscription_Modal.aggregate([
        {
          $match: {
            del: false,
            client_id: new mongoose.Types.ObjectId(id) // Convert id to ObjectId if necessary
          }
        },
        {
          $lookup: {
            from: 'plans', // The name of the plans collection
            localField: 'plan_id', // The field in PlanSubscription_Modal that references the plans
            foreignField: '_id', // The field in the plans collection that is referenced
            as: 'planDetails' // The name of the field in the result that will hold the joined data
          }
        },
        {
          $unwind: '$planDetails' // Optional: Unwind the result if you expect only one matching plan per subscription
        },
        {
          $sort: { created_at: -1 } // Sort by created_at in descending order
        }
      ]);




      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async myService(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id) {
        return res.status(400).json({ status: false, message: 'Client ID is required' });
      }


      const result = await Planmanage.aggregate([
        {
          $match: { clientid: id }
        },
        {
          $addFields: {
            serviceid: { $toObjectId: '$serviceid' } // Convert serviceid to ObjectId for matching
          }
        },
        {
          $lookup: {
            from: 'services',           // The name of the Service collection
            localField: 'serviceid',    // Field in Planmanage
            foreignField: '_id',        // Field in Service
            as: 'serviceDetails'        // Output array field
          }
        },
        {
          $unwind: {
            path: '$serviceDetails',
            preserveNullAndEmptyArrays: true // If there's no matching service, it won't remove the document
          }
        },
        {
          $project: {
            _id: 1,
            clientid: 1,
            serviceid: 1,
            startdate: 1,
            enddate: 1,
            serviceName: '$serviceDetails.title' // Rename the service name field for clarity
          }
        }
      ]);


      return res.json({
        status: true,
        message: "Subscriptions and client details retrieved successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async clientRequest(req, res) {
    try {
      const { page = 1, search } = req.body;
      const limit = 10;
      const skip = (page - 1) * limit;
      const clientSearchQuery = new RegExp(search, 'i');

      const requestclients = await Requestclient_Modal.aggregate([
        {
          $match: { del: false }, // Filter out deleted records
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientid',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $or: [
              { 'clientDetails.FullName': clientSearchQuery },
              { 'clientDetails.Email': clientSearchQuery },
              { 'clientDetails.PhoneNo': clientSearchQuery }
            ]
          }
        },
        // Conditional Lookup for 'plan' and 'basket' based on 'type' field
        // Lookup for Plans
        {
          $lookup: {
            from: 'plans',
            localField: 'id',
            foreignField: '_id',
            as: 'planDetails'
          }
        },
        {
          $unwind: {
            path: '$planDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        // Lookup for Plan Category (to get category title & service)
        {
          $lookup: {
            from: 'plancategories',
            localField: 'planDetails.category',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        {
          $unwind: {
            path: '$categoryDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            serviceArray: {
              $map: {
                input: { $split: ["$categoryDetails.service", ","] }, // Split string into array
                as: "serviceId",
                in: { $toObjectId: "$$serviceId" } // Convert to ObjectId
              }
            }
          }
        },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceArray',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        },
        // Lookup for Baskets
        {
          $lookup: {
            from: 'baskets',
            localField: 'id',
            foreignField: '_id',
            as: 'basketDetails'
          }
        },
        {
          $addFields: {
            planData: {
              $cond: {
                if: { $eq: ["$type", "plan"] },
                then: {
                  title: "$planDetails.title",
                  categoryTitle: "$categoryDetails.title",
                  service: "$categoryDetails.service",
                  serviceTitles: {
                    $map: {
                      input: "$serviceDetails",
                      as: "service",
                      in: "$$service.title"
                    }
                  }
                },
                else: null
              }
            },
            basketData: {
              $cond: {
                if: { $eq: ["$type", "basket"] },
                then: { $map: { input: "$basketDetails", as: "basket", in: { title: "$$basket.title" } } },
                else: []
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            clientid: 1,
            type: 1,
            status: 1,
            del: 1,
            created_at: 1,
            updated_at: 1,
            FullName: "$clientDetails.FullName",
            Email: "$clientDetails.Email",
            PhoneNo: "$clientDetails.PhoneNo",
            planData: 1,
            basketData: 1
          }
        },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Get the total count of matching records for pagination
      const totalCount = await Requestclient_Modal.aggregate([
        {
          $match: { del: false }, // Filter out deleted records
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientid',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: { path: '$clientDetails', preserveNullAndEmptyArrays: true }
        },
        {
          $match: {
            $or: [
              { 'clientDetails.FullName': clientSearchQuery },
              { 'clientDetails.Email': clientSearchQuery },
              { 'clientDetails.PhoneNo': clientSearchQuery }
            ]
          }
        },
        { $count: 'totalCount' }
      ]);

      const totalItems = totalCount.length ? totalCount[0].totalCount : 0;
      const totalPages = Math.ceil(totalItems / limit);

      return res.json({
        status: true,
        message: "Retrieved successfully",
        data: requestclients,
        pagination: {
          total: totalItems,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });

    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving Requestclient data', error });
    }
  }

  async deleteClientrequest(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "ID is required",
        });
      }

      const deletedClientrequest = await Requestclient_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );
      if (!deletedClientrequest) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      return res.json({
        status: true,
        message: "deleted successfully",
        data: deletedClientrequest,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async orderListDetail(req, res) {
    try {
      const { clientid, signalid, page = 1, fromDate, toDate, ordertype, borkerid, search, segment } = req.body; // Default pagination values
      const limit = 10;
      const pageSize = parseInt(limit);
      const skip = (parseInt(page) - 1) * pageSize;

      // Build dynamic match conditions
      const matchCondition = {};
      if (clientid) matchCondition.clientid = clientid;
      if (signalid) matchCondition.signalid = signalid;
      if (ordertype) matchCondition.ordertype = ordertype; // BUY or SELL
      if (borkerid) matchCondition.borkerid = borkerid;

      // Filter by date range
      if (fromDate && toDate) {
        matchCondition.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        };
      } else if (fromDate) {
        matchCondition.createdAt = {
          $gte: new Date(fromDate)
        };
      } else if (toDate) {
        matchCondition.createdAt = {
          $lte: new Date(toDate)
        };
      }





      const result = await Order_Modal.aggregate([
        {
          $match: matchCondition, // Dynamically match based on provided filters
        },
        {
          $addFields: {
            signalObjectId: { $toObjectId: "$signalid" }, // Convert signalid to ObjectId
            clientObjectId: { $toObjectId: "$clientid" }, // Convert clientid to ObjectId
          },
        },
        {
          $lookup: {
            from: "signals", // Join with the 'signals' collection
            localField: "signalObjectId",
            foreignField: "_id",
            as: "signalDetails",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientObjectId",
            foreignField: "_id",
            as: "clientDetails",
          },
        },
        {
          $unwind: {
            path: "$signalDetails",
            preserveNullAndEmptyArrays: true, // Optional: keep orders even if no signal match
          },
        },
        ...(segment ? [{ $match: { "signalDetails.segment": segment } }] : []),
        {
          $unwind: {
            path: "$clientDetails",
            preserveNullAndEmptyArrays: true, // Optional: keep orders even if no client match
          },
        },
        {
          $match: search ? {
            $or: [
              { "clientDetails.FullName": { $regex: search, $options: "i" } },
              { "clientDetails.Email": { $regex: search, $options: "i" } },
              { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }
            ]
          } : {}
        },
        {
          $project: {
            orderid: 1,
            clientid: 1,
            signalid: 1,
            uniqueorderid: 1,
            quantity: 1,
            status: 1,
            borkerid: 1,
            ordertype: 1,
            data: 1,
            signalDetails: 1, // Include all signal fields
            "clientDetails.FullName": 1, // Include only FullName from clientDetails
            "clientDetails.Email": 1,   // Include only Email from clientDetails
            "clientDetails.PhoneNo": 1, // Include only PhoneNo from clientDetails
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort by creation date in descending order
          },
        },
        {
          $skip: skip, // Skip documents for pagination
        },
        {
          $limit: pageSize, // Limit documents per page
        },
      ]);

      // Get total count for pagination metadata
      // const totalRecords = await Order_Modal.countDocuments(matchCondition);


      const countPipeline = [
        { $match: matchCondition },
        {
          $addFields: {
            signalObjectId: { $toObjectId: "$signalid" },
            clientObjectId: { $toObjectId: "$clientid" },
          },
        },
        {
          $lookup: {
            from: "signals",
            localField: "signalObjectId",
            foreignField: "_id",
            as: "signalDetails"
          }
        },
        { $unwind: { path: "$signalDetails", preserveNullAndEmptyArrays: true } },

        ...(segment ? [{ $match: { "signalDetails.segment": segment } }] : []),


        {
          $lookup: {
            from: "clients",
            localField: "clientObjectId",
            foreignField: "_id",
            as: "clientDetails",
          },
        },
        {
          $unwind: {
            path: "$clientDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      // Add search filter if provided
      if (search) {
        countPipeline.push({
          $match: {
            $or: [
              { "clientDetails.FullName": { $regex: search, $options: "i" } },
              { "clientDetails.Email": { $regex: search, $options: "i" } },
              { "clientDetails.PhoneNo": { $regex: search, $options: "i" } },
            ],
          },
        });
      }

      // Count the documents
      countPipeline.push({ $count: "totalRecords" });

      const countResult = await Order_Modal.aggregate(countPipeline);
      const totalRecords = countResult[0] ? countResult[0].totalRecords : 0;

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result,
        pagination: {
          totalRecords,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRecords / pageSize),
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
        data: [],
      });
    }
  }


  async orderListDetailexport(req, res) {
    try {
      const { clientid, signalid, page = 1, fromDate, toDate, ordertype, borkerid, search, segment } = req.body; // Default pagination values


      // Build dynamic match conditions
      const matchCondition = {};
      if (clientid) matchCondition.clientid = clientid;
      if (signalid) matchCondition.signalid = signalid;
      if (ordertype) matchCondition.ordertype = ordertype; // BUY or SELL
      if (borkerid) matchCondition.borkerid = borkerid;

      // Filter by date range
      if (fromDate && toDate) {
        matchCondition.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        };
      } else if (fromDate) {
        matchCondition.createdAt = {
          $gte: new Date(fromDate)
        };
      } else if (toDate) {
        matchCondition.createdAt = {
          $lte: new Date(toDate)
        };
      }





      const result = await Order_Modal.aggregate([
        {
          $match: matchCondition, // Dynamically match based on provided filters
        },
        {
          $addFields: {
            signalObjectId: { $toObjectId: "$signalid" }, // Convert signalid to ObjectId
            clientObjectId: { $toObjectId: "$clientid" }, // Convert clientid to ObjectId
          },
        },
        {
          $lookup: {
            from: "signals", // Join with the 'signals' collection
            localField: "signalObjectId",
            foreignField: "_id",
            as: "signalDetails",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientObjectId",
            foreignField: "_id",
            as: "clientDetails",
          },
        },
        {
          $unwind: {
            path: "$signalDetails",
            preserveNullAndEmptyArrays: true, // Optional: keep orders even if no signal match
          },
        },
        ...(segment ? [{ $match: { "signalDetails.segment": segment } }] : []),
        {
          $unwind: {
            path: "$clientDetails",
            preserveNullAndEmptyArrays: true, // Optional: keep orders even if no client match
          },
        },
        {
          $match: search ? {
            $or: [
              { "clientDetails.FullName": { $regex: search, $options: "i" } },
              { "clientDetails.Email": { $regex: search, $options: "i" } },
              { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }
            ]
          } : {}
        },
        {
          $project: {
            orderid: 1,
            clientid: 1,
            signalid: 1,
            uniqueorderid: 1,
            quantity: 1,
            status: 1,
            borkerid: 1,
            ordertype: 1,
            data: 1,
            signalDetails: 1, // Include all signal fields
            "clientDetails.FullName": 1, // Include only FullName from clientDetails
            "clientDetails.Email": 1,   // Include only Email from clientDetails
            "clientDetails.PhoneNo": 1, // Include only PhoneNo from clientDetails
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort by creation date in descending order
          },
        },

      ]);

      // Get total count for pagination metadata
      // const totalRecords = await Order_Modal.countDocuments(matchCondition);


      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
        data: [],
      });
    }
  }





  async PlanCartList(req, res) {
    try {
      const { client_id } = req.params; // Assuming client_id is passed in URL parameters

      // Validate input
      if (!client_id) {
        return res.status(400).json({
          status: false,
          message: 'Client ID is required.',
          data: [],
        });
      }

      // Fetch cart items where client_id matches and status is false
      const cartItems = await Addtocart_Modal.find({
        client_id: client_id,
        status: false,
        basket_id: null, // Check for both null and empty string
      }).populate('plan_id', 'price validity')  // Populate plan details
        .populate({
          path: 'plan_id', // The path to the plan
          populate: {
            path: 'category', // The field in Plan model that references the Plancategory
            select: 'title' // Select only the 'title' from Plancategory
          }
        });

      // Check if cart is empty
      if (!cartItems.length) {
        return res.status(404).json({
          status: false,
          message: 'No items found in the cart for this client.',
          data: [],
        });
      }

      // Return success response with cart items
      return res.status(200).json({
        status: true,
        message: 'Cart items retrieved successfully.',
        data: cartItems,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Something went wrong while retrieving cart items.',
        error: error.message,
      });
    }
  }

  async BasketCartList(req, res) {
    try {
      const { client_id } = req.params; // Assuming client_id is passed in URL parameters

      // Validate input
      if (!client_id) {
        return res.status(400).json({
          status: false,
          message: 'Client ID is required.',
          data: [],
        });
      }

      // Fetch cart items where client_id matches and status is false
      const cartItems = await Addtocart_Modal.find({
        client_id: client_id,
        status: false,
        plan_id: null, // Check for both null and empty string
      }).populate('basket_id', 'title	themename	full_price	basket_price	validity');

      // Check if cart is empty
      if (!cartItems.length) {
        return res.status(404).json({
          status: false,
          message: 'No items found in the cart for this client.',
          data: [],
        });
      }

      // Return success response with cart items
      return res.status(200).json({
        status: true,
        message: 'Cart items retrieved successfully.',
        data: cartItems,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Something went wrong while retrieving cart items.',
        error: error.message,
      });
    }
  }




  async getClientWithFilterwithplan(req, res) {
    try {
      const { status, kyc_verification, createdby, planStatus, search, add_by, page = 1 } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      const limitValue = parseInt(limit);
      const matchConditions = { del: 0 }; // Initialize match conditions

      // Filter by KYC verification if specified
      if (kyc_verification !== "") {
        matchConditions.kyc_verification = parseInt(kyc_verification);
      }

      if (createdby) {
        matchConditions.add_by = createdby === "app" ? null : { $ne: null };
      }

      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }


      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }

      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } }, // Search in name
          { Email: { $regex: search, $options: "i" } },    // Search in email
          { PhoneNo: { $regex: search, $options: "i" } }  // Search in mobile
        ];
      }


      const result = await Clients_Modal.aggregate([
        {
          $match: matchConditions
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
          $lookup: {
            from: 'addtocarts', // Join with addtocarts collection
            let: { clientId: { $toObjectId: "$_id" } }, // Convert client _id to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toObjectId: "$client_id" }, "$$clientId"] }, // Ensure both are ObjectId
                      { $eq: ["$status", false] } // Only fetch records where status is false
                    ]
                  }
                }
              }
            ],
            as: 'cartItems'
          }
        },
        {
          $addFields: {
            hasPendingCart: { $gt: [{ $size: "$cartItems" }, 0] } // If cartItems > 0, set true; else false
          }
        },
        {
          $project: {
            _id: 1,
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
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
            },
            hasPendingCart: 1
          }
        },
        ...(planStatus ? [{
          $match: { "clientStatus": planStatus } // Match only clients with the specified status
        }] : []),
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        },
        {
          $skip: skip // Pagination: Skip the first 'skip' number of items
        },
        {
          $limit: limitValue // Pagination: Limit the result to 'limit' items
        }
      ]);


      const results = await Clients_Modal.aggregate([
        {
          $match: matchConditions // Match based on the conditions
        },
        {
          $count: "totalCount" // Count the total number of matching clients
        }
      ]);

      const totalClients = results.length > 0 ? results[0].totalCount : 0;




      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result,
        pagination: {
          total: totalClients,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalClients / limit),
        }
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async getClientWithFilterExport(req, res) {
    try {
      const { status, kyc_verification, createdby, planStatus, search, add_by, fromDate, toDate } = req.body;
      // const limit = 10;
      // const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      // const limitValue = parseInt(limit);
      const matchConditions = { del: 0 }; // Initialize match conditions

      // Filter by KYC verification if specified
      if (kyc_verification !== "") {
        matchConditions.kyc_verification = parseInt(kyc_verification);
      }

      if (createdby) {
        matchConditions.add_by = createdby === "app" ? null : { $ne: null };
      }

      if (status !== "") {
        matchConditions.ActiveStatus = parseInt(status);
      }


      if (add_by !== "") {
        matchConditions.add_by = add_by;
      }


      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // extend to end of the day

        matchConditions.createdAt = { $gte: from, $lte: to };
      }


      if (search && search.trim() !== "") {
        matchConditions.$or = [
          { FullName: { $regex: search, $options: "i" } }, // Search in name
          { Email: { $regex: search, $options: "i" } },    // Search in email
          { PhoneNo: { $regex: search, $options: "i" } }  // Search in mobile
        ];
      }


      const result = await Clients_Modal.aggregate([
        {
          $match: matchConditions
        },
        {
          $lookup: {
            from: 'users', // The users collection name
            let: { userId: { $toObjectId: "$add_by" } }, // Convert add_by to ObjectId
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
            ],
            as: 'addedByDetails'
          }
        },
        {
          $unwind: {
            path: '$addedByDetails',
            preserveNullAndEmptyArrays: true // Keeps clients without a matching user
          }
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
          $lookup: {
            from: 'services', // Assuming services collection contains the service details
            localField: 'plans.serviceid', // Linking serviceid in planmanages
            foreignField: '_id', // Matching _id in services
            as: 'serviceDetails'
          }
        },
        {
          $addFields: {
            activePlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $gte: ["$$plan.enddate", new Date()] } // Active if enddate >= today
              }
            },
            expiredPlans: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: { $lt: ["$$plan.enddate", new Date()] } // Expired if enddate < today
              }
            },
            plansStatus: {
              $map: {
                input: "$plans",
                as: "plan",
                in: {
                  planId: "$$plan._id", // Include plan ID
                  serviceName: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66d2c3bebf7e6dc53ed07626" // Static ObjectId for "Cash"
                            ]
                          },
                          then: "Cash" // If serviceid matches, return "Cash"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfede64a88602fbbca9b72" // Static ObjectId for "Future"
                            ]
                          },
                          then: "Future" // If serviceid matches, return "Future"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "66dfeef84a88602fbbca9b79" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Option" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e12758a0a2be895da19550" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Strategy" // If serviceid matches, return "Option"
                        },
                        {
                          case: {
                            $eq: [
                              { $toString: "$$plan.serviceid" }, // Convert serviceid to string for comparison
                              "67e1279ba0a2be895da19551" // Static ObjectId for "Option"
                            ]
                          },
                          then: "Future Strategy" // If serviceid matches, return "Option"
                        }
                      ],
                      default: "Unknown Service" // Default value if no match
                    }
                  },
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
          $lookup: {
            from: 'addtocarts', // Join with addtocarts collection
            let: { clientId: { $toObjectId: "$_id" } }, // Convert client _id to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toObjectId: "$client_id" }, "$$clientId"] }, // Ensure both are ObjectId
                      { $eq: ["$status", false] } // Only fetch records where status is false
                    ]
                  }
                }
              }
            ],
            as: 'cartItems'
          }
        },
        {
          $addFields: {
            hasPendingCart: { $gt: [{ $size: "$cartItems" }, 0] } // If cartItems > 0, set true; else false
          }
        },
        {
          $project: {
            _id: 1,
            FullName: 1,
            Email: 1,
            PhoneNo: 1,
            password: 1,
            token: 1,
            panno: 1,
            aadhaarno: 1,
            kyc_verification: 1,
            pdf: 1,
            add_by: 1,
            apikey: 1,
            apisecret: 1,
            alice_userid: 1,
            brokerid: 1,
            authtoken: 1,
            dlinkstatus: 1,
            tradingstatus: 1,
            wamount: 1,
            del: 1,
            clientcome: 1,
            ActiveStatus: 1,
            freetrial: 1,
            refer_token: 1,
            forgotPasswordToken: 1,
            forgotPasswordTokenExpiry: 1,
            devicetoken: 1,
            createdAt: 1,
            updatedAt: 1,
            state: 1,
            city: 1,
            'addedByDetails.FullName': 1, // Include user's first name
            plansStatus: 1, // Updated to include service name and status
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
            },
            hasPendingCart: 1
          }
        },
        ...(planStatus ? [{
          $match: { "clientStatus": planStatus } // Match only clients with the specified status
        }] : []),
        {
          $sort: { 'createdAt': -1 } // Sort by createdAt in descending order
        },
        // {
        //   $skip: skip // Pagination: Skip the first 'skip' number of items
        // },
        // {
        //   $limit: limitValue // Pagination: Limit the result to 'limit' items
        // }
      ]);



      return res.json({
        status: true,
        message: "Clients with their plan statuses fetched",
        data: result,

      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async freetrialListWithFilterExport(req, res) {
    try {
      const { freestatus, search } = req.body; // Extract page and limit from the request body with default values
      // let limit = 10;
      // const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of items to skip based on page and limit
      const today = new Date(); // Get today's date


      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } },
          { "clientDetails.Email": { $regex: search, $options: "i" } },
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }
        ]
      } : {};


      const statussMatch = {
        "clientDetails.ActiveStatus": 1,
        "clientDetails.del": 0
      };

      const finalFilter = {
        ...searchMatch,
        ...statussMatch
      };

      const statusMatch = freestatus && freestatus.trim() !== "" ? {
        status: freestatus // Match only the given status (active or expired)
      } : {};



      const totalCountPipeline = [
        {
          $match: { del: false } // Only active free trials
        },
        {
          $addFields: {
            clientid: { $toObjectId: "$clientid" } // Convert clientid to ObjectId
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientid',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        {
          $unwind: {
            path: '$clientDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: finalFilter // Apply the search filter dynamically
        },
        {
          $lookup: {
            from: 'plansubscriptions',
            localField: 'clientid', // Converted clientid in Freetrial_Modal
            foreignField: 'client_id',
            as: 'subscriptionDetails'
          }
        },
        {
          $addFields: {
            subscriptionCount: { $size: "$subscriptionDetails" } // Check subscription array size
          }
        },
        {
          $match: {
            subscriptionCount: 0 // Only clients without any subscriptions
          }
        },
        {
          $addFields: {
            status: {
              $cond: {
                if: { $gte: ["$enddate", today] }, // Check if enddate is today or later
                then: "active",
                else: "expired"
              }
            }
          }
        },
        {
          $match: statusMatch // Filter by freestatus
        },
        {
          $count: "totalCount" // Count the total number of matching documents
        }
      ];

      // Get the total count


      // Now get the paginated result
      const result = await Freetrial_Modal.aggregate([
        ...totalCountPipeline.slice(0, -1), // Use the same pipeline but exclude $count for paginated results
        { $sort: { created_at: -1 } },

      ]);


      return res.json({
        status: true,
        message: "get",
        data: result,

      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async getClientEmailsForMailing(req, res) {
    try {
      // Destructure query parameters for client status and plan category
      const { clientStatus, planCategory } = req.body;

      // Validate client status (can be "all", "active", "expired", "nonsubscriber")
      if (!clientStatus || !['all', 'active', 'expired', 'nonsubscriber'].includes(clientStatus)) {
        return res.status(400).json({ message: 'Invalid client status' });
      }

      // Validation: Ensure that planCategory is only provided for 'active' or 'expired' statuses
      if ((clientStatus === 'active' || clientStatus === 'expired') && !planCategory) {
        return res.status(400).json({ message: 'Plan category is required for active or expired status' });
      }

      let filter = {};

      // If clientStatus is "all", we will return all clients without applying any filters for subscriptions.
      if (clientStatus === "all") {
        filter = {
          ActiveStatus: 1,   // Filter by ActiveStatus: 1
          del: 0             // Filter by del: 0
        };
      }
      // If clientStatus is "active", filter based on subscription status and plan category
      else if (clientStatus === "active") {
        filter = {
          "status": "active",
          "plan_end": { $gte: new Date() }, // Active plans (plan_end >= current date)
          "plan_category_id": planCategory,  // Filter by selected plan category
        };
      }
      // If clientStatus is "expired", filter based on subscription status and plan category
      else if (clientStatus === "expired") {
        filter = {
          "status": "active",
          "plan_end": { $lt: new Date() }, // Expired plans (plan_end < current date)
          "plan_category_id": planCategory,  // Filter by selected plan category
        };
      }
      // If clientStatus is "nonsubscriber", filter out clients who do not have any active subscriptions
      else if (clientStatus === "nonsubscriber") {
        // Fetch clients who have no subscriptions at all (active or expired)
        const subscribedClientIds = await PlanSubscription_Modal.distinct('client_id');
        // Find clients who don't have a subscription (not in the subscribedClientIds)
        filter = {
          _id: { $nin: subscribedClientIds },
          ActiveStatus: 1,   // Filter by ActiveStatus: 1
          del: 0             // Filter by del: 0
        };
      }

      // Fetch subscriptions based on the constructed filter
      const subscriptions = await PlanSubscription_Modal.find(filter).populate("client_id");

      // To avoid duplicates, we will store the client emails in a Map (using client_id as the key)
      const clientMap = new Map();

      // Loop through subscriptions and check if the plan is expired but renewed
      for (const subscription of subscriptions) {
        const clientId = subscription.client_id._id;
        const email = subscription.client_id.Email;
        const fullName = subscription.client_id.FullName;
        const planEnd = new Date(subscription.plan_end);

        // If the client is already in the map, check if the current plan is later (more recent)
        if (clientMap.has(clientId)) {
          const existingPlanEnd = clientMap.get(clientId).plan_end;
          if (planEnd > existingPlanEnd) {
            // Replace with the newer plan if the current plan is more recent
            clientMap.set(clientId, { _id: clientId, email, fullName, plan_end: planEnd });
          }
        } else {
          // If the client is not in the map, add the current plan
          clientMap.set(clientId, { _id: clientId, email, fullName, plan_end: planEnd });
        }
      }

      // Extract unique clients (email, fullName, _id) from the map
      const uniqueClients = Array.from(clientMap.values()).map(item => ({
        _id: item._id,
        FullName: item.fullName,
        Email: item.email
      }));

      // If no subscriptions are found (for "nonsubscriber"), get all clients without plans
      if (clientStatus === "nonsubscriber") {
        // Apply filters for ActiveStatus: 1 and del: 0
        const clientsWithoutSubscriptions = await Clients_Modal.find(filter).select("Email FullName _id");
        return res.status(200).json({ clients: clientsWithoutSubscriptions });
      }

      if (clientStatus === "all") {
        // Apply filters for ActiveStatus: 1 and del: 0
        const clientsWithoutSubscriptions = await Clients_Modal.find(filter).select("Email FullName _id");
        return res.status(200).json({ clients: clientsWithoutSubscriptions });
      }

      // If no clients found
      if (uniqueClients.length === 0) {
        return res.status(404).json({ message: 'No client emails found' });
      }

      // Return the list of unique clients (with _id, FullName, and Email)
      return res.status(200).json({ clients: uniqueClients });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  async getClientsByPlanExpiry(req, res) {
    try {
      const { dayOffset } = req.body;

      // Validate dayOffset (can be -1, 0, 1, 3, etc.)
      if (typeof dayOffset !== 'number') {
        return res.status(400).json({ message: "dayOffset (number) is required", status: false });
      }

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const targetDateStart = new Date(currentDate);
      targetDateStart.setDate(currentDate.getDate() + dayOffset);

      const targetDateEnd = new Date(targetDateStart);
      targetDateEnd.setHours(23, 59, 59, 999);

      const latestSubs = await PlanSubscription_Modal.aggregate([
        {
          $match: {
            del: false,
            status: "active"
          }
        },
        { $sort: { plan_end: -1 } },
        {
          $group: {
            _id: {
              client_id: "$client_id",
              plan_category_id: "$plan_category_id"
            },
            latestSubscription: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$latestSubscription" }
        },
        {
          $match: {
            plan_end: { $gte: targetDateStart, $lte: targetDateEnd }
          }
        },
        {
          $lookup: {
            from: "clients",  // your clients collection name (adjust if different)
            localField: "client_id",
            foreignField: "_id",
            as: "client"
          }
        },
        { $unwind: "$client" },
        {
          $lookup: {
            from: "plancategories",  // your plancategory collection name (adjust if different)
            localField: "plan_category_id",
            foreignField: "_id",
            as: "plan_category"
          }
        },
        { $unwind: { path: "$plan_category", preserveNullAndEmptyArrays: true } }
      ]);

      if (!latestSubs.length) {
        return res.json({ message: "No subscriptions found for the given date range.", status: false });
      }

      const clientMap = new Map();

      for (const sub of latestSubs) {
        const clientIdStr = sub.client_id.toString();

        if (!clientMap.has(clientIdStr)) {
          const planName = sub.plan_category ? sub.plan_category.title : 'Unknown';

          clientMap.set(clientIdStr, {
            _id: sub.client._id,
            FullName: sub.client.FullName || 'Unknown',
            Email: sub.client.Email || 'Unknown',
            PhoneNo: sub.client.PhoneNo || 'Unknown',
            planName: planName
          });
        }
      }

      const clientList = Array.from(clientMap.values());

      return res.json({
        status: true,
        dayOffset,
        clientCount: clientList.length,
        clients: clientList
      });

    } catch (err) {
      console.error("Error in getClientsByPlanExpiry:", err);
      return res.status(500).json({ message: "Server Error", error: err.message, status: false });
    }
  }







}
module.exports = new Clients();