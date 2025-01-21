import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useNavigate } from 'react-router-dom';
import { SendBroadCast, GetService } from '../../../Services/Admin/Admin';

const Addbroadcast = () => {

    const navigate = useNavigate();
    const [servicedata, setServicedata] = useState([]);

    useEffect(() => {
        getservice();
    }, []);



    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);




    const getservice = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServicedata(response.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };



    const validate = (values) => {
        let errors = {};
        if (values.type !== "nonsubscribe" && !values.service) {
            errors.service = "Please Select Service";
        }
        if (!values.subject) {
            errors.subject = "Please Enter Subject";
        }
        if (!values.message) {
            errors.message = "Please Enter Message";
        }
        if (!values.type) {
            errors.type = "Please Select Type";
        }
        return errors;
    };

    const onSubmit = async (values) => {
        setLoading(!loading)
        const req = {
            service: values.service,
            subject: values.subject,
            message: values.message,
            type: values.type
        };

        try {
            const response = await SendBroadCast(req, token);
            if (response.status) {
                Swal.fire({
                    title: "Send Successful!",
                    text: response.message,
                    icon: "success",
                    timer: 1500,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    navigate("/admin/message");
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
            // console.error("Error in API call:", error);
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
            service: "",
            subject: "",
            message: "",
            type: ""

        },
        validate,
        onSubmit,
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
                // { value: "all", label: "All" },
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
            options: servicedata?.map((item) => ({
                label: item?.title,
                value: item?._id,
            })),
            star: true,
            showWhen: (values) => values.type !== "nonsubscribe"
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
        <div style={{ marginTop: "100px" }}>
            <DynamicForm
                fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                formik={formik}
                page_title="Add Broadcast"
                btn_name="Add Broadcast"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/admin/message"}
                additional_field={<></>}
            />
        </div>
    );
};

export default Addbroadcast;
