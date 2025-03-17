import React from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { Updatecompanydata } from '../../../Services/Superadmin/Admin';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const Update = () => {


    const navigate = useNavigate();
    const location = useLocation();

    const { row } = location.state;

    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");



    const validate = (values) => {
        let errors = {};

        if (!values.title) {
            errors.title = "Please Enter Title";
        }
        if (!values.phone) {
            errors.phone = "Please Enter Phone No";
        }
        if (!values.email) {
            errors.email = "Please Enter Email";
        }
        if (!values.key) {
            errors.key = "Please Enter Key";
        }
        if (!values.url) {
            errors.url = "Please Enter Url";
        }


        return errors;
    };

    const onSubmit = async (values) => {
        const req = {
            title: values.title,
            email: values.email,
            phone: values.phone,
            key: values.key,
            url: values.url,
            id: row._id,
        };

        try {
            const response = await Updatecompanydata(req, token);
            if (response.status) {
                showCustomAlert("Success",response.message)
                setTimeout(() => {
                    navigate("/admin/company");
                }, 1500);
            } else {
                showCustomAlert("error",response.message)
            }
        } catch (error) {
            showCustomAlert("error","An unexpected error occurred. Please try again later.")
        }
    };

    const formik = useFormik({
        initialValues: {
            title: row?.title || "",
            email: row?.email || "",
            phone: row?.phone || "",
            key: row?.key || "",
            url: row?.url || "",
            id: ""

        },
        validate,
        onSubmit,
    });

    const fields = [
        {
            name: "title",
            label: "Title",
            type: "text",
            star: true,
            label_size: 6,
            col_size: 6,
            disable: false,
        },

        {
            name: "email",
            label: "Email",
            type: "text",
            star: true,
            label_size: 12,
            col_size: 6,
            disable: false,
        },
        {
            name: "phone",
            label: "Phone Number",
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

    ];

    return (
        <div style={{ marginTop: "100px" }}>
            <DynamicForm
                fields={fields}
                page_title="Update Company"
                btn_name="Update Company"
                btn_name1="Cancel"
                formik={formik}
                sumit_btn={true}
                btn_name1_route={"/admin/company"}
                additional_field={<></>}
            />
        </div>
    );
};

export default Update;
