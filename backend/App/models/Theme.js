const { Schema, model } = require("mongoose");

const themeSchema = new Schema(
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
    status: { type: String, default: 0 },
    HeadingColor: { type: String, required: true },
    WrapperColor: { type: String, required: true },
    wrapperGradientStart: { type: String, required: true },
    wrapperGradientEnd: { type: String, required: true },
    BtnPriTxtCol: { type: String, required: true },
    BtnSecTxtCol: { type: String, required: true },
    BtnBorderColor: { type: String, required: true },
    BtnSecBorderColor: { type: String, required: true },
    BtnPriBgCol: { type: String, required: true },
    BtnSecBgCol: { type: String, required: true },
    wrapperMode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ThemeModal = model("Theme", themeSchema);

module.exports = ThemeModal;
