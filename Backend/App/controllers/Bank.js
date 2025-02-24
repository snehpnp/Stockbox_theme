const db = require("../Models");
const upload = require('../Utils/multerHelper'); 
const Bank_Modal = db.Bank;
const Notification_Modal = db.Notification;
const Clients_Modal = db.Clients;
const { sendFCMNotification } = require('./Pushnotification'); 

class BankController {
    // Create a new Bank post
    async AddBank(req, res) {
        try {
            
            // Handle the image upload
            await new Promise((resolve, reject) => {
                upload('bank').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
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
            const { name, branch, accountno, ifsc } = req.body;

            if (!name) {
                return res.status(400).json({ status: false, message: "Name is required" });
              }
              if (!branch) {
                return res.status(400).json({ status: false, message: "Branch is required" });
              }
          
              if (!accountno) {
                return res.status(400).json({ status: false, message: "Account No. is required" });
              }

              if (!ifsc) {
                return res.status(400).json({ status: false, message: "Ifsc is required" });
              }

            const image = req.files['image'] ? req.files['image'][0].filename : null;
    
            // Create a new News record
            const result = new Bank_Modal({
                name: name,
                ifsc: ifsc,
                branch: branch,
                image: image,
                accountno:accountno,
                type: 1,
            });
            
            // Save the result to the database
            await result.save();


            return res.json({
                status: true,
                message: "Bank added successfully",
            });
    
        } catch (error) {
            // console.log("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }




    async AddQrcode(req, res) {
        try {
            
            // Handle the image upload
            await new Promise((resolve, reject) => {
                upload('bank').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
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
           
            const image = req.files['image'] ? req.files['image'][0].filename : null;
    
            // Create a new News record
            const result = new Bank_Modal({
                image: image,
                type: 2,
            });
            
            // Save the result to the database
            await result.save();


            return res.json({
                status: true,
                message: "Qrcode added successfully",
            });
    
        } catch (error) {
            // console.log("Server error:", error);
            return res.status(500).json({ status: false, message: "Server error", data: [] });
        }
    }

    // Get all Bank posts
    async getBank(req, res) {
        try {

            const Bank = await Bank_Modal.find({ del: false,type:1 }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Bank retrieved successfully",
                data: Bank
            });
        } catch (error) {
            // console.log("Error retrieving Bank:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }



    async getQrcode(req, res) {
        try {

            const Bank = await Bank_Modal.find({ del: false,type:2 }).sort({created_at:-1});

            return res.status(200).json({
                status: true,
                message: "Qrcode retrieved successfully",
                data: Bank
            });
        } catch (error) {
            // console.log("Error retrieving Qrcode:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async activeBank(req, res) {
        try {

            const Bank = await Bank_Modal.find({ del: false,status: true,type:1 });

            return res.status(200).json({
                status: true,
                message: "Bank retrieved successfully",
                data: Bank
            });
        } catch (error) {
            // console.log("Error retrieving Bank:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    async activeQrcode(req, res) {
        try {

            const Bank = await Bank_Modal.find({ del: false,status: true,type:2 });

            return res.status(200).json({
                status: true,
                message: "Bank retrieved successfully",
                data: Bank
            });
        } catch (error) {
            // console.log("Error retrieving Bank:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    // Get a single Bank post by ID
    async detailBank(req, res) {
        try {
            const { id } = req.params;

            const Bank = await Bank_Modal.findById(id);

            if (!Bank) {
                return res.status(404).json({
                    status: false,
                    message: "Bank not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Bank retrieved successfully",
                data: Bank
            });
        } catch (error) {
            // console.log("Error retrieving Bank:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


    async  updateBank(req, res) {
        try {
            // Log incoming data for debugging
         //   console.log('Request Body:', req.body);
    
            // Handle the image upload
            await new Promise((resolve, reject) => {
                upload('bank').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }

                 
                    resolve();
                });
            });
    
            // Extracting fields from the request body
            const { id, name, branch, accountno, ifsc } = req.body;
    
            // Validating required fields
            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Bank ID is required",
                });
            }
            if (!name) {
                return res.status(400).json({ status: false, message: "Name is required" });
              }
              if (!branch) {
                return res.status(400).json({ status: false, message: "Branch is required" });
              }
          
              if (!accountno) {
                return res.status(400).json({ status: false, message: "Account No. is required" });
              }

              if (!ifsc) {
                return res.status(400).json({ status: false, message: "Ifsc is required" });
              }
            // Get the uploaded image file name if present
            const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;
    
            // Prepare the update object with the fields to update
            const updateFields = { name, branch, accountno, ifsc };
            if (image) {
                updateFields.image = image;
            }
    
            // Find and update the Bank post by ID
            const updatedBank = await Bank_Modal.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, runValidators: true } // Options to return the updated document and run validators
            );
    
            // If the Bank post is not found
            if (!updatedBank) {
                return res.status(404).json({
                    status: false,
                    message: "Bank not found",
                });
            }
    
    
            // Send the success response
            return res.json({
                status: true,
                message: "Bank updated successfully",
                data: updatedBank,
            });
    
        } catch (error) {
            // console.log("Error updating Bank:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    


    async  updateQrcode(req, res) {
        try {
            // Log incoming data for debugging
         //   console.log('Request Body:', req.body);
    
            // Handle the image upload
            await new Promise((resolve, reject) => {
                upload('bank').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
                    if (err) {
                        // console.log('File upload error:', err);
                        return reject(err);
                    }

                    resolve();
                });
            });
    
            // Extracting fields from the request body
            const { id } = req.body;
    
            // Validating required fields
            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: "Qrcode ID is required",
                });
            }
          
            const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;
    
      
    
            const updatedBank = await Bank_Modal.findByIdAndUpdate(
                id,
                { image: image },
                { new: true, runValidators: true } // Options to return the updated document and run validators
            );
    
            // If the Bank post is not found
            if (!updatedBank) {
                return res.status(404).json({
                    status: false,
                    message: "Qrcode not found",
                });
            }
    
    
            // Send the success response
            return res.json({
                status: true,
                message: "Qrcode updated successfully",
                data: updatedBank,
            });
    
        } catch (error) {
            // console.log("Error updating Qrcode:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }

  
    // Delete a Bank post by ID
    async deleteBank(req, res) {
        try {
            const { id } = req.params;

            // const deletedBank = await Bank_Modal.findByIdAndDelete(id);
            const deletedBank = await Bank_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedBank) {
                return res.status(404).json({
                    status: false,
                    message: "Bank not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Bank deleted successfully"
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

    async deleteQrcode(req, res) {
        try {
            const { id } = req.params;

            // const deletedBank = await Bank_Modal.findByIdAndDelete(id);
            const deletedBank = await Bank_Modal.findByIdAndUpdate(
                id, 
                { del: true }, // Set del to true
                { new: true }  // Return the updated document
              );

            if (!deletedBank) {
                return res.status(404).json({
                    status: false,
                    message: "Qrcode not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Qrcode deleted successfully"
            });
        } catch (error) {
            // console.log("Error deleting Qrcode:", error);
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
            const result = await Bank_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Bank not found"
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



      async  statusChangeQrcode(req, res) {
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
            const result = await Bank_Modal.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } // Return the updated document
            );
      
            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Bank not found"
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

module.exports = new BankController();
