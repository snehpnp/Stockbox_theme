import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Addblogsbyadmin } from '../../../Services/Admin/Admin';

import { Link } from 'react-router-dom';
import Content from '../../../components/Contents/Content';


const Addblogs = () => {


    const navigate = useNavigate();


    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);





    const validate = (values) => {
        console.log("blogs", values);

        let errors = {};

        if (!values.title) {
            errors.title = "Please Enter Title";
        }
        if (!values.description) {
            errors.description = "Please Enter Description";
        }
        if (!values.image) {
            errors.image = "Please Select Image";
        }


        return errors;
    };

    const onSubmit = async (values) => {
        setLoading(!loading)
        const req = {
            title: values.title,
            description: values.description,
            image: values.image,
            add_by: user_id,
        };

        try {
            const response = await Addblogsbyadmin(req, token);
            if (response.status) {
                Swal.fire({
                    title: "Blog Add  Successful!",
                    text: response.message,
                    icon: "success",
                    timer: 1500,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    navigate("/admin/blogs");
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
            image: "",
        },
        validate,
        onSubmit,
    });

    const fields = [

        {
            name: "title",
            label: "Title",
            type: "text",
            label_size: 12,
            col_size: 6,
            disable: false,
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
        <Content
            Page_title="Add Blog"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}
                
                btn_name="Add Blog"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/admin/blogs"}
                additional_field={<></>}
            />
        </Content>
    );
};

export default Addblogs;
