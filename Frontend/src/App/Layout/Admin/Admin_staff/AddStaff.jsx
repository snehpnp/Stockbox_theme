import React, { useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AddStaffClient } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';

const AddStaff = () => {
  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  

  const validate = (values) => {
    let errors = {};

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    } else if (/\d/.test(values.FullName)) {
      // Agar Full Name mein koi number hai
      errors.FullName = "Numbers Are Not Allowed In the Full Name";
    } else if (/[^a-zA-Z\s]/.test(values.FullName)) {
      // Agar Full Name mein koi special character hai
      errors.FullName = "Special Characters Are Not Allowed In the Full Name";
    }


    if (!values.Email) {
      errors.Email = "Please Enter Email";
    }
    if (!values.UserName) {
      errors.UserName = "Please Enter Username";
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
      UserName: values.UserName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      password: values.password,
      add_by: user_id,
    };

    try {
      const response = await AddStaffClient(req, token);
      if (response.status) {
        Swal.fire({
          title: "Create Successful!",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/admin/employee");
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          timer: 1500,
          timerProgressBar: true,
        });
      setLoading(false)
      }
    } catch (error) {
      setLoading(false)
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
      UserName: "",
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
      star: true
    },
    {
      name: "UserName",
      label: "User Name",
      type: "text",
      label_size: 12,
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
  ];

  return (
    <Content
    Page_title="Add New Employee"
    button_status={false}
    backbutton_status={true}
    backForword={true}
  >
      <DynamicForm
        fields={fields}
        // page_title="Add New Employee"
        btn_name="Add Employee"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btnstatus={loading}
        btn_name1_route={"/admin/staff"}
        additional_field={<></>}
      />
    </Content>
  );
};

export default AddStaff;
