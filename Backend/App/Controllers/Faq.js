const db = require("../Models");
const Faq_Modal = db.Faq;


class Faq {

    async AddFaq(req, res) {
        try {
            const { title,description,add_by } = req.body;

            if (!title) {
              return res.status(400).json({ status: false, message: "title is required" });
            }
            if (!description) {
              return res.status(400).json({ status: false, message: "description is required" });
            }
        
            if (!add_by) {
              return res.status(400).json({ status: false, message: "add_by is required" });
            }
    
            // console.log("Request Body:", req.body);
    
            const result = new Faq_Modal({
                title,
                description,
                add_by,
            });
    
            await result.save();
    
            // console.log("Faq successfully added:", result);
            return res.json({
                status: true,
                message: "Faq added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Faq:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getFaq(req, res) {
    try {


      const { } = req.body;

    //  const result = await Faq_Modal.find()
      const result = await Faq_Modal.find({ del: false }).sort({created_at:-1});


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async activeFaq(req, res) {
    try {


      const { } = req.body;

    //  const result = await Faq_Modal.find()
      const result = await Faq_Modal.find({ del: false,status: true }).sort({created_at:-1});


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  async detailFaq(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Faq ID is required"
            });
        }

        const Faq = await Faq_Modal.findById(id);

        if (!Faq) {
            return res.status(404).json({
                status: false,
                message: "Faq not found"
            });
        }

        return res.json({
            status: true,
            message: "Faq details fetched successfully",
            data: Faq
        });

    } catch (error) {
        // console.log("Error fetching Faq details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updateFaq(req, res) {
    try {
      const { id, title,description } = req.body;

      if (!title) {
        return res.status(400).json({ status: false, message: "title is required" });
      }
      if (!description) {
        return res.status(400).json({ status: false, message: "description is required" });
      }
  
     
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Faq ID is required",
        });
      }
  
      const updatedFaq = await Faq_Modal.findByIdAndUpdate(
        id,
        {
          title,
          description,
        },
        { faq: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedFaq) {
        return res.status(404).json({
          status: false,
          message: "Faq not found",
        });
      }
  
      // console.log("Updated Faq:", updatedFaq);
      return res.json({
        status: true,
        message: "Faq updated successfully",
        data: updatedFaq,
      });
  
    } catch (error) {
      // console.log("Error updating Faq:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deleteFaq(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Faq ID is required",
        });
      }

     // const deletedFaq = await Faq_Modal.findByIdAndDelete(id);

      const deletedFaq = await Faq_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedFaq) {
        return res.status(404).json({
          status: false,
          message: "Faq not found",
        });
      }

      // console.log("Deleted Faq:", deletedFaq);
      return res.json({
        status: true,
        message: "Faq deleted successfully",
        data: deletedFaq,
      });
    } catch (error) {
      // console.log("Error deleting Faq:", error);
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
        const result = await Faq_Modal.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Return the updated document
        );
  
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Faq not found"
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
module.exports = new Faq();