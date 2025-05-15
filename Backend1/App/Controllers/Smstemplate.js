const db = require("../Models");
const Smstemplate_Modal = db.Smstemplate;


class Smstemplate {


  async getSmstemplate(req, res) {
    try {


      const { } = req.body;

    //  const result = await Mailtemplate_Modal.find()
      const result = await Smstemplate_Modal.find();


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async detailSmstemplate(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;
        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Smstemplate ID is required"
            });
        }

        const Smstemplate = await Smstemplate_Modal.findById(id);

        if (!Smstemplate) {
            return res.status(404).json({
                status: false,
                message: "Smstemplate not found"
            });
        }

        return res.json({
            status: true,
            message: "Smstemplate details fetched successfully",
            data: Smstemplate
        });

    } catch (error) {
        // console.error("Error fetching Mailtemplate details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updateSmstemplate(req, res) {
    try {
      const { id, templateid,sms_body } = req.body;

      if (!templateid) {
        return res.status(400).json({ status: false, message: "templateid is required" });
      }
      if (!sms_body) {
        return res.status(400).json({ status: false, message: "sms body is required" });
      }
  
     
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Smstemplate ID is required",
        });
      }
  
      const updatedMSmstemplate = await Smstemplate_Modal.findByIdAndUpdate(
        id,
        {
            templateid,
            sms_body,
        },
        { Smstemplate: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedMSmstemplate) {
        return res.status(404).json({
          status: false,
          message: "Smstemplate not found",
        });
      }
  
      // console.log("Updated Mailtemplate:", updatedMailtemplate);
      return res.json({
        status: true,
        message: "Smstemplate updated successfully",
        data: updatedMSmstemplate,
      });
  
    } catch (error) {
      // console.error("Error updating Mailtemplate:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  

}
module.exports = new Smstemplate();