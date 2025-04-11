const db = require("../Models");
const mongoose = require('mongoose'); // Import mongoose
const Plan_Modal = db.Plan;
const Service_Modal = db.Service;
const PlanSubscription_Modal = db.PlanSubscription;
const Planmanage = db.Planmanage;
const Clients_Modal = db.Clients;
const License_Modal = db.License;
const Refer_Modal = db.Refer;
const BasicSetting_Modal = db.BasicSetting;
const Addtocart_Modal = db.Addtocart;
const Mailtemplate_Modal = db.Mailtemplate;
const BasketSubscription_Modal = db.BasketSubscription;

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { sendEmail } = require('../Utils/emailService');


const Adminnotification_Modal = db.Adminnotification;

class Plan {

    async AddPlan(req, res) {
        try {
            const { title, description, price, validity, category, add_by, deliverystatus } = req.body;
    
            // Debugging: Log the incoming request body to ensure the data is correct
    
            const result = new Plan_Modal({
                title,
                description,
                price,
                validity,
                category,
                add_by,
                deliverystatus,
            });
    
            await result.save();
    
            // console.log("Plan successfully added:", result);
            return res.json({
                status: true,
                message: "Package added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Plan:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

    async getPlan(req, res) {
        try {

           
            const plans = await Plan_Modal.aggregate([
                {
                    $match: { del: false } // Match plans where 'del' is false
                },
                {
                    $lookup: {
                        from: 'services', // The name of the collection to join with
                        localField: 'service_id', // The field from the Plan_Modal
                        foreignField: '_id', // The field from the Service_Modal
                        as: 'service' // The name of the new array field to add to the output documents
                    }
                },
                {
                    $unwind: {
                        path: '$service',
                        preserveNullAndEmptyArrays: true // If a plan does not have a matching service, it will still appear in the result
                    }
                },
                {
                  $sort: { created_at: -1 } // Sort by created_at in descending order
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
   


    async getPlanByClient(req, res) {
      try {

        const { id } = req.params;
        const clientId = new mongoose.Types.ObjectId(id); // Convert to ObjectId
        const plans = await Plan_Modal.aggregate([
          {
              $match: { del: false,status:"active" } // Match plans where 'del' is false
          },
          {
              $lookup: {
                  from: 'plancategories', // The name of the collection to join with
                  localField: 'category', // The field from the Plan_Modal
                  foreignField: '_id', // The field from the category
                  as: 'category' // The name of the new array field to add to the output documents
              }
          },
          {
              $unwind: {
                  path: '$category',
                  preserveNullAndEmptyArrays: true // If a plan does not have a matching category, it will still appear in the result
              }
          },
          {
    $lookup: {
      from: 'plansubscriptions',
      let: { planId: '$_id', clientId: clientId }, // Pass clientId as a variable
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$plan_id', '$$planId'] }, // Match subscription to the current plan ID
                { $gte: ['$plan_end', new Date()] }, // Check if subscription is still active
                { $eq: ['$del', false] }, // Ensure the subscription is not deleted
                { $eq: ['$client_id', '$$clientId'] } // Match the client ID
              ]
            }
          }
        },
        { $sort: { created_at: -1 } }, // Sort by creation date in descending order
        { $limit: 1 }, // Get only the latest subscription if multiple exist
        { $project: { status: 1 } } // Only include the status field
      ],
      as: 'subscription'
    }
  },
          {
            $unwind: {
              path: '$subscription',
              preserveNullAndEmptyArrays: true // Retain plans without a matching active subscription
            }
          },
          {
            $sort: { created_at: -1 } // Sort by created_at in descending order
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
 


    async activePlan(req, res) {
      try {

         
          const plans = await Plan_Modal.aggregate([
              {
                  $match: { del: false,status:"active" } // Match plans where 'del' is false
              },
              {
                  $lookup: {
                      from: 'plancategories', // The name of the collection to join with
                      localField: 'category', // The field from the Plan_Modal
                      foreignField: '_id', // The field from the category
                      as: 'category' // The name of the new array field to add to the output documents
                  }
              },
              {
                  $unwind: {
                      path: '$category',
                      preserveNullAndEmptyArrays: true // If a plan does not have a matching category, it will still appear in the result
                  }
              },
              {
                $sort: { created_at: -1 } // Sort by created_at in descending order
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
 


    async detailPlan(req, res) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;
    
            // Check if ID is provided
            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Plan ID is required"
                });
            }
    
            
            // Aggregation pipeline
            const plan = await Plan_Modal.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) } // Match the specific plan by ID
                },
                {
                    $lookup: {
                        from: 'plancategories', // The name of the collection to join with
                        localField: 'category', // The field from the Plan_Modal
                        foreignField: '_id', // The field from the category
                        as: 'category' // The name of the new array field to add to the output documents
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true // If a plan does not have a matching category, it will still appear in the result
                    }
                }
            ]);
    
            // Check if Plan is found
            if (plan.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "Plan not found"
                });
            }
    
            return res.json({
                status: true,
                message: "Plan details fetched successfully",
                data: plan[0] // Since we're matching by ID, the result will be an array with a single document
            });
    
        } catch (error) {
            // console.log("Error fetching Plan details:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                data: []
            });
        }
    }

