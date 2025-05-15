const db = require("../Models");
const Plancategory_Modal = db.Plancategory;


class Plancategory {

    async AddPlancategory(req, res) {
        try {
            const { title,service,add_by } = req.body;

            if (!title) {
              return res.json({ status: false, message: "Title is required" });
            }
            if (!service) {
                return res.json({ status: false, message: "Service is required" });
              }
            if (!add_by) {
              return res.json({ status: false, message: "Add_by is required" });
            }

            let services;
            if (Array.isArray(service)) {
                services = service.join(',');  // Convert array to comma-separated string
            } else if (typeof service === 'string') {
                services = service;  // If it's already a string, use it directly
            } else {
                return res.json({ status: false, message: "Invalid service format" });
            }
    
            const existingCategory = await Plancategory_Modal.findOne({
              status : true,
              del : false,
              title: { $regex: `^${title}$`, $options: 'i' } // Case-insensitive check
            });
            

            if (existingCategory) {
              return res.json({ status: false, message: "Plancategory already exists" });
            }


            const result = new Plancategory_Modal({
                title,
                service:services,
                add_by,
            });
    
            await result.save();
    
            // console.log("Plan category successfully added:", result);
            return res.json({
                status: true,
                message: "Plan category added successfully",
                data: result,
            });
    
        } catch (error) {
            // Enhanced error logging
            // console.log("Error adding Plan category:", error);
    
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }
    

  async getPlancategory(req, res) {
    try {

    
      const { } = req.body;

    //  const result = await Plancategory_Modal.find()
    const result = await Plancategory_Modal.aggregate([
      {
        $match: { del: false }
      },
      {
        $addFields: {
          serviceIds: {
            $map: {
              input: { $split: ['$service', ','] },
              as: 'serviceId',
              in: {
                $cond: {
                  if: { $eq: [ { $strLenCP: '$$serviceId' }, 24 ] }, // Check if the length is 24 characters
                  then: { $toObjectId: '$$serviceId' }, // Convert to ObjectId if valid
                  else: null // Return null for invalid ObjectIds
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'services', // The collection that holds the service details
          localField: 'serviceIds', // The split and filtered service IDs
          foreignField: '_id', // The field in the services collection containing the IDs
          as: 'servicesDetails'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          add_by: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          servicesDetails: {
            _id: 1,
            title: 1 // Only show the service titles
          }
        }
      },
      {
        $sort: { created_at: -1 } // Sort by created_at in descending order
      }
    ]);

      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      // console.log("error",error)
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async activePlancategory(req, res) {
  
    try {

    
      const { } = req.body;

    //  const result = await Plancategory_Modal.find()
    const result = await Plancategory_Modal.aggregate([
      {
        $match: { del: false,status: true }
      },
      {
        $addFields: {
          serviceIds: {
            $map: {
              input: { $split: ['$service', ','] },
              as: 'serviceId',
              in: {
                $cond: {
                  if: { $eq: [ { $strLenCP: '$$serviceId' }, 24 ] }, // Check if the length is 24 characters
                  then: { $toObjectId: '$$serviceId' }, // Convert to ObjectId if valid
                  else: null // Return null for invalid ObjectIds
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'services', // The collection that holds the service details
          localField: 'serviceIds', // The split and filtered service IDs
          foreignField: '_id', // The field in the services collection containing the IDs
          as: 'servicesDetails'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          add_by: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          servicesDetails: {
            _id: 1,
            title: 1 // Only show the service titles
          }
        }
      },
      {
        $sort: { created_at: -1 } // Sort by created_at in descending order
      }
    ]);

      return res.json({
        status: true,
        message: "get",
        data:result
      });

    } catch (error) {
      // console.log("error",error)
      return res.json({ status: false, message: "Server error", data: [] });
    }
  
  }




  async detailPlancategory(req, res) {
    try {
        // Extract ID from request parameters
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Plan category ID is required"
            });
        }

        const plancategory = await Plancategory_Modal.findById(id);

        if (!plancategory) {
            return res.status(404).json({
                status: false,
                message: "Plancategory not found"
            });
        }

        return res.json({
            status: true,
            message: "Plancategory details fetched successfully",
            data: plancategory
        });

    } catch (error) {
        // console.log("Error fetching Plancategory details:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            data: []
        });
    }
}


  async updatePlancategory(req, res) {
    try {
      const { id, title,service } = req.body;

      if (!title) {
        return res.json({ status: false, message: "Title is required" });
      }
      if (!service) {
        return res.json({ status: false, message: "Service is required" });
      }
  
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Plan category ID is required",
        });
      }


      const existingCategory = await Plancategory_Modal.findOne({
        _id: { $ne: id },
        status : true,
        del : false,
        title: { $regex: `^${title}$`, $options: 'i' } // Case-insensitive match
      });
  
      if (existingCategory) {
        return res.json({ status: false, message: "Plan category with this title already exists" });
      }
  



      let services;
      if (Array.isArray(service)) {
          services = service.join(',');  // Convert array to comma-separated string
      } else if (typeof service === 'string') {
          services = service;  // If it's already a string, use it directly
      } else {
          return res.status(400).json({ status: false, message: "Invalid service format" });
      }
 
      const updatedPlancategory = await Plancategory_Modal.findByIdAndUpdate(
        id,
        {
          title,
          service:services,
        },
        { Plancategory: true, runValidators: true } // Options: return the updated document and run validators
      );
  
      if (!updatedPlancategory) {
        return res.status(404).json({
          status: false,
          message: "Plan category not found",
        });
      }
  
      // console.log("Updated Plancategory:", updatedPlancategory);
      return res.json({
        status: true,
        message: "Plan category updated successfully",
        data: updatedPlancategory,
      });
  
    } catch (error) {
      // console.log("Error updating Plancategory:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  
  
  async deletePlancategory(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Plan category ID is required",
        });
      }

     // const deletedPlancategory = await Plancategory_Modal.findByIdAndDelete(id);

      const deletedPlancategory = await Plancategory_Modal.findByIdAndUpdate(
        id, 
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedPlancategory) {
        return res.status(404).json({
          status: false,
          message: "Plan category not found",
        });
      }

      // console.log("Deleted Plancategory:", deletedPlancategory);
      return res.json({
        status: true,
        message: "Plan category deleted successfully",
        data: deletedPlancategory,
      });
    } catch (error) {
      // console.log("Error deleting Plancategory:", error);
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
        const result = await Plancategory_Modal.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Return the updated document
        );
  
        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Plancategory not found"
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
module.exports = new Plancategory();