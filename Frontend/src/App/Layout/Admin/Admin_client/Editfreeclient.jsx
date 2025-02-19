import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UpdateClient } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const Editfreeclient = () => {

  const { id } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const validate = (values) => {
    let errors = {};

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    } else if (!/^[A-Za-z\s]+$/.test(values.FullName)) {
      errors.FullName = "Full Name should contain only alphabetic characters";
    } else if (values.FullName.length < 3) {
      errors.FullName = "Full Name should be at least 3 characters long";
    } else if (values.FullName.length > 50) {
      errors.FullName = "Full Name should not exceed 50 characters";
    }

    if (!values.Email) {
      errors.Email = "Please Enter Email";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.Email)
    ) {
      errors.Email = "Please Enter a Valid Email Address";
    }

    if (!values.PhoneNo) {
      errors.PhoneNo = "Please Enter Phone Number";
    } else if (!/^\d{10}$/.test(values.PhoneNo)) {
      errors.PhoneNo = "Phone Number should be exactly 10 digits";
    } else if (!/^[6-9]\d{9}$/.test(values.PhoneNo)) {
      errors.PhoneNo = "Phone Number should start with digits 6-9";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      FullName: values.FullName,
      // UserName: values.UserName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      // password: values.password,
      id: id,
    }
    try {
      const response = await UpdateClient(req, token);
      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/admin/freeclient");
      } else {
        showCustomAlert("error", response.message);
      }
    } catch (error) {
      showCustomAlert("error", "An unexpected error occurred. Please try again later.");
    }
  };

  const formik = useFormik({
    initialValues: {
      FullName: row?.clientDetails.FullName || "",
      // UserName: row?.UserName || "",
      Email: row?.clientDetails.Email || "",
      PhoneNo: row?.clientDetails.PhoneNo || "",

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
      label_size: 12,
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
      Page_title="Update Free Client"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >

      <DynamicForm
        fields={fields}
        page_title="Update Free Client"
        btn_name="Update Client"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/freeclient"}
        additional_field={<></>}
      />
    </Content>

  );
};

export default Editfreeclient;
