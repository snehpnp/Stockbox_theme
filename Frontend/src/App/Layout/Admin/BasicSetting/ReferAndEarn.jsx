import React, { useEffect, useState } from "react";
import { basicsettinglist, UpdatereferAndEarn } from "../../../Services/Admin/Admin";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { image_baseurl } from "../../../../Utils/config";

const ReferAndEarn = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [clients, setClients] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const getsettinglist = async () => {
    try {
      const response = await basicsettinglist(token);
      if (response.status) {
        setClients(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getsettinglist();
  }, []);

  const handleFieldChange = (fieldName, value, setFieldValue) => {
    if (value === "" || (Number(value) <= 100 && !isNaN(value))) {
      setFieldValue(fieldName, value); 
    }
    setIsChanged(true); 
  };

  if (!clients) {
    return <div>Loading...</div>;
  }




  return (
    <div className="page-content">
      <div className="page-breadcrumb  d-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Refer And Earn</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard">
                  <i className="bx bx-home-alt" />
                </Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card radius-15">
            <Formik
              enableReinitialize={true}
              initialValues={{
                sender_earn: clients[0]?.sender_earn || "",
                receiver_earn: clients[0]?.receiver_earn || "",
                refer_title: clients[0]?.refer_title || "",
                refer_description: clients[0]?.refer_description || "",
                refer_status: clients[0]?.refer_status || "",
                refer_image: null,
                Multipletime: clients[0]?.refer_status === 1, 
                Singletime: clients[0]?.refer_status === 0, 
              }}
              onSubmit={async (values) => {
                const req = {
                  sender_earn: values?.sender_earn,
                  receiver_earn: values?.receiver_earn,
                  refer_title: values?.refer_title,
                  refer_description: values?.refer_description,
                  refer_image: values?.refer_image,
                  refer_status: values?.refer_status,
                };

                try {
                  const response = await UpdatereferAndEarn(req, token);

                  if (response.status) {
                    Swal.fire({
                      title: "Update Successful!",
                      text: response.message,
                      icon: "success",
                      timer: 1500,
                      timerProgressBar: true,
                    });
                  } else {
                    Swal.fire({
                      title: "Error",
                      text: response.message,
                      icon: "error",
                      timer: 1500,
                      timerProgressBar: true,
                    });
                  }
                  setIsChanged(false); // Reset after successful update
                } catch (error) {
                  Swal.fire({
                    title: "Error",
                    text: "An unexpected error occurred. Please try again later.",
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true,
                  });
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Form className="card-body p-4">
                  <div className="p-4 border radius-15">
                    {/* Title field */}
                    <div className="row mb-3 align-items-center">
                      <label htmlFor="refer_title" className="col-sm-3 col-form-label">
                        <b>Title</b>
                      </label>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fadeIn animated bx bx-message-square-edit" />
                          </span>
                          <Field
                            name="refer_title"
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={(e) => {
                              handleFieldChange("refer_title", e.target.value, setFieldValue);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sender Earn field */}
                    <div className="row mb-3 align-items-center">
                      <label htmlFor="sender_earn" className="col-sm-3 col-form-label">
                        <b>Sender Earn</b>
                      </label>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="lni lni-customer" />
                          </span>
                          <Field
                            name="sender_earn"
                            type="text"
                            className="form-control"
                            placeholder="Sender"
                            onChange={(e) => {
                              handleFieldChange("sender_earn", e.target.value, setFieldValue);
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Receiver Earn field */}
                    <div className="row mb-3 align-items-center">
                      <label htmlFor="receiver_earn" className="col-sm-3 col-form-label">
                        <b>Receiver Earn</b>
                      </label>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="lni lni-customer" />
                          </span>
                          <Field
                            name="receiver_earn"
                            type="text"
                            className="form-control"
                            placeholder="Receiver"
                            onChange={(e) => {
                              handleFieldChange("receiver_earn", e.target.value, setFieldValue);
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Description field */}
                    <div className="row mb-3 align-items-center">
                      <label htmlFor="refer_description" className="col-sm-3 col-form-label">
                        <b>Description</b>
                      </label>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <Field
                            as="textarea"
                            name="refer_description"
                            className="form-control"
                            placeholder="Description"
                            style={{ width: "100%" }}
                            onChange={(e) => {
                              handleFieldChange("refer_description", e.target.value, setFieldValue);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image upload */}
                    <div className="row mb-3 align-items-center">
                      <label htmlFor="refer_image" className="col-sm-3 col-form-label">
                        <b>Image</b>
                      </label>
                      <div className="col-sm-6">
                        <input
                          name="refer_image"
                          type="file"
                          className="form-control"
                          onChange={(event) => {
                            handleFieldChange("refer_image", event.currentTarget.files[0], setFieldValue);
                          }}
                        />
                      </div>
                      <div className="col-sm-3">
                        {clients[0]?.refer_image && (
                          <div className="file-preview">
                            <img
                              src={`${image_baseurl}uploads/basicsetting/${clients[0].refer_image}`}
                              alt="refer_image"
                              className="image-preview"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Multiple Time and Single Time checkboxes */}
                    <div className="d-flex">
                      <div className="col-sm-7">
                        <div className="input-group">
                          <Field
                            type="checkbox"
                            name="Multipletime"
                            className="form-check-input me-2"
                            checked={values.Multipletime}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setFieldValue("Multipletime", isChecked);
                              setFieldValue("refer_status", isChecked ? 1 : 0);
                              setFieldValue("Singletime", !isChecked);
                              setIsChanged(true); // Mark changes
                            }}
                          />
                          <label htmlFor="Multipletime" className="form-check-label">
                            Multiple Time
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <Field
                            type="checkbox"
                            name="Singletime"
                            className="form-check-input me-2"
                            checked={values.Singletime}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setFieldValue("Singletime", isChecked);
                              setFieldValue("refer_status", isChecked ? 0 : 1);
                              setFieldValue("Multipletime", !isChecked);
                              setIsChanged(true); // Mark changes
                            }}
                          />
                          <label htmlFor="Singletime" className="form-check-label">
                            Single Time
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="row">
                      <label className="col-sm-3 col-form-label" />
                      <div className="col-sm-9">
                        <div className="d-md-flex d-grid align-items-center justify-content-end gap-3">
                          <button
                            type="submit"
                            className="btn btn-primary px-4"
                          // disabled={!isChanged}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <style jsx>{`
        .general-settings {
          width: 50%;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }

        .file-preview {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .image-preview {
          width: auto;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ReferAndEarn;
