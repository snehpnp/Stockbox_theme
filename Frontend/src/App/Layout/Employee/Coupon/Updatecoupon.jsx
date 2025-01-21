import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import DynamicForm from "../../../components/FormicForm";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCouponbyadmin, GetService } from "../../../Services/Admin";

const Updatecoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;


  useEffect(() => {
    getservice();
  }, []);


  const token = localStorage.getItem("token");
  const [servicedata, setServicedata] = useState([]);
  const [isFixed, setIsFixed] = useState(false);

  // const [servicedata, setServicedata] = useState([]);


  const getservice = async () => {
    try {
      const response = await GetService(token);
      if (response.status) {
        setServicedata(response.data);

      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch the services to populate the select dropdown
  const getService = async () => {
    try {
      const response = await GetService(token);
      if (response.status) {
        setServicedata(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };




  const validate = (values) => {
    let errors = {};

    if (!values.name) {
      errors.name = "Please Enter  Name";
    }
    if (!values.code) {
      errors.code = "Please Enter code";
    }
    if (values.code) {
      if (values.code.length < 6 || values.code.length > 8) {
        errors.code = "Please Enter Between 6 and 8 Characters.";
      } else if (!/^[a-zA-Z0-9]+$/.test(values.code)) {
        errors.code = "Code Must Contain Only Numbers and Letters.";
      }
    }

    if (values.minpurchasevalue && parseFloat(values.minpurchasevalue) < parseFloat(values.mincouponvalue)) {
      errors.minpurchasevalue = "Please Enter Value Greater Than  Max Discount Value "
    }
    if (values.mincouponvalue && parseFloat(values.minpurchasevalue) < parseFloat(values.mincouponvalue)) {
      errors.mincouponvalue = "Please Enter Value Less Than Min Purchase Value "
    }
    if (values.value && parseFloat(values.minpurchasevalue) < parseFloat(values.value)) {
      errors.minpurchasevalue = "Please Enter Greater Than Discount value";
    }
    if (values.enddate && values.startdate > values.enddate) {
      errors.enddate = "Please Enter greater Than Startdate";
    }
    if (!values.type) {
      errors.type = "Please Enter Type";
    }
    if (!values.value) {
      errors.value = "Please Enter Value";
    }
    if (!values.startdate) {
      errors.startdate = "Please Enter Startdate";
    }
    if (!values.enddate) {
      errors.enddate = "Please Enter Enddate";
    }
    if (!values.minpurchasevalue) {
      errors.minpurchasevalue = "Please Enter Min Purchase Value";
    }
    if (values.mincouponvalue && !values.mincouponvalue) {
      errors.mincouponvalue = "Please Enter Min Coupon Value";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      name: values.name,
      code: values.code,
      type: values.type,
      value: values.value,
      startdate: values.startdate,
      enddate: values.enddate,
      minpurchasevalue: values.minpurchasevalue,
      mincouponvalue: values.mincouponvalue,
      description: values.description,
      image: values.image,
      service: values.service,
      limitation: values.limitation,
      id: row._id,
    };
    console.log("req data",req);
    

    try {
      const response = await updateCouponbyadmin(req, token);
      console.log("datata",response);
      
      if (response.status) {
        Swal.fire({
          title: "Update Successful!",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/staff/coupon");
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
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
      name: row?.name || "",
      code: row?.code || "",
      type: row?.type || "",
      value: row?.value || "",
      startdate: row?.startdate ? new Date(row.startdate).toISOString().split("T")[0] : "",
      enddate: row?.enddate ? new Date(row.enddate).toISOString().split("T")[0] : "",
      minpurchasevalue: row?.minpurchasevalue || "",
      mincouponvalue: row?.mincouponvalue || "",
      limitation: row?.limitation || "",
      service: row?.service ? row?.service : "",
      id: "",
    },
    validate,
    onSubmit,
  });

  // Watch type field for changes
  useEffect(() => {
    setIsFixed(formik.values.type === "fixed");
  }, [formik.values.type]);

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: true,
      star: true
    },
    {
      name: "code",
      label: "Coupon Code",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
      star: true
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      label_size: 12,
      col_size: 6,
      disable: true,
      star: true,
      options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed" },
      ]

    },

    {
      name: "value",
      label: "Percent/Fixed Discount",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: true,
      showWhen: (values) => values.type === "fixed",
      star: true
    },
    {
      name: "value",
      label: "Percentage/Fixed Discount",
      type: "text4",
      label_size: 12,
      col_size: 6,
      disable: true,
      showWhen: (values) => values.type === "percentage",
      star: true
    },

    {
      name: "minpurchasevalue",
      label: "Min Purchase Value",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },
    {
      name: "mincouponvalue",
      label: "Max Discount Value",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.type === "percentage",
      star: true
    },
    {
      name: "startdate",
      label: "Start Date",
      type: "date1",
      label_size: 12,
      col_size: 6,
      disable: true,
      star: true

    },
    {
      name: "enddate",
      label: "End Date",
      type: "date",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    }, {
      name: "limitation",
      label: "Set Limit",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true,
    },
    {
      name: "service",
      label: "Select Service",
      type: "select",
      label_size: 12,
      col_size: 6,
      disable: true,
      options: [
        { label: "All", value: "0" },
        ...servicedata?.map((item) => ({
          label: item?.title,
          value: item?._id,
        })),
      ],
      star: true,
    },


    // {
    //     name: "image",
    //     label: "Image",
    //     type: "file2",
    //     label_size: 12,
    //     col_size: 6,
    //     disable: false,
    // },
    // {
    //     name: "description",
    //     label: "Description",
    //     type: "text",
    //     label_size: 12,
    //     col_size: 6,
    //     disable: false,
    // },

  ];


  return (
    <div style={{ marginTop: "100px" }}>
      <DynamicForm
        fields={fields.filter((field) => !field.showWhen || field.showWhen(formik.values))}
        page_title="Update Coupon Code"
        btn_name="Update Coupon"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/staff/coupon"}
        additional_field={<></>}
      />
    </div>
  );
};

export default Updatecoupon;
