import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateClient, GetAllStates, GetAllCities } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const EditClient = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;


  const [selectedState, setSelectedState] = useState("");


  const [state, setState] = useState([])
  const [city, setCity] = useState([])



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

    if (!values.state) {
      errors.state = "Please Select State";
    }
    if (!values.city) {
      errors.city = "Please Select City";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      state: values.state,
      city: values.city,
      id: row._id,
    };

    try {
      const response = await UpdateClient(req, token);


      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/admin/client");
      } else {
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
      state: row?.state || "",
      city: row?.city || "",

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
      col_size: 3,
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
      col_size: 3,
      disable: false,
      star: true

    },
    {
      name: "PhoneNo",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 3,
      disable: false,
      star: true
    },
    {
      name: "state",
      label: "Select State",
      type: 'select',
      options: state?.map((item) => ({
        label: item.name,
        value: item.name,
      })),
      label_size: 12,
      col_size: 3,
      disable: false,
      star: true
    },
    {
      name: "city",
      label: "Select City",
      type: 'select',
      options: city?.map((item) => ({
        label: item.city,
        value: item.city,
      })),
      label_size: 12,
      col_size: 3,
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



  const getStatedata = async () => {
    try {
      const response = await GetAllStates(token);
      if (response) {
        setState(response);

      }
    } catch (error) {
      console.log("error");
    }
  }



  const getCitydata = async () => {
    try {
      const response = await GetAllCities(formik.values.state, token);
      if (response) {
        setCity(response);

      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (formik.values.state) {
      getCitydata();
    }
  }, [formik.values.state]);




  useEffect(() => {
    getStatedata()
  }, [])




  return (
    <Content
      Page_title="Update Client"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <DynamicForm
        fields={fields}
        btn_name="Update Client"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/client"}
        additional_field={<>


        </>}
      />
    </Content>

  );
};

export default EditClient;
