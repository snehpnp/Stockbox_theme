const db = require("../Models");
const Script_Modal = db.Script;


class Script {

    async AddScript(req, res) {
        try {
            const { price,basket,calltype,stock,tag1,tag2,tag3,stoploss,add_by } = req.body;
    
            // console.log("Request Body:", req.body);
    
            const result = new Script_Modal({
                price,
                basket,
                calltype,
                stock,
                tag1,
                tag2,
                tag3,
                stoploss,
                add_by,
            });
    
            await result.save();
    
            // console.log("Script successfully added:", result);
            return res.json({
                status: true,
                message: "Script added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Script:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getScript(req, res) {
    try {

     
     
      const { } = req.body;

    //  const result = await Script_Modal.find()
      const result = await Script_Modal.find({ del: 0 });


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async detailScript(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Script ID is required"
            });
        }

        const Script = await Script_Modal.findById(id);

        if (!Script) {
            return res.status(404).json({
                status: false,
                message: "Script not found"
            });
        }

        return res.json({
            status: true,
            message: "Script details fetched successfully",
            data: Script
        });

    } catch (error) {
        // console.log("Error fetching Script details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  
  async deleteScript(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Script ID is required",
        });
      }

     // const deletedScript = await Script_Modal.findByIdAndDelete(id);

      const deletedScript = await Script_Modal.findByIdAndUpdate(
        id, 
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedScript) {
        return res.status(404).json({
          status: false,
          message: "Script not found",
        });
      }

      // console.log("Deleted Script:", deletedScript);
      return res.json({
        status: true,
        message: "Script deleted successfully",
        data: deletedScript,
      });
    } catch (error) {
      // console.log("Error deleting Script:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


}
module.exports = new Script();