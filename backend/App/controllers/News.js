const db = require("../Models");
const upload = require('../Utils/multerHelper'); 
const News_Modal = db.News;
const Notification_Modal = db.Notification;
const Clients_Modal = db.Clients;
const { sendFCMNotification } = require('./Pushnotification'); 


class NewsController {
  
    async AddNews(req, res) {
        try {
           

            await new Promise((resolve, reject) => {
                upload('news').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }
                    if (!req.files || !req.files['image']) {
                       
                        return res.status(400).json({ status: false, message: "No file uploaded." });
                      }
                    resolve();
                });
            });
    
          
            const { title, description,add_by } = req.body;


            if (!title) {
                return res.status(400).json({ status: false, message: "title is required" });
              }
              if (!description) {
                return res.status(400).json({ status: false, message: "description is required" });
              }
          
              if (!add_by) {
                return res.status(400).json({ status: false, message: "add_by is required" });
              }


            const image = req.files['image'] ? req.files['image'][0].filename : null;
    
           
            const result = new News_Modal({
                title: title,
                description: description,
                image: image,
                add_by:add_by,
            });
            
            
            await result.save();

            const notificationTitle = 'Important Update';
            const notificationBody = `News Alert ${title}`;
            
            const clients = await Clients_Modal.find({
                del: 0,
                ActiveStatus: 1,
                devicetoken: { $exists: true, $ne: null }
              }).select('devicetoken');
        
              const tokens = clients.map(client => client.devicetoken);
        
              if (tokens.length > 0) {
          
                const resultn = new Notification_Modal({
                  segmentid:result._id,
                  type:'add news',
                  title: notificationTitle,
                  message: notificationBody
              });
        
              await resultn.save();
              try {
                // Send notifications to all device tokens
                await sendFCMNotification(notificationTitle, notificationBody, tokens,"add news");
                // console.log('Notifications sent successfully');
              } catch (error) {
                // console.error('Error sending notifications:', error);
              }
        
        
              }
        
    
            return res.json({
                status: true,
                message: "News added successfully",
            });
    
        } catch (error) {
            // console.log("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }
    
   



    async getNews(req, res) {
        try {


        
           // const news = await News_Modal.find();
            const news = await News_Modal.find({ del: false }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "News retrieved successfully",
                data: news
            });
        } catch (error) {
            // console.log("Error retrieving news:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async activeNews(req, res) {
        try {


        
           // const news = await News_Modal.find();
            const news = await News_Modal.find({ del: false,status: true });

            return res.status(200).json({
                status: true,
                message: "News retrieved successfully",
                data: news
            });
        } catch (error) {
            // console.log("Error retrieving news:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    // Get a single blog post by ID
    async detailNews(req, res) {
        try {
            const { id } = req.params;

            const news = await News_Modal.findById(id);

            if (!news) {
                return res.status(404).json({
                    status: false,
                    message: "News not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "News retrieved successfully",
                data: news
            });
        } catch (error) {
            // console.log("Error retrieving news:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

   
    async updateNews(req, res) {
        try {

            await new Promise((resolve, reject) => {
                upload('news').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }
                  
                    resolve();
                });
            });

            const { id, title, description } = req.body;

            if (!title) {
                return res.status(400).json({ status: false, message: "title is required" });
              }
              if (!description) {
                return res.status(400).json({ status: false, message: "description is required" });
              }
          
            
          
            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "News ID is required",
                });
            }
    
            // Handle the image upload
           
    
            // Get the updated image filename if a new image was uploaded
            const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;
    
            // Prepare the update object
            const updateFields = {
                title,
                description,
            };
    
            if (image) {
                updateFields.image = image;
            }
    
            // Find the news by ID and update the fields
            const updatedNews = await News_Modal.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, runValidators: true } // Options: return the updated document and run validators
            );
    
            // If the news item is not found
            if (!updatedNews) {
                return res.status(404).json({
                    status: false,
                    message: "News not found",
                });
            }
    
            // console.log("Updated News:", updatedNews);
            return res.json({
                status: true,
                message: "News updated successfully",
                data: updatedNews,
            });
    
        } catch (error) {
            // console.log("Error updating News:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    
  
    // Delete a blog post by ID
    async deleteNews(req, res) {
        try {
            const { id } = req.params;

          //  const deletedNews = await News_Modal.findByIdAndDelete(id);

          const deletedNews = await News_Modal.findByIdAndUpdate(
            id, 
            { del: true }, // Set del to true
            { new: true }  // Return the updated document
          );
    

            if (!deletedNews) {
                return res.status(404).json({
                    status: false,
                    message: "News not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "News deleted successfully"
            });
        } catch (error) {
            // console.log("Error deleting news:", error);
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
            const validStatuses = ['true', 'false'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status value"
                });
            }
      
            // Find and update the plan
            const result = await News_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "News not found"
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
      
    

}

module.exports = new NewsController();
