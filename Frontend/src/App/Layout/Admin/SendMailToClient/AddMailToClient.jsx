import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useNavigate } from 'react-router-dom';
import { SendBroadCast, GetService, sendMailToClient, getActivecategoryplan, sendMailForClient } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Addbroadcast = () => {

    const navigate = useNavigate();
    const [servicedata, setServicedata] = useState([]);
    const [userdata, setUserdata] = useState([]);

    useEffect(() => {
        getservice();
    }, []);




    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);




    const getservice = async () => {
        try {
            const response = await getActivecategoryplan(token);
            if (response.status) {
                setServicedata(response.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };


    const getUser = async () => {
        try {
            const data = { clientStatus: formik.values.type, planCategory: formik.values.service }
            const response = await sendMailForClient(data, token);

            if (response) {
                setUserdata(response?.clients);
            } else {
                setUserdata([])
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };





    const validate = (values) => {
        let errors = {};

        if (values.type !== "nonsubscribe" && values.type !== "all" && !values.service) {
            errors.service = "Please Select Service";
        }
        if (!values.user) {
            errors.user = "Please Select  User";
        }

        if (!values.subject) {
            errors.subject = "Please Enter Subject";
        }
        if (values.message === "<p style=\"color: rgb(0, 0, 0); font-family: Arial;\"><br></p>") {
            errors.message = "Please Enter Message";
        }
        if (!values.type) {
            errors.type = "Please Select Type";
        }

        return errors;
    };

    const onSubmit = async (values) => {
        setLoading(true);

        const req = {
            usertype: values.type,
            planid: values.service,
            subject: values.subject,
            message: values.message,
            selectedUserIds: values.user
        };

        try {
            const response = await sendMailToClient(req, token);
            if (response.status) {
                showCustomAlert("Success", "Mail Send Successfully",);
            } else {
                showCustomAlert("error", response.message);
            }
        } catch (error) {
            showCustomAlert("error", "An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };



    const formik = useFormik({
        initialValues: {
            service: "",
            subject: "",
            message: "",
            type: "",
            user: ""

        },
        validate,
        onSubmit,
    });

    const fields = [
        {
            name: "type",
            label: "Select Type",
            type: "select",
            label_size: 4,
            col_size: 3,
            disable: false,
            options: [
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "nonsubscriber", label: "Non Subscriber" },
            ],
            star: true
        },
        {
            name: "service",
            label: "Select Plan",
            type: "select",
            label_size: 4,
            col_size: 3,
            disable: false,
            options: [
                { value: "all", label: "All" },
                ...servicedata?.map((item) => ({
                    value: item?._id,
                    label: item?.title,
                }))
            ],
            star: true,
            showWhen: (values) => !(values.type === "nonsubscriber" || values.type === "all")
        },
        {
            name: "user",
            label: "Select User",
            type: "selectcheckbox",
            label_size: 4,
            col_size: 3,
            multi: true,
            disable: false,
            options: [
                { value: "all", label: "All" },
                ...(Array.isArray(userdata) ? userdata.map((item) => ({
                    value: item?._id,
                    label: item?.FullName,
                })) : [])
            ],
            star: true,
        },

        {
            name: "subject",
            label: "Subject",
            type: "text",
            label_size: 4,
            col_size: 3,
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



    useEffect(() => {
        getUser();
    }, [formik.values.type, formik.values.service]);



    return (
        <Content
            Page_title="Send Email to client"
            button_status={false}
            backbutton_status={true}

        >
            <DynamicForm
                fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                formik={formik}
                // page_title="Add Broadcast"
                btn_name="Send Email"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/admin/addmail-to-client"}
                additional_field={<></>}
            />
        </Content >
    );
};

export default Addbroadcast;
