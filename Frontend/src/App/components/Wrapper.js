import React, { useState, useEffect, use } from "react";
import Navbar from "../components/Navbar";
import Content from "../Routes/Route";
import Sidebar from "../components/Sidebar";
import Setting_sidebar from '../components/Setting_sidebar'

export default function App() {
  const savedTheme = localStorage.getItem("theme");
  useEffect(() => {
    if (savedTheme) {
      const theme = JSON.parse(savedTheme); // Parse the theme object

      // Apply theme attributes to the root HTML element
      document.documentElement.setAttribute("data-theme", savedTheme);

      // Apply background color to .container-fluid
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
      // const all = document.querySelectorAll("*");

      const all = document.querySelectorAll(
        "*:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(button)"
      );

      all.forEach((element) => {
        element.style.color = fontColor;
      });
      all.forEach((element) => {
        element.style.color = contentColor;
      });
      buttons.forEach((button) => {
        if (button) {
          if (font) {
            button.style.background = theme.BtnBgColor;
            button.style.color = theme.btnTxtColor;
          } else {
            button.style.backgroundColor = theme.BtnBgColor;
            button.style.color = theme.btnTxtColor;
          }
        }
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

      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      if (headings) {
        headings.forEach((heading) => {
          if (theme.HeadingColor) {
            heading.style.color = theme.HeadingColor;
          } else {
            heading.style.color = theme.fontColor;
          }
        });
      }

      // CHANGE ALL SOFTWARE FONT FAMILY

      allFont.forEach((element) => {
        element.style.fontFamily = fontFamily;
      });
    } else {
      let data = {
        sidebarColor: "linear-gradient(to right, #1fa9ff, #000000)",
        navbarColor: "linear-gradient(to right, #f13b3b, #000000)",
        fontColor: "#1d1b1b",
        sidebarGradientStart: "#1fa9ff",
        sidebarGradientEnd: "#000000",
        navbarGradientStart: "#f13b3b",
        navbarGradientEnd: "#000000",
        fontGradientStart: "#ffffff",
        fontGradientEnd: "#000000",
        sidebarPosition: "Sidebar",
        fontFamily: "Comic Sans MS",
        navbarPosition: "Header",
        themeId: "1",
        sidebarName: "1",
        BtnBgColor: "#ffffff",
        btnTxtColor: "#ffffff",
        HeadingColor: "#ffffff",
        contentColor: "#8f8f8f",
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
        <div
  className="content"
  
>
 
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
