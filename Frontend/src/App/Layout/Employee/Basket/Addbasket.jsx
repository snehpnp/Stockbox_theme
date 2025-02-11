import React, { useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Addbasketplan } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import Content from '../../../components/Contents/Content';
const AddBasket = () => {


  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);


  const validate = (values) => {
    let errors = {};

    if (!values.title) {
      errors.title = "Please Enter Title";
    }

    if (!values.themename) {
      errors.themename = "Please Enter Theme Name";
    }

    if (values.full_price && values.full_price <= values.basket_price) {
      errors.full_price = "Please Enter Greater Discounted/Net Basket Price";
    }

    if (!values.basket_price) {
      errors.basket_price = "Please Enter Discounted/Net Basket Price";
    }

    // if (!values.accuracy) {
    //   errors.accuracy = "Please Enter Accuracy";

    // }
    if (!values.mininvamount) {
      errors.mininvamount = "Please Enter Minimum Investment Amount";
    }

    // if (!values.portfolioweightage) {
    //   errors.portfolioweightage = "Please Enter Portfolio Weightage";
    // }

    if (!values.frequency) {
      errors.frequency = "Please Enter Frequency";
    }

    // if (!values.cagr) {
    //   errors.cagr = "Please Enter CAGR";
    // }

    if (!values.validity) {
      errors.validity = "Please Select Validity";
    }

    if (!values.next_rebalance_date) {
      errors.next_rebalance_date = "Please Enter Rebalance Date";
    }

    if (!values.description) {
      errors.description = "Please Enter Description";
    }
    if (!values.type) {
      errors.type = "Please Enter Type";
    }
    if (!values.image) {
      errors.image = "Please Upload image";
    }
    if (!values.short_description) {
      errors.short_description = "Please Enter Short Description";
    }
    if (!values.rationale) {
      errors.rationale = "Please Enter Rationale";
    }
    if (!values.methodology) {
      errors.methodology = "Please Enter Methodology";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    setLoading(!loading)
    const req = {
      title: values.title,
      add_by: user_id,
      description: values.description,
      basket_price: values.basket_price,
      mininvamount: values.mininvamount,
      themename: values.themename,
      frequency: values.frequency,
      validity: values.validity,
      next_rebalance_date: values.next_rebalance_date,
      cagr: values.cagr,
      full_price: values.full_price || 0,
      type: values.type,
      image: values.image,
      short_description: values.short_description,
      url:values.url,
      rationale: values.rationale,
      methodology: values.methodology
    };


    try {
      const response = await Addbasketplan(req, token);

      if (response.status) {
        Swal.fire({
          title: "Basket Create Successfull !",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/employee/basket");
        }, 1500);
      } else {
        Swal.fire({
          title: "Alert",
          text: response.message,
          icon: "warning",
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
      title: "",
      description: "",
      basket_price: "",
      add_by: "",
      mininvamount: "",
      themename: "",
      frequency: "",
      validity: "",
      next_rebalance_date: "",
      cagr: "",
      full_price: "",
      type: "",
      image: "",
      short_description: "",
      url:"",
      rationale: "",
      methodology: "",
    },
    validate,
    onSubmit,
  });




  const fields = [
    {
      name: "title",
      label: "Basket Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "themename",
      label: "Theme Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "full_price",
      label: "Actual Basket Price",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,

    },

    {
      name: "basket_price",
      label: "Discounted/Net Basket Price",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true

    },

    {
      name: "mininvamount",
      label: "Minimun Investment Amount",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },

    {
      name: "frequency",
      label: "Rebalance Frequency",
      type: "select",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true,
      options: [
        { value: "Monthly", label: "Monthly" },
        { value: "Quarterly", label: "Quarterly" },
        { value: "Half Yearly", label: "Half Yearly" },
        { value: "Yearly", label: "Yearly" }
      ],
    },
    {
      name: "validity",
      label: "Validity",
      type: "select",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: [
        { value: "1 month", label: "1 Month" },
        { value: "3 months", label: "3 Months" },
        { value: "6 months", label: "6 Months" },
        { value: "1 year", label: "1 Year" }
      ],
      star: true
    },
    {
      name: "cagr",
      label: "CAGR",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "next_rebalance_date",
      label: "Rebalance Date",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "type",
      label: "Risk Type",
      type: "select",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: [
        { value: "HIGH", label: "High" },
        { value: "MEDIUM", label: "Medium" },
        { value: "LOW", label: "Low" },
      ],
      star: true
    },
    {
      name: "image",
      label: "Upload Image",
      type: "file2",
      image: true,
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "short_description",
      label: "Short discription",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "url",
      label: "url",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "description",
      label: "Description",
      type: "ckeditor",
      label_size: 12,
      col_size: 12,
      disable: false,
      star: true
    },
    {
      name: "rationale",
      label: "Rationale",
      type: "ckeditor",
      label_size: 12,
      col_size: 12,
      disable: false,
      star: true
    },
    {
      name: "methodology",
      label: "Methodology",
      type: "ckeditor",
      label_size: 12,
      col_size: 12,
      disable: false,
      star: true
    },
  ];




  return (
    <Content
      Page_title="Add Basket"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >

      <DynamicForm
        fields={fields}
        formik={formik}
       
        btn_name="Add Basket"
        btn_name1="Cancel"
        sumit_btn={true}
        btnstatus={loading}
        btn_name1_route={"/employee/basket"}
        additional_field={<></>}

      />

    </Content>
  );
};

export default AddBasket;
