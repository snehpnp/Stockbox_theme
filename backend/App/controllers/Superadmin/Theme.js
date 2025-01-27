const db = require("../../Models");
const Theme = db.ThemeModal;
const Company_Modal = db.Company1;
const axios = require("axios");

// Create a new theme
exports.createTheme = async (req, res) => {
  try {
    const newTheme = new Theme(req.body);
    await newTheme.save();
    res.status(201).json({
      status: true,
      data: newTheme,
      message: "Theme added successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.status(200).json({
      status: true,
      data: themes,
      message: "Themes found successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getAllThemesName = async (req, res) => {
  try {
    const themes = await Theme.find().select("ThemeName");
    console.log(themes);

    if (!themes || themes.length === 0) {
      return res.json({
        status: false,
        message: "No themes found",
      });
    }

    res.json({
      status: true,
      data: themes,
      message: "Themes found successfully",
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    res.json({
      status: false,
      message: "Internal Server Error",
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
        data: {},
      });
    }
    res.status(200).json({
      status: true,
      data: theme,
      message: "Theme found successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
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
        message: "Theme not found",
      });
    }
    res.status(200).json({
      status: true,
      data: updatedTheme,
      message: "Theme updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
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
        message: "Theme not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Theme deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateThemeCompany = async (req, res) => {
  try {
    const { id, theme_id } = req.body;
    if (!id || !theme_id) {
      return res.status(400).json({
        status: false,
        message: "Please provide company id and theme id",
      });
    }

    const FindCompany = await Company_Modal.findById(id).select("url");

    const updatedCompany = await Company_Modal.findByIdAndUpdate(
      { _id: id },
      { theme_id: theme_id },
      { new: true }
    );

    const ThemeFind = await Theme.findById(theme_id);

    if (!updatedCompany) {
      return res.status(404).json({
        status: false,
        message: "Company not found",
      });
    }

    if (FindCompany) {
      if (FindCompany?.url.includes("localhost")) {
        const response = await axios.post(
          "http://localhost:5001/basicsetting/updatethemecompany",
          { theme_id: theme_id, ThemeData: "" }
        );

        return res.status(200).json({
          status: true,
          data: updatedCompany,
          message: "Company updated successfully",
        });
      } else {
        const response = await axios.post(
          `${FindCompany?.url}/backend/basicsetting/updatethemecompany`,
          { theme_id: theme_id, ThemeData: ThemeFind }
        );
      }
      return res.status(200).json({
        status: true,
        data: updatedCompany,
        message: "Company updated successfully",
      });
    }
  } catch (error) {
    // console.error("Error updating Company:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};
