import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateStaff } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Update = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;

  const token = localStorage.getItem("token");

  const validate = (values) => {
    const errors = {};
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[^a-zA-Z\s]/;

    if (!values.FullName) {
      errors.FullName = "Please Enter Full Name";
    } else if (numberRegex.test(values.FullName)) {
      errors.FullName = "Full Name should not contain numbers";
    } else if (specialCharRegex.test(values.FullName)) {
      errors.FullName = "Full Name should not contain special characters";
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

    return errors;
  };


  const onSubmit = async (values) => {

    const req = {
      FullName: values.FullName,
      UserName: values.UserName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      // password: values.password,
      id: row._id,
    };

    try {
      const response = await UpdateStaff(req, token);
      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/admin/staff")
      } else {
        showCustomAlert("Success", response.error.message)

      }
    } catch (error) {
      showCustomAlert("Success", "An unexpected error occurred. Please try again later.",)
    }
  };


  const formik = useFormik({
    initialValues: {
      FullName: row?.FullName || "",
      UserName: row?.UserName || "",
      Email: row?.Email || "",
      PhoneNo: row?.PhoneNo || "",
      // password: "", 
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
      disable: true,
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

  ];

  return (
    <Content
      Page_title="Edit Employee"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <DynamicForm
        fields={fields}
        btn_name="Edit Employee"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/staff"}
        additional_field={<></>}
      />
    </Content>

  );
};

export default Update;
