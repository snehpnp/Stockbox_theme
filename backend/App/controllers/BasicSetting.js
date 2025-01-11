const db = require("../Models");
const upload = require('../Utils/multerHelper'); // Import the multer helper
const fs = require('fs');
const path = require('path');
const BasicSetting_Modal = db.BasicSetting;
const Activitylogs_Modal = db.Activitylogs;


class BasicSetting {


    async AddBasicSetting(req, res) {

        try {
            // Handle the image uploads
            upload('basicsetting').fields([{ name: 'favicon', maxCount: 1 }, { name: 'logo', maxCount: 1 }, , { name: 'refer_image', maxCount: 1 }])(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "File upload error", error: err.message });
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
                    invoicestatus

                } = req.body;

                console.log("req.body", invoicestatus)

                const existingSetting = await BasicSetting_Modal.findOne({});





                const favicon = req.files['favicon'] ? req.files['favicon'][0].filename : (existingSetting ? existingSetting.favicon : null);
                const logo = req.files['logo'] ? req.files['logo'][0].filename : (existingSetting ? existingSetting.logo : null);
                const refer_image = req.files['refer_image'] ? req.files['refer_image'][0].filename : (existingSetting ? existingSetting.refer_image : null);
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
                    invoicestatus
                };

                const options = {
                    new: true,
                    upsert: true,
                    runValidators: true
                };

                const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);

                return res.status(200).json({
                    status: true,
                    message: "Basic setting added/updated successfully",
                    data: result
                });
            });
        } catch (error) {
            // console.log("Error adding/updating basic setting:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    // Additional methods can be defined here...

    // Example method to get all settings
    async getSettings(req, res) {
        try {
            const settings = await BasicSetting_Modal.find();
            return res.json({
                status: true,
                message: "Settings retrieved successfully",
                data: settings
            });
        } catch (error) {
            // console.log("Error retrieving settings:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    async getFreetrialActivity(req, res) {
        try {
            const settings = await Activitylogs_Modal.find().sort({ createdAt: -1 });

            return res.json({
                status: true,
                message: "Free trial activity retrieved successfully",
                data: settings
            });
        } catch (error) {
            // console.log("Error retrieving settings:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }



    async updateCronTime(req, res) {
        try {
            const { cashexpiretime, foexpiretime, cashexpirehours, foexpirehours } = req.body;

            const update = {
                cashexpiretime,
                foexpiretime,
                cashexpirehours,
                foexpirehours
            };

            // Update the database
            const options = { new: true, upsert: true, runValidators: true };
            const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);

            // Define path to the JSON file
            const filePath = path.join(__dirname, '../../uploads/json', 'config.json');
            // Read the existing JSON data
            let jsonData = {};
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'utf8');
                jsonData = JSON.parse(fileData);
            }

            // Update fields in the JSON data
            jsonData.cashexpiretime = cashexpiretime;
            jsonData.foexpiretime = foexpiretime;
            jsonData.cashexpirehours = cashexpirehours;
            jsonData.foexpirehours = foexpirehours;

            // Write the updated data back to the JSON file
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

            return res.status(200).json({
                status: true,
                message: "Basic setting updated successfully",
                data: result
            });
        } catch (error) {
            // console.error("Error updating basic setting:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
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
                instagram
            };

            // Update the database
            const options = { new: true, upsert: true, runValidators: true };
            const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);

            return res.status(200).json({
                status: true,
                message: "Social Link updated successfully",
                data: result
            });
        } catch (error) {
            // console.error("Error updating social link:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
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
            const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);


            return res.status(200).json({
                status: true,
                message: "Social Link updated successfully",
                data: result
            });
        } catch (error) {
            console.error("Error updating social link:", error);
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }


        const options = { new: true, upsert: true, runValidators: true };
        const result = await BasicSetting_Modal.findOneAndUpdate({}, update, options);


        return res.status(200).json({
            status: true,
            message: "Social Link updated successfully",
            data: result
        });
    } catch(error) {
        // console.error("Error updating social link:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }


}
module.exports = new BasicSetting();