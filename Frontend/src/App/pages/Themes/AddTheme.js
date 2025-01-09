import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios"; // Ensure axios is installed
import Contnet from "../../components/Content";
import { AddThemeApi } from "../../Services/Themes/Theme";

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
    BtnBgColor: "#ffffff",
    btnTxtColor: "#ffffff",
    HeadingColor: "#ffffff",
  });

  useEffect(() => {
    const theme = {};
    setIsGradient({
      sidebar: theme.sidebarColor?.includes("gradient") || false,
      navbar: theme.navbarColor?.includes("gradient") || false,
      font: theme.fontColor?.includes("gradient") || false,
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
      BtnBgColor: theme.BtnBgColor || "#ffffff",
      btnTxtColor: theme.btnTxtColor || "#ffffff",
      HeadingColor: theme.HeadingColor || "#ffffff",
    });
  }, []);

  const handleSubmit = async (values) => {
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

    try {
      // Send data to the backend API
      const Response = await AddThemeApi(updatedValues);
      if (Response.status) {
        window.location.href = "/#/themes";
      }
    } catch (error) {
      console.log("Error applying theme:", error);
    }
  };

  return (
    <Contnet Page_title="Add Theme" button_title="Back" button_status={false}>
      <Container id="app" style={{ marginTop: "50px", color: "black" }}>
        <h2 className="my-4">Add Theme</h2>

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
                        <label>Theme Name: </label>
                        <Field name="ThemeName" type="text" />
                      </div>
                      <div className="mt-3">
                        <label>Dashboard Name: </label>
                        <Field
                          as="select"
                          name="themeId"
                          className="form-control"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </Field>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <label>Sidebar Color</label>
                      <div>
                        <label>Sidebar Color Mode: </label>
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
                        <div className="mt-3">
                          <label>Sidebar Solid Color: </label>
                          <Field name="sidebarColor" type="color" />
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label>Sidebar Gradient Start: </label>
                          <Field name="sidebarGradientStart" type="color" />
                          <br />
                          <label>Sidebar Gradient End: </label>
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
                    </Card.Body>
                  </Card>
                </Col>

                {/* Navbar Color Card */}
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>Navbar Color</Card.Title>
                      <div>
                        <label>Navbar Color Mode: </label>
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
                          <label>Navbar Solid Color: </label>
                          <Field name="navbarColor" type="color" />
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label>Navbar Gradient Start: </label>
                          <Field name="navbarGradientStart" type="color" />
                          <br />
                          <label>Navbar Gradient End: </label>
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
                {/* Font Color Card */}
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>Font Color</Card.Title>
                      <div className="mt-3">
                        <label>Font Solid Color: </label>
                        <Field name="fontColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label>Button Text Color: </label>
                        <Field name="btnTxtColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label>Heading Color: </label>
                        <Field name="HeadingColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label>Button Background Color: </label>
                        <Field name="BtnBgColor" type="color" />
                      </div>

                      <div className="mt-3">
                        <label>Font: </label>
                        <Field
                          as="select"
                          name="fontFamily"
                          className="form-control"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
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
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>Sidebar Settings</Card.Title>
                      <div className="mt-3">
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

                      <div className="mt-3">
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
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Button type="submit" variant="primary">
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
