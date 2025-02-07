import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MoveLeft, Plus, Eye, EyeOff } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import Swal from "sweetalert2";
import JoditEditor from 'jodit-react';


const DynamicForm = ({


  fields,
  ProfileShow,
  page_title,
  formData,
  btn_name1,
  btn_name1_route,
  initialValues,
  validationSchema,
  onSubmit,
  btn_name_signUp,
  btn_name_login,
  fromDate,
  fieldtype,
  formik,
  btn_name,
  forlogin,
  title,
  additional_field,
  btn_status,
  content_btn_name,
  content_path,
  btn_name2,
  sumit_btn,
  additional_field1,
  btnstatus,
}) => {




  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  const [inputPerTrade, setInputPerTrade] = useState("");
  const [inputPerStrategy, setInputPerStrategy] = useState("");

  const [previews, setPreviews] = useState([]);

  const [inputValue, setInputValue] = useState("");


  const today = new Date().toISOString().slice(0, 10);

  const handleFileChange2 = (event, index, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
    }
  };





  const [imagePreview, setImagePreview] = useState({});

  const handleFileChange3 = (event, index, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);

      // Image preview logic
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prevState) => ({
          ...prevState,
          [fieldName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event, index, name) => {
    if (event.target.files[0].size > 420000) {
      alert("Select file less then 420KB");
      event.target.value = "";
      return;
    } else {
      const file = event.target.files[0];
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
      const reader = new FileReader();
      reader.onload = () => {
        formik.setFieldValue(name, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleOnchange = (e) => {
    const newValue = e.target.value.toUpperCase();
    if (/^[a-zA-Z]{0,3}$/.test(newValue)) {
      setInputValue(newValue);
      formik.handleChange(newValue);
    }
  };

  const HandelChange = (value) => {
    formik.setFieldValue("Service_Type", value);
  };

  const PerTradeValueset = (value) => {
    formik.setFieldValue("per_trade_value", value.target.value);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };



  const config = useMemo(() => ({

    readonly: false,

    placeholder: 'Start typing...',

    uploader: {

      url: '/upload',

      accept: 'image/*',

      method: 'POST',

      isRunOnce: true,

      onUpload: (files, insert) => {

        const formData = new FormData();

        formData.append('file', files[0]);

        fetch('/upload', {

          method: 'POST',

          body: formData,

        })

          .then((response) => response.json())

          .then((data) => {

            const imageUrl = data.url;

            insert(imageUrl);

          })

          .catch((error) => {

            console.log('Image upload failed:', error);

          });

      },

    },

    events: {

      afterInit: (editorInstance) => {

        setEditorReady(true);

        editor.current = editorInstance;

      },

    },

  }), []);





  return (
    <div className="" data-aos="fade-left">
      <div className="card mb-0">
        {page_title ? (
          <div className="card-header">
            {page_title ? (
              <h5 className="card-title mt-2 mb-2 w-auto">
                <i className="fa-regular fa-circle-user pe-2"></i>
                {page_title}{" "}
              </h5>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="card-body ">
            <div className="page-header">
              <div className="content-page-header d-flex justify-content-between align-items-center">
                {btn_status == "true" ? (
                  content_btn_name == "Back" ? (
                    <Link to={content_path} className="btn btn-primary">
                      {" "}
                      <MoveLeft /> {content_btn_name}{" "}
                    </Link>
                  ) : (
                    <Link to={content_path} className="btn btn-primary">
                      {" "}
                      <Plus /> {content_btn_name}{" "}
                    </Link>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>

            <div>
              <div>
                {/*  form  */}
                <div className="row d-flex ">
                  {fields.map((field, index) => (
                    <React.Fragment key={index}>
                      {field.type === "text" ? (
                        <>
                          <div className={` col-lg-${field.col_size}`}>
                            <div className="input-block mb-3 flex-column">
                              <label className={`col-lg-${field.label_size}`}>
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>

                              <input
                                type="text"
                                autoComplete="new-email1"
                                aria-describedby="basic-addon1"
                                className="form-control"
                                placeholder={`Enter ${field.label}`}
                                readOnly={field.disable}
                                id={field.name}
                                name={field.name}
                                {...formik.getFieldProps(field.name)}
                              />
                              {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "text5" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block mb-3 flex-column">
                              <label className={`col-lg-${field.label_size}`}>
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>

                              {/* Convert input to textarea */}
                              <textarea
                                autoComplete="new-email1"
                                aria-describedby="basic-addon1"
                                className="form-control"
                                placeholder={`Enter ${field.label}`}
                                readOnly={field.disable}
                                id={field.name}
                                name={field.name}
                                {...formik.getFieldProps(field.name)}
                              ></textarea>

                              {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "text2" ? (
                        <>
                          <div className={` col-lg-${field.col_size}`}>
                            <div className="input-block mb-3 flex-column">
                              <label className={`col-lg-${field.label_size}`}>
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>

                              <input
                                type="text"
                                autoComplete="new-email2"
                                aria-describedby="basic-addon1"
                                className="form-control"
                                placeholder={`Enter ${field.label}`}
                                readOnly={field.disable}
                                id={field.name}
                                name={field.name}
                                value={inputValue}
                                onChange={(e) => {
                                  const newValue = e.target.value.toUpperCase();

                                  if (/^[a-zA-Z]{0,3}$/.test(newValue)) {
                                    setInputValue(newValue);
                                    formik.handleChange(e);
                                  }
                                }}
                              />
                              {inputValue == "" ? (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "file" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="profile-picture">
                              <div className="upload-profile">
                                <div className="profile-img">
                                  <img
                                    id="blah"
                                    className="avatar"
                                    src={
                                      formik.values[field.name]
                                        ? formik.values[field.name]
                                        : "assets/img/profiles/avatar-14.jpg"
                                    }
                                    alt="profile-img"
                                  />
                                </div>
                                <div className="add-profile">
                                  <h5>Upload a Photo</h5>
                                  <span>
                                    {selectedImage
                                      ? selectedImage.name
                                      : "Profile-pic.jpg"}
                                  </span>
                                </div>
                              </div>
                              <div className="img-upload d-flex">
                                {/* Input field for selecting an image */}
                                <label className="btn btn-upload">
                                  Upload{" "}
                                  <input
                                    type="file"
                                    id={field.name}
                                    className="form-control"
                                    onChange={(e) =>
                                      handleFileChange(e, index, field.name)
                                    }
                                  />
                                </label>
                                {/* Button to remove the selected image */}
                                {/* <button className="btn btn-remove" onClick={() => formik.setFieldValue(field.name, '')}>Remove</button> */}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "file2" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block mb-3">
                              <label>
                                {field.label}
                                {field.star ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>

                              {field.image ? (
                                <input
                                  type="file"
                                  id={field.name}
                                  accept="image/*"
                                  placeholder="No File Chosen"
                                  className={`form-control ${formik.touched[field.name] &&
                                    formik.errors[field.name]
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const validImageTypes = [
                                        "image/jpeg",
                                        "image/png",
                                        "image/gif",
                                      ];
                                      if (validImageTypes.includes(file.type)) {
                                        handleFileChange2(e, index, field.name);
                                        formik.setFieldValue(field.name, file);
                                      } else {
                                        //   alert("Please select a valid image file (JPEG, PNG, GIF).");
                                        Swal.fire({
                                          title: "warning",
                                          text: "Please select a valid image file (JPEG, PNG, GIF)",
                                          icon: "alert",
                                          timer: 1500,
                                          timerProgressBar: true,
                                        });
                                        e.target.value = "";
                                      }
                                    }
                                  }}
                                  name={field.name}
                                />
                              ) : (
                                <input
                                  type="file"
                                  id={field.name}
                                  accept="application/pdf"
                                  placeholder="No File Choosen"
                                  className={`form-control ${formik.touched[field.name] &&
                                    formik.errors[field.name]
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  onChange={(e) => {
                                    handleFileChange2(e, index, field.name);
                                    formik.setFieldValue(
                                      field.name,
                                      e.target.files[0]
                                    );
                                  }}
                                  name={field.name}
                                />
                              )}
                              {formik.touched[field.name] &&
                                formik.errors[field.name] && (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                )}
                            </div>
                          </div>

                          {field.additional_content && (
                            <div className={`col-lg-${field.col_size}`}>
                              {field.additional_content}
                            </div>
                          )}
                        </>
                      ) : field.type === "file3" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div
                              className="input-block mb-3"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div style={{ flex: 1 }}>
                                <label>
                                  {field.label}
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                </label>

                                <input
                                  type="file"
                                  id={field.name}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleFileChange3(e, index, field.name)
                                  }
                                  name={field.name}
                                />
                              </div>

                              {field.image === true && (
                                <div>
                                  <img
                                    className="mt-3"
                                    src={imagePreview[field.name] || field.src}
                                    alt={`${field.label} Preview`}
                                    style={{
                                      width: field.imageWidth || "200px",
                                      height: field.imageHeight || "auto",
                                      borderRadius: field.borderRadius || "8px",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional content for image preview */}
                          {field.additional_content && (
                            <div className={`col-lg-${field.col_size}`}>
                              {field.additional_content}
                            </div>
                          )}
                        </>
                      ) : field.type === "file1" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="mb-3">
                                <label
                                  className={`col-form-${field.label_size}`}
                                  htmlFor={field.name}
                                >
                                  {field.label}
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                </label>
                                <input
                                  type="file"
                                  id={field.name}
                                  onChange={(e) =>
                                    handleFileChange(e, index, field.name)
                                  } // Pass the index to the handler
                                  className={`form-control`}
                                />
                              </div>
                              {formik.getFieldProps(field.name).value ? (
                                <img
                                  src={formik.getFieldProps(field.name).value}
                                  name={field.name}
                                  id={field.name}
                                  alt={`Preview ${index}`}
                                  className={`col-lg-11 ms-3 ${field.label_size} mb-3 border border-2`}
                                  style={{
                                    height: formik.getFieldProps(field.name)
                                      .value
                                      ? "150px"
                                      : "",
                                    width: "95%",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </>
                      ) : field.type === "select" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block row mb-3">
                              <label
                                className={`col-lg-${title === "forlogin"
                                  ? 3
                                  : title === "update_theme"
                                    ? 12
                                    : 7
                                  }  col-form-label p-0 mx-3 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                className={`col-lg-${title === "addgroup" ? 12 : 12
                                  }`}
                              >
                                <select
                                  className="default-select wide form-control"
                                  aria-describedby="basic-addon1"
                                  disabled={field.disable}
                                  id={field.name}
                                  {...formik.getFieldProps(field.name)}
                                >
                                  <option value="" selected>
                                    {field.label}
                                  </option>
                                  {field.options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>

                                {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "select1" ? (
                        <>
                          <div
                            className={`col-lg-${title === "update_theme" ? 12 : 6
                              }`}
                          >
                            <div className="input-block row mb-3">
                              <label
                                className={`col-lg-${title === "forlogin"
                                  ? 3
                                  : title === "update_theme"
                                    ? 12
                                    : 7
                                  }  col-form-label p-0 mx-3 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                className={`col-lg-${title === "addgroup" ? 12 : 12
                                  }`}
                              >
                                <select
                                  className="default-select wide form-control"
                                  aria-describedby="basic-addon1"
                                  disabled={field.disable}
                                  id={field.name}
                                  {...formik.getFieldProps(field.name)}
                                >
                                  <option value="" selected>
                                    Select {field.label}
                                  </option>
                                  {field.options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>

                                {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "select2" ? (
                        <>
                          {/* <div className="row"> */}
                          {/* First Column for Select Input */}
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block row mb-3">
                              <label
                                className={`col-lg-${title === "forlogin"
                                  ? 3
                                  : title === "update_theme"
                                    ? 12
                                    : 7
                                  }  col-form-label p-0 mx-3 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                className={`col-lg-${title === "addgroup" ? 12 : 12
                                  }`}
                              >
                                <select
                                  className="default-select wide form-control"
                                  aria-describedby="basic-addon1"
                                  disabled={field.disable}
                                  id={field.name}
                                  {...formik.getFieldProps(field.name)}
                                >
                                  <option value="" selected>
                                    Select {field.label}
                                  </option>
                                  {field.options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>

                                {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6">{additional_field1}</div>
                          {/* </div> */}
                        </>
                      ) : field.type === "checkbox" ? (
                        <>
                          {field.options && field.options.length > 0 ? (
                            <>
                              {field.options &&
                                field.options.map((option, index) => (
                                  <>
                                    <div
                                      className={`col-lg-${field.col_size}`}
                                      key={option.id}
                                    >
                                      <div className="row d-flex">
                                        <div
                                          className={`col-lg-${field.col_size}`}
                                        >
                                          <div className="form-check custom-checkbox input-block  ">
                                            <input
                                              type={field.type}
                                              className="form-check-input"
                                              id={option.label}
                                              {...formik.getFieldProps(
                                                option.name
                                              )}
                                            />
                                            <label
                                              className="form-check-label "
                                              for={option.label}
                                            >
                                              <b>{option.label}</b>
                                            </label>
                                            {formik.errors[field.name] && (
                                              <div style={{ color: "red" }}>
                                                {formik.errors[field.name]}
                                                {field.star == true ? (
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ))}
                            </>
                          ) : (
                            <>
                              {field.bold && (
                                <h5
                                  style={{
                                    marginBottom: "1rem",
                                    marginLeft: "2rem",
                                    marginTop: "1rem",
                                  }}
                                >
                                  <b>{field.label}</b>
                                  <hr />
                                </h5>
                              )}

                              <div
                                className={`col-lg-${field.col_size}`}
                                style={{ marginLeft: "4rem", display: "flex" }}
                              >
                                <div className="row d-flex justify-content-start">
                                  <div className="mb-4">
                                    <div className="form-check custom-checkbox ">
                                      <input
                                        type={field.type}
                                        className="form-check-input"
                                        id={field.label}
                                        {...formik.getFieldProps(field.name)}
                                        checked={field.check_box_true}
                                      />
                                      <label
                                        className="form-check-label"
                                        for={field.label}
                                      >
                                        <b>{field.label}</b>
                                      </label>
                                    </div>
                                    {formik.errors[field.name] && (
                                      <div style={{ color: "red" }}>
                                        {formik.errors[field.name]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : field.type === "radio" ? (
                        <>
                          <label
                            className={`col-lg-${field.label_size} col-form-label fw-bold text-decoration-underline`}
                            htmlFor={field.parent_label}
                          >
                            {field.parent_label}
                            {field.star == true ? (
                              <span className="text-danger">*</span>
                            ) : (
                              ""
                            )}
                          </label>

                          <div className={`d-flex`}>
                            <div
                              className={`col-lg-${field.col_size} form-check custom-checkbox my-3`}
                            >
                              <input
                                type={field.type}
                                name={field.name}
                                value={field.value1}
                                className="form-check-input"
                                id={field.title1}
                                {...formik.getFieldProps(field.name)}
                              />
                              <label
                                className={`col-lg-${field.label_size} col-form-label mx-2`}
                                for={field.title1}
                              >
                                {field.title1}
                              </label>
                            </div>
                            <div
                              className={`col-lg-${field.col_size} form-check custom-checkbox my-3`}
                            >
                              <input
                                type={field.type}
                                name={field.name}
                                value={field.value2}
                                className="form-check-input"
                                id={field.title2}
                                {...formik.getFieldProps(field.name)}
                              />
                              <label
                                className={`col-lg-${field.label_size} col-form-label  mx-2`}
                                for={field.name}
                              >
                                {field.title2}
                              </label>
                            </div>
                          </div>
                        </>
                      ) : field.type === "togglebtn" ? (
                        <>
                          <div className={`col-lg-${field.col_size} mb-4`}>
                            <div className="row">
                              <label
                                htmlFor={field.name}
                                className={`col-lg-${field.label_size} col-form-label`}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>

                              <div className="col-lg-8">
                                <div className="form-switch">
                                  <input
                                    className="form-check-input"
                                    style={{
                                      height: "22px",
                                      width: "45px",
                                    }}
                                    type="checkbox"
                                    id={field.name}
                                    checked={formik.values[field.name] === 1}
                                    onChange={() =>
                                      formik.setFieldValue(
                                        field.name,
                                        formik.values[field.name] === 1 ? 0 : 1
                                      )
                                    }
                                    disabled={field.disable}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "password" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className=" input-block row">
                              <label
                                className={`col-lg-${field.label_size} col-form-labelp-0 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                className="d-flex"
                                style={{ position: "relative" }}
                              >
                                <input
                                  id={field.name}
                                  autoComplete="new-password"
                                  type={passwordVisible ? "text" : field.type}
                                  placeholder={`Enter ${field.label}`}
                                  {...formik.getFieldProps(field.name)}
                                  className="form-control"
                                  style={{ paddingRight: "3rem" }}
                                />

                                <FontAwesomeIcon
                                  icon={passwordVisible ? faEye : faEyeSlash}
                                  onClick={togglePasswordVisibility}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                  }}
                                />
                                {/* Formik validation error */}
                              </div>
                              {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                <div style={{ color: "red", marginTop: "5px" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "password1" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block row">
                              <label
                                className={`col-lg-${field.label_size} col-form-labelp-0 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                className="d-flex"
                                style={{ position: "relative" }}
                              >
                                <input
                                  id={field.name}
                                  autoComplete="new-password"
                                  type={passwordVisible1 ? "text" : "password"}
                                  placeholder={`Enter ${field.label}`}
                                  {...formik.getFieldProps(field.name)}
                                  className="form-control"
                                  style={{ paddingRight: "3rem" }}
                                />
                                <FontAwesomeIcon
                                  icon={passwordVisible1 ? faEye : faEyeSlash}
                                  onClick={togglePasswordVisibility1}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                  }}
                                />
                              </div>
                              {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                <div style={{ color: "red", marginTop: "5px" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "password2" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className=" input-block row">
                              <label
                                className={`col-lg-${field.label_size} col-form-labelp-0 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </label>
                              <div
                                // className={`col-lg-${field.col_size}`}
                                style={{ position: "relative" }}
                              >
                                <input
                                  id={field.name}
                                  autoComplete="new-password"
                                  type={
                                    passwordVisible[field.name]
                                      ? "text"
                                      : field.type
                                  }
                                  placeholder={`Enter ${field.label}`}
                                  {...formik.getFieldProps(field.name)}
                                  className={` form-control`}
                                />
                                <i
                                  className={`fa-solid ${passwordVisible[field.name]
                                    ? "fa-eye-slash"
                                    : "fa-eye"
                                    }`}
                                  style={{
                                    position: "absolute",
                                    top: "1.5px",
                                    right: "20px",
                                    padding: "12.4px 6.6px",
                                    borderRadius: "3px",
                                  }}
                                  onClick={() =>
                                    setPasswordVisible((prevState) => ({
                                      ...prevState,
                                      [field.name]: !prevState[field.name],
                                    }))
                                  }
                                ></i>
                                {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "date" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-check custom-checkbox input-block ps-0 mb-1">
                                  <label
                                    className={`col-lg-${field.label}`}
                                    htmlFor={field.name}
                                  >
                                    {field.label}
                                    {field.star == true ? (
                                      <span className="text-danger">*</span>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    readOnly={field.disable}
                                    className="form-control"
                                    id={field.name}
                                    {...formik.getFieldProps(field.name)}
                                  />
                                </div>
                                {formik.errors[field.name] && (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "date1" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12">
                                <div className="form-check custom-checkbox input-block ps-0 mb-3">
                                  <label
                                    className={`col-lg-${field.label}`}
                                    htmlFor={field.name}
                                  >
                                    {field.label}
                                    {field.star == true ? (
                                      <span className="text-danger">*</span>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <input
                                    type={"date"}
                                    name={field.name}
                                    readOnly={field.disable}
                                    className="form-control"
                                    id={field.name}
                                    min={new Date().toISOString().split("T")[0]}
                                    defaultValue={
                                      formik.values[field.name] ||
                                      new Date().toISOString().split("T")[0]
                                    }
                                    {...formik.getFieldProps(field.name)}
                                  />
                                </div>
                                {formik.errors[field.name] && (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "msgbox" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className={`col-lg-${field.col_size}  `}>
                                <div className="mb-3 input-block">
                                  <label
                                    className={`col-lg-${field.label_size}`}
                                    for={field.name}
                                  >
                                    {field.label}
                                    {field.star == true ? (
                                      <span className="text-danger">*</span>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={field.row_size}
                                    id={field.name}
                                    readOnly={field.disable}
                                    name={field.name}
                                    {...formik.getFieldProps(field.name)}
                                    placeholder={field.label}
                                  ></textarea>
                                  {formik.errors[field.name] && (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "number" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                    {field.star == true ? (
                                      <span className="text-danger">*</span>
                                    ) : (
                                      ""
                                    )}
                                  </label>

                                  <input
                                    type="number"
                                    name={field.name}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    readOnly={field.disable}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                  />

                                  {formik.touched[field.name] &&
                                    formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "text3" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="text"
                                    name={field.name}
                                    readOnly={field.disable}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      const newValue = value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);
                                      e.target.value = newValue;
                                      formik.handleChange(e);
                                    }}
                                  />

                                  {formik.touched[field.name] &&
                                    formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "text4" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="number"
                                    name={field.name}
                                    readOnly={field.disable}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    step="0.01"
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                    min={1}
                                    onChange={(e) => {
                                      let value = e.target.value;

                                      value = value.replace(/^0+/, "");

                                      if (value === "") {
                                        value = "";
                                      }

                                      value = Math.min(parseFloat(value), 100);
                                      // Update input value
                                      e.target.value = value;
                                      formik.handleChange(e);
                                    }}
                                  />

                                  {formik.touched[field.name] &&
                                    formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "text5" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="number"
                                    name={field.name}
                                    readOnly={field.disable}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                    min={1}
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      // Remove any leading zeros
                                      value = value.replace(/^0+/, "");
                                      // If value is empty, set it to 0
                                      if (value === "") {
                                        value = "";
                                      }
                                      // Enforce maximum value of 100
                                      value = Math.min(
                                        parseInt(value),
                                        10000000000
                                      );
                                      // Update input value
                                      e.target.value = value;
                                      formik.handleChange(e);
                                    }}
                                  />

                                  {formik.touched[field.name] &&
                                    formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) :
                        field.type === "ckeditor" ? (
                          <>
                            <div
                              style={{
                                maxHeight: "500px",
                                overflowY: "auto",
                                marginTop: "20px",
                                padding: "10px",
                              }}
                            >
                              <label htmlFor={field.name}>{field.label}</label>
                              {field.star === true && (
                                <span style={{ color: "red" }}>*</span>
                              )}

                              <ReactQuill

                                value={formik.values[field.name]}
                                onChange={(value) =>
                                  formik.setFieldValue(field.name, value)
                                }
                                modules={{
                                  toolbar: [
                                    [
                                      { header: "1" },
                                      { header: "2" },
                                      { font: [] },
                                    ],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["bold", "italic", "underline"],
                                    ["link", "image"],
                                    ["clean"],
                                  ],

                                }}
                                formats={[
                                  "header",
                                  "font",
                                  "size",
                                  "bold",
                                  "italic",
                                  "underline",
                                  "list",
                                  "bullet",
                                  "link",
                                  "image",
                                  "clean",
                                ]}
                                style={{
                                  height: "230px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  padding: "10px",
                                  backgroundColor: "#fff",
                                  fontFamily: "inherit",
                                  fontSize: "inherit",
                                  overflow: "hidden",
                                }}
                              />

                              {formik.touched[field.name] &&
                                formik.errors[field.name] && (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                )}
                            </div>
                          </>
                        ) :
                          field.type === "ckeditor1" ? (
                            <>
                              <div
                                style={{
                                  maxHeight: '500px',
                                  overflowY: 'auto',
                                  marginTop: '20px',
                                  padding: '10px',
                                }}
                              >
                                <label htmlFor={field.name}>{field.label}</label>
                                {field.star === true && <span style={{ color: 'red' }}>*</span>}

                                {/* <JoditEditor
                                  value={formik.values[field.name]}
                                  onChange={(value) => formik.setFieldValue(field.name, value)}
                                  config={config}
                                  style={{
                                    height: '230px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    backgroundColor: '#fff',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    overflow: 'hidden',
                                  }}
                                /> */}

                                {formik.touched[field.name] && formik.errors[field.name] && (
                                  <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>
                                )}
                              </div>
                            </>
                          )
                            : field.type === "selectchecbox" ? (
                              <div className={`col-lg-${field.col_size}`}>
                                <label htmlFor={field.name}>{field.label}</label>
                                {field.star == true ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                                {field.options && field.options.length > 0 && (
                                  <DropdownMultiselect
                                    options={field.options.map((item) => ({
                                      key: item.value,
                                      label: item.label,
                                    }))}
                                    name={field.name}
                                    handleOnChange={(selected) => {
                                      formik.setFieldValue(field.name, selected);
                                    }}
                                    selected={formik.values[field.name]}
                                    isCheckbox
                                    placeholder="Select options"
                                  />
                                )}

                                {formik.touched[field.name] &&
                                  formik.errors[field.name] && (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  )}
                              </div>
                            ) : field.type === "security" ? (
                              <>
                                <div className={`col-lg-${field.col_size}`}>
                                  <div className="input-block mb-3 flex-column">
                                    <label className={`col-lg-${field.label_size}`}>
                                      {field.label}
                                    </label>
                                    {field.star == true ? (
                                      <span className="text-danger">*</span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : field.type === "convertprice" ? (
                              <>
                                <div
                                  key={index}
                                  className={`col-md-${field.col_size}`}
                                >
                                  <label htmlFor={field.name}>{field.label}</label>
                                  {field.star == true ? (
                                    <span className="text-danger">*</span>
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="text"
                                    id={field.name}
                                    {...formik.getFieldProps(field.name)}
                                    disabled={field.disable}
                                    className={`form-control ${formik.touched[field.name] &&
                                      formik.errors[field.name]
                                      ? "is-invalid"
                                      : ""
                                      }`}
                                  />
                                  {formik.touched[field.name] &&
                                    formik.errors[field.name] ? (
                                    <div className="invalid-feedback">
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                  {field.customElement}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className={`col-lg-${field.col_size}`}>
                                  <div className="input-block mb-3"></div>
                                </div>
                              </>
                            )}
                    </React.Fragment>
                  ))}
                  {additional_field}

                  <div className="add-customer-btns text-end mt-3 ">
                    {btn_name1 ? (
                      <Link
                        to={btn_name1_route}
                        className="btn customer-btn-cancel btn btn-primary"
                      >
                        {btn_name1}
                      </Link>
                    ) : (
                      ""
                    )}
                    {
                      <>
                        {sumit_btn === true && (
                          <button
                            type="submit"
                            disabled={btnstatus}
                            className="btn customer-btn-save btn btn-primary m-2"
                          >
                            {btn_name}
                          </button>
                        )}
                        {btn_name2 ? (
                          <button
                            type="submit"
                            className="btn customer-btn-save btn btn-primary"
                          >
                            {btn_name2}
                          </button>
                        ) : (
                          ""
                        )}
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
