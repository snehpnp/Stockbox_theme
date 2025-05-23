import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { SendBroadCast, GetService, UpdateCastmessage } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Updatebroadcast = () => {
    const location = useLocation();
    const { item } = location.state;


    const [servicedata, setServicedata] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");



    const getservice = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServicedata(response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };

    useEffect(() => {
        getservice();
    }, []);


    const formik = useFormik({
        initialValues: {
            service: item?.service ? item.service.split(',') : [],
            subject: item?.subject || "",
            message: item?.message || "",
            type: item?.type || "",
        },

        onSubmit: async (values) => {
            const data = {
                message: values.message,
                id: item._id,
                subject: values.subject,
                service: Array.isArray(values.service) ? values.service.join(',') : values.service,
                type: values.type,
            };

            try {
                const response = await UpdateCastmessage(data, token);


                if (response.status) {
                    showCustomAlert("Success", response.message, navigate, "/admin/message")
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
            name: "type",
            label: "Select Type",
            type: "select",
            label_size: 6,
            col_size: 4,
            disable: false,
            options: [
                { value: "All", label: "All" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "nonsubscribe", label: "Non Subscribe" },
            ],
            star: true
        },
        {
            name: "service",
            label: "Select Service",
            type: "select",
            label_size: 6,
            col_size: 4,
            disable: false,
            options: [
                { value: "All", label: "All" },
                ...servicedata?.map((item) => ({
                    value: item?._id,
                    label: item?.title,
                }))
            ],
            star: true,
            showWhen: (values) => !(values.type === "nonsubscribe" || values.type === "All")
        },
        {
            name: "subject",
            label: "Subject",
            type: "text",
            label_size: 12,
            col_size: 4,
            disable: false,
            star: true
        },

        {
            name: "message",
            label: "Message",
            type: "ckeditor",
            label_size: 12,
            col_size: 12,
            disable: false,
            star: true
        },

    ];

    return (
        <Content
            Page_title="Update Broadcast"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            {servicedata && servicedata.length > 0 && (
                <DynamicForm
                    fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                    formik={formik}
                    btn_name="Update Broadcast"
                    btn_name1="Cancel"
                    sumit_btn={true}
                    btn_name1_route={"/admin/message"}
                    additional_field={<></>}
                />
            )}
        </Content>
    );
};

export default Updatebroadcast;
