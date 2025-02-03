import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateClient } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';



const EditClient = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;



  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");




  const validate = (values) => {
    let errors = {};

    const numberRegex = /[0-9]/;

    const specialCharRegex = /[^a-zA-Z\s]/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const onlyNumbersRegex = /^[0-9]+$/;

    const phoneRegex = /^[0-9]{10}$/;

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    } else if (numberRegex.test(values.FullName)) {
      errors.FullName = "Full Name should not contain numbers";
    } else if (specialCharRegex.test(values.FullName)) {
      errors.FullName = "Full Name should not contain special characters";
    }
    if (!values.Email) {
      errors.Email = "Please Enter Email";
    } else if (onlyNumbersRegex.test(values.Email)) {
      errors.Email = "Email should not contain only numbers";
    } else if (!emailRegex.test(values.Email)) {
      errors.Email = "Please Enter a valid Email";
    }

    if (!values.PhoneNo) {
      errors.PhoneNo = "Please Enter Phone Number";
    } else if (!phoneRegex.test(values.PhoneNo)) {
      errors.PhoneNo = "Phone Number should be exactly 10 digits";
    }


    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      id: row._id,
    };

    try {
      const response = await UpdateClient(req, token);


      if (response.status) {
        Swal.fire({
          title: "Update Successful!",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/admin/client");
        }, 1500);
      } else {

        if (response.error.status === false) {
          Swal.fire({
            title: "Error",
            text: response.error.message,
            icon: "error",
            timer: 2500,
            timerProgressBar: true,
          });
        } else if (response.error.status === false) {
          Swal.fire({
            title: "Error",
            text: response.error.message,
            icon: "error",
            timer: 2500,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Email or Mobile number are already exists.",
            icon: "error",
            timer: 2500,
            timerProgressBar: true,
          });
        }
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
      FullName: row?.FullName || "",
      // UserName: row?.UserName || "",
      Email: row?.Email || "",
      PhoneNo: row?.PhoneNo || "",

    },
    validate,
    onSubmit,
  });

  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      star: true,
      label_size: 6,
      col_size: 4,
      disable: false,
      star: true

    },
    // {
    //   name: "UserName",
    //   label: "User Name",
    //   type: "text",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    // },
    {
      name: "Email",
      label: "Email",
      type: "text",
      star: true,
      label_size: 12,
      col_size: 4,
      disable: false,
      star: true

    },
    {
      name: "PhoneNo",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 4,
      disable: false,
      star: true


    },
    // {
    //   name: "password",
    //   label: "Password",
    //   type: "text",
    //   label_size: 12,
    //   col_size: 3,
    //   disable: false,
    // },
  ];

  return (
    <Content
      Page_title="Update Client"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <DynamicForm
        fields={fields}
        page_title="Update Client"
        btn_name="Update Client"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/client"}
        additional_field={<></>}
      />
    </Content>

  );
};

export default EditClient;
