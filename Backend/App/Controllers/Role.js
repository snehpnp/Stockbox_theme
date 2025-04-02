const db = require("../Models");
const Role_Modal = db.Role;


class Role {

    async AddRole(req, res) {
        try {
            const { title, permission, add_by } = req.body;
    
            // console.log("Request Body:", req.body);
    
            const result = new Role_Modal({
                title,
                permission,
                add_by,
            });
    
            await result.save();
    
            // console.log("Role successfully added:", result);
            return res.json({
                status: true,
                message: "Role added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Role:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getRole(req, res) {
    try {
      const { } = req.body;

      const result = await Role_Modal.find({ del: false });

      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async detailRole(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Role ID is required"
            });
        }

        const Role = await Role_Modal.findById(id);

        if (!Role) {
            return res.status(404).json({
                status: false,
                message: "Role not found"
            });
        }

        return res.json({
            status: true,
            message: "Role details fetched successfully",
            data: Role
        });

    } catch (error) {
        // console.log("Error fetching Role details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updateRole(req, res) {
    try {
      const { id, title, permission, add_by } = req.body;
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Role ID is required",
        });
      }
  
      const updatedRole = await Role_Modal.findByIdAndUpdate(
        id,
        {
          title,
          permission,
          add_by,
        },
        { role: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedRole) {
        return res.status(404).json({
          status: false,
          message: "Role not found",
        });
      }
  
      // console.log("Updated Role:", updatedRole);
      return res.json({
        status: true,
        message: "Role updated successfully",
        data: updatedRole,
      });
  
    } catch (error) {
      // console.log("Error updating Role:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deleteRole(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Role ID is required",
        });
      }

     // const deletedRole = await Role_Modal.findByIdAndDelete(id);

      const deletedRole = await Role_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );

      if (!deletedRole) {
        return res.status(404).json({
          status: false,
          message: "Role not found",
        });
      }

      // console.log("Deleted Role:", deletedRole);
      return res.json({
        status: true,
        message: "Role deleted successfully",
        data: deletedRole,
      });
    } catch (error) {
      // console.log("Error deleting Role:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}
module.exports = new Role();