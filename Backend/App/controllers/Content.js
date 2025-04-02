const db = require("../Models");
const Content_Modal = db.Content;


class Content {

    async AddContent(req, res) {
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
    
            const result = new Content_Modal({
                title,
                description,
                add_by,
            });
    
            await result.save();
    
            // console.log("Content successfully added:", result);
            return res.json({
                status: true,
                message: "Content added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Content:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getContent(req, res) {
    try {


      const { } = req.body;

    //  const result = await Content_Modal.find()
      const result = await Content_Modal.find({ del: false });


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async activeContent(req, res) {
    try {


      const { } = req.body;

    //  const result = await Content_Modal.find()
      const result = await Content_Modal.find({ del: false,status: true });


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
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
        // console.log("Error fetching Content details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updateContent(req, res) {
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
          message: "Content ID is required",
        });
      }
  
      const updatedContent = await Content_Modal.findByIdAndUpdate(
        id,
        {
          title,
          description,
        },
        { Content: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedContent) {
        return res.status(404).json({
          status: false,
          message: "Content not found",
        });
      }
  
      // console.log("Updated Content:", updatedContent);
      return res.json({
        status: true,
        message: "Content updated successfully",
        data: updatedContent,
      });
  
    } catch (error) {
      // console.log("Error updating Content:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deleteContent(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Content ID is required",
        });
      }

     // const deletedContent = await Content_Modal.findByIdAndDelete(id);

      const deletedContent = await Content_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedContent) {
        return res.status(404).json({
          status: false,
          message: "Content not found",
        });
      }

      // console.log("Deleted Content:", deletedContent);
      return res.json({
        status: true,
        message: "Content deleted successfully",
        data: deletedContent,
      });
    } catch (error) {
      // console.log("Error deleting Content:", error);
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
        const result = await Content_Modal.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Return the updated document
        );
  
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Content not found"
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
module.exports = new Content();