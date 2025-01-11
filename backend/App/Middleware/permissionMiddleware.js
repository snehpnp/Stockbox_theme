const { hasPermission } = require('../Utils/permissionHelper'); // Path to your helper

const checkPermission = (permissionName) => {

  return async (req, res, next) => {
    const userId = req.headers['authorization']; // Get userId from headers
    try {
      const permissionGranted = await hasPermission(userId, permissionName);
    
      if (permissionGranted) {
        next(); 
      } else {
        res.status(403).send('Forbidden'); // Permission denied
      }
    } catch (error) {
      // console.log("Error checking permission:", error);
      return res.status(500).send('Server error');
    }
  };
};

module.exports = { checkPermission };
