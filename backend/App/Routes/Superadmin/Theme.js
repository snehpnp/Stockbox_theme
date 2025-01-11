const express = require("express");
const router = express.Router();
const {
  createTheme,
  getAllThemes,
  getThemeById, 
  updateTheme,
  deleteTheme,
  getAllThemesName,
  updateThemeCompany
} = require("../../Controllers/Superadmin/Theme");

router.get("/themes/names", getAllThemesName); // Get All Themes Names

router.post("/themes", createTheme); // Create Theme
router.get("/themes", getAllThemes); // Get All Themes
router.get("/themes/:id", getThemeById); // Get Single Theme
router.put("/themes/:id", updateTheme); // Update Theme
router.delete("/themes/:id", deleteTheme); // Delete Theme

router.post("/update/theme/company", updateThemeCompany); // Create Theme


module.exports = router;
