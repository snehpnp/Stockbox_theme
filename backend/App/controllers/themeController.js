const Theme = require("../models/Theme");

// Create a new theme
exports.createTheme = async (req, res) => {
  try {
    const newTheme = new Theme(req.body);
    await newTheme.save();
    res.status(201).json({
      status: true,
      data: newTheme,
      message: "Theme added successfully"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

// Get all themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.status(200).json({
      status: true,
      data: themes,
      message: "Themes found successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Get a single theme by ID
exports.getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return res.status(404).json({
        status: false,
        message: "Theme not found",
        data: {}
      });
    }
    res.status(200).json({
      status: true,
      data: theme,
      message: "Theme found successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Update a theme
exports.updateTheme = async (req, res) => {
  try {
    const updatedTheme = await Theme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTheme) {
      return res.status(404).json({
        status: false,
        message: "Theme not found"
      });
    }
    res.status(200).json({
      status: true,
      data: updatedTheme,
      message: "Theme updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

// Delete a theme
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) {
      return res.status(404).json({
        status: false,
        message: "Theme not found"
      });
    }
    res.status(200).json({
      status: true,
      message: "Theme deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
