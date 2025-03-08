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

  const indianStates = [
    { name: "Andhra Pradesh" },
    { name: "Arunachal Pradesh" },
    { name: "Assam" },
    { name: "Bihar" },
    { name: "Chhattisgarh" },
    { name: "Goa" },
    { name: "Gujarat" },
    { name: "Haryana" },
    { name: "Himachal Pradesh" },
    { name: "Jharkhand" },
    { name: "Karnataka" },
    { name: "Kerala" },
    { name: "Madhya Pradesh" },
    { name: "Maharashtra" },
    { name: "Manipur" },
    { name: "Meghalaya" },
    { name: "Mizoram" },
    { name: "Nagaland" },
    { name: "Odisha" },
    { name: "Punjab" },
    { name: "Rajasthan" },
    { name: "Sikkim" },
    { name: "Tamil Nadu" },
    { name: "Telangana" },
    { name: "Tripura" },
    { name: "Uttar Pradesh" },
    { name: "Uttarakhand" },
    { name: "West Bengal" }
  ];


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

    if (!values.state) {
      errors.state = "Please Select State";
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
      state: values.state
    };

    try {
      const response = await AddClient(req, token);
      if (response.status) {
        showCustomAlert('Success','Client Create Successfull !',navigate,"/employee/client")
      } else {
        showCustomAlert('error',response.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      showCustomAlert('error','An unexpected error occurred. Please try again later.')
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
      state: "",
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
    {
      name: "state",
      label: "Select State",
      type: 'select',
      options: indianStates?.map((item) => ({
          label: item.name, 
          value: item.name,
      })),
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
  }
  ];

  const handlefreeTrialChange = (e) => {
    const currentValue = formik.values.freetrial;



    Swal.fire({
      title: currentValue ? "Are you sure you want to disable the free trial?" : "Are you sure you want to enable the free trial?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        formik.setFieldValue("freetrial", !currentValue);
        console.log("Updated toggle value:", !currentValue);
      } else if (result.isDenied) {
        formik.setFieldValue("freetrial", currentValue);
        console.log("Value reverted to:", currentValue);
      }
    });
  };

  return (
    <Content
      Page_title="New Client"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >

      <DynamicForm
        fields={fields}
        formik={formik}

        btn_name="Add Client"
        btn_name1="Cancel"
        sumit_btn={true}
        btn_name1_route={"/employee/client"}
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

    </Content>
  );
};

export default AddUser;
