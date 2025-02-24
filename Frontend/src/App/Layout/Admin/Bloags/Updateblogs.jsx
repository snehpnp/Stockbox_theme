import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { Updateblogsbyadmin } from '../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../Utils/config';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const Updateblogs = () => {
    const location = useLocation();
    const { row } = location.state;



    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const validate = (values) => {


        let errors = {};

        if (!values.title) {
            errors.title = "Please Enter Title";
        }
        if (!values.description || values.description === "<p><br></p>") {
            errors.description = "Please Enter Description";
        }
        if (!values.image) {
            errors.image = "Please Enter image url";
        }
        return errors;
    }

    const formik = useFormik({
        initialValues: {
            title: row?.title || "",
            description: row?.description || "",
            image: row?.image ? row?.image : "",
            id: ""
        },
        validate,

        onSubmit: async (values) => {
            const req = {
                title: values.title,
                id: row._id,
                description: values.description,
                image: values.image,
            };

            try {
                const response = await Updateblogsbyadmin(req, token);

                if (response.status) {
                    showCustomAlert("Success", response.message, navigate, "/admin/blogs")
                } else {
                    showCustomAlert("error", response.message)
                }
            } catch (error) {
                showCustomAlert("error", "An unexpected error occurred. Please try again later.")
            }
        },
    });



    const fields = [
        {
            name: "title",
            label: "Title",
            type: "text",
            label_size: 6,
            col_size: 6,
            disable: false,
            star: true

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
            src: `${image_baseurl}/uploads/blogs/${row.image}`,
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
            Page_title="Update Blog"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}
                page_title="Update Blog"
                btn_name="Update Blog"
                btn_name1="Cancel"
                sumit_btn={true}
                btn_name1_route={"/admin/blogs"}
                additional_field={<>

                </>}
            />
        </Content>
    );
};

export default Updateblogs;
