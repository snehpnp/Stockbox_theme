import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AddClient } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const AddUser = () => {


  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);




  const validate = (values) => {
    let errors = {};

    // Full Name validation: Only alphabets and one space between two words allowed
    const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)?$/;

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    } else if (!fullNameRegex.test(values.FullName)) {
      errors.FullName = "Full Name should only contain alphabets and one space between first and last name";
    }
    if (!values.Email) {
      errors.Email = "Please Enter Email";
    }
    if (!values.PhoneNo) {
      errors.PhoneNo = "Please Enter Phone Number";
    }
    if (!values.password) {
      errors.password = "Please Enter Password";
    }
    if (!values.ConfirmPassword) {
      errors.ConfirmPassword = "Please Confirm Your Password";
    } else if (values.password !== values.ConfirmPassword) {
      errors.ConfirmPassword = "Passwords Must Match";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    setLoading(!loading)
    const req = {
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      password: values.password,
      add_by: user_id,
      freetrial: values.freetrial
    };


    try {
      const response = await AddClient(req, token);

      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/admin/client");
      } else {
        showCustomAlert("error", response.message);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      showCustomAlert("error", "An unexpected error occurred. Please try again later.");

    }
  };

  const formik = useFormik({
    initialValues: {
      FullName: "",
      Email: "",
      PhoneNo: "",
      password: "",
      ConfirmPassword: "",
      freetrial: 0,
      add_by: "",
    },
    validate,
    onSubmit,
  });


  const traialStatus = formik.values.freetrial;
  // console.log("traialStatus",traialStatus);

  const handleToggleChange = () => {
    console.log("Custom Clicked", traialStatus);
  }

  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "Email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true

    },
    {
      name: "PhoneNo",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password1",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    // {
    //   name: "freetrial",
    //   label: "Free trial status",
    //   type: "togglebtn",
    //   label_size: 6,
    //   col_size: 4,
    //   disable: false,
    //   star: true,
    // },
  ];



  const handlefreeTrialChange = async () => {
    const currentValue = formik.values.freetrial;

    const result = await showCustomAlert(
      "confirm",
      currentValue ? "Are you sure you want to disable the free trial?" : "Are you sure you want to enable the free trial?"
    );

    if (!result) return;
    formik.setFieldValue("freetrial", !currentValue);
    if (result.isDenied) {
      formik.setFieldValue("freetrial", currentValue);
    }
  };



  return (
    <Content
      Page_title="Add New Client"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <div className="page-content">

        <DynamicForm
          fields={fields}
          formik={formik}

          btn_name="Add Client"
          btn_name1="Cancel"
          sumit_btn={true}
          btnstatus={loading}
          btn_name1_route={"/admin/client"}
          additional_field={<>


            <div className={`col-lg-6`}>
              <div className="input-block row">

                <label htmlFor="freetrial" className={`col-lg-12 col-form-label`}>
                  Free trial status
                </label>

                <div className="col-lg-8">
                  <div className="form-switch">
                    <input
                      className="form-check-input"
                      style={{
                        height: "22px",
                        width: "45px"
                      }}
                      type="checkbox"
                      checked={formik.values["freetrial"] == 1}
                      onChange={(e) => handlefreeTrialChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>}

        />
      </div>
    </Content>

  );
};

export default AddUser;
