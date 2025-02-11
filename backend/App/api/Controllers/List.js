const db = require("../../Models");
var axios = require('axios');

const BasicSetting_Modal = db.BasicSetting;
const Banner_Modal = db.Banner;
const Blogs_Modal = db.Blogs;
const News_Modal = db.News;
const Plan_Modal = db.Plan;
const Service_Modal = db.Service;
const Plancategory_Modal = db.Plancategory;
const PlanSubscription_Modal = db.PlanSubscription;
const Coupon_Modal = db.Coupon;
const Signal_Modal = db.Signal;
const Stock_Modal = db.Stock;
const Faq_Modal = db.Faq;
const Content_Modal = db.Content;
const Basket_Modal = db.Basket;
const BasketSubscription_Modal = db.BasketSubscription;
const Planmanage = db.Planmanage;
const Refer_Modal = db.Refer;
const Clients_Modal = db.Clients;
const Freetrial_Modal = db.Freetrial;
const Broadcast_Modal = db.Broadcast;
const Order_Modal = db.Order;
const License_Modal = db.License;
const Notification_Modal = db.Notification;
const Bank_Modal = db.Bank;
const Adminnotification_Modal = db.Adminnotification;
const Basketstock_Modal = db.Basketstock;
const Liveprice_Modal = db.Liveprice;
const Basketorder_Modal = db.Basketorder;
const Mailtemplate_Modal = db.Mailtemplate;
const Requestclient_Modal = db.Requestclient;
const Addtocart_Modal = db.Addtocart;
const Stockrating_Modal = db.Stockrating;


const { sendEmail } = require('../../Utils/emailService');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');




const { orderplace } = require('../../Controllers/Aliceblue');
const { angleorderplace } = require('../../Controllers/Angle')
const { kotakneoorderplace } = require('../../Controllers/Kotakneo')
const { markethuborderplace } = require('../../Controllers/Markethub')



mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class List {


  async Bannerlist(req, res) {
    try {

      const banners = await Banner_Modal.find({ del: false, status: true });
      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const bannerWithImageUrls = banners.map(banner => {
        return {
          ...banner._doc, // Spread the original bannerss document
          image: banner.image ? `${baseUrl}/uploads/banner/${banner.image}` : null // Append full image URL
        };
      });



      return res.status(200).json({
        status: true,
        message: "Banner retrieved successfully",
        data: bannerWithImageUrls
      });
    } catch (error) {
      console.log("Error retrieving Banner:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


  async Blogslist(req, res) {
    try {

      const blogs = await Blogs_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 });
      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const blogsWithImageUrls = blogs.map(blog => {
        return {
          ...blog._doc, // Spread the original blog document
          image: blog.image ? `${baseUrl}/uploads/blogs/${blog.image}` : null // Append full image URL
        };
      });


      return res.status(200).json({
        status: true,
        message: "Blogs retrieved successfully",
        data: blogsWithImageUrls
      });
    } catch (error) {
      console.log("Error retrieving blogs:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


  async BlogslistwithPagination(req, res) {
    try {
      const { page = 1 } = req.query; // Default page is 1, and limit is 10
      let limit = 10;
      // Parse page and limit as integers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      // Ensure page and limit are valid
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          status: false,
          message: "Invalid page or limit value. Both must be positive integers.",
        });
      }

      // Get total count of blogs
      const totalBlogs = await Blogs_Modal.countDocuments({ del: false, status: true });

      // Fetch paginated blogs
      const blogs = await Blogs_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const blogsWithImageUrls = blogs.map(blog => {
        return {
          ...blog._doc, // Spread the original blog document
          image: blog.image ? `${baseUrl}/uploads/blogs/${blog.image}` : null, // Append full image URL
        };
      });

      return res.status(200).json({
        status: true,
        message: "Blogs retrieved successfully",
        data: blogsWithImageUrls,
        pagination: {
          totalBlogs,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalBlogs / pageSize),
          pageSize,
        },
      });
    } catch (error) {
      console.log("Error retrieving blogs:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async Newslist(req, res) {
    try {

      const news = await News_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 });
      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const newsWithImageUrls = news.map(newss => {
        return {
          ...newss._doc, // Spread the original bannerss document
          image: newss.image ? `${baseUrl}/uploads/news/${newss.image}` : null // Append full image URL
        };
      });

      return res.status(200).json({
        status: true,
        message: "News retrieved successfully",
        data: newsWithImageUrls
      });
    } catch (error) {
      console.log("Error retrieving news:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


  async NewslistwithPagination(req, res) {
    try {
      const { page = 1 } = req.query; // Default page is 1, and limit is 10
      let limit = 10;
      // Parse page and limit as integers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      // Ensure page and limit are valid
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          status: false,
          message: "Invalid page or limit value. Both must be positive integers.",
        });
      }

      // Get total count of news
      const totalNews = await News_Modal.countDocuments({ del: false, status: true });

      // Fetch paginated news
      const news = await News_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const newsWithImageUrls = news.map(newss => {
        return {
          ...newss._doc, // Spread the original news document
          image: newss.image ? `${baseUrl}/uploads/news/${newss.image}` : null, // Append full image URL
        };
      });

      return res.status(200).json({
        status: true,
        message: "News retrieved successfully",
        data: newsWithImageUrls,
        pagination: {
          totalNews,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalNews / pageSize),
          pageSize,
        },
      });
    } catch (error) {
      console.log("Error retrieving news:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async Plancategorysist(req, res) {
    try {

      const result = await Plancategory_Modal.find({ del: false, status: true });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async getPlansByPlancategoryId(req, res) {
    try {
      const pipeline = [
        // Match all plancategories
        {
          $match: {
            del: false,
            status: true,
          },
        },
        // Lookup to get associated plans
        {
          $lookup: {
            from: 'plans', // Collection name for plans
            let: { categoryId: '$_id' }, // Define a variable for the category ID
            pipeline: [
              // Match plans with specific category and additional filters
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$category', '$$categoryId'] }, // Match by category
                      { $eq: ['$status', 'active'] }, // Status must be 'active'
                      { $eq: ['$del', false] }, // del must be false
                    ],
                  },
                },
              },
              // Calculate price per month based on validity
              {
                $addFields: {
                  pricePerMonth: {
                    $cond: {
                      if: { $ne: ['$validity', null] }, // Check if validity is not null
                      then: {
                        $divide: [
                          '$price', // Total price
                          {
                            $switch: {
                              branches: [
                                { case: { $eq: ['$validity', '1 month'] }, then: 1 },
                                { case: { $eq: ['$validity', '3 months'] }, then: 3 },
                                { case: { $eq: ['$validity', '6 months'] }, then: 6 },
                                { case: { $eq: ['$validity', '9 months'] }, then: 9 },
                                { case: { $eq: ['$validity', '1 year'] }, then: 12 },
                                { case: { $eq: ['$validity', '2 years'] }, then: 24 },
                                { case: { $eq: ['$validity', '3 years'] }, then: 36 },
                                { case: { $eq: ['$validity', '4 years'] }, then: 48 },
                                { case: { $eq: ['$validity', '5 years'] }, then: 60 },
                              ],
                              default: 1, // Default to 1 month if validity doesn't match
                            },
                          },
                        ],
                      },
                      else: '$price', // If no validity is specified, fallback to the full price
                    },
                  },
                },
              },
              // Sort by pricePerMonth or validity for ascending order
              {
                $sort: { pricePerMonth: 1 }, // Sorting by price per month in ascending order
              },
              // Optionally project fields in the plans
              {
                $project: {
                  _id: 1, // Plan ID
                  title: 1, // Plan title
                  description: 1, // Plan description
                  price: 1, // Plan price
                  validity: 1, // Plan validity
                  pricePerMonth: 1, // Price per month
                },
              },
            ],
            as: 'plans', // Name of the array field to add
          },
        },
        // Lookup to get associated services
        {
          $lookup: {
            from: 'services', // Collection name for services
            let: { serviceIds: { $split: ['$service', ','] } }, // Split service string into array
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }],
                      },
                      { $eq: ['$status', true] }, // Status must be true
                      { $eq: ['$del', false] }, // del must be false
                    ],
                  },
                },
              },
              // Optionally project fields in the services
              {
                $project: {
                  _id: 1, // Service ID
                  title: 1, // Service title
                },
              },
            ],
            as: 'services', // Name of the array field to add
          },
        },
        // Project only the necessary fields
        {
          $project: {
            title: 1, // Plancategory title
            plans: {
              _id: 1, // Plan ID
              title: 1, // Plan title
              description: 1, // Plan description
              price: 1, // Plan price
              validity: 1, // Plan validity
              pricePerMonth: 1, // Price per month
            },
            services: {
              _id: 1, // Service ID
              title: 1, // Service title
            },
          },
        },
      ];
      const result = await Plancategory_Modal.aggregate(pipeline);

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result,
      });

    } catch (error) {
      console.log(error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async getallPlan(req, res) {
    try {
      const plans = await Plan_Modal.aggregate([
        {
          $match: { del: false, status: "active" }
        },
        {
          $lookup: {
            from: 'plancategories',
            let: { categoryId: { $toObjectId: '$category' } }, // Ensure category is cast to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$categoryId'] },
                      { $eq: ['$del', false] },
                      { $eq: ['$status', true] }
                    ]
                  }
                }
              }
            ],
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: false // Exclude plans with no matching category
          }
        },
        {
          $lookup: {
            from: 'services',
            let: { serviceIds: { $split: ['$category.service', ','] } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }],
                      },
                      { $eq: ['$status', true] },
                      { $eq: ['$del', false] }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1
                }
              }
            ],
            as: 'services'
          }
        },
        {
          $addFields: {
            validityValue: {
              $switch: {
                branches: [
                  { case: { $eq: ['$validity', '1 month'] }, then: 1 },
                  { case: { $eq: ['$validity', '3 months'] }, then: 3 },
                  { case: { $eq: ['$validity', '6 months'] }, then: 6 },
                  { case: { $eq: ['$validity', '9 months'] }, then: 9 },
                  { case: { $eq: ['$validity', '1 year'] }, then: 12 },
                  { case: { $eq: ['$validity', '2 years'] }, then: 24 },
                  { case: { $eq: ['$validity', '3 years'] }, then: 36 },
                  { case: { $eq: ['$validity', '4 years'] }, then: 48 },
                  { case: { $eq: ['$validity', '5 years'] }, then: 60 }
                ],
                default: 0
              }
            }
          }
        },
        {
          $sort: { validityValue: 1 }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            validity: 1,
            price: 1,
            category: 1,
            services: 1
          }
        }
      ]);


      return res.json({
        status: true,
        message: "Plans fetched successfully",
        data: plans
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  // Controller function to add a new plan subscription
  async addPlanSubscription(req, res) {
    try {
      const { plan_id, client_id, price, discount, orderid, coupon_code } = req.body;

      // Validate input
      if (!plan_id || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }

      // Fetch the plan and populate the category
      const plan = await Plan_Modal.findById(plan_id)
        .populate('category')
        .exec();

      if (!plan) {
        return res.status(404).json({ status: false, message: 'Plan not found' });
      }

      // Map plan validity to months
      const validityMapping = {
        '1 month': 1,
        '2 months': 2,
        '3 months': 3,
        '6 months': 6,
        '9 months': 9,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60
      };

      const monthsToAdd = validityMapping[plan.validity];
      if (monthsToAdd === undefined) {
        return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
      }

      const start = new Date();
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
      end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration

      // Split the services in the category if they exist
      const planservice = plan.category?.service;
      const planservices = planservice ? planservice.split(',') : [];
      // Loop through each service ID and update or add the plan
      for (const serviceId of planservices) {
        const existingPlan = await Planmanage.findOne({ clientid: client_id, serviceid: serviceId }).exec();

        if (existingPlan) {
          // If the plan exists and the end date is still valid, extend it
          if (existingPlan.enddate && existingPlan.enddate > new Date()) {
            existingPlan.enddate.setMonth(existingPlan.enddate.getMonth() + monthsToAdd);
          } else {
            existingPlan.enddate = end;  // Set new end date if it has expired
            existingPlan.startdate = start;
          }


          try {
            const savedPlan = await Planmanage.updateOne(
              { _id: existingPlan._id },  // Filter: find the document by its ID
              {
                $set: {
                  enddate: existingPlan.enddate,  // Set the new end date
                  startdate: existingPlan.startdate // Set the new start date
                }
              }  // Update fields
            );
            //  const savedPlan = await existingPlan.save();  
            console.log("Plan updated successfully:", savedPlan);
          } catch (error) {
            // console.error("Error saving updated plan:", error);
          }
        } else {

          ////////////////// 17/10/2024 ////////////////////////

          const today = new Date(); // Aaj ki date
          const existingPlans = await Planmanage.find({
            clientid: client_id,
            serviceid: serviceId,
            enddate: { $gt: today } // End date must be greater than today's date
          })
            .sort({ enddate: -1 }) // Sort by `enddate` in descending order
            .limit(1) // Get the top result
            .exec();

          if (existingPlans.length > 0) {
            const existingEndDate = existingPlans[0].enddate; // Get the enddate of the existing plan
            const newEndDate = end; // Assuming `end` is your new plan's end date

            // Check if the new end date is greater than the existing end date
            if (newEndDate > existingEndDate) {

              const differenceInTime = newEndDate.getTime() - existingEndDate.getTime(); // Difference in milliseconds
              const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days

              let differenceInMonths;

              // Logic to determine the number of months
              if (differenceInDays < 15) {
                differenceInMonths = 0; // Less than a month
              } else {
                // Calculate the difference in months
                differenceInMonths = differenceInDays / 30; // Convert days to months
              }

              // Round the months based on your requirement
              if (differenceInMonths % 1 >= 0.5) {
                monthsToAdd = Math.ceil(differenceInMonths); // Round up to the nearest whole number
              } else {
                monthsToAdd = Math.floor(differenceInMonths); // Round down to the nearest whole number
              }

            }
            else {
              monthsToAdd = 0;
            }
          }

          ////////////////// 17/10/2024 ////////////////////////

          const newPlanManage = new Planmanage({
            clientid: client_id,
            serviceid: serviceId,
            startdate: start,
            enddate: end,
          });

          try {
            await newPlanManage.save();  // Save the new plan
            console.log(`Added new record for service ID: ${serviceId}`);
          } catch (error) {
            // console.error("Error saving new plan:", error);
          }
        }

      }

      ////////////////// 17/10/2024 ////////////////////////
      const currentDate = new Date();
      const targetMonth = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`;

      let license = await License_Modal.findOne({ month: targetMonth }).exec();


      if (license) {
        license.noofclient += monthsToAdd;
        console.log('Month found, updating noofclient.', monthsToAdd);
      } else {
        license = new License_Modal({
          month: targetMonth,
          noofclient: monthsToAdd
        });
        console.log('Month not found, inserting new record.');
      }

      try {
        await license.save();
        console.log('License updated successfully.');
      } catch (error) {
        // console.error('Error updating license:', error);
      }


      ////////////////// 17/10/2024 ////////////////////////
      // Create a new plan subscription record
      const newSubscription = new PlanSubscription_Modal({
        plan_id,
        client_id,
        total: price,
        plan_price: plan.price,
        discount: discount,
        coupon: coupon_code,
        plan_start: start,
        plan_end: end,
        validity: plan.validity,
        orderid: orderid
      });

      // Save the subscription
      const savedSubscription = await newSubscription.save();



      if (coupon_code) {
        const resultc = await Coupon_Modal.findOne({
          del: false,
          status: true,
          code: coupon_code
        });


        if (resultc) {

          // Check if limitation is greater than 0 before decrementing
          if (resultc.limitation > 0) {
            const updatedResult = await Coupon_Modal.findByIdAndUpdate(
              resultc._id,
              { $inc: { limitation: -1 } }, // Decrease limitation by 1
              { new: true } // Return the updated document
            );
          }

        }
      }

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });


      if (!client) {
        return console.log('Client not found or inactive.');
      }


      if (client.freetrial == 0) {
        client.freetrial = 1;
        await client.save();
      }

      const settings = await BasicSetting_Modal.findOne();

      const refertokens = await Refer_Modal.find({ user_id: client._id, status: 0 });

      if (client.refer_status && client.token) {
        if (refertokens.length > 0) {
        }
        else {

          const senderamount = (price * settings.sender_earn) / 100;
          const receiveramount = (price * settings.receiver_earn) / 100;

          const results = new Refer_Modal({
            token: client.token,
            user_id: client._id,
            senderearn: settings.sender_earn,
            receiverearn: settings.receiver_earn,
            senderamount: senderamount,
            receiveramount: receiveramount,
            status: 1
          })
          await results.save();

          client.wamount += receiveramount;
          await client.save();
          const sender = await Clients_Modal.findOne({ refer_token: client.token, del: 0, ActiveStatus: 1 });

          if (sender) {
            sender.wamount += senderamount;
            await sender.save();
          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }

        }

      }

      if (refertokens.length > 0) {
        for (const refertoken of refertokens) {
          const senderamount = (price * refertoken.senderearn) / 100;
          const receiveramount = (price * refertoken.receiverearn) / 100;

          refertoken.senderamount = senderamount;
          refertoken.receiveramount = receiveramount;
          refertoken.status = 1;

          await refertoken.save();

          // Update client's wallet amount
          client.wamount += receiveramount;
          await client.save();

          // Update sender's wallet amount
          const sender = await Clients_Modal.findOne({ refer_token: refertoken.token, del: 0, ActiveStatus: 1 });

          if (sender) {
            sender.wamount += senderamount;
            await sender.save();
          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }
        }
      } else {
        console.log('No referral tokens found.');
      }

      const adminnotificationTitle = "Important Update";
      const adminnotificationBody = `Congratulations! ${client.FullName} successfully purchased the ${plan.category.title} Plan`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        segmentid: savedSubscription._id,
        type: 'plan purchase',
        title: adminnotificationTitle,
        message: adminnotificationBody
      });


      await resultnm.save();

      if (plan.deliverystatus == true) {
        client.deliverystatus = true;
        await client.save();
      }

      if (settings.invoicestatus == 1) {
        const length = 6;
        const digits = '0123456789';
        let orderNumber = '';

        for (let i = 0; i < length; i++) {
          orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
        }


        let payment_type;
        if (orderid) {
          payment_type = "Online";
        }
        else {
          payment_type = "Offline";

        }

        const templatePath = path.join(__dirname, '../../../template', 'invoice.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `INV-${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(savedSubscription.created_at))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{validity}}/g, savedSubscription.validity)
          .replace(/{{plan_end}}/g, formatDate(savedSubscription.plan_end))
          .replace(/{{plan_price}}/g, savedSubscription.plan_price)
          .replace(/{{total}}/g, savedSubscription.total)
          .replace(/{{discount}}/g, savedSubscription.discount)
          .replace(/{{orderid}}/g, savedSubscription.orderid)
          .replace(/{{planname}}/g, plan.category.title)
          .replace(/{{plantype}}/g, "Plan")
          .replace(/{{plan_start}}/g, formatDate(savedSubscription.plan_start));


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `INV-${orderNumber}.pdf`);

        // Generate PDF and save to the specified path
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '10mm',
            bottom: '50mm',
            left: '10mm',
          },
        });

        await browser.close();

        savedSubscription.ordernumber = `INV-${orderNumber}`;
        savedSubscription.invoice = `INV-${orderNumber}.pdf`;
        const updatedSubscription = await savedSubscription.save();


        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }

        const templatePaths = path.join(__dirname, '../../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

          // Replace placeholders with actual values
          const finalHtml = htmlTemplate
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);

          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [
              {
                filename: `INV-${orderNumber}.pdf`, // PDF file name
                path: pdfPath, // Path to the PDF file
              }
            ]
          };

          // Send email
          await sendEmail(mailOptions);
        });

      }
      // Return success response
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
        data: savedSubscription,
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }

  // Controller function to add a new plan subscription
  async addBasketSubscription(req, res) {
    try {
      const { basket_id, client_id, price, discount, orderid, coupon } = req.body;

      // Validate input
      if (!basket_id || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return console.log('Client not found or inactive.');
      }


      const basket = await Basket_Modal.findOne({
        _id: basket_id,
        del: false
      });

      const settings = await BasicSetting_Modal.findOne();

      // Map plan validity to months
      const validityMapping = {
        '1 month': 1,
        '2 months': 2,
        '3 months': 3,
        '6 months': 6,
        '9 months': 9,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60,
      };

      const monthsToAdd = validityMapping[basket.validity];
      if (monthsToAdd === undefined) {
        return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
      }

      const start = new Date();
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
      end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration

      // Create a new subscription
      const newSubscription = new BasketSubscription_Modal({
        basket_id,
        client_id,
        total: price,
        plan_price: basket.basket_price,
        discount: discount,
        coupon: coupon,
        startdate: start,
        enddate: end,
        validity: basket.validity,
        orderid: orderid
      });

      // Save to the database
      const savedSubscription = await newSubscription.save();

      if (settings.invoicestatus == 1) {

        const length = 6;
        const digits = '0123456789';
        let orderNumber = '';

        for (let i = 0; i < length; i++) {
          orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
        }


        let payment_type;
        if (orderid) {
          payment_type = "Online";
        }
        else {
          payment_type = "Offline";

        }

        const templatePath = path.join(__dirname, '../../../template', 'invoice.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `INV-${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(savedSubscription.created_at))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{validity}}/g, savedSubscription.validity)
          .replace(/{{plan_end}}/g, formatDate(savedSubscription.enddate))
          .replace(/{{plan_price}}/g, savedSubscription.plan_price)
          .replace(/{{total}}/g, savedSubscription.total)
          .replace(/{{discount}}/g, savedSubscription.discount)
          .replace(/{{orderid}}/g, savedSubscription.orderid)
          .replace(/{{planname}}/g, basket.title)
          .replace(/{{plantype}}/g, "Basket")
          .replace(/{{plan_start}}/g, formatDate(savedSubscription.startdate));


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `INV-${orderNumber}.pdf`);

        // Generate PDF and save to the specified path
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '10mm',
            bottom: '50mm',
            left: '10mm',
          },
        });

        await browser.close();

        savedSubscription.ordernumber = `INV-${orderNumber}`;
        savedSubscription.invoice = `INV-${orderNumber}.pdf`;
        const updatedSubscription = await savedSubscription.save();


        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }



        const templatePaths = path.join(__dirname, '../../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

          // Replace placeholders with actual values
          const finalHtml = htmlTemplate
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);

          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [
              {
                filename: `INV-${orderNumber}.pdf`, // PDF file name
                path: pdfPath, // Path to the PDF file
              }
            ]
          };

          // Send email
          await sendEmail(mailOptions);
        });

      }
      // Respond with the created subscription
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
        data: savedSubscription
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }

  async myBasketPlan(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ status: false, message: 'Client ID is required' });
      }

      const result = await BasketSubscription_Modal.aggregate([
        {
          $match: {
            del: false,
            client_id: new mongoose.Types.ObjectId(id) // Ensure id is converted to ObjectId
          }
        },
        {
          $lookup: {
            from: 'baskets', // Replace with the actual collection name
            localField: 'basket_id', // Field in BasketSubscription_Modal
            foreignField: '_id', // Field in Basket
            as: 'basketDetails' // Resulting field name
          }
        },
        {
          $unwind: '$basketDetails' // Flatten the structure
        },
        {
          $project: {
            _id: 1, // Include the _id of BasketSubscription_Modal
            basket_id: 1,
            client_id: 1,
            plan_price: 1,
            total: 1,
            orderid: 1,
            coupon: 1,
            startdate: 1,
            enddate: 1,
            validity: 1,
            'basketDetails.title': 1,
            'basketDetails.description': 1,
            'basketDetails.mininvamount': 1
          }
        }
      ]);



      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async myPlan(req, res) {
    try {
      const { id } = req.params;


      // Validate input
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
          $unwind: '$planDetails' // Unwind to get a flat structure for planDetails
        },
        {
          $lookup: {
            from: 'plancategories', // The name of the plan categories collection
            localField: 'planDetails.category', // Assuming planDetails has a field called category
            foreignField: '_id', // The field in the planCategories collection
            as: 'categoryDetails' // The name of the field for category data
          }
        },
        {
          $unwind: '$categoryDetails' // Unwind to get a flat structure for categoryDetails
        },
        {
          $lookup: {
            from: 'services', // Collection name for services
            let: { serviceIds: { $split: ['$categoryDetails.service', ','] } }, // Split service string into array
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }],
                      },
                      { $eq: ['$status', true] }, // Match only active services
                      { $eq: ['$del', false] }, // Match only non-deleted services
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1, // Service ID
                  title: 1, // Service title
                },
              },
            ],
            as: 'serviceDetails' // Name of the new array field to hold the services
          }
        },
        {
          $unwind: {
            path: '$serviceDetails', // Unwind to get a flat structure for serviceDetails
            preserveNullAndEmptyArrays: true // Optionally preserve empty arrays if there are no services
          }
        },
        // Grouping to aggregate service titles into an array
        {
          $group: {
            _id: '$_id', // Group by the PlanSubscription's ID
            plan_id: { $first: '$plan_id' }, // Keep the original plan_id
            plan_price: { $first: '$plan_price' }, // Keep the plan_price
            total: { $first: '$total' }, // Keep the total
            discount: { $first: '$discount' },
            coupon: { $first: '$coupon' }, // Keep the discount
            plan_start: { $first: '$plan_start' }, // Keep the plan_start
            plan_end: { $first: '$plan_end' },
            created_at: { $first: '$created_at' },
            orderid: { $first: '$orderid' }, // Keep the plan_end
            planDetails: { $first: '$planDetails' }, // First instance of planDetails
            categoryDetails: { $first: '$categoryDetails' }, // First instance of categoryDetails
            serviceNames: { $push: '$serviceDetails.title' }
          }
        },

        {
          $sort: {
            created_at: -1
          }
        },

        {
          $project: {
            _id: 1, // Plan Subscription ID
            plan_id: 1, // Original plan_id
            plan_price: 1, // Plan price
            total: 1, // Total
            discount: 1,
            coupon: 1,
            plan_start: 1, // Plan start date
            plan_end: 1,
            orderid: 1,
            created_at: 1, // Plan end date
            planDetails: 1, // Details from the plans collection
            categoryDetails: 1, // Details from the plan categories collection
            serviceNames: 1, // All service titles
            categoryDetails: {
              title: 1 // Include only the title from the category details
            },
          }
        }
      ]);



      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }



  async Couponlist(req, res) {
    try {



      const { } = req.body;

      //const result = await Coupon_Modal.find()

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const result = await Coupon_Modal.find({
        del: false,
        status: true,
        showstatus: 1,
        startdate: { $lte: endOfToday },
        enddate: { $gte: startOfToday }
      });

      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      const resultWithImageUrls = result.map(results => {

        let serviceName = '';
        if (results.service == "66d2c3bebf7e6dc53ed07626") {
          serviceName = "Cash";
        } else if (results.service == "66dfeef84a88602fbbca9b79") {
          serviceName = "Option";
        } else if (results.service == "66dfede64a88602fbbca9b72") {
          serviceName = "Future";
        }
        else {
          serviceName = "All";
        }

        return {
          ...results._doc, // Spread the original bannerss document
          image: results.image ? `${baseUrl}/uploads/coupon/${results.image}` : null,
          serviceName: serviceName
        };
      });

      return res.json({
        status: true,
        message: "get",
        data: resultWithImageUrls
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async Signallist(req, res) {
    try {

      const { } = req.body;

      //const result = await Coupon_Modal.find()

      const result = await Signal_Modal.find({ del: 0 });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async applyCoupon(req, res) {


    try {
      const { code, purchaseValue, planid } = req.body;
      // Find the coupon by code
      const coupon = await Coupon_Modal.findOne({ code, status: 'true', del: false });
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found or is inactive' });
      }




      // Check if the coupon is within the valid date range
      const currentDate = new Date();
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Strip time
      const startDateOnly = new Date(coupon.startdate.getFullYear(), coupon.startdate.getMonth(), coupon.startdate.getDate());
      const endDateOnly = new Date(coupon.enddate.getFullYear(), coupon.enddate.getMonth(), coupon.enddate.getDate());

      if (currentDateOnly < startDateOnly || currentDateOnly > endDateOnly) {
        return res.status(400).json({ status: false, message: 'Coupon is not valid at this time' });
      }


      // Check if the purchase meets the minimum purchase value requirement
      if (purchaseValue < coupon.minpurchasevalue) {
        return res.status(400).json({ status: false, message: `Minimum purchase value required is ${coupon.minpurchasevalue}` });
      }
      // Calculate the discount based on the coupon type
      let discount = 0;
      if (coupon.type === 'fixed') {
        discount = coupon.value;
      } else if (coupon.type === 'percentage') {
        discount = (coupon.value / 100) * purchaseValue;
      }

      if (discount > purchaseValue) {
        return res.status(400).json({ status: false, message: "Discount should be less than the purchase value." });
      }


      if (coupon.limitation <= 0) {
        return res.status(400).json({ status: false, message: 'Coupon usage limit has been reached' });
      }
      if (coupon.service && coupon.service != 0) {
        const plan = await Plan_Modal.findById(planid)
          .populate('category')
          .exec();
        if (coupon.service != plan.category?.service) {

          return res.status(404).json({ status: false, message: 'Service Does not match' });
        }
      }

      // Ensure the discount does not exceed the minimum coupon value

      if (coupon.mincouponvalue) {
        if (discount > coupon.mincouponvalue) {
          discount = coupon.mincouponvalue;
        }
      }

      // Calculate the final price after applying the discount
      const finalPrice = purchaseValue - discount;

      return res.status(200).json({
        status: true,
        message: 'Coupon applied successfully',
        originalPrice: purchaseValue,
        discount,
        finalPrice
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
  }


  async showSignalsToClients(req, res) {
    try {
      const { service_id, client_id, search, page = 1 } = req.body;
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



      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      const startDates = plans.map(plan => new Date(plan.startdate));
      const endDates = plans.map(plan => new Date(plan.enddate));

      // const query = {
      //   service: service_id,
      //   close_status: false,
      //   created_at: {
      //     $gte: startDates[0], // Assuming all plans have the same startdate
      //     $lte: endDates[0] // Assuming all plans have the same enddate
      //   }
      // };


      const query = {
        service: service_id,
        close_status: false,
      };

      // Check if deliverystatus is true
      if (client.deliverystatus === true) {
        query.created_at = {
          $lte: endDates[0], // Only keep the end date condition
        };
      } else {
        query.created_at = {
          $gte: startDates[0], // Include both start and end date conditions
          $lte: endDates[0],
        };
      }

      // const signals = await Signal_Modal.find(query);

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



      // const signals = await Signal_Modal.find(query).lean(); // Use lean() to return plain JavaScript objects
      const signals = await Signal_Modal.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitValue)
        .lean();
      /*
         const signalsWithReportUrls = signals.map(signal => {
      
          return {
              ...signal,
              report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null 
          };
      });
      */


      const totalSignals = await Signal_Modal.countDocuments(query);

      const signalsWithReportUrls = await Promise.all(signals.map(async (signal) => {
        // Check if the signal was bought by the client
        const order = await Order_Modal.findOne({
          clientid: client_id,
          signalid: signal._id
        }).lean();


        /*
        
        let lot = 0;
        let tradesymbol ="";
        if(signal.segment != "C")
        {
          if(signal.segment == "F")
            {
          const lots = await Stock_Modal.findOne({
            segment: signal.segment,
            expiry: signal.expirydate,
            symbol: signal.stock
          });
          lot = lots.lotsize;
          tradesymbol = lots.tradesymbol;
        }
        else
        {
          const query = Stock_Modal.findOne({
            segment: signal.segment,
            expiry: signal.expirydate,
            symbol: signal.stock,
            strike: signal.strikeprice,
           
          });
          
          const lots = await query.exec();
          lot = lots.lotsize;
          tradesymbol = lots.tradesymbol;
        }
        }
        */



        return {
          ...signal,
          report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Append full report URL
          purchased: order ? true : false,

          //  lot: lot,
          //  tradesymbol: tradesymbol,
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
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async showSignalsToClientsCloses(req, res) {
    try {

      const { service_id, client_id, search, page = 1 } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitValue = parseInt(limit);


      const plans = await Planmanage.find({ serviceid: service_id, clientid: client_id });
      if (plans.length === 0) {
        return res.json({
          status: false,
          message: "No plans found for the given service and client IDs",
          data: []
        });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      const startDates = plans.map(plan => new Date(plan.startdate));
      const endDates = plans.map(plan => new Date(plan.enddate));

      // const query = {
      //   service: service_id,
      //   close_status: true,
      //   created_at: {
      //     $gte: startDates[0], // Assuming all plans have the same startdate
      //     $lte: endDates[0] // Assuming all plans have the same enddate
      //   }
      // };




      const query = {
        service: service_id,
        close_status: true,
        closedate: {
          $gte: startDates[0],
        }
      };

      // Check if deliverystatus is true
      if (client.deliverystatus === true) {
        query.created_at = {
          $lte: endDates[0], // Only keep the end date condition
        };
      } else {
        query.created_at = {
          $gte: startDates[0], // Include both start and end date conditions
          $lte: endDates[0],
        };
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



      // const signals = await Signal_Modal.find(query).lean(); // Use lean() to return plain JavaScript objects
      const signals = await Signal_Modal.find(query)
        .sort({ closedate: -1 })
        .skip(skip)
        .limit(limitValue)
        .lean();
      /*
       const signalsWithReportUrls = signals.map(signal => {
      
        return {
            ...signal,
            report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null 
        };
      });
      */

      const totalSignals = await Signal_Modal.countDocuments(query);


      const signalsWithReportUrls = await Promise.all(signals.map(async (signal) => {
        // Check if the signal was bought by the client
        const order = await Order_Modal.findOne({
          clientid: client_id,
          signalid: signal._id
        }).lean();



        /*
        
        let lot = 0;
        let tradesymbol ="";
        if(signal.segment != "C")
        {
        if(signal.segment == "F")
          {
        const lots = await Stock_Modal.findOne({
          segment: signal.segment,
          expiry: signal.expirydate,
          symbol: signal.stock
        });
        lot = lots.lotsize;
        tradesymbol = lots.tradesymbol;
        }
        else
        {
        const query = Stock_Modal.findOne({
          segment: signal.segment,
          expiry: signal.expirydate,
          symbol: signal.stock,
          strike: signal.strikeprice,
         
        });
        
        const lots = await query.exec();
        lot = lots.lotsize;
        tradesymbol = lots.tradesymbol;
        }
        }
        */

        const orders = await Order_Modal.find({
          clientid: client_id,
          signalid: signal._id
        }).lean();  // .lean() to return plain JavaScript objects

        // Sum the quantity field from the orders
        const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);
        return {
          ...signal,
          report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Append full report URL
          purchased: order ? true : false,
          //  lot: lot,
          //  tradesymbol: tradesymbol,
          order_quantity: totalQuantity ? totalQuantity : 0
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
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }






  async showSignalsToClientsClose(req, res) {
    try {
      const { service_id, client_id } = req.body;

      // Fetch the plan that matches the serviceId and clientId
      const plans = await Planmanage.find({ serviceid: service_id, clientid: client_id });

      if (plans.length === 0) {
        return res.json({
          status: false,
          message: "No plans found for the given service and client IDs",
          data: []
        });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      // Get the start and end dates from the plans
      const startDates = plans.map(plan => new Date(plan.startdate));
      const endDates = plans.map(plan => new Date(plan.enddate));

      // const query = {
      //   service: service_id,
      //   close_status: true,
      //   created_at: {
      //     $gte: startDates[0], // Assuming all plans have the same startdate
      //     $lte: endDates[0] // Assuming all plans have the same enddate
      //   }
      // };


      const query = {
        service: service_id,
        close_status: true,
        closedate: {
          $gte: startDates[0],
        }
      };

      // Check if deliverystatus is true
      if (client.deliverystatus === true) {
        query.created_at = {
          $lte: endDates[0], // Only keep the end date condition
        };
      } else {
        query.created_at = {
          $gte: startDates[0], // Include both start and end date conditions
          $lte: endDates[0],
        };
      }



      // Print the query to the console

      // Fetch signals where createdAt is between the plan's start and end dates
      const signals = await Signal_Modal.find(query);

      return res.json({
        status: true,
        message: "Signals retrieved successfully",
        data: signals,
        pagination: {
          total: totalSignals,
          page: parseInt(page), // Current page
          limit: parseInt(limit), // Items per page
          totalPages: Math.ceil(totalSignals / limit), // Total number of pages
        }
      });

    } catch (error) {
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async CloseSignal(req, res) {
    try {
      const { service_id, search, page = 1 } = req.body;

      const limit = 15;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitValue = parseInt(limit);


      const query = {
        service: service_id,
        close_status: true,
        closeprice: { $ne: 0 }
      };

      if (search && search.trim() !== '') {
        query.$or = [
          { tradesymbol: { $regex: search, $options: 'i' } },
          { calltype: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
          { closeprice: { $regex: search, $options: 'i' } }
        ];
      }

      // Fetch signals and sort by createdAt in descending order
      const signals = await Signal_Modal.find(query).sort({ created_at: -1 })
        .skip(skip)
        .limit(limitValue)
        .lean();




      const protocol = req.protocol; // Will be 'http' or 'https'

      const baseUrl = `${protocol}://${req.headers.host}`; // Construct the base URL

      const signalsWithReportUrls = signals.map(signal => {

        return {
          ...signal,
          report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null
        };
      });

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
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async Servicelist(req, res) {
    try {

      const service = await Service_Modal.find({ del: false, status: true });


      return res.status(200).json({
        status: true,
        message: "Service retrieved successfully",
        data: service
      });
    } catch (error) {
      console.log("Error retrieving Service:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  async Faqlist(req, res) {
    try {

      const faq = await Faq_Modal.find({ del: false, status: true });


      return res.status(200).json({
        status: true,
        message: "Faq retrieved successfully",
        data: faq
      });
    } catch (error) {
      console.log("Error retrieving Faq:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }
  async detailContent(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Content ID is required"
        });
      }

      const Content = await Content_Modal.findById(id);

      if (!Content) {
        return res.status(404).json({
          status: false,
          message: "Content not found"
        });
      }

      return res.json({
        status: true,
        message: "Content details fetched successfully",
        data: Content
      });

    } catch (error) {
      console.log("Error fetching Content details:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async BasketLists(req, res) {
    try {

      const baskets = await Basket_Modal.find({ del: false, status: true });

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      // Update each basket's image path
      baskets.forEach(basket => {
          if (basket.image) {
              basket.image = `${baseUrl}/uploads/basket/${basket.image}`;
          }
      });


      return res.json({
        status: true,
        message: "Baskets fetched successfully",
        data: baskets
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async BasketListss(req, res) {
    try {
      const { clientid } = req.body; // assuming clientid is passed in the request

      // Get the current date
      const currentDate = new Date();

      const clientObjectId = new mongoose.Types.ObjectId(clientid);


      const result = await Basket_Modal.aggregate([
        {
          $lookup: {
            from: 'basketsubscriptions',
            localField: '_id',
            foreignField: 'basket_id',
            as: 'subscription_info'
          }
        },
        {
          $addFields: {
            filteredSubscriptions: {
              $ifNull: [
                {
                  $filter: {
                    input: '$subscription_info',
                    as: 'sub',
                    cond: { $eq: ['$$sub.client_id', clientObjectId] }
                  }
                },
                []
              ]
            }
          }
        },
        {
          $addFields: {
            latestSubscription: {
              $arrayElemAt: [
                {
                  $sortArray: {
                    input: '$filteredSubscriptions',
                    sortBy: { enddate: -1 }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            isSubscribed: {
              $cond: {
                if: { $gt: [{ $size: '$filteredSubscriptions' }, 0] },
                then: true,
                else: false
              }
            },
            isActive: {
              $cond: {
                if: {
                  $and: [
                    { $gt: [{ $size: '$filteredSubscriptions' }, 0] },
                    { $gte: [currentDate, '$latestSubscription.startdate'] },
                    { $lte: [currentDate, '$latestSubscription.enddate'] }
                  ]
                },
                then: true,
                else: false
              }
            },
            startdate: '$latestSubscription.startdate',
            enddate: '$latestSubscription.enddate'
          }
        },
        {
          $match: {
            del: false,
            status: true,
            $or: [
              { publishstatus: true },
              { $and: [{ publishstatus: false }, { isSubscribed: true }] }
            ]
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
              }
            ],
            as: "stock_details"
          }
        },
        {
          $project: {
            basket_id: 1,
            title: 1,
            description: 1,
            full_price: 1,
            basket_price: 1,
            mininvamount: 1,
            accuracy: 1,
            portfolioweightage: 1,
            cagr: 1,
            cagr_live: 1,
            frequency: 1,
            validity: 1,
            next_rebalance_date: 1,
            status: 1,
            del: 1,
            created_at: 1,
            updated_at: 1,
            type: 1,
            themename: 1,
            image: 1,
            short_description: 1,
            rationale: 1,
            methodology: 1,
            isSubscribed: 1,
            isActive: 1,
            startdate: 1,
            enddate: 1,
            stock_details: {
              $filter: {
                input: "$stock_details", // Filter the joined stock details
                as: "stock",
                cond: { $eq: ["$$stock.del", false] } // Exclude deleted stocks
              }
            },
          }
        }
      ]);




      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      result.forEach(basket => {
          if (basket.image) {
              basket.image = `${baseUrl}/uploads/basket/${basket.image}`;
          }
      });

      res.status(200).json({
        status: true,
        message: "Baskets retrieved successfully.",
        data: result
      });
    } catch (error) {
      // console.error("Error retrieving baskets:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while retrieving the baskets."
      });
    }
  }


  async BasketstockList(req, res) {
    try {
      const { id } = req.params;

      // Step 1: Get the latest version for the given basket_id
      const latestVersion = await Basketstock_Modal.findOne({
        basket_id: id,
        del: false,
        status: 1
      })
        .sort({ version: -1 }) // Sort by version in descending order
        .select("version"); // Fetch only the version field

      // Step 2: Fetch basket stock data for the latest version
      let basketstock = [];
      if (latestVersion) {
        basketstock = await Basketstock_Modal.find({
          basket_id: id,
          del: false,
          status: 1,
          version: latestVersion.version // Filter by the latest version
        }).lean(); // Use .lean() for plain objects to allow adding custom fields
      }

      // Step 3: Add instrument_token to each basket stock
      if (basketstock.length > 0) {
        basketstock = await Promise.all(
          basketstock.map(async (stock) => {
            const stockDetails = await Stock_Modal.findOne({
              tradesymbol: stock.tradesymbol // Match tradesymbol in the stocks collection
            }).select("instrument_token"); // Fetch only the instrument_token field

            return {
              ...stock, // Spread existing stock fields
              instrument_token: stockDetails ? stockDetails.instrument_token : null // Add instrument_token
            };
          })
        );
      }

      // Step 3: Return the response
      return res.json({
        status: true,
        message: "Basket Stock fetched successfully",
        data: basketstock
      });
    } catch (error) {
      // Handle errors
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async MyPorfolio(req, res) {
    try {
      const { id, clientid } = req.params; // Extract basket_id and client_id from request parameters


      const result = await Basketorder_Modal.aggregate([
        {
          $match: {
            basket_id: id, // Filter by basket_id
            clientid: clientid,
            ordertype: "BUY" // Filter by client_id
          }
        },
        {
          $group: {
            _id: null, // Single group since we are already filtering by basket_id and client_id
            maxVersion: { $max: "$version" } // Determine the highest version
          }
        },
        {
          $lookup: {
            from: "basketordermodels", // Collection name
            localField: "maxVersion", // The max version determined earlier
            foreignField: "version", // Match version field in the collection
            as: "latestOrders"
          }
        },
        { $unwind: "$latestOrders" },
        {
          $match: {
            "latestOrders.basket_id": id,
            "latestOrders.clientid": clientid
          }
        },
        {
          $group: {
            _id: "$latestOrders.tradesymbol", // Group by tradesymbol
            totalQuantity: { $sum: "$latestOrders.quantity" }, // Sum the quantity
            basket_id: { $first: "$latestOrders.basket_id" }, // Get the basket_id
            clientid: { $first: "$latestOrders.clientid" }, // Get the client_id
            ordertype: { $first: "$latestOrders.ordertype" }, // Get the ordertype (example)
            price: { $first: "$latestOrders.price" }, // Get the price (example)
            ordertoken: { $first: "$latestOrders.ordertoken" }, // Get the ordertype (example)
            borkerid: { $first: "$latestOrders.borkerid" }, // Get the ordertype (example)
            exchange: { $first: "$latestOrders.exchange" },
            version: { $first: "$latestOrders.version" }, // Get the ordertype (example)
            createdAt: { $first: "$latestOrders.createdAt" }, // Get createdAt timestamp
            updatedAt: { $first: "$latestOrders.updatedAt" } // Get updatedAt timestamp
          }
        },
        // Project the final fields for response
        {
          $project: {
            _id: 0, // We don’t need the _id from the group stage
            tradesymbol: "$_id", // Rename _id to tradesymbol
            totalQuantity: 1,
            basket_id: 1,
            clientid: 1,
            borkerid: 1,
            ordertype: 1,
            price: 1,
            ordertoken: 1,
            exchange: 1,
            version: 1,
            createdAt: 1,
            updatedAt: 1

          }
        }
      ]);

      return res.json({
        status: true,
        message: "Basket Stock fetched successfully",
        data: result, // Return the aggregated result
      });
    } catch (error) {
      // console.error("Error fetching basket stock:", error);

      // Handle any server errors gracefully
      return res.json({
        status: false,
        message: "Server error",
        data: [],
      });
    }
  }



  async BasketstockLists(req, res) {
    try {
      const { id, clientid } = req.params; // Extract basket_id and client_id from request parameters

      // Convert clientid to ObjectId for database query
      const clientObjectId = new mongoose.Types.ObjectId(clientid);

      // Fetch the latest subscription for the given basket_id and client_id
      const subscription = await BasketSubscription_Modal.findOne({
        basket_id: id,
        client_id: clientObjectId,
      }).sort({ created_at: -1 });

      // Check if subscription exists
      if (!subscription) {
        return res.json({
          status: false,
          message: "No subscription found for the given basket and client.",
          data: [],
        });
      }

      // Extract the subscription's end date
      const latestEndDate = subscription.enddate;

      // Fetch the latest version of basket stocks and perform aggregations
      const latestVersionStock = await Basketstock_Modal.aggregate([
        {
          $match: {
            basket_id: id,
            del: false,
            status: 1,
            created_at: { $lt: latestEndDate }, // Filter stocks created before the subscription end date
          },
        },
        {
          $lookup: {
            from: "basketordermodels", // Collection name for orders
            let: {
              stock_tradesymbol: "$tradesymbol",
              stock_basket_id: "$basket_id",
              stock_version: "$version",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$tradesymbol", "$$stock_tradesymbol"] }, // Match tradesymbol
                      { $eq: ["$basket_id", "$$stock_basket_id"] }, // Match basket_id
                      { $eq: ["$version", "$$stock_version"] }, // Match version
                      { $eq: ["$clientid", clientid] }, // Match clientid
                    ],
                  },
                },
              },
            ],
            as: "order_details", // Add order details to the result
          },
        },
        {
          $lookup: {
            from: "stocks", // Collection name for stock details
            localField: "tradesymbol", // Field in Basketstock_Modal to match
            foreignField: "tradesymbol", // Field in stocks collection to match
            as: "stock_details", // Add stock details to the result
          },
        },
        {
          $addFields: {
            // Extract instrument_token from stock details (first match only)
            instrument_token: {
              $arrayElemAt: ["$stock_details.instrument_token", 0],
            },
          },
        },
        {
          $project: {
            // Include required fields in the final result
            _id: 1,
            basket_id: 1,
            name: 1,
            tradesymbol: 1,
            price: 1,
            weightage: 1,
            total_value: 1,
            quantity: 1,
            comment: 1,
            version: 1,
            del: 1,
            created_at: 1,
            status: 1,
            instrument_token: 1, // Include extracted instrument_token
            order_details: 1, // Keep order details as a nested array
          },
        },
      ]);

      // Return the fetched data as a response
      return res.json({
        status: true,
        message: "Basket Stock fetched successfully",
        data: latestVersionStock,
      });
    } catch (error) {
      // console.error("Error fetching basket stock:", error);

      // Handle any server errors gracefully
      return res.json({
        status: false,
        message: "Server error",
        data: [],
      });
    }
  }


  async BasketstockListBalance(req, res) {
    try {
      const { id, clientid } = req.params; // Extract basket_id and client_id from request parameters

      // Convert clientid to ObjectId for database query if necessary
      const clientObjectId = new mongoose.Types.ObjectId(clientid);

      // Fetch the latest subscription for the given basket_id and client_id
      const subscription = await BasketSubscription_Modal.findOne({
        basket_id: id,
        client_id: clientObjectId,
      }).sort({ created_at: -1 });

      // Check if subscription exists
      if (!subscription) {
        return res.json({
          status: false,
          message: "No subscription found for the given basket and client.",
          data: [],
        });
      }

      // Extract the subscription's end date
      const latestEndDate = subscription.enddate;


      const versions = await Basketstock_Modal.aggregate([
        {
          $match: {
            basket_id: id,
            del: false,
            status: 1,
            created_at: { $lt: latestEndDate }, // Filter stocks created before the subscription end date
          },
        },
        {
          $group: {
            _id: null,
            versions: { $addToSet: "$version" },
          },
        },
        {
          $project: {
            _id: 0,
            sortedVersions: {
              $sortArray: { input: "$versions", sortBy: -1 },
            },
          },
        },
      ]);


      const lastTwoVersions = versions[0]?.sortedVersions?.slice(0, 2) || [];


      const latestVersionStock = await Basketstock_Modal.aggregate([
        {
          $match: {
            basket_id: id,
            del: false,
            status: 1,
            created_at: { $lt: latestEndDate },
            version: { $in: lastTwoVersions },

          },
        },
        {
          $lookup: {
            from: "basketordermodels", // Collection name for orders
            let: {
              stock_tradesymbol: "$tradesymbol",
              stock_basket_id: "$basket_id",
              stock_version: "$version",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$tradesymbol", "$$stock_tradesymbol"] }, // Match tradesymbol
                      { $eq: ["$basket_id", "$$stock_basket_id"] }, // Match basket_id
                      { $eq: ["$version", "$$stock_version"] }, // Match version
                      { $eq: ["$clientid", clientid] }, // Match clientid
                    ],
                  },
                },
              },
            ],
            as: "order_details", // Add order details to the result
          },
        },
        {
          $lookup: {
            from: "stocks", // Collection name for stock details
            localField: "tradesymbol", // Field in Basketstock_Modal to match
            foreignField: "tradesymbol", // Field in stocks collection to match
            as: "stock_details", // Add stock details to the result
          },
        },
        {
          $addFields: {
            // Extract instrument_token from stock details (first match only)
            instrument_token: {
              $arrayElemAt: ["$stock_details.instrument_token", 0],
            },
          },
        },
        {
          $project: {
            // Include required fields in the final result
            _id: 1,
            basket_id: 1,
            name: 1,
            tradesymbol: 1,
            price: 1,
            weightage: 1,
            total_value: 1,
            quantity: 1,
            comment: 1,
            version: 1,
            del: 1,
            created_at: 1,
            status: 1,
            instrument_token: 1, // Include extracted instrument_token
            order_details: 1, // Keep order details as a nested array
          },
        },
      ]);

      return res.json({
        status: true,
        message: "Basket Stock fetched successfully",
        data: latestVersionStock,
      });



    } catch (error) {
      // console.error("Error fetching basket stock:", error);

      // Handle any server errors gracefully
      return res.json({
        status: false,
        message: "Server error",
        data: [],
      });
    }
  }

  async getBasketVersionOrder(req, res) {
    try {
      // Extract basket_id, clientid, and version from request body
      const { basket_id, clientid, version } = req.body; // Fix typo: use req.body instead of req.bady
      console.log("req.body", req.body);
      // Perform aggregation to fetch orders from BasketOrderModel
      const orders = await Basketorder_Modal.aggregate([
        {
          $match: {
            basket_id: basket_id,  // Match by basket_id
            clientid: clientid,    // Match by clientid
            version: version,      // Match by version
          },
        },
        {
          $lookup: {
            from: "stocks", // Join with stocks collection to get stock details
            localField: "tradesymbol", // Field in BasketOrderModel to match
            foreignField: "tradesymbol", // Field in stocks collection to match
            as: "stock_details", // Add stock details to the result
          },
        },
        {
          $addFields: {
            instrument_token: {
              $arrayElemAt: ["$stock_details.instrument_token", 0], // Extract instrument_token (first match only)
            },
          },
        },
        {
          $project: {
            _id: 1,
            basket_id: 1,
            tradesymbol: 1,
            orderid: 1,
            quantity: 1,
            ordertype: 1,
            price: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1,
            instrument_token: 1, // Include extracted instrument_token
          },
        },
      ]);

      // Return the orders as a response
      return res.status(200).json({
        status: true,
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      // console.error("Error fetching orders:", error);
      return res.status(500).json({
        status: false,
        message: "Error fetching orders",
        error: error.message,
      });
    }
  }


  async BasketList(req, res) {
    try {

      const { clientId } = req.params;
      const baskets = await Basket_Modal.find({ del: false, status: true });

      // Process each basket to restructure the data
      const processedBaskets = await Promise.all(baskets.map(async (basket) => {

        const subscription = await BasketSubscription_Modal.findOne({
          basket_id: basket._id,
          client_id: clientId,
          del: false // Only check active (non-deleted) subscriptions
        });




        // Split the data by '##'
        const stocks = basket.stocks ? basket.stocks.split('##') : [];
        const pricerange = basket.pricerange ? basket.pricerange.split('##') : [];
        const stockweightage = basket.stockweightage ? basket.stockweightage.split('##') : [];
        const entryprice = basket.entryprice ? basket.entryprice.split('##') : [];
        const entrydate = basket.entrydate ? basket.entrydate.split('##') : [];
        const exitprice = basket.exitprice ? basket.exitprice.split('##') : [];
        const exitdate = basket.exitdate ? basket.exitdate.split('##') : [];
        const comment = basket.comment ? basket.comment.split('##') : [];
        //  const returnpercentage = basket.returnpercentage ? basket.returnpercentage.split('##') : [];
        //   const holdingperiod = basket.holdingperiod ? basket.holdingperiod.split('##') : [];
        //  const potentialleft = basket.potentialleft ? basket.potentialleft.split('##') : [];

        // Group data into objects
        const groupedData = stocks.map((stock, index) => ({
          stock: stock || null,
          pricerange: pricerange[index] || null,
          stockweightage: stockweightage[index] || null,
          entryprice: entryprice[index] || null,
          entrydate: entrydate[index] || null,
          exitprice: exitprice[index] || null,
          exitdate: exitdate[index] || null,
          comment: comment[index] || null,
          //   returnpercentage: returnpercentage[index] || null,
          //    holdingperiod: holdingperiod[index] || null,
          //   potentialleft: potentialleft[index] || null
        }));

        return {
          _id: basket._id,
          title: basket.title,
          description: basket.description,
          accuracy: basket.accuracy,
          price: basket.price,
          returnpercentage: basket.returnpercentage,
          holdingperiod: basket.holdingperiod,
          potentialleft: basket.potentialleft,
          mininvamount: basket.mininvamount,
          portfolioweightage: basket.portfolioweightage,
          themename: basket.themename,
          status: basket.status,
          add_by: basket.add_by,
          del: basket.del,
          created_at: basket.created_at,
          updated_at: basket.updated_at,
          __v: basket.__v,
          groupedData,
          purchaseStatus: subscription ? 1 : 0
        };
      }));


      return res.json({
        status: true,
        message: "Baskets fetched successfully",
        data: processedBaskets
      });

    } catch (error) {
      console.log("Server error occurred:", error);
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async pastPerformance(req, res) {
    try {
      const { id } = req.params;

      // Query to find signals based on the service ID
      const signals = await Signal_Modal.find({
        del: 0,
        close_status: true,
        closeprice: { $ne: 0 },
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
      console.log("Error fetching signal details:", error);

      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


  async addFreeTrail(req, res) {
    try {
      const { client_id } = req.body;
      // Validate input


      if (!client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return console.error('Client not found or inactive.');
      }


      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.freetrial) {
        throw new Error('SMTP settings are not configured or are disabled');
      }

      const freetrialDays = parseInt(settings.freetrial, 10); // or you can use +settings.freetrial

      const start = new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + freetrialDays);  // Add 7 days to the start date
      end.setHours(23, 59, 59, 999);


      const existingPlan = await Planmanage.findOne({ clientid: client_id }).exec();

      if (existingPlan) {
        return res.status(500).json({ status: false, message: 'Sorry, you are not eligible for a free trial', data: [] });
      } else {

        const service = await Service_Modal.find({ del: false });
        // Create an array to hold promises for saving the plans
        const savePromises = service.map(async (svc) => {
          // Create a new plan management record
          const newPlanManage = new Planmanage({
            clientid: client_id,
            serviceid: svc._id,
            startdate: start,
            enddate: end,
          });

          // Save the new plan management record to the database
          return newPlanManage.save(); // Return the promise from save
        });

        // Create a new plan subscription record

      }

      const newSubscription = new Freetrial_Modal({
        clientid: client_id,
        startdate: start,
        enddate: end,
      });

      const savedSubscription = await newSubscription.save();
      // Save the subscription
      client.freetrial = 1;
      await client.save();

      return res.status(201).json({
        status: true,
        message: 'Free trial Activated successfully',
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }
  async BroadcastList(req, res) {
    try {
      const { id } = req.body;  // Extract client id from request body
      const currentDate = new Date();

      // Fetch active plans
      const activePlans = await Planmanage.find({
        clientid: id,
        startdate: { $lte: currentDate },
        enddate: { $gte: currentDate }
      }).distinct('serviceid');

      // Fetch expired plans
      const expiredPlans = await Planmanage.find({
        clientid: id,
        enddate: { $lt: currentDate }
      }).distinct('serviceid');

      // Fetch all plans (non-subscription check)
      const allPlans = await Planmanage.find({
        clientid: id
      }).distinct('serviceid');

      // Determine the type based on active/expired plans
      let query = {
        del: false,
        status: true
      };

      if (activePlans.length > 0) {
        // If there are active plans
        query.$or = [
          { type: 'active', service: { $in: activePlans } }
        ];
      } else if (expiredPlans.length > 0) {
        // If there are expired plans
        query.$or = [
          { type: 'expired', service: { $in: expiredPlans } }
        ];
      } else if (allPlans.length === 0) {
        // If no plans exist
        query.$or = [
          { type: 'nonsubscribe', service: "" }
        ];
      }

      // If 'all' is selected, include all broadcasts
      if (activePlans.length > 0 || expiredPlans.length > 0 || allPlans.length === 0) {
        query.$or.push(
          { type: 'all' }
        );
      }

      // Fetch the broadcasts
      const broadcasts = await Broadcast_Modal.find(query).sort({ created_at: -1 });

      // Remove duplicates
      const uniqueBroadcasts = Array.from(new Set(broadcasts.map(b => b._id))).map(id => {
        return broadcasts.find(b => b._id === id);
      });

      if (!uniqueBroadcasts.length) {
        return res.status(404).json({ status: false, message: "No matching broadcasts found." });
      }

      // Return the matching broadcasts
      return res.status(200).json({ status: true, data: uniqueBroadcasts });

    } catch (error) {
      // console.error("Error fetching broadcasts:", error);
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  }



  async myFreetrial(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id) {
        return res.status(400).json({ status: false, message: 'Client ID is required' });
      }


      const result = await Freetrial_Modal.find({ clientid: id }).exec();

      const today = new Date();

      // Add `status` field based on `enddate`
      const updatedResult = result.map(item => {
        const status = item.enddate && new Date(item.enddate) >= today ? "active" : "expired";
        return {
          ...item.toObject(), // Convert the Mongoose document to a plain object
          status, // Add the new status field
        };
      });
      // Respond with the retrieved subscriptions and client details
      return res.json({
        status: true,
        message: "Subscriptions and client details retrieved successfully",
        data: updatedResult
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }




  async basicSetting(req, res) {
    try {


      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;



      const result = await BasicSetting_Modal.findOne()
        .select('freetrial website_title logo contact_number address refer_image receiver_earn refer_title sender_earn refer_description razorpay_key razorpay_secret kyc paymentstatus officepaymenystatus facebook instagram twitter youtube offer_image')
        .exec();

      if (result) {
        result.logo = `${baseUrl}/uploads/basicsetting/${result.logo}`;
        result.refer_image = `${baseUrl}/uploads/basicsetting/${result.refer_image}`;
        result.offer_image = `${baseUrl}/uploads/basicsetting/${result.offer_image}`;
      }

      return res.json({
        status: true,
        message: "details retrieved successfully",
        data: result
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
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
        closeprice: { $ne: 0 },
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
          Signal_Modal.findOne({ del: 0, close_status: true, closeprice: { $ne: 0 }, service: serviceId }).sort({ created_at: 1 }),
          Signal_Modal.findOne({ del: 0, close_status: true, closeprice: { $ne: 0 }, service: serviceId }).sort({ created_at: -1 })
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


        console.log("avgreturnpertrade", avgreturnpertrade);

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

      // Debug output for troubleshooting
      console.log('Aggregated Result:', result);



      // Respond with the retrieved subscriptions and client details
      return res.json({
        status: true,
        message: "Subscriptions and client details retrieved successfully",
        data: result
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }





  /*
    async Notification(req, res) {
      try {
        const { id } = req.params;
        const { page = 1 } = req.query; 
        let limit = 10;
  
        const today = new Date();
  
  
  
        const client = await Clients_Modal.findById(id).select('createdAt');
        if (!client) {
          return res.status(404).json({ status: false, message: "Client not found" });
        }
        const clientCreatedAt = client.createdAt;
  
        const activePlans = await Planmanage.find({
          clientid: id,
        startdate: { $lte: today },
        enddate: { $gte: today }
        }).select('serviceid');
  
  
  
        
        const activeServiceIds = activePlans.map(plan => plan.serviceid);
  
        const result = await Notification_Modal.find({
          createdAt: { $gte: clientCreatedAt }, 
          $or: [
            { clientid: id },
            {
              clientid: null,
              $or: [
                {
                  type: { $in: ['close signal', 'open signal'] },
                  segmentid: { $in: activeServiceIds } 
                },
                { type: { $nin: ['close signal', 'open signal'] } }
              ]
            },
            {
              clienttype: {
                $in: [
                  'active', 
                  'expired', 
                  'no subscribe', 
                  'all'
                ]
              },
              $or: [
                { clienttype: 'active', segmentid: { $in: activeServiceIds } },
                {
                  clienttype: 'expired',
                  segmentid: {
                    $in: await Planmanage.find({
                      clientid: id,
                      startdate: { $lte: today },
                      enddate: { $gte: today } 
                    }).distinct('serviceid')
                  }
                },
                {
                  clienttype: 'nonsubscribe',
                  segmentid: {
                    $nin: await Planmanage.find({ clientid: id }).distinct('serviceid')
                  }
                },
                { clienttype: 'all' }
              ]
            }
          ]
        })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit) 
          .limit(parseInt(limit)); 
  
        const totalCount = await Notification_Modal.countDocuments({
          createdAt: { $gte: clientCreatedAt }, 
          $or: [
            { clientid: id },
            {
              clientid: null,
              $or: [
                {
                  type: { $in: ['close signal', 'open signal'] },
                  segmentid: { $in: activeServiceIds }
                },
                { type: { $nin: ['close signal', 'open signal'] } }
              ]
            },
            {
              clienttype: {
                $in: ['active', 'expired', 'no subscribe', 'all']
              },
              $or: [
                { clienttype: 'active', segmentid: { $in: activeServiceIds } },
                {
                  clienttype: 'expired',
                  segmentid: {
                    $in: await Planmanage.find({
                      clientid: id,
                      enddate: { $lt: today }
                    }).distinct('serviceid')
                  }
                },
                {
                  clienttype: 'nonsubscribe',
                  segmentid: {
                    $nin: await Planmanage.find({ clientid: id }).distinct('serviceid')
                  }
                },
                { clienttype: 'all' }
              ]
            }
          ]
        });
  
        return res.json({
          status: true,
          message: "get",
          data: result,
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
  
  */

  async Notification(req, res) {
    try {
      const { id } = req.params;
      const { page = 1 } = req.query; // Default values for page and limit
      const limit = 10;
      const today = new Date();

      // Fetch the client's creation date
      const client = await Clients_Modal.findById(id).select('createdAt');
      if (!client) {
        return res.status(404).json({ status: false, message: "Client not found" });
      }
      const clientCreatedAt = client.createdAt;

      // Fetch active plans
      const activePlans = await Planmanage.find({
        clientid: id,
        startdate: { $lte: today },
        enddate: { $gte: today }
      }).distinct('serviceid');

      // Fetch expired plans
      const expiredPlans = await Planmanage.find({
        clientid: id,
        enddate: { $lt: today }
      }).distinct('serviceid');

      // Fetch all plans (non-subscription check)
      const allPlans = await Planmanage.find({
        clientid: id
      }).distinct('serviceid');

      // Determine if client has no active or expired plans
      const noPlans = activePlans.length === 0 && expiredPlans.length === 0;

      // Logging plan information for debugging
      // console.log("Active Plans:", activePlans);
      // console.log("Expired Plans:", expiredPlans);
      // console.log("All Plans (No Subscription):", allPlans);

      // Construct the query dynamically
      const queryConditions = {
        createdAt: { $gte: clientCreatedAt }, // Notifications created after client creation date
        $or: [
          // Notifications specific to the client
          { clientid: id },

          // Global notifications
          {
            clientid: null,
            $or: [
              // Global notifications with 'close signal', 'open signal', or 'add broadcast' types
              { type: { $in: ['close signal', 'open signal', 'add broadcast'] }, segmentid: { $in: activePlans } },
              // Global notifications with other types
              { type: { $nin: ['close signal', 'open signal', 'add broadcast'] } }
            ]
          },

          // Broadcast notifications
          {
            clienttype: { $in: ['active', 'expired', 'nonsubscribe', 'all'] },
            $or: [
              // For active clients, include active plans
              { clienttype: 'active', segmentid: { $in: activePlans } },
              // For expired clients, include expired plans
              { clienttype: 'expired', segmentid: { $in: expiredPlans } },
              // For clients with no active or expired plans (no subscription)
              ...(noPlans ? [{ clienttype: 'nonsubscribe' }] : []),
              // For all clients
              { clienttype: 'all' }
            ]
          }
        ]
      };

      // Fetch notifications based on constructed query
      const result = await Notification_Modal.find(queryConditions)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)  // Pagination
        .limit(parseInt(limit));   // Limit the number of records

      // Return the response with notifications
      return res.json({
        status: true,
        message: "Notifications fetched successfully",
        data: result
      });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: "Server error", data: [] });
    }
  }



  async Bank(req, res) {
    try {

      const banks = await Bank_Modal.find({ del: false, status: true, type: 1 });

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`; // Construct base URL dynamically
      console.log(baseUrl);
      const bankWithImageUrls = banks.map(bank => {
        return {
          ...bank._doc, // Spread the original document
          image: bank.image ? `${baseUrl}/uploads/bank/${bank.image}` : null, // Append full image URL
        };
      });


      return res.status(200).json({
        status: true,
        message: "Bank retrieved successfully",
        data: bankWithImageUrls
      });
    } catch (error) {
      console.log("Error retrieving Bank:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


  async Qrcode(req, res) {
    try {

      const banks = await Bank_Modal.find({ del: false, status: true, type: 2 });

      const protocol = req.protocol;

      const baseUrl = `${protocol}://${req.headers.host}`; // Construct base URL dynamically

      const bankWithImageUrls = banks.map(bank => {
        return {
          ...bank._doc, // Spread the original document
          image: bank.image ? `${baseUrl}/uploads/bank/${bank.image}` : null, // Append full image URL
        };
      });


      return res.status(200).json({
        status: true,
        message: "Qrcode retrieved successfully",
        data: bankWithImageUrls
      });
    } catch (error) {
      console.log("Error retrieving Bank:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }




  async placeOrder(req, res) {
    try {
      const { basket_id, clientid, brokerid, investmentamount, type } = req.body;

      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.json({
          status: false,
          message: "Basket not found.",
        });
      }

      if (investmentamount < basket.mininvamount) {
        return res.json({
          status: false,
          message: `Investment amount must be at least ${basket.mininvamount}.`,
        });
      }

      const client = await Clients_Modal.findById(clientid);
      if (!client) {
        return res.json({
          status: false,
          message: "Client not found"
        });
      }

      if (client.tradingstatus == 0) {
        return res.json({
          status: false,
          message: "Client Broker Not Login, Please Login With Broker"
        });
      }


      // Get stocks for the basket
      const existingStocks = await Basketstock_Modal.find({ basket_id }).sort({ version: -1 });

      const version = existingStocks.length > 0 ? existingStocks[0].version : 1;


      if (version == 1) {
        if (investmentamount < basket.mininvamount) {
          return res.json({
            status: false,
            message: `Investment amount must be at least ${basket.mininvamount}.`,
          });
        }
      }

      if (!existingStocks || existingStocks.length === 0) {
        return res.json({
          status: false,
          message: "No stocks found in the basket.",
        });
      }


      const totalAmount = investmentamount;

      const stockOrders = [];
      let respo;
      let isFundChecked = false;
      // Iterate over each stock to calculate allocated amount and quantity
      for (const stock of existingStocks) {
        const { tradesymbol, weightage, name } = stock;

        try {
          // Fetch stock data from Stock_Modal
          const stockData = await Stock_Modal.findOne({ tradesymbol });
          if (!stockData) {

            continue; // Skip this stock if no data found
          }

          const instrumentToken = stockData.instrument_token;

          // Fetch live price from Liveprice_Modal
          const livePrice = await Liveprice_Modal.findOne({ token: instrumentToken });
          if (!livePrice) {
            console.log(`Live price not found for instrument token: ${instrumentToken}`);
            continue; // Skip this stock if live price is unavailable
          }

          const lpPrice = livePrice.lp;

          // Calculate allocated amount and quantity
          const allocatedAmount = (weightage / 100) * totalAmount;
          const quantity = Math.floor(allocatedAmount / lpPrice); // Use Math.floor to avoid fractional shares

          // Store the order details for the stock
          const stockOrder = {
            symbol: name,
            tradesymbol,
            quantity,
            lpPrice,
            clientid,
            basket_id,
            version,
            instrumentToken
          };
          // Add the stock order to the stockOrders array
          stockOrders.push(stockOrder);

          if (type == 1) {
            let howmanytimebuy = 1;
            if (brokerid == 2) {


              if (!isFundChecked) {
                const orders = await Basketorder_Modal.find({
                  tradesymbol: tradesymbol,
                  clientid: clientid,
                  basket_id: basket_id,
                  version: version,
                  borkerid: brokerid
                })
                  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                  .limit(1);


                if (orders.length > 0) {
                  const order = orders[0]; // Use the first order if only one is relevant
                  howmanytimebuy = (order.howmanytimebuy || 0) + 1; // Increment the `howmanytimebuy` value
                }
              }
              const authToken = client.authtoken;
              const userId = client.alice_userid;

              const config = {
                method: 'get',
                url: `https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/limits/getRmsLimits`, // Construct the full URL
                headers: {
                  'Authorization': 'Bearer ' + userId + ' ' + authToken,
                }
              };

              const response = await axios(config);
              const responseData = response.data;

              if (responseData[0].stat == 'Ok') {
                // if (!isFundChecked) {
                //   isFundChecked = true; // Set the flag to true
                //   const net = parseFloat(responseData[0].net); // Convert responseData.net to a float
                //  const total = parseFloat(totalAmount);
                //   if (total >= net) {
                //     return res.status(400).json({
                //       status: false,
                //       message: "Insufficient funds in your broker account.",
                //     });
                //   }
                // }



                respo = await orderplace({
                  id: clientid,
                  basket_id: basket_id,
                  quantity,
                  price: lpPrice,
                  tradesymbol: tradesymbol,
                  instrumentToken: instrumentToken,
                  version: stock.version,
                  brokerid: brokerid,
                  calltype: "BUY",
                  howmanytimebuy
                });


              }


            }
            else if (brokerid == 1) {


              if (!isFundChecked) {
                const orders = await Basketorder_Modal.find({
                  tradesymbol: tradesymbol,
                  clientid: clientid,
                  basket_id: basket_id,
                  version: version,
                  borkerid: brokerid
                })
                  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                  .limit(1);


                if (orders.length > 0) {
                  const order = orders[0]; // Use the first order if only one is relevant
                  howmanytimebuy = (order.howmanytimebuy || 0) + 1; // Increment the `howmanytimebuy` value
                }
              }

              const authToken = client.authtoken;
              const userId = client.apikey;

              var config = {
                method: 'get',
                url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getRMS',
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-UserType': 'USER',
                  'X-SourceID': 'WEB',
                  'X-ClientLocalIP': 'CLIENT_LOCAL_IP', // Replace with actual IP
                  'X-ClientPublicIP': 'CLIENT_PUBLIC_IP', // Replace with actual IP
                  'X-MACAddress': 'MAC_ADDRESS', // Replace with actual MAC address
                  'X-PrivateKey': userId // Replace with actual API key
                },
              };


              const response = await axios(config);
              if (response.data.message == 'SUCCESS') {
                const responseData = response.data.data;

                if (!isFundChecked) {
                  isFundChecked = true; // Set the flag to true
                  const net = parseFloat(responseData.net); // Convert responseData.net to a float
                  const total = parseFloat(totalAmount);

                  if (total >= net) {
                    return res.json({
                      status: false,
                      message: "Insufficient funds in your broker account.",
                    });
                  }
                }



                respo = await angleorderplace({
                  id: clientid,
                  basket_id: basket_id,
                  quantity,
                  price: lpPrice,
                  tradesymbol: tradesymbol,
                  instrumentToken: instrumentToken,
                  version: stock.version,
                  brokerid: brokerid,
                  calltype: "BUY",
                  howmanytimebuy // Increment version for the new stock order
                });
              }

            }
            else if (brokerid == 3) {

              if (!isFundChecked) {
                const orders = await Basketorder_Modal.find({
                  tradesymbol: tradesymbol,
                  clientid: clientid,
                  basket_id: basket_id,
                  version: version,
                  borkerid: brokerid
                })
                  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                  .limit(1);


                if (orders.length > 0) {
                  const order = orders[0]; // Use the first order if only one is relevant
                  howmanytimebuy = (order.howmanytimebuy || 0) + 1; // Increment the `howmanytimebuy` value
                }
              }

              var data2 = JSON.stringify({ "seg": "CASH", "exch": "NSE", "prod": "ALL" });
              const requestData = `jData=${data2}`;

              var config = {
                method: "post",
                url: `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/user/limits?sId=${client.hserverid}`,
                headers: {
                  accept: "*/*",
                  sid: client.kotakneo_sid,
                  Auth: client.authtoken,
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + client.oneTimeToken,
                },
                data: requestData,
              };


              const response = await axios.request(config);
              if (response.data.stat === 'Ok') {

                if (!isFundChecked) {
                  isFundChecked = true; // Set the flag to true
                  const net = parseFloat(response.data.Net); // Convert responseData.net to a float
                  const total = parseFloat(totalAmount);

                  if (total >= net) {
                    return res.json({
                      status: false,
                      message: "Insufficient funds in your broker account.",
                    });
                  }
                }


                respo = await kotakneoorderplace({
                  id: clientid,
                  basket_id: basket_id,
                  quantity,
                  price: lpPrice,
                  tradesymbol: tradesymbol,
                  instrumentToken: instrumentToken,
                  version: stock.version,
                  brokerid: brokerid,
                  calltype: "B",
                  howmanytimebuy // Increment version for the new stock order
                });
              }
            }
            else if (brokerid == 4) {

              if (!isFundChecked) {
                const orders = await Basketorder_Modal.find({
                  tradesymbol: tradesymbol,
                  clientid: clientid,
                  basket_id: basket_id,
                  version: version,
                  borkerid: brokerid
                })
                  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                  .limit(1);


                if (orders.length > 0) {
                  const order = orders[0]; // Use the first order if only one is relevant
                  howmanytimebuy = (order.howmanytimebuy || 0) + 1; // Increment the `howmanytimebuy` value
                }
              }

              const authToken = client.authtoken;
              const userId = client.apikey;

              var config = {
                method: 'post',
                url: 'https://fund.markethubonline.com/middleware/api/v2/GetLimits',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${client.authtoken}`
                },
              };


              const response = await axios(config);

              if (response.data.message == 'Ok') {
                const responseData = response.data.data;


                if (!isFundChecked) {
                  isFundChecked = true; // Set the flag to true
                  const net = parseFloat(responseData.net); // Convert responseData.net to a float
                  const total = parseFloat(totalAmount);

                  if (total >= net) {
                    return res.json({
                      status: false,
                      message: "Insufficient funds in your broker account.",
                    });
                  }
                }



                respo = await markethuborderplace({
                  id: clientid,
                  basket_id: basket_id,
                  quantity,
                  price: lpPrice,
                  tradesymbol: tradesymbol,
                  instrumentToken: instrumentToken,
                  version: stock.version,
                  brokerid: brokerid,
                  calltype: "BUY",
                  howmanytimebuy // Increment version for the new stock order
                });

              }

            }

          }

        } catch (innerError) {
          // console.error(`Error processing stock ${tradesymbol}:`, innerError);
          continue; // Skip this stock in case of an error
        }
      }

      if (type != 1) {
        res.json({
          status: true,
          message: type == 1 ? "Order Placed Successfully." : "Order Confirm Successfully.",
          data: stockOrders,
        });
      }
      else {
        res.json({
          "response": respo
        });

      }

    } catch (error) {
      // console.error("Error placing order:", error);
      res.json({
        status: false,
        message: "An error occurred while placing the order.",
      });
    }
  }




  async exitPlaceOrder(req, res) {
    try {
      const { basket_id, clientid, brokerid, version, ids } = req.body;



      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.status(400).json({
          status: false,
          message: "Basket not found.",
        });
      }

      // Get stocks for the basket
      const existingStocks = await Basketstock_Modal.find({ basket_id: basket_id, version: version });
      if (!existingStocks || existingStocks.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No stocks found in the basket.",
        });
      }

      // Total investment amount

      // Initialize an array to store the calculated stock orders
      const stockOrders = [];
      let respo;
      // Iterate over each stock to calculate allocated amount and quantity
      for (const stock of existingStocks) {
        const { tradesymbol, quantity } = stock;



        const orders = await Basketorder_Modal.find({
          tradesymbol: tradesymbol,
          clientid: clientid,
          basket_id: basket_id,
          borkerid: brokerid,
          version: version,
          howmanytimebuy: { $in: ids }
        });



        // Calculating buy and sell quantities
        const buyQuantity = orders
          .filter(order => order.ordertype === 'BUY')
          .reduce((total, order) => total + order.quantity, 0);

        const sellQuantity = orders
          .filter(order => order.ordertype === 'SELL')
          .reduce((total, order) => total + order.quantity, 0);

        // Calculating the difference
        const netQuantity = buyQuantity - sellQuantity;

        try {
          // Fetch stock data from Stock_Modal
          const stockData = await Stock_Modal.findOne({ tradesymbol });
          if (!stockData) {
            console.log(`Stock data not found for trade symbol: ${tradesymbol}`);
            continue; // Skip this stock if no data found
          }

          const instrumentToken = stockData.instrument_token;

          // Fetch live price from Liveprice_Modal
          const livePrice = await Liveprice_Modal.findOne({ token: instrumentToken });
          if (!livePrice) {
            console.log(`Live price not found for instrument token: ${instrumentToken}`);
            continue; // Skip this stock if live price is unavailable
          }

          const lpPrice = livePrice.lp;


          const stockOrder = {
            tradesymbol,
            netQuantity,
            lpPrice,
            clientid,
            basket_id,
            version,
            instrumentToken
          };
          // Add the stock order to the stockOrders array
          stockOrders.push(stockOrder);


          if (brokerid == 2) {
            respo = await orderplace({
              id: clientid,
              basket_id: basket_id,
              quantity: netQuantity,
              price: lpPrice,
              tradesymbol: tradesymbol,
              instrumentToken: instrumentToken,
              version: version,
              brokerid: brokerid,
              calltype: "SELL",
              howmanytimebuy: ids
            });
          }
          else if (basket_id == 1) {
            respo = await angleorderplace({
              id: clientid,
              basket_id: basket_id,
              quantity: netQuantity,
              price: lpPrice,
              tradesymbol: tradesymbol,
              instrumentToken: instrumentToken,
              version: version,
              brokerid: brokerid,
              calltype: "SELL",
              howmanytimebuy: ids
            });

          }
          else if (brokerid == 3) {

            respo = await kotakneoorderplace({
              id: clientid,
              basket_id: basket_id,
              quantity: netQuantity,
              price: lpPrice,
              tradesymbol: tradesymbol,
              instrumentToken: instrumentToken,
              version: version,
              brokerid: brokerid,
              calltype: "S",
              howmanytimebuy: ids
            });

          }
          else if (brokerid == 4) {
            respo = await markethuborderplace({
              id: clientid,
              basket_id: basket_id,
              quantity: netQuantity,
              price: lpPrice,
              tradesymbol: tradesymbol,
              instrumentToken: instrumentToken,
              version: version,
              brokerid: brokerid,
              calltype: "SELL",
              howmanytimebuy: ids
            });

          }
        } catch (innerError) {
          // console.error(`Error processing stock ${tradesymbol}:`, innerError);
          continue; // Skip this stock in case of an error
        }
      }

      // Respond with success and order details
      res.status(200).json({
        "response": respo
      });


    } catch (error) {
      // console.error("Error placing order:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while placing the order.",
      });
    }
  }


  async checkBasketSell(req, res) {
    try {
      // Destructure the request body
      const { basket_id, clientid, brokerid, version } = req.body;

      // Validate required fields
      if (!basket_id || !clientid || !brokerid || !version) {
        return res.status(400).json({
          status: false,
          message: "Missing required parameters. Please provide basket_id, clientid, brokerid, version, and tradesymbol."
        });
      }

      // Perform aggregation to group orders by `howmanytimebuy`
      const groupedOrders = await Basketorder_Modal.aggregate([
        {
          $match: {
            version: version,
            clientid: clientid,
            basket_id: basket_id,
            borkerid: brokerid,
            exitstatus: 0
          }
        },
        {
          $group: {
            _id: "$howmanytimebuy"
          }
        },
        {
          $sort: { _id: 1 } // Sort by `howmanytimebuy` in ascending order
        }
      ]);

      // Check if there are any grouped orders
      if (!groupedOrders.length) {
        return res.status(404).json({
          status: false,
          message: "No orders found for the specified criteria."
        });
      }

      // Return the grouped orders
      res.status(200).json({
        status: true,
        message: "Orders retrieved successfully.",
        data: groupedOrders
      });
    } catch (error) {
      // Log the error and return a 500 response
      // console.error("Error retrieving grouped orders:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while retrieving the grouped orders."
      });
    }
  }

  async Refer(req, res) {
    return res.status(200).json({
      status: true,
    });
  }

  async getLivePrice(req, res) {
    try {
      const livePrices = await Liveprice_Modal.aggregate([
        {
          $lookup: {
            from: 'stocks', // Collection to join with
            localField: 'token', // Field in Liveprice_Modal
            foreignField: 'instrument_token', // Field in dstocks
            as: 'stockDetails' // Output array field containing matching documents
          }
        },
        {
          $unwind: {
            path: '$stockDetails', // Unwind the stockDetails array
            preserveNullAndEmptyArrays: true // Keep documents even if no match is found
          }
        },
        {
          $project: {
            lp: 1,
            curtime: 1,
            token: 1,
            tradesymbol: '$stockDetails.tradesymbol', // Include tradesymbol from dstocks
          }
        }
      ]);

      return res.json({
        status: true,
        message: "Live prices fetched successfully",
        data: livePrices
      });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async Logout(req, res) {
    try {
      const { id } = req.params;

      const client = await Clients_Modal.findOne({ _id: id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return console.error('Client not found or inactive.');
      }

      client.devicetoken = "";
      await client.save();

      return res.json({
        status: true,
        message: "Logout successfully",
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async addRequest(req, res) {
    try {
      const { clientid, type, id } = req.body;



      const result = new Requestclient_Modal({
        clientid: clientid,
        id: id,
        type: type
      });

      const savedSubscription = await result.save();

      return res.status(201).json({
        status: true,
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }



  async SignalClientWithPlan(req, res) {
    try {
      const { service_id, client_id, search, page = 1 } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      const limitValue = parseInt(limit); // Items per page


      const existingPlan = await Planmanage.findOne({ clientid: client_id, serviceid: service_id }).exec();

      if (!existingPlan) {
        // Fetch last 5 signal IDs for the given service_id
        const lastFiveSignals = await Signal_Modal.find({ service: service_id,close_status: false })
            .sort({ created_at: -1 })
            .limit(5)
            .lean();
        
        return res.json({
          status: true,
          message: "Returning last 5 signals due to no existing plan",
          data: lastFiveSignals,
          pagination: {
            total: lastFiveSignals.length,
            page: 1,
            limit: 5,
            totalPages: 1
          }
        });
      }


      const subscriptions = await PlanSubscription_Modal.find({ client_id });
      if (subscriptions.length === 0) {
        return res.json({
          status: false,
          message: "No plan subscriptions found for the given service and client IDs",
          data: []
        });
      }

      const planIds = subscriptions.map(sub => sub.plan_category_id);
      const planEnds = subscriptions.map(sub => new Date(sub.plan_end));

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });




      const uniquePlanIds = [
        ...new Set(planIds.filter(id => id !== null).map(id => id.toString()))
      ].map(id => new ObjectId(id));


      const query = {
        service: service_id,
        close_status: false,
        $or: uniquePlanIds.map((planId, index) => ({
          planid: planId.toString(), // Matching the planid with regex
          created_at: { $lte: planEnds[index] }       // Checking if created_at is <= to planEnds
        }))
      };


      //   const query = {
      //     service: service_id,
      //     close_status: false,
      //     $or: uniquePlanIds.map((planId, index) => {
      //         return {
      //             planid: { $regex: `(^|,)${planId}($|,)` }
      //             created_at: { $lte: planEnds[index] } // Compare created_at with the plan_end date of each subscription
      //         };
      //     })
      // };


      //console.log("Final Query:", JSON.stringify(query, null, 2));
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
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async NotificationWithPlan(req, res) {
    try {
      const { id } = req.params;
      const { page = 1 } = req.query; // Default values for page and limit
      const limit = 10;
      const today = new Date();

      // Fetch the client's creation date
      const client = await Clients_Modal.findById(id).select('createdAt');
      if (!client) {
        return res.status(404).json({ status: false, message: "Client not found" });
      }
      const clientCreatedAt = client.createdAt;

      // Fetch subscriptions
      const subscriptions = await PlanSubscription_Modal.find({ client_id: id });

      // Initialize status variables
      const hasActiveSubscriptions = subscriptions.some(
        sub => new Date(sub.plan_start) <= today && new Date(sub.plan_end) >= today
      );
      const hasExpiredSubscriptions = subscriptions.some(
        sub => new Date(sub.plan_end) < today
      );
      const noSubscriptions = subscriptions.length === 0;

      // Fetch active and expired plans for broadcast notifications
      const activePlans = await Planmanage.find({
        clientid: id,
        startdate: { $lte: today },
        enddate: { $gte: today }
      }).distinct('serviceid');

      const expiredPlans = await Planmanage.find({
        clientid: id,
        enddate: { $lt: today }
      }).distinct('serviceid');

      // Construct query conditions
      const queryConditions = {
        createdAt: { $gte: clientCreatedAt }, // Notifications created after client creation date
        $or: [
          // Notifications specific to the client
          { clientid: id },

          // Global notifications
          {
            clientid: null,
            $or: [
              // Global notifications for 'close signal' and 'open signal'
              {
                type: { $in: ['close signal', 'open signal'] },
                $or: subscriptions.map((sub) => ({
                  segmentid: { $regex: `(^|,)${sub.plan_id}($|,)` }, // Match plan_id in segmentid
                  createdAt: { $lte: new Date(sub.plan_end) } // Ensure the notification was created before plan_end date
                }))
              },
              // Global notifications for 'add broadcast'
              //  { type: 'add broadcast' },
              // Include all other types of notifications (e.g., add coupon, blogs, news, etc.)
              { type: { $nin: ['close signal', 'open signal', 'add broadcast'] } }
            ]
          },

          // Broadcast notifications based on client type
          {
            clienttype: { $in: ['active', 'expired', 'nonsubscribe', 'all'] },
            $or: [
              // For active clients with active subscriptions
              ...(hasActiveSubscriptions ? [{ clienttype: 'active', segmentid: { $in: activePlans } }] : []),

              // For expired clients with expired subscriptions
              ...(hasExpiredSubscriptions ? [{ clienttype: 'expired', segmentid: { $in: expiredPlans } }] : []),

              // For clients with no subscriptions
              ...(noSubscriptions ? [{ clienttype: 'nonsubscribe' }] : []),

              // For all clients
              { clienttype: 'all' }
            ]
          }
        ]
      };

      // Fetch notifications based on constructed query
      const result = await Notification_Modal.find(queryConditions)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit) // Pagination
        .limit(parseInt(limit)); // Limit the number of records

      // Return the response with notifications
      return res.json({
        status: true,
        message: "Notifications fetched successfully",
        data: result
      });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: "Server error", data: [] });
    }
  }


  async getCompanyAndBseData(req, res) {
    try {
      // Fetch data from CompanyMaster API
      const companyResponse = await axios.get('http://stockboxapis.cmots.com/api/CompanyMaster');
      const companyData = companyResponse.data.data;  // Accessing the 'data' field which is an array

      // Get the search query from the request (if any)
      const searchQuery = req.query.search || '';

      // Filter companyData by CompanyName if searchQuery is provided
      const filteredCompanyData = companyData.filter(company =>
        company.CompanyName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Fetch data from BseNseDelayedData API
      const bseResponse = await axios.get('http://stockboxapis.cmots.com/api/BseNseDelayedData/NSE');
      const bseData = bseResponse.data.data;

      // Combine data by matching BSECode from companyData and co_code from bseData
      const combinedData = filteredCompanyData.map(company => {
        // Find the matching BSE data using co_code from companyData and co_code from bseData
        const bseMatch = bseData.find(bse => bse.co_code === company.co_code);

        if (bseMatch) {
          return {
            co_code: company.co_code,
            BSECode: company.BSECode,
            NSESymbol: company.NSESymbol,
            CompanyName: company.CompanyName,
            CompanyShortName: company.CompanyShortName,
            CategoryName: company.CategoryName,
            isin: company.isin,
            BSEGroup: company.BSEGroup,
            mcaptype: company.mcaptype,
            SectorCode: company.SectorCode,
            SectorName: company.SectorName,
            BSEListed: company.BSEListed,
            NSEListed: company.NSEListed,
            DisplayType: company.DisplayType,
            price: bseMatch.price,
            Open: bseMatch.Open,
            High: bseMatch.High,
            Low: bseMatch.Low,
            prevclose: bseMatch.prevclose,
            Volume: bseMatch.Volume,
            Tr_Date: bseMatch.Tr_Date
          };
        }
      }).filter(Boolean);  // Remove undefined results if no match was found


      return res.json({
        status: true,
        data: combinedData
      });

    } catch (error) {
      return res.status(500).json({ status: false, message: "Server error", data: error });
    }
  }


  async addPlanSubscriptionAddToCart(req, res) {
    try {
      const { plan_ids, client_id, price, discount, orderid, coupon_code } = req.body;

      // Validate input
      if (!plan_ids || !Array.isArray(plan_ids) || plan_ids.length === 0 || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }


      const length = 6;
      const digits = '0123456789';
      let orderNumber = '';

      for (let i = 0; i < length; i++) {
        orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
      }


      for (const plan_id of plan_ids) {
        // Fetch the plan and populate the category
        const plan = await Plan_Modal.findById(plan_id)
          .populate('category')
          .exec();

        if (!plan) {
          return res.status(404).json({ status: false, message: 'Plan not found' });
        }



        const activePlan = await PlanSubscription_Modal.findOne({
          plan_category_id: plan.category._id,
          client_id: client_id,
          plan_end: { $gte: new Date() } // Ensure the plan is not expired
        }).sort({ plan_end: -1 }); // Sort by end date to get the most recent one

        // If there is an active plan, set the new plan's start date to the end date of the existing active plan



        // Map plan validity to months
        const validityMapping = {
          '1 month': 1,
          '2 months': 2,
          '3 months': 3,
          '6 months': 6,
          '9 months': 9,
          '1 year': 12,
          '2 years': 24,
          '3 years': 36,
          '4 years': 48,
          '5 years': 60
        };

        const monthsToAdd = validityMapping[plan.validity];
        if (monthsToAdd === undefined) {
          return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
        }

        let start = new Date();  // Use let instead of const to allow reassigning

        if (activePlan) {
          start = new Date(activePlan.plan_end); // Start the new plan right after the previous one ends
        }
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
        end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration


        const planservice = plan.category?.service;
        const planservices = planservice ? planservice.split(',') : [];
        for (const serviceId of planservices) {
          const existingPlan = await Planmanage.findOne({ clientid: client_id, serviceid: serviceId }).exec();

          if (existingPlan) {

            if (new Date(existingPlan.enddate) < end) {
              existingPlan.enddate = end;
              await existingPlan.save();
            }
          }
          else {
            const newPlanManage = new Planmanage({
              clientid: client_id,
              serviceid: serviceId,
              startdate: start,
              enddate: end,
            });
            await newPlanManage.save();
          }
        }
        /*
         const planservice = plan.category?.service;
         const planservices = planservice ? planservice.split(',') : [];
         for (const serviceId of planservices) {
           const existingPlan = await Planmanage.findOne({ clientid: client_id, serviceid: serviceId }).exec();
   
           if (existingPlan) {
             // If the plan exists and the end date is still valid, extend it
             if (existingPlan.enddate && existingPlan.enddate > new Date()) {
               existingPlan.enddate.setMonth(existingPlan.enddate.getMonth() + monthsToAdd);
             } else {
               existingPlan.enddate = end;  // Set new end date if it has expired
               existingPlan.startdate = start;
             }
   
   
             try {
               const savedPlan = await Planmanage.updateOne(
                 { _id: existingPlan._id },  // Filter: find the document by its ID
                 {
                   $set: {
                     enddate: existingPlan.enddate,  // Set the new end date
                     startdate: existingPlan.startdate // Set the new start date
                   }
                 }  // Update fields
               );
               //  const savedPlan = await existingPlan.save();  
               console.log("Plan updated successfully:", savedPlan);
             } catch (error) {
               // console.error("Error saving updated plan:", error);
             }
           } else {
   
             ////////////////// 17/10/2024 ////////////////////////
   
             const today = new Date(); // Aaj ki date
             const existingPlans = await Planmanage.find({
               clientid: client_id,
               serviceid: serviceId,
               enddate: { $gt: today } // End date must be greater than today's date
             })
               .sort({ enddate: -1 }) // Sort by `enddate` in descending order
               .limit(1) // Get the top result
               .exec();
   
             if (existingPlans.length > 0) {
               const existingEndDate = existingPlans[0].enddate; // Get the enddate of the existing plan
               const newEndDate = end; // Assuming `end` is your new plan's end date
   
               // Check if the new end date is greater than the existing end date
               if (newEndDate > existingEndDate) {
   
                 const differenceInTime = newEndDate.getTime() - existingEndDate.getTime(); // Difference in milliseconds
                 const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
   
                 let differenceInMonths;
   
                 // Logic to determine the number of months
                 if (differenceInDays < 15) {
                   differenceInMonths = 0; // Less than a month
                 } else {
                   // Calculate the difference in months
                   differenceInMonths = differenceInDays / 30; // Convert days to months
                 }
   
                 // Round the months based on your requirement
                 if (differenceInMonths % 1 >= 0.5) {
                   monthsToAdd = Math.ceil(differenceInMonths); // Round up to the nearest whole number
                 } else {
                   monthsToAdd = Math.floor(differenceInMonths); // Round down to the nearest whole number
                 }
   
               }
               else {
                 monthsToAdd = 0;
               }
             }
   
             ////////////////// 17/10/2024 ////////////////////////
   
             const newPlanManage = new Planmanage({
               clientid: client_id,
               serviceid: serviceId,
               startdate: start,
               enddate: end,
             });
   
             try {
               await newPlanManage.save();  // Save the new plan
               console.log(`Added new record for service ID: ${serviceId}`);
             } catch (error) {
               // console.error("Error saving new plan:", error);
             }
           }
   
         }
         */

        ////////////////// 17/10/2024 ////////////////////////
        const currentDate = new Date();
        const targetMonth = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${currentDate.getFullYear()}`;

        let license = await License_Modal.findOne({ month: targetMonth }).exec();


        if (license) {
          license.noofclient += monthsToAdd;
          console.log('Month found, updating noofclient.', monthsToAdd);
        } else {
          license = new License_Modal({
            month: targetMonth,
            noofclient: monthsToAdd
          });
          console.log('Month not found, inserting new record.');
        }

        try {
          await license.save();
          console.log('License updated successfully.');
        } catch (error) {
          // console.error('Error updating license:', error);
        }


        const numberOfPlans = plan_ids.length;
        const discountPerPlan = parseFloat((discount / numberOfPlans).toFixed(2));

        ////////////////// 17/10/2024 ////////////////////////
        // Create a new plan subscription record
        const newSubscription = new PlanSubscription_Modal({
          plan_id,
          plan_category_id: plan.category._id,
          client_id,
          total: plan.price - discountPerPlan,
          plan_price: plan.price,
          discount: discountPerPlan,
          coupon: coupon_code,
          plan_start: start,
          plan_end: end,
          validity: plan.validity,
          orderid: orderid,
          ordernumber: `INV-${orderNumber}`,
          ordernumber: `INV-${orderNumber}.pdf`,
        });

        // Save the subscription
        const savedSubscription = await newSubscription.save();

      }



      const updatedItems = await Addtocart_Modal.updateMany(
        { client_id: client_id, status: false, basket_id: null }, // Find all matching items
        { $set: { status: true } } // Update status to true
      );


      if (coupon_code) {
        const resultc = await Coupon_Modal.findOne({
          del: false,
          status: true,
          code: coupon_code
        });


        if (resultc) {

          // Check if limitation is greater than 0 before decrementing
          if (resultc.limitation > 0) {
            const updatedResult = await Coupon_Modal.findByIdAndUpdate(
              resultc._id,
              { $inc: { limitation: -1 } }, // Decrease limitation by 1
              { new: true } // Return the updated document
            );
          }

        }
      }

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });


      if (!client) {
        return console.log('Client not found or inactive.');
      }


      if (client.freetrial == 0) {
        client.freetrial = 1;
        await client.save();
      }

      const settings = await BasicSetting_Modal.findOne();

      const refertokens = await Refer_Modal.find({ user_id: client._id, status: 0 });

      if (client.refer_status && client.token) {
        if (refertokens.length > 0) {
        }
        else {

          const senderamount = (price * settings.sender_earn) / 100;
          const receiveramount = (price * settings.receiver_earn) / 100;

          const results = new Refer_Modal({
            token: client.token,
            user_id: client._id,
            senderearn: settings.sender_earn,
            receiverearn: settings.receiver_earn,
            senderamount: senderamount,
            receiveramount: receiveramount,
            status: 1
          })
          await results.save();

          client.wamount += receiveramount;
          await client.save();
          const sender = await Clients_Modal.findOne({ refer_token: client.token, del: 0, ActiveStatus: 1 });

          if (sender) {
            sender.wamount += senderamount;
            await sender.save();
          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }

        }

      }

      if (refertokens.length > 0) {
        for (const refertoken of refertokens) {
          const senderamount = (price * refertoken.senderearn) / 100;
          const receiveramount = (price * refertoken.receiverearn) / 100;

          refertoken.senderamount = senderamount;
          refertoken.receiveramount = receiveramount;
          refertoken.status = 1;

          await refertoken.save();

          // Update client's wallet amount
          client.wamount += receiveramount;
          await client.save();

          // Update sender's wallet amount
          const sender = await Clients_Modal.findOne({ refer_token: refertoken.token, del: 0, ActiveStatus: 1 });

          if (sender) {
            sender.wamount += senderamount;
            await sender.save();
          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }
        }
      } else {
        console.log('No referral tokens found.');
      }

      const adminnotificationTitle = "Important Update";
      const adminnotificationBody = `Congratulations! ${client.FullName} successfully purchased the Plan`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        segmentid: "",
        type: 'plan purchase',
        title: adminnotificationTitle,
        message: adminnotificationBody
      });


      await resultnm.save();

      // if (plan.deliverystatus == true) {
      //   client.deliverystatus = true;
      //   await client.save();
      // }

      if (settings.invoicestatus == 1) {


        let payment_type;
        if (orderid) {
          payment_type = "Online";
        }
        else {
          payment_type = "Offline";

        }

        const templatePath = path.join(__dirname, '../../../template', 'invoicenew.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');



        let planDetailsHtml = '';
        for (const plan_id of plan_ids) {
          const plan = await Plan_Modal.findById(plan_id)
            .populate('category')
            .exec();

          const validityMapping = {
            '1 month': 1,
            '2 months': 2,
            '3 months': 3,
            '6 months': 6,
            '9 months': 9,
            '1 year': 12,
            '2 years': 24,
            '3 years': 36,
            '4 years': 48,
            '5 years': 60
          };

          const monthsToAdd = validityMapping[plan.validity];
          if (monthsToAdd === undefined) {
            return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
          }

          const start = new Date();
          const end = new Date(start);
          end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
          end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration




          planDetailsHtml += `
            <tr>
              <td>${plan.category.title}</td>
              <td>${plan.validity}</td>
              <td>${plan.price}</td>
              <td>${formatDate(start)}</td>
              <td>${formatDate(end)}</td>
            </tr>`;
        }


        const todays = new Date();

        htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `INV-${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(todays))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{plan_details}}/g, planDetailsHtml)
          .replace(/{{total}}/g, price)
          .replace(/{{plantype}}/g, "Plan")
          .replace(/{{discount}}/g, discount);


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `INV-${orderNumber}.pdf`);

        // Generate PDF and save to the specified path
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '10mm',
            bottom: '50mm',
            left: '10mm',
          },
        });

        await browser.close();




        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }

        const templatePaths = path.join(__dirname, '../../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

          // Replace placeholders with actual values
          const finalHtml = htmlTemplate
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);

          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [
              {
                filename: `INV-${orderNumber}.pdf`, // PDF file name
                path: pdfPath, // Path to the PDF file
              }
            ]
          };

          // Send email
          await sendEmail(mailOptions);
        });

      }
      // Return success response
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async PurchasedBasketList(req, res) {
    try {
      const { clientid } = req.body; // assuming clientid is passed in the request

      // Convert clientid to ObjectId
      const clientObjectId = new mongoose.Types.ObjectId(clientid);

      const currentDate = new Date();

      const result = await Basket_Modal.aggregate([
        {
          $lookup: {
            from: 'basketsubscriptions',
            localField: '_id',
            foreignField: 'basket_id',
            as: 'subscription_info',
          },
        },
        {
          $addFields: {
            filteredSubscriptions: {
              $filter: {
                input: '$subscription_info',
                as: 'sub',
                cond: { $eq: ['$$sub.client_id', clientObjectId] },
              },
            },
          },
        },
        {
          $addFields: {
            latestSubscription: {
              $arrayElemAt: [
                {
                  $sortArray: {
                    input: '$filteredSubscriptions',
                    sortBy: { enddate: -1 },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $addFields: {
            isSubscribed: true,
            isActive: {
              $cond: {
                if: {
                  $and: [
                    { $gt: [{ $size: '$filteredSubscriptions' }, 0] },
                    { $gte: [currentDate, '$latestSubscription.startdate'] },
                    { $lte: [currentDate, '$latestSubscription.enddate'] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $match: {
            'filteredSubscriptions.0': { $exists: true }, // Only include baskets with subscriptions
            del: false,
            status: true,
          },
        },
        {
          $lookup: {
            from: 'basketstocks',
            let: { basketId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$basket_id', '$$basketId'] },
                      { $eq: ['$status', 1] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: '$basket_id',
                  maxVersion: { $max: '$version' },
                },
              },
              {
                $lookup: {
                  from: 'basketstocks',
                  let: { basketId: '$_id', maxVer: '$maxVersion' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$basket_id', '$$basketId'] },
                            { $eq: ['$version', '$$maxVer'] },
                            { $eq: ['$status', 1] },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'latestStocks',
                },
              },
              { $unwind: '$latestStocks' },
              { $replaceRoot: { newRoot: '$latestStocks' } },
            ],
            as: 'stock_details',
          },
        },
        {
          $project: {
            basket_id: 1,
            title: 1,
            description: 1,
            full_price: 1,
            basket_price: 1,
            mininvamount: 1,
            accuracy: 1,
            portfolioweightage: 1,
            cagr: 1,
            cagr_live: 1,
            frequency: 1,
            validity: 1,
            next_rebalance_date: 1,
            status: 1,
            del: 1,
            created_at: 1,
            updated_at: 1,
            type: 1,
            themename: 1,
            image: 1,
            short_description: 1,
            rationale: 1,
            methodology: 1,
            isActive: 1,
            isSubscribed: 1,
            startdate: '$latestSubscription.startdate',
            enddate: '$latestSubscription.enddate',
            stock_details: {
              $filter: {
                input: '$stock_details',
                as: 'stock',
                cond: { $eq: ['$$stock.del', false] },
              },
            },
          },
        },
      ]);
  


      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `${protocol}://${req.headers.host}`;

      // Update each basket's image path
      result.forEach(basket => {
          if (basket.image) {
              basket.image = `${baseUrl}/uploads/basket/${basket.image}`;
          }
      });


      res.status(200).json({
        status: true,
        message: 'Purchased baskets retrieved successfully.',
        data: result,
      });
    } catch (error) {
      // console.error('Error retrieving purchased baskets:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while retrieving purchased baskets.',
      });
    }
  }

  async addBasketSubscriptionAddToCart(req, res) {
    try {
      const { basket_ids, client_id, price, discount, orderid, coupon } = req.body;

      // Validate input
      if (!basket_ids || !Array.isArray(basket_ids) || basket_ids.length === 0 || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return console.log('Client not found or inactive.');
      }

      const settings = await BasicSetting_Modal.findOne();


      const length = 6;
      const digits = '0123456789';
      let orderNumber = '';

      for (let i = 0; i < length; i++) {
        orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
      }




      for (const basket_id of basket_ids) {

        const basket = await Basket_Modal.findOne({
          _id: basket_id,
          del: false
        });


        // Map plan validity to months
        const validityMapping = {
          '1 month': 1,
          '2 months': 2,
          '3 months': 3,
          '6 months': 6,
          '9 months': 9,
          '1 year': 12,
          '2 years': 24,
          '3 years': 36,
          '4 years': 48,
          '5 years': 60,
        };

        const monthsToAdd = validityMapping[basket.validity];
        if (monthsToAdd === undefined) {
          return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
        }

        const start = new Date();
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
        end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration

        const numberOfPlans = basket_ids.length;
        const discountPerPlan = parseFloat((discount / numberOfPlans).toFixed(2));


        // Create a new subscription
        const newSubscription = new BasketSubscription_Modal({
          basket_id,
          client_id,
          total: basket.basket_price - discountPerPlan,
          plan_price: basket.basket_price,
          discount: discountPerPlan,
          coupon: coupon,
          startdate: start,
          enddate: end,
          validity: basket.validity,
          orderid: orderid,
          ordernumber: `INV-${orderNumber}`,
          invoice: `INV-${orderNumber}.pdf`,
        });

        // Save to the database
        const savedSubscription = await newSubscription.save();
      }


      const updatedItems = await Addtocart_Modal.updateMany(
        { client_id: client_id, status: false, plan_id: null }, // Find all matching items
        { $set: { status: true } } // Update status to true
      );


      if (settings.invoicestatus == 1) {



        let payment_type;
        if (orderid) {
          payment_type = "Online";
        }
        else {
          payment_type = "Offline";

        }

        const templatePath = path.join(__dirname, '../../../template', 'invoicenew.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        let planDetailsHtml = '';

        for (const basket_id of basket_ids) {

          const basket = await Basket_Modal.findOne({
            _id: basket_id,
            del: false
          });


          // Map plan validity to months
          const validityMapping = {
            '1 month': 1,
            '2 months': 2,
            '3 months': 3,
            '6 months': 6,
            '9 months': 9,
            '1 year': 12,
            '2 years': 24,
            '3 years': 36,
            '4 years': 48,
            '5 years': 60,
          };

          const monthsToAdd = validityMapping[basket.validity];
          if (monthsToAdd === undefined) {
            return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
          }

          const start = new Date();
          const end = new Date(start);
          end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
          end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration


          planDetailsHtml += `
            <tr>
              <td>${basket.title}</td>
              <td>${basket.validity}</td>
              <td>${basket.basket_price}</td>
              <td>${formatDate(start)}</td>
              <td>${formatDate(end)}</td>
            </tr>`;
        }


        const todays = new Date();

        htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `INV-${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(todays))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{total}}/g, price)
          .replace(/{{discount}}/g, discount)
          .replace(/{{plan_details}}/g, planDetailsHtml)
          .replace(/{{plantype}}/g, "Basket");


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `INV-${orderNumber}.pdf`);

        // Generate PDF and save to the specified path
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '10mm',
            bottom: '50mm',
            left: '10mm',
          },
        });

        await browser.close();




        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }



        const templatePaths = path.join(__dirname, '../../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

          // Replace placeholders with actual values
          const finalHtml = htmlTemplate
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);

          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [
              {
                filename: `INV-${orderNumber}.pdf`, // PDF file name
                path: pdfPath, // Path to the PDF file
              }
            ]
          };

          // Send email
          await sendEmail(mailOptions);
        });

      }
      // Respond with the created subscription
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async AddToCartPlan(req, res) {
    try {
      const { plan_id, client_id } = req.body;

      // Validate input
      if (!plan_id || !client_id) {
        return res.status(400).json({
          status: false,
          message: 'Missing required fields: plan_id and client_id are required.'
        });
      }

      // Check if plan exists in the database (optional step)
      const plan = await Plan_Modal.findById(plan_id);
      if (!plan) {
        return res.status(404).json({
          status: false,
          message: 'Plan not found.'
        });
      }

      // Check if client exists in the database (optional step)
      const client = await Clients_Modal.findById(client_id);
      if (!client) {
        return res.status(404).json({
          status: false,
          message: 'Client not found.'
        });
      }

      // Create the new subscription object for the cart
      const newSubscription = new Addtocart_Modal({
        plan_id,
        client_id,
      });

      // Save the subscription
      const savedSubscription = await newSubscription.save();

      // Return a success response with the saved subscription details
      return res.status(201).json({
        status: true,
        message: 'Plan added to cart successfully.',
        data: savedSubscription,
      });

    } catch (error) {
      console.error('Error adding plan to cart:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong while adding the plan to the cart.',
        error: error.message,
      });
    }
  }

  async AddToCartBasket(req, res) {
    try {
      const { basket_id, client_id } = req.body;

      // Validate input
      if (!basket_id || !client_id) {
        return res.status(400).json({
          status: false,
          message: 'Missing required fields: basket_id and client_id are required.'
        });
      }

      // Check if plan exists in the database (optional step)
      const plan = await Basket_Modal.findById(basket_id);
      if (!plan) {
        return res.status(404).json({
          status: false,
          message: 'Plan not found.'
        });
      }

      // Check if client exists in the database (optional step)
      const client = await Clients_Modal.findById(client_id);
      if (!client) {
        return res.status(404).json({
          status: false,
          message: 'Client not found.'
        });
      }

      // Create the new subscription object for the cart
      const newSubscription = new Addtocart_Modal({
        basket_id,
        client_id,
      });

      // Save the subscription
      const savedSubscription = await newSubscription.save();

      // Return a success response with the saved subscription details
      return res.status(201).json({
        status: true,
        message: 'Basket added to cart successfully.',
        data: savedSubscription,
      });

    } catch (error) {
      console.error('Error adding Basket to cart:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong while adding the Basket to the cart.',
        error: error.message,
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
      console.error('Error retrieving cart items:', error);
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
      console.error('Error retrieving cart items:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong while retrieving cart items.',
        error: error.message,
      });
    }
  }

  async DeleteCartItem(req, res) {
    try {
      const { id, client_id } = req.body; // Assuming cart_id is passed in request body

      // Validate input
      if (!id || !client_id) {
        return res.status(400).json({
          status: false,
          message: "Cart ID and Client ID are required.",
        });
      }

      // Find and delete the cart item
      const deletedItem = await Addtocart_Modal.findOneAndDelete({
        _id: id,
        client_id: client_id,
      });

      // If no item is found, return an error
      if (!deletedItem) {
        return res.status(404).json({
          status: false,
          message: "Cart item not found.",
        });
      }

      // Return success response
      return res.status(200).json({
        status: true,
        message: "Cart item deleted successfully.",
      });

    } catch (error) {
      console.error("Error deleting cart item:", error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong while deleting the cart item.",
        error: error.message,
      });
    }
  }



  async SignalClientWithPlanClose(req, res) {
    try {
      const { service_id, client_id, search, page = 1 } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate how many items to skip
      const limitValue = parseInt(limit); // Items per page


      const subscriptions = await PlanSubscription_Modal.find({ client_id });
      if (subscriptions.length === 0) {
        return res.json({
          status: false,
          message: "No plan subscriptions found for the given service and client IDs",
          data: []
        });
      }

      const planIds = subscriptions.map(sub => sub.plan_category_id);
      const planStarts = subscriptions.map(sub => new Date(sub.plan_start));
      const planEnds = subscriptions.map(sub => new Date(sub.plan_end));

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });


      const uniquePlanIds = [
        ...new Set(planIds.filter(id => id !== null).map(id => id.toString()))
      ].map(id => new ObjectId(id));


      const query = {
        service: service_id,
        close_status: true,
        $or: uniquePlanIds.map((planId, index) => ({
          planid: planId.toString(), // Matching the planid with regex
          created_at: { $lte: planEnds[index] },
          closedate: { $gte: planStarts[index] }      // Checking if created_at is <= to planEnds
        }))
      };


      //   const query = {
      //     service: service_id,
      //     close_status: false,
      //     $or: uniquePlanIds.map((planId, index) => {
      //         return {
      //             planid: { $regex: `(^|,)${planId}($|,)` }
      //             created_at: { $lte: planEnds[index] } // Compare created_at with the plan_end date of each subscription
      //         };
      //     })
      // };


      //console.log("Final Query:", JSON.stringify(query, null, 2));
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
      // console.error("Error fetching signals:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async getStockrating(req, res) {
    try {

      const { symbol } = req.params;
      const result = await Stockrating_Modal.find({ del: false, symbol: symbol });


      if (result.length === 0) {
        return res.json({
          status: false,
          message: "Stock rating not available",
          data: [],
        });
      }


      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async SignalLatest(req, res) {
    try {
      const { service_id, client_id } = req.body;

      // Ensure service_id is provided
      if (!service_id) {
        return res.json({ status: false, message: "Service ID is required", data: [] });
      }

      // Query to fetch the last 5 signals
      const query = {
        service: service_id, // Match the service_id
        close_status: false  // Ensure signals are active (not closed)
      };

      const signals = await Signal_Modal.find(query)
        .sort({ created_at: -1 }) // Sort by created_at in descending order
        .limit(5) // Fetch only the last 5 signals
        .lean();

      const protocol = req.protocol;
      const baseUrl = `${protocol}://${req.headers.host}`;

      // Enhance the signals with additional info
      const signalsWithReportUrls = await Promise.all(
        signals.map(async (signal) => {
          // Check if the signal was purchased by the client
          const order = await Order_Modal.findOne({
            clientid: client_id,
            signalid: signal._id
          }).lean();

          return {
            ...signal,
            report_full_path: signal.report ? `${baseUrl}/uploads/report/${signal.report}` : null, // Full report URL
            purchased: order ? true : false, // Whether the signal was purchased
            order_quantity: order ? order.quantity : 0 // Quantity if purchased
          };
        })
      );

      return res.json({
        status: true,
        message: "Last 5 signals retrieved successfully",
        data: signalsWithReportUrls
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

  async updatePerformanceStatus(req, res) {
    try {
      const { client_id, performance_status } = req.body;
      // Validate required fields
      if (!client_id) {
        return res.status(400).json({ message: "Client ID are required." });
      }

      // Find client by ID
      const client = await Clients_Modal.findById(client_id);
      if (!client) {
        return res.status(404).json({ message: "Client not found." });
      }

      // Update performance status (0 or 1)
      client.performance_status = performance_status;
      await client.save();

      return res.status(200).json({ message: "Performance status updated successfully.", data: client });

    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  }



}


function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return `${day}/${month}/${year}`;

}










module.exports = new List();