const db = require("../Models");
const upload = require('../Utils/multerHelper'); 
const Ticket_Modal = db.Ticket;
const Ticketmessage_Modal = db.Ticketmessage;
const Notification_Modal = db.Notification;
const Clients_Modal = db.Clients;
const { sendFCMNotification } = require('./Pushnotification'); 

class TicketController {
    // Create a new Bank post
    async rePly(req, res) {
        try {
            
            // Handle the image upload
            await new Promise((resolve, reject) => {
                upload('ticket').fields([{ name: 'attachment', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }

                    // if (!req.files || !req.files['attachment']) {
                       
                    //     return res.status(400).json({ status: false, message: "No file uploaded." });
                    //   }


                    resolve();
                });
            });
    
            // After the upload is successful, proceed with the rest of the logic
            const { ticket_id, message, adminname } = req.body;

            if (!ticket_id) {
                return res.status(400).json({ status: false, message: "Ticket Id is required" });
              }
              if (!message) {
                return res.status(400).json({ status: false, message: "Message is required" });
              }
          

            const attachment = req.files['attachment'] ? req.files['attachment'][0].filename : null;
    
            // Create a new News record
            const result = new Ticketmessage_Modal({
                ticket_id: ticket_id,
                message: message,
                attachment: attachment,
                adminname: adminname,
                
            });
            
            // Save the result to the database
            await result.save();

            const ticket = await Ticket_Modal.findById(ticket_id);

if (ticket && ticket.status === 0) {
    ticket.status = 1;
    await ticket.save();
}

            return res.json({
                status: true,
                message: "reply successfully",
            });
    
        } catch (error) {
            // console.log("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }


    async  getTicketWithFilter(req, res) {
      try {
        const { page = 1, from, to, status, search } = req.body;
        const limit = 10;
        const skip = (parseInt(page) - 1) * parseInt(limit);
    
        // Build the match query
        const matchQuery = {
          del: false
        };
    
        // Date range filter
        if (from && to) {
          matchQuery.created_at = {
            $gte: new Date(from),
            $lte: new Date(to)
          };
        }
    
        // Status filter
        if (status !== undefined && status !== "") {
          // Agar status aya hai aur empty nahi hai
          const parsedStatus = Number(status); // Convert to Number (0,1,2)
        
          if (!isNaN(parsedStatus)) {
            matchQuery.status = parsedStatus;
          }
        }
        // Aggregation pipeline with lookup and match
        const pipeline = [
          {
            $match: matchQuery
          },
          {
            $lookup: {
              from: "clients",
              localField: "client_id",
              foreignField: "_id",
              as: "client"
            }
          },
          {
            $unwind: "$client"
          }
        ];
    
        // Search by name, email, phone
        if (search) {
          const regex = new RegExp(search, "i"); // case-insensitive
          pipeline.push({
            $match: {
              $or: [
                { "client.FullName": { $regex: regex } },
                { "client.Email": { $regex: regex } },
                { "client.PhoneNo": { $regex: regex } }
              ]
            }
          });
        }
    
        // Count total
        const totalCountPipeline = [...pipeline, { $count: "total" }];
        const totalResult = await Ticket_Modal.aggregate(totalCountPipeline);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;
    
        // Add pagination
        pipeline.push({ $sort: { created_at: -1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: parseInt(limit) });
    
        let tickets = await Ticket_Modal.aggregate(pipeline);
    
        const BASE_URL = `https://${req.headers.host}/uploads/ticket/`;

        tickets = tickets.map(ticket => {
          if (ticket.attachment) {
            ticket.attachment = BASE_URL + ticket.attachment;
          }
          return ticket;
        });


        return res.json({
          status: true,
          data: tickets,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
      //  console.error("getTickets error:", error);
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: error.message
        });
      }
    }
    
    async  detailTicket(req, res) {
        try {
          const { ticketid } = req.params;
      
          if (!ticketid) {
            return res.status(400).json({
              status: false,
              message: "ticketid is required",
            });
          }
      
          // Fetch ticket details
          const ticket = await Ticket_Modal.findById(ticketid)
          .populate("client_id", "FullName Email PhoneNo")
          .lean();
      


          
          if (!ticket) {
            return res.status(404).json({
              status: false,
              message: "Ticket not found",
            });
          }
         
         
          const BASE_URL = `https://${req.headers.host}/uploads/ticket/`;
      
          if (ticket.attachment) {
            ticket.attachment = BASE_URL + ticket.attachment;
          }
          // Fetch related messages
          let messages = await Ticketmessage_Modal.find({ ticket_id: ticketid, del: false })
            .sort({ created_at: 1 }) // oldest to newest
            .lean();

            messages = messages.map(message => {
                if (message.attachment) {
                  message.attachment = BASE_URL + message.attachment;
                }
                return message;
              });
      
          return res.json({
            status: true,
            data: {
              ticket,
              messages
            }
          });
      
        } catch (error) {
        //  console.error("getTicketDetailById error:", error);
          return res.status(500).json({
            status: false,
            message: "Server Error",
            error: error.message
          });
        }
      }
  
    // Delete a Bank post by ID
    async deleteTicket(req, res) {
        try {
            const { id } = req.params;

            // const deletedBank = await Bank_Modal.findByIdAndDelete(id);
            const deletedTicket = await Ticket_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedTicket) {
                return res.status(404).json({
                    status: false,
                    message: "Ticket not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Ticket deleted successfully"
            });
        } catch (error) {
            // console.log("Error deleting Bank:", error);
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
            const validStatuses = [0, 1, 2, "0", "1", "2"];

            if (!validStatuses.includes(status)) {
              return res.json({
                status: false,
                message: "Invalid status value."
              });
            }
            
            // Ensure status is stored as a number
            const parsedStatus = Number(status);
            
            // Find and update the ticket
            const result = await Ticket_Modal.findByIdAndUpdate(
              id,
              { status: parsedStatus },
              { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.json({
                    status: false,
                    message: "Ticket not found"
                });
            }
      
            return res.json({
                status: true,
                message: "Status updated successfully",
                data: result
            });
      
        } catch (error) {
            // console.log("Error updating status:", error);
            return res.json({
                status: false,
                message: "Server error",
                data: []
            });
        }
      }


      
}

module.exports = new TicketController();
