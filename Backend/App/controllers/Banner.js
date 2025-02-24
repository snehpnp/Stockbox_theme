const db = require("../Models");
const upload = require('../Utils/multerHelper'); 

const Banner_Modal = db.Banner;
class BannerController {
    // Create a new Banner post
    async AddBanner(req, res) {

        try {


            await new Promise((resolve, reject) => {
                upload('banner').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
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
    
            // After the upload is successful, proceed with the rest of the logic
            const { add_by, hyperlink, type } = req.body;

           
              if (!add_by) {
                return res.status(400).json({ status: false, message: "add_by is required" });
              }


            const image = req.files['image'] ? req.files['image'][0].filename : null;
    
            // Create a new News record
            const result = new Banner_Modal({
                image: image,
                hyperlink:hyperlink,
                add_by:add_by,
                type:type,
            });
            
            // Save the result to the database
            await result.save();
    
         
            return res.json({
                status: true,
                message: "Banner added successfully",
            });
    
        } catch (error) {
            // console.log("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }

    // Get all Banner posts
    async getBanner(req, res) {
        try {
            const Banner = await Banner_Modal.find({ del: false }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Banner retrieved successfully",
                data: Banner
            });
        } catch (error) {
            // console.log("Error retrieving Banner:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async activeBanner(req, res) {
        try {

            const banner = await Banner_Modal.find({ del: false,status: true }).sort({created_at:-1});;

            return res.status(200).json({
                status: true,
                message: "Banner retrieved successfully",
                data: banner
            });
        } catch (error) {
            // console.log("Error retrieving Banner:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    // Get a single Banner post by ID
    async detailBanner(req, res) {
        try {
            const { id } = req.params;

            const banner = await Banner_Modal.findById(id);

            if (!banner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Banner retrieved successfully",
                data: banner
            });
        } catch (error) {
            // console.log("Error retrieving Banner:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    async updateBanner(req, res) {
        try {


            await new Promise((resolve, reject) => {
                upload('banner').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }


                    resolve();
                });
            });
    

            const { id, hyperlink,type } = req.body;
          

            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Banner ID is required",
                });
            }
    
            // Handle the image upload
       
            // Get the updated image filename if a new image was uploaded
            const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;
            // Prepare the update object
            
            const updateFields = { hyperlink,type };
            if (image) {
                updateFields.image = image;
            }

    
            const updatedbanner = await Banner_Modal.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, runValidators: true } // Options: return the updated document and run validators
            );
            // If the news item is not found
            if (!updatedbanner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found",
                });
            }
    
            // console.log("Updated Banner:", updatedbanner);
            return res.json({
                status: true,
                message: "Banner updated successfully",
                data: updatedbanner,
            });
    
        } catch (error) {
            // console.log("Error updating Banner:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    
   
  
    // Delete a Banner post by ID
    async deleteBanner(req, res) {
        try {
            const { id } = req.params;

            // const deletedBanner = await Banner_Modal.findByIdAndDelete(id);
            const deletedbanner = await Banner_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedbanner) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Banner deleted successfully"
            });
        } catch (error) {
            // console.log("Error deleting Banner:", error);
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
            const result = await Banner_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Banner not found"
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

module.exports = new BannerController();
