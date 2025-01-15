import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Row, Col, Button } from "react-bootstrap";

export default function Setting_sidebar() {
  const [isGradient, setIsGradient] = useState({
    sidebar: false,
    navbar: false,
    font: false,
  });

  const [initialValues, setInitialValues] = useState({
    sidebarColor: "#ffffff",
    navbarColor: "#ffffff",
    fontColor: "#ffffff",
    sidebarGradientStart: "#ffffff",
    sidebarGradientEnd: "#000000",
    navbarGradientStart: "#ffffff",
    navbarGradientEnd: "#000000",
    fontGradientStart: "#ffffff",
    fontGradientEnd: "#000000",
    sidebarPosition: "Header",
    fontFamily: "Arial",
    navbarPosition: "Header",
    themeId: "1",
    sidebarName: "1",
    BtnBgColor: "#ffffff",
    btnTxtColor: "#ffffff",
    HeadingColor: "#ffffff",
    WrapperColor: "#ffffff",
    sidebarFontColor: "#000000",
  });

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme")) || {};
    setIsGradient({
      sidebar: theme.sidebarColor?.includes("gradient") || false,
      navbar: theme.navbarColor?.includes("gradient") || false,
      font: theme.fontColor?.includes("gradient") || false,
    });

    setInitialValues({
      sidebarColor: theme.sidebarColor || "#ffffff",
      navbarColor: theme.navbarColor || "#ffffff",
      fontColor: theme.fontColor || "#ffffff",
      sidebarGradientStart: theme.sidebarGradientStart || "#ffffff",
      sidebarGradientEnd: theme.sidebarGradientEnd || "#000000",
      navbarGradientStart: theme.navbarGradientStart || "#ffffff",
      navbarGradientEnd: theme.navbarGradientEnd || "#000000",
      fontGradientStart: theme.fontGradientStart || "#ffffff",
      fontGradientEnd: theme.fontGradientEnd || "#000000",
      sidebarPosition: theme.sidebarPosition || "Header",
      fontFamily: theme.fontFamily || "Arial",
      navbarPosition: theme.navbarPosition || "Header",
      themeId: theme.themeId || "1",
      sidebarName: theme.sidebarName || "1",
      BtnBgColor: theme.BtnBgColor || "#ffffff",
      btnTxtColor: theme.btnTxtColor || "#ffffff",
      HeadingColor: theme.HeadingColor || "#ffffff",
    });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const theme = JSON.parse(savedTheme);

      const wrapper = document.querySelector(".wrapper");
      if (wrapper) {
        wrapper.style.backgroundColor = theme.WrapperColor || "#ffffff";
      }
    }
  }, []);

  const [color, setColor] = useState(
    () => localStorage.getItem('dynamicColor') || '#000000'
  );

  useEffect(() => {
    // Set the initial color in CSS variable
    document.documentElement.style.setProperty('--dynamic-color', color);
  }, [color]);

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);

    // Update the global CSS variable
    document.documentElement.style.setProperty('--dynamic-color', selectedColor);

    // Save the color to localStorage
    localStorage.setItem('dynamicColor', selectedColor);
  };

  return (
    <>
      <span className="sidebar-setting-toggle-button" onClick={toggleSidebar}>
        <i className="fa-solid fa-gear fa-spin"></i>
      </span>

      <div
        ref={sidebarRef}
        className={`sidebar-setting ${isOpen ? "sidebar-setting-open" : ""}`}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={(values) => {
            const updatedValues = {
              ...values,
              sidebarColor: isGradient.sidebar
                ? `linear-gradient(to right, ${values.sidebarGradientStart}, ${values.sidebarGradientEnd})`
                : values.sidebarColor,
              navbarColor: isGradient.navbar
                ? `linear-gradient(to right, ${values.navbarGradientStart}, ${values.navbarGradientEnd})`
                : values.navbarColor,
              fontColor: values.fontColor,
              sidebarFontColor: values.sidebarFontColor, // Include Sidebar Font Color
            };
            localStorage.setItem("theme", JSON.stringify(updatedValues));
            window.location.reload();
          }}
        >
          {({ values }) => (
            <Form>
              <div>
      <h1 className="content-heading">This text changes color dynamically!</h1>
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
        aria-label="Choose a color"
      />
    </div>
              <Row>
                <Col md={12} lg={12}>
                  <label className="setting-label">Sidebar Color</label>
                  {/* <label className='setting-color-mode-label'>Sidebar Color Mode: </label> */}
                  <div className="setting-color-mode-input">
                    <label>
                      <input
                        type="radio"
                        name="sidebarMode"
                        checked={!isGradient.sidebar}
                        onChange={() =>
                          setIsGradient((prev) => ({
                            ...prev,
                            sidebar: false,
                          }))
                        }
                      />
                      Solid
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="sidebarMode"
                        checked={isGradient.sidebar}
                        onChange={() =>
                          setIsGradient((prev) => ({
                            ...prev,
                            sidebar: true,
                          }))
                        }
                      />
                      Gradient
                    </label>
                  </div>

                  {!isGradient.sidebar ? (
                    <div className="color-input-div">
                      <label>Sidebar Solid Color: </label>
                      <Field name="sidebarColor" type="color" />
                    </div>
                  ) : (
                    <div>
                      <div className="color-input-div">
                        <label>Sidebar Gradient Start: </label>
                        <Field name="sidebarGradientStart" type="color" />
                      </div>
                      <div className="color-input-div">
                        <label>Sidebar Gradient End: </label>
                        <Field name="sidebarGradientEnd" type="color" />
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          height: "50px",
                          background: `linear-gradient(to right, ${values.sidebarGradientStart}, ${values.sidebarGradientEnd})`,
                          border: "1px solid #ccc",
                        }}
                      ></div>
                    </div>
                  )}
                </Col>

                <div className="setting-sidebar-divider-line"></div>

                {/* Navbar Color Card */}
                <Col md={12} lg={12}>
                  <label className="setting-label">Navbar Color</label>
                  {/* <label className='setting-color-mode-label'>Navbar Color Mode:</label> */}
                  <div className="setting-color-mode-input">
                    <label>
                      <input
                        type="radio"
                        name="navbarMode"
                        checked={!isGradient.navbar}
                        onChange={() =>
                          setIsGradient((prev) => ({
                            ...prev,
                            navbar: false,
                          }))
                        }
                      />
                      Solid
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="navbarMode"
                        checked={isGradient.navbar}
                        onChange={() =>
                          setIsGradient((prev) => ({ ...prev, navbar: true }))
                        }
                      />
                      Gradient
                    </label>
                  </div>

                  {!isGradient.navbar ? (
                    <div className="color-input-div">
                      <label>Navbar Solid Color: </label>
                      <Field name="navbarColor" type="color" />
                    </div>
                  ) : (
                    <div>
                      <div className="color-input-div">
                        <label>Navbar Gradient Start: </label>
                        <Field name="navbarGradientStart" type="color" />
                      </div>
                      <div className="color-input-div">
                        <label>Navbar Gradient End: </label>
                        <Field name="navbarGradientEnd" type="color" />
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          height: "50px",
                          background: `linear-gradient(to right, ${values.navbarGradientStart}, ${values.navbarGradientEnd})`,
                          border: "1px solid #ccc",
                        }}
                      ></div>
                    </div>
                  )}
                </Col>

                <div className="setting-sidebar-divider-line"></div>

                {/* Font Color Card */}
                <Col md={12} lg={12}>
                  <label className="setting-label">Font Color</label>

                  <div className="color-input-div">
                    <label>Font Solid Color: </label>
                    <Field name="fontColor" type="color" />
                  </div>

                  <div className="color-input-div">
                    <label>Button Text Color: </label>
                    <Field name="btnTxtColor" type="color" />
                  </div>

                  <div className="color-input-div">
                    <label>Heading Color: </label>
                    <Field name="HeadingColor" type="color" />
                  </div>

                  <div className="color-input-div">
                    <label>Button Background Color: </label>
                    <Field name="BtnBgColor" type="color" />
                  </div>

                  <div className="color-input-div">
                    <label>Font: </label>
                    <Field
                      as="select"
                      name="fontFamily"
                      className="form-control"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Lucida Console">Lucida Console</option>
                      <option value="Palatino Linotype">
                        Palatino Linotype
                      </option>
                      <option value="Arial Black">Arial Black</option>
                      <option value="Consolas">Consolas</option>
                    </Field>
                  </div>
                </Col>

                <div className="setting-sidebar-divider-line"></div>

                {/* Sidebar Position & Font Settings Card */}
                <Col md={12} lg={12}>
                  <label className="setting-label">Sidebar Settings</label>

                  <div className="color-input-div">
                    <label>Sidebar Position: </label>
                    <Field
                      as="select"
                      name="sidebarPosition"
                      className="form-control"
                    >
                      <option value="Header">Header</option>
                      <option value="Sidebar">Sidebar</option>
                    </Field>
                  </div>

                  <div className="color-input-div">
                    <label>Sidebar Name: </label>
                    <Field
                      as="select"
                      name="sidebarName"
                      className="form-control"
                    >
                      <option value="1">Main</option>
                      <option value="2">Card Sidebar</option>
                      <option value="3">New Sidebar</option>
                    </Field>
                  </div>
                </Col>

                <div className="setting-sidebar-divider-line"></div>

                <Col md={12} lg={12} className="mb-4">
                  <label className="setting-label">Theme Settings</label>

                  <div className="color-input-div">
                    <label>Dashboard Name: </label>
                    <Field as="select" name="themeId" className="form-control">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                    </Field>
                  </div>
                </Col>

                <div className="setting-sidebar-divider-line"></div>
                <Col md={12} lg={12}>
                  <label className="setting-label">
                    Wrapper Background Color
                  </label>
                  <div className="color-input-div">
                    <label>Wrapper Solid Color: </label>
                    <Field name="WrapperColor" type="color" />
                  </div>
                </Col>
              </Row>
              <div className="setting-sidebar-divider-line"></div>
              <Col md={12} lg={12}>
                <label className="setting-label">Sidebar Font Color</label>
                <div className="color-input-div">
                  <label>Sidebar Font Color: </label>
                  <Field name="sidebarFontColor" type="color" />
                </div>
              </Col>

              <Button type="submit">Apply Changes</Button>
            </Form>
          )}
        </Formik>
     
      </div>
    </>
  );
}