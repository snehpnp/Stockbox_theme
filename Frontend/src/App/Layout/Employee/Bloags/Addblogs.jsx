import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useNavigate } from 'react-router-dom';
import { Addblogsbyadmin } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const Addblogs = () => {


    const navigate = useNavigate();


    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);



    const validate = (values) => {
        let errors = {};

        if (!values.title) {
            errors.title = "Please enter title";
        }
        if (!values.description) {
            errors.description = "Please enter description";
        }
        if (!values.image) {
            errors.image = "Please enter image";
        }


        return errors;
    };

    const onSubmit = async (values) => {
        setLoading(!loading);
        const req = {
            title: values.title,
            description: values.description,
            image: values.image,
            add_by: user_id,
        };

        try {
            const response = await Addblogsbyadmin(req, token);
            if (response.status) {
                showCustomAlert("Success", response.message, navigate, "/employee/blogs")
            } else {
                showCustomAlert("error", response.message)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            showCustomAlert("error", "An unexpected error occurred. Please try again later.")
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
        },
        {
            name: "image",
            label: "Upload Image",
            type: "file2",
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
                // page_title="Add Blog"
                btn_name="Add Blog"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/employee/blogs"}
                additional_field={<></>}
            />
        </Content>


    );
};

export default Addblogs;
