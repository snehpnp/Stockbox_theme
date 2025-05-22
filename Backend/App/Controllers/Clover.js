const db = require("../Models");
const upload = require('../Utils/multerHelper'); 
    const fs = require('fs');
const path = require('path');


const Clover_Modal = db.Clover;
class CloverController {
    

async AddClover(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload('banner').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
        if (err) return reject(err);
        if (!req.files || !req.files['image']) {
          return res.status(400).json({ status: false, message: "No file uploaded." });
        }
        resolve();
      });
    });

    const imageFile = req.files['image'][0];

    // ✅ Validate extension
    const ext = path.extname(imageFile.originalname).toLowerCase();
    if (ext !== '.gif') {
      fs.unlinkSync(imageFile.path); // Delete the uploaded file
      return res.status(400).json({ status: false, message: "Only .gif files are allowed" });
    }

    // ✅ Validate size (max 1MB)
    const fileSizeInBytes = imageFile.size;
    if (fileSizeInBytes > 1 * 1024 * 1024) {
      fs.unlinkSync(imageFile.path); // Delete the uploaded file
      return res.status(400).json({ status: false, message: "File size must be 1MB or less" });
    }

    // Proceed with saving
    const { add_by, title } = req.body;
    if (!add_by) {
      return res.status(400).json({ status: false, message: "add_by is required" });
    }

    const result = new Clover_Modal({
      image: imageFile.filename,
      title,
      add_by
    });

    await result.save();

    return res.json({ status: true, message: "Clover added successfully" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: false, message: "Server error", data: [] });
  }
}


    // Get all Clover posts
    async getClover(req, res) {
        try {
            const Clover = await Clover_Modal.find({ del: false }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Clover retrieved successfully",
                data: Clover
            });
        } catch (error) {
            // console.log("Error retrieving Clover:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async activeClover(req, res) {
        try {

            const Clover = await Clover_Modal.find({ del: false,status: true }).sort({created_at:-1});;

            return res.status(200).json({
                status: true,
                message: "Clover retrieved successfully",
                data: Clover
            });
        } catch (error) {
            // console.log("Error retrieving Clover:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    // Get a single Clover post by ID
    async detailClover(req, res) {
        try {
            const { id } = req.params;

            const Clover = await Clover_Modal.findById(id);

            if (!Clover) {
                return res.status(404).json({
                    status: false,
                    message: "Clover not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Clover retrieved successfully",
                data: Clover
            });
        } catch (error) {
            // console.log("Error retrieving Clover:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }



async updateClover(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload('banner').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const { id, title } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Clover ID is required",
      });
    }

    let image = null;

    // If image was uploaded, validate it
    if (req.files && req.files['image']) {
      const imageFile = req.files['image'][0];
      const ext = path.extname(imageFile.originalname).toLowerCase();
      const fileSizeInBytes = imageFile.size;

      if (ext !== '.gif') {
        fs.unlinkSync(imageFile.path); // delete invalid file
        return res.status(400).json({ status: false, message: "Only .gif files are allowed" });
      }

      if (fileSizeInBytes > 1 * 1024 * 1024) {
        fs.unlinkSync(imageFile.path); // delete large file
        return res.status(400).json({ status: false, message: "File size must be 1MB or less" });
      }

      image = imageFile.filename;
    }

    const updateFields = { title };
    if (image) {
      updateFields.image = image;
    }

    const updatedClover = await Clover_Modal.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedClover) {
      return res.status(404).json({
        status: false,
        message: "Clover not found",
      });
    }

    return res.json({
      status: true,
      message: "Clover updated successfully",
      data: updatedClover,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}

   
    // Delete a Clover post by ID
    async deleteClover(req, res) {
        try {
            const { id } = req.params;

            // const deletedClover = await Clover_Modal.findByIdAndDelete(id);
            const deletedClover = await Clover_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedClover) {
                return res.status(404).json({
                    status: false,
                    message: "Clover not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Clover deleted successfully"
            });
        } catch (error) {
            // console.log("Error deleting Clover:", error);
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
            const result = await Clover_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Clover not found"
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

module.exports = new CloverController();
