import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateClient } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const EditClient = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;



  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const validate = (values) => {
    let errors = {};

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    }
    if (!values.Email) {
      errors.Email = "Please Enter Email";
    }
    // if (!values.UserName) {
    //   errors.UserName = "Please enter Username";
    // }
    if (!values.PhoneNo) {
      errors.PhoneNo = "Please Enter Phone Number";
    }
    // if (!values.password) {
    //   errors.password = "Please Enter Password";
    // }


    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      FullName: values.FullName,
      // UserName: values.UserName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      // password: values.password,
      id: row._id,
    };

    try {
      const response = await UpdateClient(req, token);
      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/employee/client");
      }else {
        if (response.error.status === false) {
          showCustomAlert("error", response.error.message);
        } else if (response.error.status === false) {
          showCustomAlert("error", response.error.message);
        } else {
          showCustomAlert("error", "Email or Mobile number are already exists.");
        }
      }
    } catch (error) {
      showCustomAlert("error", "An unexpected error occurred. Please try again later.");
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
        btn_name1_route={"/employee/client"}
        additional_field={<></>}
      />
    
    </Content>
  );
};

export default EditClient;
