const express = require('express');
const router = express.Router();
const {
  createTheme,
  getAllThemes,
  getThemeById,
  updateTheme,
  deleteTheme,
} = require('../controllers/themeController');

router.post('/themes', createTheme); // Create Theme
router.get('/themes', getAllThemes); // Get All Themes
router.get('/themes/:id', getThemeById); // Get Single Theme
router.put('/themes/:id', updateTheme); // Update Theme
router.delete('/themes/:id', deleteTheme); // Delete Theme

module.exports = router;
