import React, { createContext, useState, useEffect } from "react";
import Content from "../components/Content";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexGrow: 1, width: "100%" }}>
          <div
            style={{
              backgroundColor: "yellow",
              flexGrow: 1,
              padding: "20px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
