import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateCondition } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Updatecondition = () => {

    const location = useLocation();
    const { client } = location.state;



    const navigate = useNavigate();
    const token = localStorage.getItem("token");



    const formik = useFormik({
        initialValues: {
            description: client?.description || "",
            id: "",
            title: client?.title
        },

        onSubmit: async (values) => {
            const req = {
                id: client._id,
                description: values.description,
                title: values.title
            };

            try {
                const response = await UpdateCondition(req, token);
                if (response.status) {
                    showCustomAlert("Success", response.message, navigate, "/admin/termsandcondtion")
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
            disable: true,
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
            Page_title="Update Condition"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}

                btn_name="Update Condition"
                btn_name1="Cancel"
                sumit_btn={true}
                btn_name1_route={"/admin/termsandcondtion"}
                additional_field={<>

                </>}
            />
        </Content>
    );
};

export default Updatecondition;
