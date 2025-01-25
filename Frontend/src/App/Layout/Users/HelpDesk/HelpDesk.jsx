import React from 'react'
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";

const HelpDesk = () => {

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            checkbox: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = "Required";
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
                errors.email = "Invalid email address";
            }
            if (!values.password) {
                errors.password = "Required";
            } else if (values.password.length < 6) {
                errors.password = "Password should be atleast 6 characters";
            }
            return errors;
        },
        onSubmit: (values) => {
            console.log("Form data", values);
        }
    })

    let fieldtype =[
        {
          type: "text",
          name: "subject",
          label: "Subject",
          placeholder: "Subject",
          required: true,
          label_size: 5,
          col_size: 12,
          disable: false,
        },
         {
          type: "textarea",
          name: "message",
          label: "Message",
          placeholder: "Message",
          required: true,
          label_size: 5,
          col_size: 12,
          disable: false,
         },
        
        
        
        ]
        

  return (
    <Content Page_title="Help Desk" button_title="Add Trade" button_status={false}>
         <FormicForm
    fieldtype={fieldtype} // Rename to fieldtype to match FormicForm's expectation
    formik={formik}
    ButtonName="Submit"
    BtnStatus={true}
/>
        </Content>
  )
}

export default HelpDesk