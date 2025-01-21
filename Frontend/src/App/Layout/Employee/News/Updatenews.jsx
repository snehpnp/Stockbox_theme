import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../components/FormicForm';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateNewsbyadmin } from '../../../Services/Admin';
import { image_baseurl } from '../../../Utils/config';


const Updatenews = () => {


    const location = useLocation();
    const { client } = location.state;



    const navigate = useNavigate();
    const token = localStorage.getItem("token");



    const formik = useFormik({
        initialValues: {
            title: client?.title || "",
            description: client?.description || "",
            image: client?.image || "",
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
                    Swal.fire({
                        title: "Update Successful!",
                        text: response.message,
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        navigate("/staff/news");
                    }, 1500);
                } else {
                    Swal.fire({
                        title: "Alert",
                        text: response.message,
                        icon: "warning",
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
            star:true

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
            star:true
        },
        {
            name: "description",
            label: "Description",
            type: "ckeditor",
            label_size: 12,
            col_size: 12,
            disable: false,
            star:true
        },
    ];

    return (
        <div style={{ marginTop: "100px" }}>
            <DynamicForm
                fields={fields}
                formik={formik}
                page_title="Update News"
                btn_name="Update News"
                btn_name1="Cancel"
                sumit_btn={true}
                btn_name1_route={"/staff/news"}
                additional_field={<>

                </>}
            />
        </div>
    );
};

export default Updatenews;
