import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Addbasketplan } from '../../../Services/Admin/Admin';


const AddBasket = () => {


  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

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

    return errors;
  };

  const onSubmit = async (values) => {

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
      full_price: values.full_price || 0
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
          navigate("/admin/basket");
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
      name: "offer_price",
      label: "Offer Price",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
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
  ];




  return (
    <div style={{ marginTop: "100px" }}>
      <DynamicForm
        fields={fields}
        formik={formik}
        page_title="Add Basket"
        btn_name="Add Basket"
        btn_name1="Cancel"
        sumit_btn={true}
        btn_name1_route={"/admin/basket"}
        additional_field={<></>}

      />
    </div>
  );
};

export default AddBasket;
