const db = require("../Models");
const upload = require("../Utils/multerHelper"); // Import the multer helper
const fs = require("fs");
const path = require("path");
const BasicSetting_Modal = db.BasicSetting;
const Activitylogs_Modal = db.Activitylogs;
const ThemeModal = db.ThemeModal;

class BasicSetting {
  async AddBasicSetting(req, res) {
    try {

      // Handle the image uploads
      upload("basicsetting").fields([
        { name: "favicon", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "refer_image", maxCount: 1 },
        { name: "offer_image", maxCount: 1 }
      ])(req, res, async (err) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "File upload error",
            error: err.message,
          });
        }

        const {
          website_title,
          email_address,
          contact_number,
          address,
          smtp_status,
          smtp_host,
          smtp_port,
          encryption,
          smtp_username,
          smtp_password,
          from_mail,
          from_name,
          to_mail,
          refer_title,
          refer_description,
          sender_earn,
          receiver_earn,
          surepass_token,
          digio_client_id,
          digio_client_secret,
          razorpay_key,
          razorpay_secret,
          digio_template_name,
          kyc,
          paymentstatus,
          officepaymenystatus,
          refer_status,
          invoicestatus,
        } = req.body;

        const existingSetting = await BasicSetting_Modal.findOne({});

        const favicon = req.files["favicon"]
          ? req.files["favicon"][0].filename
          : existingSetting
            ? existingSetting.favicon
            : null;
        const logo = req.files["logo"]
          ? req.files["logo"][0].filename
          : existingSetting
            ? existingSetting.logo
            : null;
        const refer_image = req.files["refer_image"]
          ? req.files["refer_image"][0].filename
          : existingSetting
            ? existingSetting.refer_image
            : null;
        const offer_image = req.files["offer_image"]
          ? req.files["offer_image"][0].filename
          : existingSetting
            ? existingSetting.offer_image
            : null;



        // Define the update payload
        const update = {
          favicon,
          logo,
          website_title: from_name,
          email_address,
          contact_number,
          address,
          smtp_status,
          smtp_host,
          smtp_port,
          encryption,
          smtp_username,
          smtp_password,
          from_mail: smtp_username,
          from_name,
          to_mail,
          refer_title,
          refer_description,
          refer_image,
          sender_earn,
          receiver_earn,
          surepass_token,
          digio_client_id,
          digio_client_secret,
          razorpay_key,
          razorpay_secret,
          digio_template_name,
          kyc,
          paymentstatus,
          officepaymenystatus,
          refer_status,
          invoicestatus,
          offer_image,
        };

        const options = {
          new: true,
          upsert: true,
          runValidators: true,
        };

        const result = await BasicSetting_Modal.findOneAndUpdate(
          {},
          update,
          options
        );

        return res.status(200).json({
          status: true,
          message: "Basic setting added/updated successfully",
          data: result,
        });
      });
    } catch (error) {
      // console.log("Error adding/updating basic setting:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Example method to get all settings
  async getSettings(req, res) {
    try {
      const settings = await BasicSetting_Modal.find();
      let Theme;

      if (settings[0]?.theme_id) {
        const ThemeModalData = await ThemeModal.find({
          _id: settings[0]?.theme_id,
        });
        Theme = ThemeModalData[0];
      }

      return res.json({
        status: true,
        message: "Settings retrieved successfully",
        data: settings,
        Theme: Theme,
      });
    } catch (error) {
      // console.log("Error retrieving settings:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async getFreetrialActivity(req, res) {
    try {
      const settings = await Activitylogs_Modal.find().sort({ createdAt: -1 });

      return res.json({
        status: true,
        message: "Free trial activity retrieved successfully",
        data: settings,
      });
    } catch (error) {
      // console.log("Error retrieving settings:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async updateCronTime(req, res) {
    try {
      const { cashexpiretime, foexpiretime, cashexpirehours, foexpirehours } =
        req.body;

      const update = {
        cashexpiretime,
        foexpiretime,
        cashexpirehours,
        foexpirehours,
      };

      // Update the database
      const options = { new: true, upsert: true, runValidators: true };
      const result = await BasicSetting_Modal.findOneAndUpdate(
        {},
        update,
        options
      );

      // Define path to the JSON file
      const filePath = path.join(
        __dirname,
        "../../uploads/json",
        "config.json"
      );
      // Read the existing JSON data
      let jsonData = {};
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");
        jsonData = JSON.parse(fileData);
      }

      // Update fields in the JSON data
      jsonData.cashexpiretime = cashexpiretime;
      jsonData.foexpiretime = foexpiretime;
      jsonData.cashexpirehours = cashexpirehours;
      jsonData.foexpirehours = foexpirehours;

      // Write the updated data back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

      return res.status(200).json({
        status: true,
        message: "Basic setting updated successfully",
        data: result,
      });
    } catch (error) {
      // console.error("Error updating basic setting:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async updateSocialLink(req, res) {
    try {
      const { facebook, youtube, twitter, instagram } = req.body;

      const update = {
        facebook,
        youtube,
        twitter,
        instagram,
      };

      // Update the database
      const options = { new: true, upsert: true, runValidators: true };
      const result = await BasicSetting_Modal.findOneAndUpdate(
        {},
        update,
        options
      );

      return res.status(200).json({
        status: true,
        message: "Social Link updated successfully",
        data: result,
      });
    } catch (error) {
      // console.error("Error updating social link:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async updateFreetrail(req, res) {
    try {
      const { freetrial } = req.body;
      const update = {
        freetrial,
      };

      // Update the database

      const existingSetting = await BasicSetting_Modal.findOne({});

      if (existingSetting.freetrial !== freetrial) {
        const message = "Free Trail Update";
        const newactivity = new Activitylogs_Modal({
          olddays: existingSetting.freetrial,
          newdays: freetrial,
          message,
        });
        await newactivity.save();
      }

      const options = { new: true, upsert: true, runValidators: true };
      const result = await BasicSetting_Modal.findOneAndUpdate(
        {},
        update,
        options
      );

      return res.status(200).json({
        status: true,
        message: "Social Link updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating social link:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async UpdateThemeCompany(req, res) {
    try {
      const { theme_id, ThemeData } = req.body;

      if (!theme_id) {
        return res.status(400).json({
          status: false,
          message: "Please provide a theme ID",
        });
      }

      // Find the company record (assuming there is only one company)
      let getCompany = await BasicSetting_Modal.findOne(); // Use findOne to get a single document

      if (!getCompany) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      // Update the theme_id field
      getCompany.theme_id = theme_id;

      // Save the updated record
      await getCompany.save();

      if (ThemeData) {
        const existingTheme = await ThemeModal.findOne({ _id: theme_id });

        const UpdateTheme = await ThemeModal.updateOne(
          { _id: theme_id },
          ThemeData,
          { upsert: true }
        );
        console.log("UpdateTheme", UpdateTheme);
        if (existingTheme) {
          const message = "Theme Update";
          const newactivity = new Activitylogs_Modal({
            olddays: existingTheme,
            newdays: ThemeData,
            message,
          });
          await newactivity.save();
        }
      }

      return res.status(200).json({
        status: true,
        message: "Company theme updated successfully",
      });
    } catch (error) {
      console.error("Error updating Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}
module.exports = new BasicSetting();
