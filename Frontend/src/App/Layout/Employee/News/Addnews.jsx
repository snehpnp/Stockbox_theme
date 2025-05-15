import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useNavigate } from 'react-router-dom';
import { AddNewsbyadmin } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const Addnews = () => {


    const navigate = useNavigate();


    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");


    const [loading, setLoading] = useState(false);





    const validate = (values) => {
        let errors = {};

        if (!values.title) {
            errors.title = "Please Enter Title";
        }
        if (!values.description) {
            errors.description = "Please Enter Description";
        }
        if (!values.image) {
            errors.image = "Please Enter Image";
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
            const response = await AddNewsbyadmin(req, token);
            if (response.status) {
                showCustomAlert("Success", response.message, navigate, "/employee/news")
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
            Page_title="Add News"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}

                btn_name="Add News"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/employee/news"}
                additional_field={<></>}
            />
        </Content>


    );
};

export default Addnews;
