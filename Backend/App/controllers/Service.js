const db = require("../Models");
const Service_Modal = db.Service;


class Service {

    async AddService(req, res) {
        try {
            const { title,add_by } = req.body;

            if (!title) {
              return res.status(400).json({ status: false, message: "title is required" });
            }
        
            if (!add_by) {
              return res.status(400).json({ status: false, message: "add_by is required" });
            }
    
            // console.log("Request Body:", req.body);
    
            const result = new Service_Modal({
                title,
                add_by,
            });
    
            await result.save();
    
            // console.log("Service successfully added:", result);
            return res.json({
                status: true,
                message: "Service added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Service:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getService(req, res) {
    try {

     
      const { } = req.body;

      const result = await Service_Modal.find({ del: false });


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async activeService(req, res) {
    try {

     
     
      const { } = req.body;

    //  const result = await Service_Modal.find()
      const result = await Service_Modal.find({ del: false,status: true });


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async detailService(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Service ID is required"
            });
        }

        const Service = await Service_Modal.findById(id);

        if (!Service) {
            return res.status(404).json({
                status: false,
                message: "Service not found"
            });
        }

        return res.json({
            status: true,
            message: "Service details fetched successfully",
            data: Service
        });

    } catch (error) {
        // console.log("Error fetching Service details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updateService(req, res) {
    try {
      const { id, title } = req.body;

      if (!title) {
        return res.status(400).json({ status: false, message: "title is required" });
      }
    
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Service ID is required",
        });
      }
  
      const updatedService = await Service_Modal.findByIdAndUpdate(
        id,
        {
          title,
        },
        { service: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedService) {
        return res.status(404).json({
          status: false,
          message: "Service not found",
        });
      }
  
      // console.log("Updated Service:", updatedService);
      return res.json({
        status: true,
        message: "Service updated successfully",
        data: updatedService,
      });
  
    } catch (error) {
      // console.log("Error updating Service:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deleteService(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Service ID is required",
        });
      }

     // const deletedService = await Service_Modal.findByIdAndDelete(id);

      const deletedService = await Service_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedService) {
        return res.status(404).json({
          status: false,
          message: "Service not found",
        });
      }

      // console.log("Deleted Service:", deletedService);
      return res.json({
        status: true,
        message: "Service deleted successfully",
        data: deletedService,
      });
    } catch (error) {
      // console.log("Error deleting Service:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
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
        const result = await Service_Modal.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Return the updated document
        );
  
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Service not found"
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
module.exports = new Service();