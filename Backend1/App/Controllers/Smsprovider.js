const db = require("../Models");
const Smsprovider_Modal = db.Smsprovider;


class Smsprovider {


  async getSmsprovider(req, res) {
    try {


      const { } = req.body;

    //  const result = await Mailtemplate_Modal.find()
      const result = await Smsprovider_Modal.find();


      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async updateSmsprovider(req, res) {
    try {
      const { id, name,apikey,username,password,route,entity_id,sender,url } = req.body;

      if (!name) {
        return res.status(400).json({ status: false, message: "name is required" });
      }
    
     
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Smstemplate ID is required",
        });
      }
  
      const updatedMSmsprovider = await Smsprovider_Modal.findByIdAndUpdate(
        id,
        {
            name,
            apikey,
            username,
            password,
            route,
            entity_id,
            sender,
            url,
        },
        { Smsprovider: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedMSmsprovider) {
        return res.status(404).json({
          status: false,
          message: "Smsprovider not found",
        });
      }
  
      // console.log("Updated Mailtemplate:", updatedMailtemplate);
      return res.json({
        status: true,
        message: "Smsprovider updated successfully",
        data: updatedMSmsprovider,
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


  async setActiveSmsProvider(req, res) {
    try {
      const { providerId } = req.body;
  
      if (!providerId) {
        return res.json({ status: false, message: "Provider ID is required" });
      }
  
      // Step 1: Deactivate all providers
      await Smsprovider_Modal.updateMany({}, { $set: { status: 0 } });
  
      // Step 2: Activate the selected provider
      const updated = await Smsprovider_Modal.findByIdAndUpdate(
        providerId,
        { $set: { status: 1 } },
        { new: true }
      );
  
      if (!updated) {
        return res.json({ status: false, message: "Provider not found" });
      }
  
      return res.json({
        status: true,
        message: "Provider activated successfully",
        data: updated
      });
  
    } catch (error) {
      console.error(error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
  
  
  

}
module.exports = new Smsprovider();