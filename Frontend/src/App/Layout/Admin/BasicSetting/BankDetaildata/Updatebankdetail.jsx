import React from "react";
import { useFormik } from "formik";
import DynamicForm from "../../../../Extracomponents/FormicForm";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdateBankDetailbyadmin } from "../../../../Services/Admin/Admin";
import { image_baseurl } from "../../../../../Utils/config";
import Content from "../../../../components/Contents/Content";
import showCustomAlert from "../../../../Extracomponents/CustomAlert/CustomAlert";

const Updatebankdetail = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state;


  const token = localStorage.getItem("token");


  const validate = (values) => {
    let errors = {};

    if (!values.Confirmnumber) {
      errors.Confirmnumber = "Please Confirm Your Account Number";
    } else if (values.accountno !== values.Confirmnumber) {
      errors.Confirmnumber = "Accout Number Must Match";
    }

    return errors;
  };

  const onSubmit = async (values) => {
    const req = {
      name: values.name,
      branch: values.branch,
      accountno: values.accountno,
      ifsc: values.ifsc,
      image: values.image,
      id: row._id,
    };

    try {
      const response = await UpdateBankDetailbyadmin(req, token);
      if (response.status) {
        showCustomAlert("Success", response.message, navigate, "/admin/bankdetail")
      } else {
        showCustomAlert("error", response.message)
      }
    } catch (error) {
      showCustomAlert("error", "An unexpected error occurred. Please try again later.")
    }
  };

  const formik = useFormik({
    initialValues: {
      name: row?.name || "",
      branch: row?.branch || "",
      accountno: row?.accountno || "",
      Confirmnumber: row?.accountno || "",
      ifsc: row?.ifsc || "",
      image: row?.image || "",
      id: "",
    },
    validate,
    onSubmit,
  });

  const fields = [
    {
      name: "name",
      label: "Bank Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
    },
    {
      name: "branch",
      label: "Branch Name",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "accountno",
      label: "Account Number",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "Confirmnumber",
      label: "Confirm Account Number",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "ifsc",
      label: "IFSC Code",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,

    },
    {
      name: "image",
      label: "Image",
      type: "file3",
      label_size: 12,
      col_size: 6,
      disable: false,
      image: true,
      imageWidth: "60px",
      imageHeight: "auto",
      src: `${image_baseurl}/uploads/bank/${row.image}`
    },


  ];

  return (
    <Content
      Page_title="Update Bank Account"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <DynamicForm
        fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
        page_title="Update Bank Account"
        btn_name="Update Bank Account"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route={"/admin/bankdetail"}
        additional_field={<></>}
      />
    </Content>
  );
};

export default Updatebankdetail;
