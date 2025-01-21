import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../components/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AddClient } from '../../../Services/Admin';


const AddUser = () => { 
  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const validate = (values) => {
    let errors = {};


    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    }
    if (/\d/.test(values.FullName)) {
      errors.FullName = "Numbers are not allowed in the Full Name";
    }
    if (!values.Email) {
      errors.Email = "Please Enter Email";
    }
    if (!values.PhoneNo) {
      errors.PhoneNo = "Please Enter Phone Number";
    }
    if (!values.password) {
      errors.password = "Please Enter password";
    }
    if (!values.ConfirmPassword) {
      errors.ConfirmPassword = "Please Confirm Your Password";
    } else if (values.password !== values.ConfirmPassword) {
      errors.ConfirmPassword = "Password Must Match";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      password: values.password,
      add_by: user_id,
    };

    try {
      const response = await AddClient(req, token);
      if (response.status) {
        Swal.fire({
          title: "Client Create Successfull !",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/staff/client");
        }, 1500);
      } else {
        Swal.fire({
          title: "Alert",
          text: response.message,
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      FullName: "",
      Email: "",
      PhoneNo: "",
      password: "",
      ConfirmPassword: "",
      add_by: "",
    },
    validate,
    onSubmit,
  });

  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
    },
    {
      name: "Email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "PhoneNo",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "password",
      label: "Password",
      type: "password", 
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password1",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
  ];

    const handlefreeTrialChange = (e) => {
      const currentValue = formik.values.freetrial; // Store current value
    
      console.log("Current toggle value:", e.target.checked);
    
      Swal.fire({
        title: currentValue ? "Are you sure you want to disable the free trial?" : "Are you sure you want to enable the free trial?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          // If toggle is currently true (checked), and user clicks "Yes", set it to false
          // If toggle is false (unchecked), and user clicks "Yes", set it to true
          formik.setFieldValue("freetrial", !currentValue);
          console.log("Updated toggle value:", !currentValue); // Log the updated value
        } else if (result.isDenied) {
          // If "No" (Deny) clicked, revert the value to its original state
          formik.setFieldValue("freetrial", currentValue);
          console.log("Value reverted to:", currentValue); // Log reverted value
        }
      });
    };

  return (
    <div style={{ marginTop: "100px" }}>
      <DynamicForm
        fields={fields}
        formik={formik}
        page_title="Add New Client"
        btn_name="Add Client"
        btn_name1="Cancel"
        sumit_btn={true}
        btn_name1_route={"/staff/client"}
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
                    onChange={(e) =>handlefreeTrialChange(e)   }
                  />
                </div>
              </div>
            </div>
          </div>
        </>}
        
      />
    </div>
  );
};

export default AddUser;
