import React, { useState, useEffect, use } from "react";
import Navbar from "../Navbars/Navbar";
import Content from "../../Routes/route.routes";
import Sidebar from "../Sidebars/Sidebar";
import Setting_sidebar from "../Sidebars/Setting_sidebar";

export default function App() {
  const savedTheme = localStorage.getItem("theme");

  useEffect(() => {
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);

      document.documentElement.setAttribute("data-theme", savedTheme);

      const container = document.querySelector(".navbar");
      const SidebarColored = document.querySelector(".SidebarColored");

      let sidebar = theme.sidebarColor?.includes("gradient") || false;
      let navbar = theme.navbarColor?.includes("gradient") || false;
      let font = theme.fontColor?.includes("gradient") || false;

      const buttons = document.querySelectorAll("button");
      const fontFamily = theme.fontFamily;
      const allFont = document.querySelectorAll("*");
      const fontColor = theme.fontColor;
      const contentColor = document.querySelector(".content");

      const all = document.querySelectorAll(
        "*:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(button):not(a)"
      );

      all.forEach((element) => {
        element.style.color = fontColor;
      });



      if (container) {
        if (navbar) {
          container.style.background = theme.navbarColor;
        } else {
          container.style.backgroundColor = theme.navbarColor;
        }
      }

      if (SidebarColored) {
        if (sidebar) {
          SidebarColored.style.background = theme.sidebarColor;
        } else {
          SidebarColored.style.backgroundColor = theme.sidebarColor;
        }
      }



      // ----------------------------------------------
      // NEW CHANGE ALL SOFTWARE FONT FAMILY

      allFont.forEach((element) => {
        element.style.fontFamily = fontFamily;
      });

      // Apply background color to .container-fluid
      document.documentElement.style.setProperty(
        "--BtnPriTxtCol",
        theme?.BtnPriTxtCol
      );
      document.documentElement.style.setProperty(
        "--BtnSecTxtCol",
        theme?.BtnSecTxtCol
      );
      document.documentElement.style.setProperty(
        "--BtnBorderColor",
        theme?.BtnBorderColor
      );
      document.documentElement.style.setProperty(
        "--BtnSecBorderColor",
        theme?.BtnSecBorderColor
      );
      document.documentElement.style.setProperty(
        "--BtnPriBgCol",
        theme?.BtnPriBgCol
      );
      document.documentElement.style.setProperty(
        "--BtnSecBgCol",
        theme?.BtnSecBgCol
      );

      document.documentElement.style.setProperty(
        "--headSidebarFontCol",
        theme?.headSidebarFontCol
      );

      document.documentElement.style.setProperty(
        "--headSidebarFontActiveCol",
        theme?.headSidebarFontActiveCol
      );

      document.documentElement.style.setProperty(
        "--HeadingColor",
        theme?.HeadingColor
      );

      document.documentElement.style.setProperty(
        "--sidebarColor",
        theme?.sidebarColor
      );
      document.documentElement.style.setProperty("--tabelheadbgcolor", theme?.tabelheadbgcolor);


    } else {
      let data = {
        sidebarColor: "linear-gradient(to right, #1a053e, #623256)",
        navbarColor: "#ffffff",
        fontColor: "#000000",
        sidebarGradientStart: "#1a053e",
        sidebarGradientEnd: "#623256",
        navbarGradientStart: "#4dfee9",
        navbarGradientEnd: "#fffafa",
        fontGradientStart: "#ffffff",
        fontGradientEnd: "#000000",
        sidebarPosition: "Sidebar",
        fontFamily: "Arial",
        navbarPosition: "Header",
        themeId: "1",
        sidebarName: "1",
        HeadingColor: "#000000",
        headSidebarFontCol: "#fef1f1",
        headSidebarFontActiveCol: "#887c7c",
        WrapperColor: "#edf7f6",
        tabelheadbgcolor: "#c5c4c4",
        wrapperMode: "false",
        BtnSecBgCol: "#ffffff",
        BtnSecTxtCol: "#0d6efd",
        BtnSecBorderColor: "#0d6efd",
        BtnPriBgCol: "#0d6efd",
        BtnPriTxtCol: "#ffffff",
        BtnBorderColor: "#0d6efd",
        wrapperGradientEnd: "#fafafa",
        wrapperGradientStart: "#13fbe0",
      };

      localStorage.setItem("theme", JSON.stringify(data));

      const container = document.querySelector(".container-fluid");
      const SidebarColored = document.querySelector(".SidebarColored");

      if (container) container.style.background = data.navbarColor;
      if (SidebarColored) SidebarColored.style.background = data.sidebarColor;

      document.body.style.color = data.fontColor;
      document.body.style.fontFamily = data.fontFamily;

      const allElements = document.querySelectorAll("*");
      allElements.forEach((element) => {
        element.style.color = data.fontColor;
        element.style.fontFamily = data.fontFamily;
      });
    }
  }, [savedTheme]);

  return (
    <div className="wrapper">
      {savedTheme && (
        <>
          <Navbar />
          <div className="content-wrapper">
            <Sidebar />
            <div className="content">
              {/* Content Overlay */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Content />
              </div>
            </div>
          </div>

          <Setting_sidebar />
        </>
      )}
    </div>
  );
}
