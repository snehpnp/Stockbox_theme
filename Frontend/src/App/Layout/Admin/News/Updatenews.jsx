import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateNewsbyadmin } from '../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../Utils/config';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Updatenews = () => {


    const location = useLocation();
    const { client } = location.state;



    const navigate = useNavigate();
    const token = localStorage.getItem("token");



    const formik = useFormik({
        initialValues: {
            title: client?.title || "",
            description: client?.description || "",
            image: client?.image ? client?.image : "",
            id: "",
        },

        onSubmit: async (values) => {
            const req = {
                title: values.title,
                id: client._id,
                description: values.description,
                image: values.image,
            };

            try {
                const response = await UpdateNewsbyadmin(req, token);
                if (response.status) {
                    showCustomAlert("Success", response.message, navigate, "/admin/news")
                } else {
                    showCustomAlert("error", response.message, navigate, "/admin/news")

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
            src: `${image_baseurl}/uploads/news/${client.image}`,
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
            Page_title="Update News"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}
                page_title="Update News"
                btn_name="Update News"
                btn_name1="Cancel"
                sumit_btn={true}
                btn_name1_route={"/admin/news"}
                additional_field={<>

                </>}
            />
        </Content>
    );
};

export default Updatenews;
