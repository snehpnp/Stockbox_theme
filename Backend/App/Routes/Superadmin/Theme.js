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

router.get("/themes/names", getAllThemesName);

router.post("/themes", createTheme);
router.get("/themes", getAllThemes);
router.get("/themes/:id", getThemeById);
router.put("/themes/:id", updateTheme);
router.delete("/themes/:id", deleteTheme);

router.post("/update/theme/company", updateThemeCompany);


module.exports = router;
