import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Contnet from "../../../components/Contents/Content";
import { AddThemeApi } from "../../../Services/Themes/Theme";

const Addtheme = () => {
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
    WrapperColor: "#000000",
    wrapperGradientStart: "#ffffff",
    wrapperGradientEnd: "#000000",
    BtnPriTxtCol: "#ffffff",
    BtnSecTxtCol: "#ffffff",
    BtnBorderColor: "#ffffff",
    BtnSecBorderColor: "#ffffff",
    BtnPriBgCol: "#ffffff",
    BtnSecBgCol: "#ffffff",
    wrapperMode: false,
    headSidebarFontActiveCol: "#ffffff",
    headSidebarFontCol: "#ffffff",
    tabelheadbgcolor: "#f1f1f1",
  });

  useEffect(() => {
    const theme = {};
    setIsGradient({
      sidebar: theme.sidebarColor?.includes("gradient") || false,
      navbar: theme.navbarColor?.includes("gradient") || false,
      font: theme.fontColor?.includes("gradient") || false,
      wrapperMode: theme.WrapperColor?.includes("gradient") || false,
    });

    setInitialValues({
      ThemeName: theme.ThemeName || "",
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
      WrapperColor: theme.WrapperColor || "#ffffff",
      wrapperGradientStart: theme.wrapperGradientStart || "#ffffff",
      wrapperGradientEnd: theme.wrapperGradientEnd || "#000000",
      BtnPriTxtCol: theme.BtnPriTxtCol || "#ffffff",
      BtnSecTxtCol: theme.BtnSecTxtCol || "#ffffff",
      BtnBorderColor: theme.BtnBorderColor || "#ffffff",
      BtnSecBorderColor: theme.BtnSecBorderColor || "#ffffff",
      BtnPriBgCol: theme.BtnPriBgCol || "#ffffff",
      BtnSecBgCol: theme.BtnSecBgCol || "#ffffff",
      wrapperMode: theme.wrapperMode || false,
      headSidebarFontCol: theme.headSidebarFontCol || "#ffffff",
      headSidebarFontActiveCol: theme.headSidebarFontActiveCol || "#ffffff",
      tabelheadbgcolor: theme.tabelheadbgcolor || "#f1f1f1",

    });
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    const updatedValues = {
      ...values,
      sidebarColor: isGradient.sidebar
        ? `linear-gradient(to right, ${values.sidebarGradientStart}, ${values.sidebarGradientEnd})`
        : values.sidebarColor,
      navbarColor: isGradient.navbar
        ? `linear-gradient(to right, ${values.navbarGradientStart}, ${values.navbarGradientEnd})`
        : values.navbarColor,
      fontColor: values.fontColor,
      wrapperMode: isGradient.font,
    };

    try {
      // Send data to the backend API
      const Response = await AddThemeApi(updatedValues);
      if (Response.status) {
        window.location.href = "/superadmin/themes";
      }
    } catch (error) {
      console.log("Error applying theme:", error);
    }
  };

  return (
    <Contnet Page_title="Add Theme" button_title="Back" button_status={false}>
      <Container id="app" style={{ marginTop: "50px", color: "black" }}>
        <h2 className="text-dark my-4">Add Theme</h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Row>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <div className="mt-3">
                        <label className="text-dark">Theme Name: </label>
                        <Field name="ThemeName" type="text" />
                      </div>
                      <div className="mt-3">
                        <label className="text-dark">Dashboard Name: </label>
                        <Field
                          as="select"
                          name="themeId"
                          className="text-dark form-control"
                        >
                          <option className="text-dark" value="1">
                            1
                          </option>
                          <option className="text-dark" value="2">
                            2
                          </option>
                   
                          <option className="text-dark" value="4">
                            4
                          </option>
                          <option className="text-dark" value="5">
                            5
                          </option>
                          <option className="text-dark" value="6">
                            6
                          </option>
                          <option className="text-dark" value="7">
                            7
                          </option>
                          <option className="text-dark" value="8">
                            8
                          </option>
                          <option className="text-dark" value="9">
                            9
                          </option>
                          <option className="text-dark" value="10">
                            10
                          </option>
                          <option className="text-dark" value="11">
                            11
                          </option>
                        </Field>
                      </div>

                      <div className="mt-3">
                        <label className="text-dark">Font: </label>
                        <Field
                          as="select"
                          name="fontFamily"
                          className="text-dark form-control"
                        >
                          <option className="text-dark" value="Arial">
                            Arial
                          </option>
                          <option className="text-dark" value="Times New Roman">
                            Times New Roman
                          </option>
                          <option className="text-dark" value="Courier New">
                            Courier New
                          </option>
                          <option className="text-dark" value="Verdana">
                            Verdana
                          </option>
                          <option className="text-dark" value="Georgia">
                            Georgia
                          </option>
                          <option className="text-dark" value="Impact">
                            Impact
                          </option>
                          <option className="text-dark" value="Comic Sans MS">
                            Comic Sans MS
                          </option>
                          <option className="text-dark" value="Tahoma">
                            Tahoma
                          </option>
                          <option className="text-dark" value="Trebuchet MS">
                            Trebuchet MS
                          </option>
                          <option className="text-dark" value="Lucida Console">
                            Lucida Console
                          </option>
                          <option
                            className="text-dark"
                            value="Palatino Linotype"
                          >
                            Palatino Linotype
                          </option>
                          <option className="text-dark" value="Arial Black">
                            Arial Black
                          </option>
                          <option className="text-dark" value="Consolas">
                            Consolas
                          </option>
                          <option
                            className="text-dark"
                            value="Lucida Sans Unicode"
                          >
                            Lucida Sans Unicode
                          </option>
                          <option className="text-dark" value="Garamond">
                            Garamond
                          </option>
                          <option className="text-dark" value="Book Antiqua">
                            Book Antiqua
                          </option>
                          <option className="text-dark" value="Copperplate">
                            Copperplate
                          </option>
                          <option className="text-dark" value="Brush Script MT">
                            Brush Script MT
                          </option>
                          <option className="text-dark" value="Arial Narrow">
                            Arial Narrow
                          </option>
                          <option className="text-dark" value="Century Gothic">
                            Century Gothic
                          </option>
                          <option className="text-dark" value="Rockwell">
                            Rockwell
                          </option>
                          <option
                            className="text-dark"
                            value="Franklin Gothic Medium"
                          >
                            Franklin Gothic Medium
                          </option>
                          <option
                            className="text-dark"
                            value="Arial Rounded MT Bold"
                          >
                            Arial Rounded MT Bold
                          </option>
                          <option className="text-dark" value="Poppins">
                            Poppins
                          </option>
                          <option className="text-dark" value="Roboto">
                            Roboto
                          </option>
                          <option className="text-dark" value="Open Sans">
                            Open Sans
                          </option>
                          <option className="text-dark" value="Lato">
                            Lato
                          </option>
                          <option className="text-dark" value="Montserrat">
                            Montserrat
                          </option>
                          <option className="text-dark" value="Oswald">
                            Oswald
                          </option>
                          <option className="text-dark" value="Raleway">
                            Raleway
                          </option>
                          <option className="text-dark" value="PT Sans">
                            PT Sans
                          </option>
                          <option className="text-dark" value="Merriweather">
                            Merriweather
                          </option>
                          <option className="text-dark" value="Nunito">
                            Nunito
                          </option>
                          <option className="text-dark" value="Ubuntu">
                            Ubuntu
                          </option>
                          <option
                            className="text-dark"
                            value="Playfair Display"
                          >
                            Playfair Display
                          </option>
                          <option className="text-dark" value="Fira Sans">
                            Fira Sans
                          </option>
                          <option className="text-dark" value="Inter">
                            Inter
                          </option>
                          <option className="text-dark" value="Work Sans">
                            Work Sans
                          </option>
                        </Field>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark">Font Color</Card.Title>

                      <div className="mt-3">
                        <label className="text-dark">Font Solid Color: </label>
                        <Field name="fontColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label className="text-dark">Heading Color: </label>
                        <Field name="HeadingColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label className="text-dark">
                          Sidebar/Navbar Color:{" "}
                        </label>
                        <Field name="headSidebarFontCol" type="color" />
                      </div>

                      <div className="mt-3">
                        <label className="text-dark">
                          Sidebar/Navbar Active Color:{" "}
                        </label>
                        <Field name="headSidebarFontActiveCol" type="color" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Navbar Color Card */}
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark">
                        Navbar Color
                      </Card.Title>
                      <div>
                        <label className="text-dark">Navbar Color Mode: </label>
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
                        <div className="mt-3">
                          <label className="text-dark">
                            Navbar Solid Color:{" "}
                          </label>
                          <Field name="navbarColor" type="color" />
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label className="text-dark">
                            Navbar Gradient Start:{" "}
                          </label>
                          <Field name="navbarGradientStart" type="color" />
                          <br />
                          <label className="text-dark">
                            Navbar Gradient End:{" "}
                          </label>
                          <Field name="navbarGradientEnd" type="color" />
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
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark">
                        Sidebar Settings
                      </Card.Title>

                      <div>
                        <label className="text-dark">
                          Sidebar Color Mode:{" "}
                        </label>
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
                        <div className="mt-3">
                          <label className="text-dark">
                            Sidebar Solid Color:{" "}
                          </label>
                          <Field name="sidebarColor" type="color" />
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label className="text-dark">
                            Sidebar Gradient Start:{" "}
                          </label>
                          <Field name="sidebarGradientStart" type="color" />
                          <br />
                          <label className="text-dark">
                            Sidebar Gradient End:{" "}
                          </label>
                          <Field name="sidebarGradientEnd" type="color" />
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

                      <div className="mt-3">
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

                    
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark">
                        Buttons Settings
                      </Card.Title>
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
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark">
                        Wrapper Settings
                      </Card.Title>

                      <div>
                        <label className="text-dark">
                          Wrapper Color Mode:{" "}
                        </label>
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
                        <label className="text-dark">
                          Tabel Head bg Color:{" "}
                        </label>
                        <Field name="tabelheadbgcolor" type="color" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Button className="text-dark" type="submit" variant="primary">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Contnet>
  );
};

export default Addtheme;
