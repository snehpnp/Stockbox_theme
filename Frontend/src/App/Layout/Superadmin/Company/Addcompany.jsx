import React,{useState,useEffect} from "react";
import { useFormik } from "formik";
import DynamicForm from "../../../Extracomponents/FormicForm";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AddComapanydata } from "../../../Services/Superadmin/Admin";
import Content from "../../../components/Contents/Content";
import { GetAllThemesNameApi } from '../../../Services/Themes/Theme'

const Addcompany = () => {
  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [themes, setThemes] = useState([]);
  const validate = (values) => {
    let errors = {};

    if (!values.title) {
      errors.title = "Please Enter Title";
    }
    if (!values.email) {
      errors.email = "Please Enter Email";
    }
    if (!values.phone) {
      errors.phone = "Please Enter Phone No";
    }
    if (!values.key) {
      errors.key = "Please Enter Key";
    }
    if (!values.url) {
      errors.url = "Please Enter Url";
    }
    if (!values.theme) {
      errors.theme = "Please Select Theme";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      title: values.title,
      email: values.email,
      phone: values.phone,
      key: values.key,
      add_by: user_id,
      url: values.url,
      theme_id: values.theme,
    };

    try {
      const response = await AddComapanydata(req, token);
      if (response.status) {
        Swal.fire({
          title: "Create Successful!",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/admin/company");
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
      title: "",
      email: "",
      phone: "",
      key: "",
      add_by: "",
      url: "",
      theme: "",
    },
    validate,
    onSubmit,
  });

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "phone",
      label: "Phone No",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },

    {
      name: "key",
      label: "Key",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "url",
      label: "Url",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
        name: "theme",
        label: "Theme",
        type: "select",
        label_size: 12,
        col_size: 6,
        disable: false,
        options: themes,
        
    }
  ];
  const GetAllThemes = async () => {
    try {
      const response = await GetAllThemesNameApi();
      if (response.status) {
        console.log(response.data);
        response.data.map((item) => {
          item.value = item._id;
          item.label = item.ThemeName;
          delete item._id;
          delete item.ThemeName;
        });

        setThemes(response.data);
      }
    } catch (error) {

    }
  };
    useEffect(() => {
        GetAllThemes();
    }, []);

  return (
    <Content
      Page_title="Add Company"
      backbutton_status={false}
      button_status={false}
    >
      <DynamicForm
        fields={fields}
        page_title="Add New Company"
        btn_name="Add Company"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/company"}
        additional_field={<></>}
      />
    </Content>
  );
};

export default Addcompany;
