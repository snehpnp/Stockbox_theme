import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Row, Col, Button } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { AddThemeApi } from "../../Services/Themes/Theme";

import Swal from "sweetalert2";
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
    HeadingColor: "#ffffff",
    WrapperColor: "#ffffff",
    headSidebarFontCol: "#ffffff",
    headSidebarFontActiveCol: "#ffffff",
    tabelheadbgcolor: "#f1f1f1",
  });

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const RoleData = localStorage.getItem("Role");

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
      HeadingColor: theme.HeadingColor || "#ffffff",
      headSidebarFontCol: theme.headSidebarFontCol || "#ffffff",
      headSidebarFontActiveCol: theme.headSidebarFontActiveCol || "#ffffff",
      WrapperColor: theme.WrapperColor || "#ffffff",
      tabelheadbgcolor: theme.tabelheadbgcolor || "#f1f1f1",
      wrapperMode: theme.wrapperMode || "solid",
      BtnSecBgCol: theme.BtnSecBgCol || "#ffffff",
      BtnSecTxtCol: theme.BtnSecTxtCol || "#ffffff",
      BtnSecBorderColor: theme.BtnSecBorderColor || "#ffffff",
      BtnPriBgCol: theme.BtnPriBgCol || "#ffffff",
      BtnPriTxtCol: theme.BtnPriTxtCol || "#ffffff",
      BtnBorderColor: theme.BtnBorderColor ? theme.BtnBorderColor : "#ffffff",
      wrapperGradientEnd: theme.wrapperGradientEnd || "#ffffff",
      wrapperGradientStart: theme.wrapperGradientStart || "#ffffff",
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
    () => localStorage.getItem("dynamicColor") || "#000000"
  );
  const topFonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
    "Tahoma",
    "Trebuchet MS",
    "Lucida Console",
    "Impact",
  ];
  const allFonts = [
    ...topFonts,
    "Palatino Linotype",
    "Arial Black",
    "Consolas",
    "Lucida Sans Unicode",
    "Garamond",
    "Book Antiqua",
    "Copperplate",
    "Brush Script MT",
    "Arial Narrow",
    "Century Gothic",
    "Rockwell",
    "Franklin Gothic Medium",
    "Arial Rounded MT Bold",
    "Poppins",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Oswald",
    "Raleway",
    "PT Sans",
    "Merriweather",
    "Nunito",
    "Ubuntu",
    "Playfair Display",
    "Fira Sans",
    "Inter",
    "Work Sans",
  ];
  const handleCreateNewTheme = async (values) => {
    let updatedValues = {
      ...values,
      sidebarColor: isGradient.sidebar
        ? `linear-gradient(to right, ${values.sidebarGradientStart}, ${values.sidebarGradientEnd})`
        : values.sidebarColor,
      navbarColor: isGradient.navbar
        ? `linear-gradient(to right, ${values.navbarGradientStart}, ${values.navbarGradientEnd})`
        : values.navbarColor,
      fontColor: values.fontColor,
    };

    Swal.fire({
      title: "Enter Your Theme Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async (themeName) => {
        // Ensure theme name is not empty
        if (!themeName) {
          Swal.showValidationMessage("Please enter a theme name");
          return false; // Prevent the submission
        }

        // Merge the updated values with the theme name
        const finalValues = { ...updatedValues, ThemeName: themeName };

        try {
          const response = await AddThemeApi(finalValues);

          // Check if response status is successful
          if (response.status) {
            Swal.fire({ title: "Theme Created Successfully", icon: "success" });
          } else {
            Swal.fire({ title: "Theme Creation Failed", icon: "error" });
          }
        } catch (error) {
          // Handle any errors during the API request
          Swal.fire({ title: "Theme Creation Failed", icon: "error" });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };




  return (
    <>
      {/* {RoleData == "SUPERADMIN" && ( */}
      <>
        <span
          className="text-dark sidebar-setting-toggle-button"
          onClick={toggleSidebar}
        >
          <i className="text-dark fa-solid fa-gear fa-spin"></i>
        </span>

        <div
          ref={sidebarRef}
          className={`sidebar-setting ${isOpen ? "sidebar-setting-open" : ""}`}
        >
          <h1 className="text-dark fs-2">Settings</h1>
          <hr/>
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
              };
              localStorage.setItem("theme", JSON.stringify(updatedValues));
              window.location.reload();
            }}
          >
            {({ values }) => (
              <Form>
                <Row>
                  <Col md={12} lg={12} className="mb-4">
                    <label className="text-dark setting-label">
                      Theme Settings
                    </label>

                    <div className="color-input-div">
                      <label className="text-dark">Dashboard Name: </label>
                      <Field
                        as="select"
                        name="themeId"
                        className="text-dark form-control"
                      >
                        { }
                        {Array.from({ length: 11 }, (_, i) => (
                          <option
                            key={i + 1}
                            className="text-dark"
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </Col>

                  <div className="setting-sidebar-divider-line"></div>
                  <Col md={12} lg={12}>
                    <label className="text-dark setting-label">
                      Sidebar Settings
                    </label>
                    <div className="setting-color-mode-input">
                      <label className="text-dark">
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
                      <label className="text-dark">
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
                        <label className="text-dark">
                          Sidebar Solid Color:{" "}
                        </label>
                        <Field name="sidebarColor" type="color" />
                      </div>
                    ) : (
                      <div>
                        <div className="color-input-div">
                          <label className="text-dark">
                            Sidebar Gradient Start:{" "}
                          </label>
                          <Field name="sidebarGradientStart" type="color" />
                        </div>
                        <div className="color-input-div">
                          <label className="text-dark">
                            Sidebar Gradient End:{" "}
                          </label>
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

                    <div className="color-input-div">
                      <label className="text-dark">Sidebar Position: </label>
                      <Field
                        as="select"
                        name="sidebarPosition"
                        className="text-dark form-control"
                      >
                        <option className="text-dark" value="Header">
                          Header
                        </option>
                        <option className="text-dark" value="Sidebar">
                          Sidebar
                        </option>
                      </Field>
                    </div>
                  </Col>

                  <div className="setting-sidebar-divider-line"></div>

                  {/* Navbar Color Card */}
                  <Col md={12} lg={12}>
                    <label className="text-dark setting-label">
                      Navbar Color
                    </label>
                    {/* <label className='setting-color-mode-label'>Navbar Color Mode:</label> */}
                    <div className="setting-color-mode-input">
                      <label className="text-dark">
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
                      <label className="text-dark">
                        <input
                          type="radio"
                          name="navbarMode"
                          checked={isGradient.navbar}
                          onChange={() =>
                            setIsGradient((prev) => ({
                              ...prev,
                              navbar: true,
                            }))
                          }
                        />
                        Gradient
                      </label>
                    </div>

                    {!isGradient.navbar ? (
                      <div className="color-input-div">
                        <label className="text-dark">
                          Navbar Solid Color:{" "}
                        </label>
                        <Field name="navbarColor" type="color" />
                      </div>
                    ) : (
                      <div>
                        <div className="color-input-div">
                          <label className="text-dark">
                            Navbar Gradient Start:{" "}
                          </label>
                          <Field name="navbarGradientStart" type="color" />
                        </div>
                        <div className="color-input-div">
                          <label className="text-dark">
                            Navbar Gradient End:{" "}
                          </label>
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
                    <label className="text-dark setting-label">
                      Font Color
                    </label>

                    <div className="color-input-div">
                      <label className="text-dark">Font Solid Color: </label>
                      <Field name="fontColor" type="color" />
                    </div>

                    <div className="color-input-div">
                      <label className="text-dark">Heading Color: </label>
                      <Field name="HeadingColor" type="color" />
                    </div>

                    <div className="color-input-div">
                      <label className="text-dark">
                        Sidebar/Navbar Color:{" "}
                      </label>
                      <Field name="headSidebarFontCol" type="color" />
                    </div>

                    <div className="color-input-div">
                      <label className="text-dark">
                        Sidebar/Navbar Active Color:{" "}
                      </label>
                      <Field name="headSidebarFontActiveCol" type="color" />
                    </div>

                    <div className="text-dark color-input-div">
                      <label className="text-dark">Font: </label>
                      <Field
                        as="select"
                        name="fontFamily"
                        className="text-dark form-control"
                      >
                        {topFonts.map((font) => (
                          <option key={font} className="text-dark" value={font}>
                            {font}
                          </option>
                        ))}
                        <option disabled>──────────</option>
                        {allFonts
                          .filter((font) => !topFonts.includes(font))
                          .map((font) => (
                            <option
                              key={font}
                              className="text-dark"
                              value={font}
                            >
                              {font}
                            </option>
                          ))}
                      </Field>
                    </div>
                  </Col>

                  <div className="setting-sidebar-divider-line"></div>

                  <Col md={12} lg={12}>
                    <label className="text-dark setting-label">
                      Wrapper Color Mode :
                    </label>

                    <div>
                      <br />
                      <label className="text-dark">
                        <input
                          type="radio"
                          name="wrapperMode"
                          checked={!isGradient.font}
                          onChange={() =>
                            setIsGradient((prev) => ({
                              ...prev,
                              font: false,
                            }))
                          }
                        />
                        Solid
                      </label>
                      <label className="text-dark">
                        <input
                          type="radio"
                          name="wrapperMode"
                          checked={isGradient.font}
                          onChange={() =>
                            setIsGradient((prev) => ({
                              ...prev,
                              font: true,
                            }))
                          }
                        />
                        Gradient
                      </label>
                    </div>

                    {!isGradient.font ? (
                      <div className="mt-3">
                        <label className="text-dark">
                          Wrapper Solid Color:{" "}
                        </label>
                        <Field name="WrapperColor" type="color" />
                      </div>
                    ) : (
                      <div className="mt-3">
                        <label className="text-dark">
                          Wrapper Gradient Start:{" "}
                        </label>
                        <Field name="wrapperGradientStart" type="color" />
                        <br />
                        <label className="text-dark">
                          Wrapper Gradient End:{" "}
                        </label>
                        <Field name="wrapperGradientEnd" type="color" />
                        <div
                          style={{
                            marginTop: "10px",
                            height: "50px",
                            background: `linear-gradient(to right, ${values.wrapperGradientStart}, ${values.wrapperGradientEnd})`,
                            border: "1px solid #ccc",
                          }}
                        ></div>
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="text-dark">Tabel Head bg Color: </label>
                      <Field name="tabelheadbgcolor" type="color" />
                    </div>
                  </Col>

                  <div className="setting-sidebar-divider-line"></div>

                  <Col md={12} lg={12}>
                    <label className="text-dark setting-label">
                      Buttons Settings :
                    </label>

                    <div className="mt-3">
                      <label className="text-dark">
                        primary Button Background Color{" "}
                      </label>
                      <Field name="BtnPriBgCol" type="color" />
                    </div>
                    <div className="mt-3">
                      <label className="text-dark">
                        primary Button Text Color:{" "}
                      </label>
                      <Field name="BtnPriTxtCol" type="color" />
                    </div>
                    <div className="mt-3">
                      <label className="text-dark">
                        Primary Button Border Color:{" "}
                      </label>
                      <Field name="BtnBorderColor" type="color" />
                    </div>
                    <div className="mt-3">
                      <label className="text-dark">
                        Secondary Button Background Color{" "}
                      </label>
                      <Field name="BtnSecBgCol" type="color" />
                    </div>
                    <div className="mt-3">
                      <label className="text-dark">
                        Secondary Button Text Color:{" "}
                      </label>
                      <Field name="BtnSecTxtCol" type="color" />
                    </div>
                    <div className="mt-3">
                      <label className="text-dark">
                        Secondary Button Border Color:{" "}
                      </label>
                      <Field name="BtnSecBorderColor" type="color" />
                    </div>
                  </Col>
                </Row>
                <div className="setting-sidebar-divider-line"></div>

                <Button className="btn btn-primary me-3" type="submit">
                  Apply Changes
                </Button>
                <Button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleCreateNewTheme(values)}
                >
                  Create New Theme
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </>
      {/* )} */}
    </>
  );
}