  async updatePlan(req, res) {
    try {
        const { id, title, description, price, validity, category, accuracy, deliverystatus } = req.body;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Plan ID is required",
        });
      } 
  
      const updatedPlan = await Plan_Modal.findByIdAndUpdate(
        id,
        {
            title,
            description,
            price,
            validity,
            category,
            accuracy,
            deliverystatus,
        },
        { plan: true, runValidators: true } 
      );
  
      if (!updatedPlan) {
        return res.status(404).json({
          status: false,
          message: "Plan not found",
        });
      }
  
      // console.log("Updated Plan:", updatedPlan);
      return res.json({
        status: true,
        message: "Plan updated successfully",
        data: updatedPlan,
      });
  
    } catch (error) {
      // console.log("Error updating Plan:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deletePlan(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Plan ID is required",
        });
      }

      //const deletedPlan = await Plan_Modal.findByIdAndDelete(id);
      const deletedPlan = await Plan_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { plan: true }  // Return the updated document
      );

      if (!deletedPlan) {
        return res.status(404).json({
          status: false,
          message: "Plan not found",
        });
      }

      // console.log("Deleted Plan:", deletedPlan);
      return res.json({
        status: true,
        message: "Plan deleted successfully",
        data: deletedPlan,
      });
    } catch (error) {
      // console.log("Error deleting Plan:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
// Ensure this is at the top level of your file, not inside another function or block
async  statusChange(req, res) {
  try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(status)) {
          return res.status(400).json({
              status: false,
              message: "Invalid status value"
          });
      }

      // Find and update the plan
      const result = await Plan_Modal.findByIdAndUpdate(
          id,
          { status: status },
          { new: true } // Return the updated document
      );

      if (!result) {
          return res.status(404).json({
              status: false,
              message: "Plan not found"
          });
      }



      if (status === 'inactive') {
        const deleteResult = await Addtocart_Modal.deleteMany({
            plan_id: id,  // Matching plan ID
            status: false // Status should be false (equivalent to 0)
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


/*
async  addPlanSubscription(req, res) {
    try {
      const { plan_id, client_id, price} = req.body;
      // Validate input
      if (!plan_id || !client_id ) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }
      const plan = await Plan_Modal.findById(plan_id).exec();
  
      const validityMapping = {
        '1 month': 1,
        '3 months': 3,
        '6 months': 6,
        '9 months': 9,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60
      };
  
      const start = new Date();
  
      const monthsToAdd = validityMapping[plan.validity];
    
      if (monthsToAdd === undefined) {
        throw new Error('Invalid validity period');
      }
    
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);  // Set to end of the day
          end.setMonth(start.getMonth() + monthsToAdd);
  
  
  
  
  
      // Create a new subscription
      const newSubscription = new PlanSubscription_Modal({
        plan_id,
        client_id,
        total:plan.price,
        plan_price:price,
        plan_start:start,
        plan_end:end
      });
  
      // Save to the database
      const savedSubscription = await newSubscription.save();
  
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
  */

  async addPlanSubscription(req, res) {
    try {
      const { plan_id, client_id, price } = req.body;
  
      // Validate input
      if (!plan_id) {
        return res.status(400).json({ status: false, message: 'Please Select the Plan' });
      }

      if (!client_id) {
        return res.status(400).json({ status: false, message: 'Client Not Found' });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });
      if (!client) {
        return res.status(400).json({ status: false, message: 'Client Not Actived' });
      }



      // Fetch the plan and populate the category
      const plan = await Plan_Modal.findById(plan_id)
        .populate('category')
        .exec();
  
      if (!plan) {
        return res.status(404).json({ status: false, message: 'Plan not found' });
      }
  

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
      const planservice = plan.category.service;
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
                { $set: { 
                    enddate: existingPlan.enddate,  // Set the new end date
                    startdate: existingPlan.startdate // Set the new start date
                } }  // Update fields
            );
              //  const savedPlan = await existingPlan.save();  
                // console.log("Plan updated successfully:", savedPlan);
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
} 


////////////////// 17/10/2024 ////////////////////////



            // If the plan does not exist, create a new one
            const newPlanManage = new Planmanage({
                clientid: client_id,
                serviceid: serviceId,
                startdate: start,
                enddate: end,
            });
        
            try {
                await newPlanManage.save();  // Save the new plan
                // console.log(`Added new record for service ID: ${serviceId}`);
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
    // console.log('Month found, updating noofclient.',monthsToAdd);
} else {
    license = new License_Modal({
        month: targetMonth,
        noofclient: monthsToAdd
    });
    // console.log('Month not found, inserting new record.');
}

try {
    await license.save();
    // console.log('License updated successfully.');
} catch (error) {

}


////////////////// 17/10/2024 ////////////////////////

let total = plan.price; // Use let for reassignable variables
let totalgst = 0;

if (settings.gst > 0 && settings.gststatus==1) {
  totalgst = (plan.price * settings.gst) / 100; // Use settings.gst instead of gst
  total = plan.price + totalgst;
}

      // Create a new plan subscription record
      const newSubscription = new PlanSubscription_Modal({
        plan_id,
        client_id,
        total: total,
        gstamount:totalgst,
        gst: settings.gst,
        plan_price: price,
        plan_start: start,
        plan_end: end,
        validity: plan.validity,
      });
  
      // Save the subscription
      const savedSubscription = await newSubscription.save();

      if (plan.deliverystatus == true) {
        client.deliverystatus = true;
        await client.save();
      }

      if(client.freetrial==0) 
      {
      client.freetrial  = 1; 
      await client.save();
       }




       const refertokens = await Refer_Modal.find({ user_id: client._id, status: 0 });
 
       if (client.refer_status && client.token) {
         if (refertokens.length > 0) {
         }
         else {
 
           const senderamount = (plan.price * settings.sender_earn) / 100;
           const receiveramount = (plan.price * settings.receiver_earn) / 100;
 
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
           const senderamount = (plan.price * refertoken.senderearn) / 100;
           const receiveramount = (plan.price * refertoken.receiverearn) / 100;
 
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
 









       const  adminnotificationTitle ="Important Update";
       const  adminnotificationBody =`Congratulations! ${client.FullName} ${plan.category.title} Plan successfully assigned by the SuperAdmin`;
         const resultnm = new Adminnotification_Modal({
           clientid:client._id,
           segmentid:savedSubscription._id,
           type:'plan purchase',
           title: adminnotificationTitle,
           message: adminnotificationBody
       });
   
   
       await resultnm.save();
   

//////////////////////// invoice
  // const length = 6;
  //       const digits = '0123456789';
  //       let orderNumber = '';

  //       for (let i = 0; i < length; i++) {
  //         orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
  //       }

  const invoicePrefix = settings.invoice;
        const invoiceStart = settings.invoicestart; 
        const basketCount = await BasketSubscription_Modal.countDocuments({});
        const planCount = await PlanSubscription_Modal.countDocuments({});
        const totalCount = basketCount + planCount;
        const invoiceNumber = invoiceStart + totalCount;
        const formattedNumber = invoiceNumber < 10 ? `0${invoiceNumber}` : `${invoiceNumber}`;
        const orderNumber = `${invoicePrefix}${formattedNumber}`;



        let payment_type;
          payment_type = "Offline";
        

        const templatePath = path.join(__dirname, '../../template', 'invoice.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        let sgst = 0, cgst = 0, igst = 0;

        if (client.state.toLowerCase() === settings.state.toLowerCase() || client.state.toLowerCase() ==="") {
            sgst = totalgst / 2;
            cgst = totalgst / 2;
        } else {
            igst = totalgst;
        }
        const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
        const simage = `https://${req.headers.host}/uploads/basicsetting/${settings.simage}`;

        
                htmlContent = htmlContent
                  .replace(/{{orderNumber}}/g, `${orderNumber}`)
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
                  .replace(/{{company_email}}/g, settings.email_address)
                  .replace(/{{company_phone}}/g, settings.contact_number)
                  .replace(/{{company_address}}/g, settings.address)
                  .replace(/{{company_website_title}}/g, settings.website_title)
                  .replace(/{{invoicetnc}}/g, settings.invoicetnc)
                  .replace(/{{gstin}}/g, settings.gstin)
                  .replace(/{{gstamount}}/g, totalgst)
                  .replace(/{{state}}/g, client.state)
                  .replace(/{{gst}}/g, settings.gst)
                  .replace(/{{sgst}}/g, sgst.toFixed(2))
                  .replace(/{{cgst}}/g, cgst.toFixed(2))
                  .replace(/{{igst}}/g, igst.toFixed(2))
                  .replace(/{{logo}}/g, logo)
                  .replace(/{{simage}}/g, simage)
                  .replace(/{{plan_start}}/g, formatDate(savedSubscription.plan_start));


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `${orderNumber}.pdf`);

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

        savedSubscription.ordernumber = `${orderNumber}`;
        savedSubscription.invoice = `${orderNumber}.pdf`;
        const updatedSubscription = await savedSubscription.save();
        if (settings.invoicestatus == 1) {

        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }

        const templatePaths = path.join(__dirname, '../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

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
                filename: `${orderNumber}.pdf`, // PDF file name
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



  async  paymentHistory(req, res) {
    try {
      
      
      const result = await PlanSubscription_Modal.aggregate([
        {
          $match: {
            del: false,
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
          $lookup: {
            from: 'plancategories', // The name of the plancategories collection
            localField: 'planDetails.category', // Field in plans referencing plancategories
            foreignField: '_id', // The field in the plancategories collection that is referenced
            as: 'planCategoryDetails' // The name of the field in the result that will hold the joined data
          }
        },
        {
          $unwind: '$planCategoryDetails' // Unwind if you expect only one matching category
        },
        {
          $lookup: {
            from: 'services',
            let: { serviceIds: { $split: ['$planCategoryDetails.service', ','] } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }]
                      },
                      { $eq: ['$status', true] }, // Match active services
                      { $eq: ['$del', false] } // Match non-deleted services
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1 // Service title
                }
              }
            ],
            as: 'serviceDetails'
          }
        },
        {
          $lookup: {
            from: 'clients', // The name of the clients collection
            localField: 'client_id', // The field in PlanSubscription_Modal that references the client
            foreignField: '_id', // The field in the clients collection that is referenced
            as: 'clientDetails' // The name of the field in the result that will hold the joined client data
          }
        },
        {
          $unwind: '$clientDetails' // Optional: Unwind the result if you expect only one matching client per subscription
        },
        {
          $project: {
            orderid: 1,
            created_at: 1,
            plan_price:1,
            total:1,
            coupon:1,
            discount:1,
            planDetails: 1,
            clientName: '$clientDetails.FullName',
            clientEmail: '$clientDetails.Email',
            clientPhoneNo: '$clientDetails.PhoneNo',
            planCategoryTitle: '$planCategoryDetails.title',
            serviceNames: { $map: { input: '$serviceDetails', as: 'service', in: '$$service.title' } } // Extract service titles
      
           
          }
        },
        {
          $sort: { created_at: -1 } // Sort by created_at in descending order
        }
      ]);
  
      // Respond with the retrieved subscriptions
      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result
      });
  
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }



  async paymentHistoryWithFilter(req, res) {
    try {
      const { fromDate, toDate, search, page = 1 } = req.body; // Extract fromDate, toDate, page, and limit from the request body
      let limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of items to skip based on page and limit
  
      // Build match conditions based on the date range
      const matchConditions = { del: false };


      
      if (fromDate && toDate) {
        const startOfFromDate = new Date(fromDate);
        startOfFromDate.setHours(0, 0, 0, 0); 
      
        const endOfToDate = new Date(toDate);
        endOfToDate.setHours(23, 59, 59, 999); 
      
        matchConditions.created_at = {
          $gte: startOfFromDate,
          $lte: endOfToDate,
        };
      }


      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } }, // Search by client name
          { "clientDetails.Email": { $regex: search, $options: "i" } },    // Search by client email
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }   // Search by client mobile
        ]
      } : {};
  
      const result = await PlanSubscription_Modal.aggregate([
        {
          $match: matchConditions
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
          $lookup: {
            from: 'plancategories', // The name of the plancategories collection
            localField: 'planDetails.category', // Field in plans referencing plancategories
            foreignField: '_id', // The field in the plancategories collection that is referenced
            as: 'planCategoryDetails' // The name of the field in the result that will hold the joined data
          }
        },
        {
          $unwind: '$planCategoryDetails' // Unwind if you expect only one matching category
        },
        {
          $lookup: {
            from: 'services',
            let: { serviceIds: { $split: ['$planCategoryDetails.service', ','] } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }]
                      },
                      { $eq: ['$status', true] }, // Match active services
                      { $eq: ['$del', false] } // Match non-deleted services
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1 // Service title
                }
              }
            ],
            as: 'serviceDetails'
          }
        },
        {
          $lookup: {
            from: 'clients', // The name of the clients collection
            localField: 'client_id', // The field in PlanSubscription_Modal that references the client
            foreignField: '_id', // The field in the clients collection that is referenced
            as: 'clientDetails' // The name of the field in the result that will hold the joined client data
          }
        },
        {
          $unwind: '$clientDetails' // Optional: Unwind the result if you expect only one matching client per subscription
        },
        { $match: searchMatch },
        {
          $project: {
            orderid: 1,
            created_at: 1,
            plan_price: 1,
            total: 1,
            coupon: 1,
            discount: 1,
            validity:1,
            planDetails: 1,
            gstamount: 1,
            invoice: 1,
            gst: 1,
            clientName: '$clientDetails.FullName',
            clientEmail: '$clientDetails.Email',
            clientPhoneNo: '$clientDetails.PhoneNo',
            state: '$clientDetails.state',
            planCategoryTitle: '$planCategoryDetails.title',
            serviceNames: { $map: { input: '$serviceDetails', as: 'service', in: '$$service.title' } } // Extract service titles
          }
        },
        {
          $sort: { created_at: -1 } // Sort by created_at in descending order
        },
        {
          $skip: skip // Pagination: Skip the first 'skip' number of items
        },
        {
          $limit: parseInt(limit) // Limit the result to 'limit' items
        }
      ]);
  
      // Get the total count for pagination
      const totalRecordsPipeline = [
        { $match: matchConditions },
        {
          $lookup: {
            from: 'clients',
            localField: 'client_id',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        { $unwind: '$clientDetails' },
        { $match: searchMatch },
        { $count: 'total' }
      ];
      const totalRecordsResult = await PlanSubscription_Modal.aggregate(totalRecordsPipeline);
      const totalRecords = totalRecordsResult[0] ? totalRecordsResult[0].total : 0;
      const totalPages = Math.ceil(totalRecords / limit);
      // Respond with the retrieved subscriptions
      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result,
        pagination: {
          total: totalRecords,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });
  
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }
  


  async addPlanSubscriptionAddToCart(req, res) {
    try {
      const { plan_id, client_id, price } = req.body;
  
      // Validate input
      if (!plan_id) {
        return res.status(400).json({ status: false, message: 'Please Select the Plan' });
      }

      if (!client_id) {
        return res.status(400).json({ status: false, message: 'Client Not Found' });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });
      if (!client) {
        return res.status(400).json({ status: false, message: 'Client Not Actived' });
      }

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
        else
        {
          const newPlanManage = new Planmanage({
            clientid: client_id,
            serviceid: serviceId,
            startdate: start,
            enddate: end,
          });
            await newPlanManage.save();
        }
      }


   /*   // Split the services in the category if they exist
      const planservice = plan.category.service;
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
                { $set: { 
                    enddate: existingPlan.enddate,  // Set the new end date
                    startdate: existingPlan.startdate // Set the new start date
                } }  // Update fields
            );
              //  const savedPlan = await existingPlan.save();  
                // console.log("Plan updated successfully:", savedPlan);
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
} 


////////////////// 17/10/2024 ////////////////////////



            // If the plan does not exist, create a new one
            const newPlanManage = new Planmanage({
                clientid: client_id,
                serviceid: serviceId,
                startdate: start,
                enddate: end,
            });
        
            try {
                await newPlanManage.save();  // Save the new plan
                // console.log(`Added new record for service ID: ${serviceId}`);
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
    // console.log('Month found, updating noofclient.',monthsToAdd);
} else {
    license = new License_Modal({
        month: targetMonth,
        noofclient: monthsToAdd
    });
    // console.log('Month not found, inserting new record.');
}

try {
    await license.save();
    // console.log('License updated successfully.');
} catch (error) {

}


////////////////// 17/10/2024 ////////////////////////
const settings = await BasicSetting_Modal.findOne();
let total = plan.price; // Use let for reassignable variables
let totalgst = 0;

if (settings.gst > 0 && settings.gststatus==1) {
  totalgst = (plan.price * settings.gst) / 100; // Use settings.gst instead of gst
  total = plan.price + totalgst;
}
// const length = 6;
// const digits = '0123456789';
// let orderNumber = '';

// for (let i = 0; i < length; i++) {
//   orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
// }

const invoicePrefix = settings.invoice;
const invoiceStart = settings.invoicestart; 
const basketCount = await BasketSubscription_Modal.countDocuments({});
const planCount = await PlanSubscription_Modal.countDocuments({});
const totalCount = basketCount + planCount;
const invoiceNumber = invoiceStart + totalCount;
const formattedNumber = invoiceNumber < 10 ? `0${invoiceNumber}` : `${invoiceNumber}`;
const orderNumber = `${invoicePrefix}${formattedNumber}`;


      // Create a new plan subscription record
      const newSubscription = new PlanSubscription_Modal({
        plan_id,
        plan_category_id: plan.category._id,
        client_id,
        total: total,
        gstamount:totalgst,
        gst: settings.gst,
        plan_price: price,
        plan_start: start,
        plan_end: end,
        validity: plan.validity,
        ordernumber:`${orderNumber}`,
        invoice:`${orderNumber}.pdf`,
      });
  
      // Save the subscription
      const savedSubscription = await newSubscription.save();

      if (plan.deliverystatus == true) {
        client.deliverystatus = true;
        await client.save();
      }

      if(client.freetrial==0) 
      {
      client.freetrial  = 1; 
      await client.save();
       }



       const refertokens = await Refer_Modal.find({ user_id: client._id, status: 0 });
 
       if (client.refer_status && client.token) {
         if (refertokens.length > 0) {
         }
         else {
 
           const senderamount = (plan.price * settings.sender_earn) / 100;
           const receiveramount = (plan.price * settings.receiver_earn) / 100;
 
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
           const senderamount = (plan.price * refertoken.senderearn) / 100;
           const receiveramount = (plan.price * refertoken.receiverearn) / 100;
 
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
 



       const  adminnotificationTitle ="Important Update";
       const  adminnotificationBody =`Congratulations! ${client.FullName} ${plan.category.title} Plan successfully assigned by the SuperAdmin`;
         const resultnm = new Adminnotification_Modal({
           clientid:client._id,
           segmentid:savedSubscription._id,
           type:'plan purchase',
           title: adminnotificationTitle,
           message: adminnotificationBody
       });
   
   
       await resultnm.save();
   




        let payment_type;
          payment_type = "Offline";
        

        const templatePath = path.join(__dirname, '../../template', 'invoicenew.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');



        let planDetailsHtml = '';
       


      
            let sgst = 0, cgst = 0, igst = 0;

            if (client.state.toLowerCase() === settings.state.toLowerCase() || client.state.toLowerCase() === "") {
                sgst = totalgst / 2;
                cgst = totalgst / 2;
            } else {
                igst = totalgst;
            }


            planDetailsHtml += `
            <tr>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">1</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${plan.category.title}</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">1</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${plan.price}</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">0</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${sgst}</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${cgst}</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${igst}</td>
                <td style="border: 1px solid black; padding: 10px; text-align: center;">${total}</td>
             </tr>`;
 
         
       
          

        const todays = new Date(); 

        const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
        const simage = `https://${req.headers.host}/uploads/basicsetting/${settings.simage}`;



          htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(todays))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{plan_details}}/g, planDetailsHtml)
          .replace(/{{company_email}}/g, settings.email_address)
          .replace(/{{company_phone}}/g, settings.contact_number)
          .replace(/{{company_address}}/g, settings.address)
          .replace(/{{company_website_title}}/g, settings.website_title)
          .replace(/{{invoicetnc}}/g, settings.invoicetnc)
          .replace(/{{gstin}}/g, settings.gstin)
          .replace(/{{state}}/g, client.state)
          .replace(/{{logo}}/g, logo)
          .replace(/{{simage}}/g, simage)
          .replace(/{{total}}/g, total)
          .replace(/{{plantype}}/g, "Plan")
          .replace(/{{discount}}/g, 0);




        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `${orderNumber}.pdf`);

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

   

        if (settings.invoicestatus == 1) {
        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }

        const templatePaths = path.join(__dirname, '../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

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
                filename: `${orderNumber}.pdf`, // PDF file name
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


  async paymentHistoryWithFilterExport(req, res) {
    try {
      const { fromDate, toDate, search } = req.body; // Extract fromDate, toDate, page, and limit from the request body
      // let limit = 10;
      // const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of items to skip based on page and limit
  
      // Build match conditions based on the date range
      const matchConditions = { del: false };


      
      if (fromDate && toDate) {
        const startOfFromDate = new Date(fromDate);
        startOfFromDate.setHours(0, 0, 0, 0); 
      
        const endOfToDate = new Date(toDate);
        endOfToDate.setHours(23, 59, 59, 999); 
      
        matchConditions.created_at = {
          $gte: startOfFromDate,
          $lte: endOfToDate,
        };
      }


      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } }, // Search by client name
          { "clientDetails.Email": { $regex: search, $options: "i" } },    // Search by client email
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } }   // Search by client mobile
        ]
      } : {};
  
      const result = await PlanSubscription_Modal.aggregate([
        {
          $match: matchConditions
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
          $lookup: {
            from: 'plancategories', // The name of the plancategories collection
            localField: 'planDetails.category', // Field in plans referencing plancategories
            foreignField: '_id', // The field in the plancategories collection that is referenced
            as: 'planCategoryDetails' // The name of the field in the result that will hold the joined data
          }
        },
        {
          $unwind: '$planCategoryDetails' // Unwind if you expect only one matching category
        },
        {
          $lookup: {
            from: 'services',
            let: { serviceIds: { $split: ['$planCategoryDetails.service', ','] } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', { $map: { input: '$$serviceIds', as: 'id', in: { $toObjectId: '$$id' } } }]
                      },
                      { $eq: ['$status', true] }, // Match active services
                      { $eq: ['$del', false] } // Match non-deleted services
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1 // Service title
                }
              }
            ],
            as: 'serviceDetails'
          }
        },
        {
          $lookup: {
            from: 'clients', // The name of the clients collection
            localField: 'client_id', // The field in PlanSubscription_Modal that references the client
            foreignField: '_id', // The field in the clients collection that is referenced
            as: 'clientDetails' // The name of the field in the result that will hold the joined client data
          }
        },
        {
          $unwind: '$clientDetails' // Optional: Unwind the result if you expect only one matching client per subscription
        },
        { $match: searchMatch },
        {
          $project: {
            orderid: 1,
            created_at: 1,
            plan_price: 1,
            total: 1,
            coupon: 1,
            discount: 1,
            validity:1,
            planDetails: 1,
            gstamount: 1,
            gst: 1,
            clientName: '$clientDetails.FullName',
            clientEmail: '$clientDetails.Email',
            clientPhoneNo: '$clientDetails.PhoneNo',
            state: '$clientDetails.state',
            planCategoryTitle: '$planCategoryDetails.title',
            serviceNames: { $map: { input: '$serviceDetails', as: 'service', in: '$$service.title' } } // Extract service titles
          }
        },
        {
          $sort: { created_at: -1 } // Sort by created_at in descending order
        },
        // {
        //   $skip: skip // Pagination: Skip the first 'skip' number of items
        // },
        // {
        //   $limit: parseInt(limit) // Limit the result to 'limit' items
        // }
      ]);
  
      // Get the total count for pagination
    
      // Respond with the retrieved subscriptions
      return res.json({
        status: true,
        message: "Subscriptions retrieved successfully",
        data: result,
       
      });
  
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
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

module.exports = new Plan();