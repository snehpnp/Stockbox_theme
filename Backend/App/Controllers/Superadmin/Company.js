const db = require("../../Models");
const Company_Modal = db.Company1;
const axios = require("axios");

class CompanyController {
  // Create a new Company post
  async AddCompany(req, res) {
    try {
      const { title, email, phone, key, url,theme_id } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({ status: false, message: "title is required" });
      }
      if (!email) {
        return res
          .status(400)
          .json({ status: false, message: "email is required" });
      }

      if (!phone) {
        return res
          .status(400)
          .json({ status: false, message: "phone is required" });
      }

      if (!key) {
        return res
          .status(400)
          .json({ status: false, message: "key is required" });
      }

      if (!url) {
        return res
          .status(400)
          .json({ status: false, message: "Url is required" });
      }
      if(!theme_id){
        return res.status(400).json({ status: false, message: "Theme is required" });
      }

      // Create a new News record
      const result = new Company_Modal({
        title: title,
        email: email,
        phone: phone,
        key: key,
        url: url,
        theme_id: theme_id
      });

      // Save the result to the database
      await result.save();

      return res.json({
        status: true,
        message: "Company added successfully",
      });
    } catch (error) {
      console.log("Error adding Company:", error);  
      return res
        .status(500)
        .json({ status: false, message: "Server error", data: [] });
    }
  }

  // Get all Company posts
  async getCompany(req, res) {
    try {
      const company = await Company_Modal.find({ del: false }).sort({
        created_at: -1,
      });

      return res.status(200).json({
        status: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      console.log("Error retrieving Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async activeCompany(req, res) {
    try {
      const Company = await Company_Modal.find({ del: false, status: true });

      return res.status(200).json({
        status: true,
        message: "Company retrieved successfully",
        data: Company,
      });
    } catch (error) {
      console.log("Error retrieving Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Get a single Company post by ID
  async detailCompany(req, res) {
    try {
      const { id } = req.params;

      const company = await Company_Modal.findById(id);

      if (!company) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      console.log("Error retrieving Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async updateCompany(req, res) {
    try {
      // Extracting fields from the request body
      const { id, title, email, phone, key, url } = req.body;

      // Validating required fields
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Company ID is required",
        });
      }
      if (!title) {
        return res
          .status(400)
          .json({ status: false, message: "Title is required" });
      }
      if (!email) {
        return res
          .status(400)
          .json({ status: false, message: "Email is required" });
      }

      if (!phone) {
        return res
          .status(400)
          .json({ status: false, message: "Phone is required" });
      }

      if (!key) {
        return res
          .status(400)
          .json({ status: false, message: "Key is required" });
      }
      if (!url) {
        return res
          .status(400)
          .json({ status: false, message: "Url is required" });
      }

      // Prepare the update object with the fields to update
      const updateFields = { title, email, phone, key, url };

      // Find and update the Company post by ID
      const updatedCompany = await Company_Modal.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true } // Options to return the updated document and run validators
      );

      // If the Company post is not found
      if (!updatedCompany) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      // Send the success response
      return res.json({
        status: true,
        message: "Company updated successfully",
        data: updatedCompany,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Delete a Company post by ID
  async deleteCompany(req, res) {
    try {
      const { id } = req.params;

      // const deletedCompany = await Company_Modal.findByIdAndDelete(id);
      const deletedCompany = await Company_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { new: true } // Return the updated document
      );

      if (!deletedCompany) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Company deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  async statusChange(req, res) {
    try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = ["true", "false"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value",
        });
      }

      // Find and update the plan
      const result = await Company_Modal.findByIdAndUpdate(
        id,
        { status: status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Company not found",
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result,
      });
    } catch (error) {
      console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: [],
      });
    }
  }

  async clientList(req, res) {
    try {
      const { id } = req.params;

      const company = await Company_Modal.findById(id);

      const apiKey = company.key; // API key for the request
      const baseUrl = company.url; // Base URL from the company details

      // Define the external API URL
      const externalApiUrl = `${baseUrl}/backend/dashboard/getlicense`;

      // Send a POST request with the API key in the request body
      const response = await axios.post(externalApiUrl, {
        key: apiKey,
      });

      // Log the response for debugging

      // Send the client data back to the caller
      return res.status(200).json({
        status: true,
        message: "Client retrieved successfully",
        data: response.data.data,
      });
    } catch (error) {
      console.log("Error retrieving Company:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

module.exports = new CompanyController();
