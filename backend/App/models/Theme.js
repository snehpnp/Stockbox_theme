const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    ThemeName: { type: String, required: true },
    sidebarColor: { type: String, required: true },
    navbarColor: { type: String, required: true },
    fontColor: { type: String, required: true },
    sidebarGradientStart: { type: String, required: true },
    sidebarGradientEnd: { type: String, required: true },
    navbarGradientStart: { type: String, required: true },
    navbarGradientEnd: { type: String, required: true },
    fontGradientStart: { type: String, required: true },
    fontGradientEnd: { type: String, required: true },
    sidebarPosition: { type: String, required: true },
    fontFamily: { type: String, required: true },
    navbarPosition: { type: String, required: true },
    themeId: { type: String, required: true },
    sidebarName: { type: String, required: true },
    BtnBgColor: { type: String, required: true },
    status: { type: String, default: 0 },
    btnTxtColor: { type: String, required: true },
    HeadingColor: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Theme", themeSchema);
