const db = require("../Models");
const Broadcast_Modal = db.Broadcast;
const Clients_Modal = db.Clients;
const Notification_Modal = db.Notification;
const Planmanage = db.Planmanage;

const { sendFCMNotification } = require('./Pushnotification'); // Adjust if necessary


class BroadcastController {
    async AddBroadcast(req, res) {

        try {

            const { subject, message, service, type } = req.body;
             console.log("req.body",req.body)
              if (!subject) {
                return res.status(400).json({ status: false, message: "subject is required" });
              }
              if (!message) {
                return res.status(400).json({ status: false, message: "message is required" });
              }

            //   if (!service) {
            //     return res.status(400).json({ status: false, message: "service is required" });
            //   }
             
             
            //   let services;
            //   if (Array.isArray(service)) {
            //       services = service.join(',');  // Convert array to comma-separated string
            //   } else if (typeof service === 'string') {
            //       services = service;  // If it's already a string, use it directly
            //   } else {
            //       return res.status(400).json({ status: false, message: "Invalid service format" });
            //   }
    
            // Create a new News record
            const result = new Broadcast_Modal({
                subject: subject,
                service: service,
                type: type,
                message:message,
            });
            
            // Save the result to the database
            await result.save();
    





            // const clients = await Clients_Modal.find({
            //     del: 0,
            //     ActiveStatus: 1,
            //     devicetoken: { $exists: true, $ne: null }
            //   }).select('devicetoken');


            const today = new Date();
            let clients;
if(type=="active")
    {
         clients = await Clients_Modal.find({
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

    }
   else if(type=="expired")
        {
            
         clients = await Clients_Modal.find({
            del: 0,
            ActiveStatus: 1,
            devicetoken: { $exists: true, $ne: null },
            _id: {
              $in: await Planmanage.find({
                serviceid: service,  // Replace `service` with your actual service value
                enddate: { $lt: today }
              }).distinct('clientid')  // Assuming 'clientid' is the field linking to Clients_Modal
            }
          }).select('devicetoken');
          
        }
        else if(type=="nonsubscribe"){
            
         clients = await Clients_Modal.find({
              del: 0,
              ActiveStatus: 1,
              devicetoken: { $exists: true, $ne: null }, // Only clients with valid device tokens
              _id: {
                $nin: await Planmanage.distinct('clientid'), // Exclude clients whose IDs are in Planmanage
              },
            }).select('devicetoken');
       }
       else{
            clients = await Clients_Modal.find({
              del: 0,
              ActiveStatus: 1,
              devicetoken: { $exists: true, $ne: null }
            }).select('devicetoken');

       }



              const tokens = clients.map(client => client.devicetoken);

            


              if (tokens.length > 0) {
  
    
                const notificationTitle = 'Important Update';
                const notificationBody = `Broadcast Alert ${subject}`;

                const resultn = new Notification_Modal({
                  segmentid:service,
                  clienttype:type,
                  type:"add broadcast",
                  title: notificationTitle,
                  message: notificationBody
              });
      
              await resultn.save();
  
  
              try {
                // Send notifications to all device tokens
                await sendFCMNotification(notificationTitle, notificationBody, tokens, "add broadcast");
                // console.log('Notifications sent successfully');
              } catch (error) {
                // console.error('Error sending notifications:', error);
              }
  
  
              }
    
  

            return res.json({
                status: true,
                message: "Broadcast added successfully",
            });
    
        } catch (error) {
            // console.error("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }

    // Get all Broadcast posts
    async getBroadcast(req, res) {
        try {

            const Broadcast = await Broadcast_Modal.find({ del: false }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Broadcast retrieved successfully",
                data: Broadcast
            });
        } catch (error) {
            // console.error("Error retrieving Broadcast:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async activeBroadcast(req, res) {
        try {

            const Broadcast = await Broadcast_Modal.find({ del: false,status: true }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Broadcast retrieved successfully",
                data: Broadcast
            });
        } catch (error) {
            // console.error("Error retrieving Broadcast:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    // Get a single Broadcast post by ID
    async detailBroadcast(req, res) {
        try {
            const { id } = req.params;

            const Broadcast = await Broadcast_Modal.findById(id);

            if (!Broadcast) {
                return res.status(404).json({
                    status: false,
                    message: "Broadcast not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Broadcast retrieved successfully",
                data: Broadcast
            });
        } catch (error) {
            // console.error("Error retrieving Broadcast:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    async updateBroadcast(req, res) {
        try {


            const { id, service, subject, message,type } = req.body;
              


            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Broadcast ID is required",
                });
            }
    
            // let services;
            // if (Array.isArray(service)) {
            //     services = service.join(',');  // Convert array to comma-separated string
            // } else if (typeof service === 'string') {
            //     services = service;  // If it's already a string, use it directly
            // } else {
            //     return res.status(400).json({ status: false, message: "Invalid service format" });
            // }
  
            const updatedBroadcast = await Broadcast_Modal.findByIdAndUpdate(
                id,
                {
                    service:service,
                    subject,
                    message,
                    type
                },
                { new: true, runValidators: true } // Options: return the updated document and run validators
            );
    
            // If the news item is not found
            if (!updatedBroadcast) {
                return res.status(404).json({
                    status: false,
                    message: "Broadcast not found",
                });
            }
    
            // console.log("Updated Broadcast:", updatedBroadcast);
            return res.json({
                status: true,
                message: "Broadcast updated successfully",
                data: updatedBroadcast,
            });
    
        } catch (error) {
            // console.error("Error updating Broadcast:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    
   
  
    // Delete a Broadcast post by ID
    async deleteBroadcast(req, res) {
        try {
            const { id } = req.params;

            // const deletedBroadcast = await Broadcast_Modal.findByIdAndDelete(id);
            const deletedBroadcast = await Broadcast_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedBroadcast) {
                return res.status(404).json({
                    status: false,
                    message: "Broadcast not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Broadcast deleted successfully"
            });
        } catch (error) {
            // console.error("Error deleting Broadcast:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }
    async  statusChange(req, res) {
        try {
            const { id, status } = req.body;
      
            // Validate status

            const validStatuses = [true, false];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status value"
                });
            }
      
            // Find and update the plan
            const result = await Broadcast_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Broadcast not found"
                });
            }
      
            return res.json({
                status: true,
                message: "Status updated successfully",
                data: result
            });
      
        } catch (error) {
            // console.error("Error updating status:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                data: []
            });
        }
      }
      
}

module.exports = new BroadcastController();
