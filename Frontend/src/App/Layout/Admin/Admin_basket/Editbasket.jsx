import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Updatebasket, Viewbasket } from '../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../Utils/config';
import Content from '../../../components/Contents/Content';


const Editbasket = () => {

  const { id } = useParams()

  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [data, setData] = useState("")

  const [loading, setLoading] = useState(false);



  useEffect(() => {
    getbasketdetail()
  }, [])



  const getbasketdetail = async () => {
    try {
      const response = await Viewbasket(id, token);
      if (response.status) {
        setData(response.data);

      }
    } catch (error) {
      console.log("error");
    }
  };



  useEffect(() => {
    if (data) {
      formik.setValues({
        title: data.title || "",
        description: data.description || "",
        basket_price: data.basket_price || "",
        mininvamount: data.mininvamount || "",
        themename: data.themename || "",
        frequency: data?.frequency || "",
        validity: data?.validity ? data?.validity : "",
        next_rebalance_date: data?.next_rebalance_date ? data?.next_rebalance_date : "",
        cagr: data?.cagr,
        full_price: data?.full_price,
        type: data?.type,
        image: data?.image,
        short_description: data?.short_description,
        url: data?.url,
        rationale: data?.rationale,
        methodology: data?.methodology,
      });
    }
  }, [data]);


  const validate = (values) => {
    console.log("values",values);

    let errors = {};
    
    if (!values.title) {
      errors.title = "Please Enter Title";
    }

    if (!values.themename) {
      errors.themename = "Please Enter Theme Name";
    }
    if (values.full_price && values.full_price <= values.basket_price) {
      errors.full_price = "Please Enter Greater Discounted/Net Basket price";
    }

    if (!values.basket_price) {
      errors.basket_price = "Please Enter Discounted/Net Basket price";
    }
    if (!values.mininvamount) {
      errors.mininvamount = "Please Enter Minimum Investment Amount";
    }
    if (!values.frequency) {
      errors.frequency = "Please Enter Frequency";
    }

    if (!values.validity) {
      errors.validity = "Please Select Validity";
    }

    if (!values.next_rebalance_date) {
      errors.next_rebalance_date = "Please Select Rebalance Date";
    }

    if (values.description === "<p><br></p>") {
      errors.description = "Please Enter Description";
    }
    if (!values.cagr) {
      errors.cagr = "Please Enter CAGR";
    }
    if (!values.type) {
      errors.type = "Please Enter type";
    }
    // if (!values.image) {
    //   errors.image = "Please Upload image";
    // }
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
      id: data._id,
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
      const response = await Updatebasket(req, token);

      // return

      if (response.status) {
        Swal.fire({
          title: "Client Create Successfull !",
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
      id: "",
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
      disable: true,
      star: true
    },
    {
      name: "themename",
      label: "Theme Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: true,
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
      label: "Discounted/Net Basket price",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true

    },
    {
      name: "mininvamount",
      label: "Minimum Investment Amount",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: true,
      star: true
    },
    {
      name: "frequency",
      label: "Frequency",
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
      disable: true,
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
      name: "short_description",
      label: "Short Discription",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      star: true
    },

    {
      name: "image",
      label: "Upload Image",
      type: "file3",
      label_size: 12,
      col_size: 6,
      disable: false,
      image: true,
      imageWidth: "60px",
      imageHeight: "auto",
      src: `${image_baseurl}/uploads/basket/${data.image}`,
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
      Page_title="Edit Basket"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >

      <DynamicForm
        fields={fields}
        formik={formik}
        page_title="Edit Basket"
        btn_name="Edit Basket"
        btn_name1="Cancel"
        sumit_btn={true}
        btnstatus={loading}
        btn_name1_route={"/admin/basket"}
        additional_field={<></>}

      />
    </Content>
  );
};

export default Editbasket;
