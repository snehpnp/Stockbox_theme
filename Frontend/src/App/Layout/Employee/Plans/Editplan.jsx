import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useNavigate, useParams } from 'react-router-dom';
import { getcategoryplan, getActivecategoryplan, getbyidplan, Updateplan } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';
import Content from '../../../components/Contents/Content';


const Editplan = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [clients, setClients] = useState([]);
    const [info, setInfo] = useState({});

    const [isFreeTrialZero, setIsFreeTrialZero] = useState("");



    const getcategoryplanlist = async () => {
        try {
            const response = await getActivecategoryplan(token);
            if (response.status) {
                setClients(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    };




    const getplaninfo = async () => {
        try {
            const response = await getbyidplan(id, token);
            if (response.status) {
                setInfo(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch plans", error);
        }
    };

    useEffect(() => {
        getcategoryplanlist();
        getplaninfo();
    }, []);




    const validate = (values) => {
        let errors = {};
        if (!values.description || values.description === "<p><br></p>") {
            errors.description = "Please Enter Description";
        }
        if (isFreeTrialZero == 1) {
            if (values.price === "" || values.price === null || values.price === undefined) {
                errors.price = "Please Enter Price";
            } else if (isNaN(values.price) || Number(values.price) < 0) {
                errors.price = "Price must be 0 or more";
            }
        } else if (isFreeTrialZero == 0) {
            if (values.price === "" || values.price === null || values.price === undefined) {
                errors.price = "Please Enter Price";
            } else if (isNaN(values.price) || Number(values.price) <= 0) {
                errors.price = "Price must be greater than 0";
            }
        }
        if (!values.validity) errors.validity = "Please Enter Validity";
        if (!values.category) errors.category = "Please Enter Category";
        return errors;
    };

    const onSubmit = async (values) => {
        const req = {
            description: values.description,
            price: values.price,
            validity: values.validity,
            category: values.category,
            // deliverystatus: values.deliverystatus == 1 ? true : false,
            id: id,

        };

        try {
            const response = await Updateplan(req, token);

            if (response.status) {
                showCustomAlert('Success', "Edit Successful!", navigate, "/employee/plan")
            } else {
                showCustomAlert('error', response.message)
            }
        } catch (error) {
            showCustomAlert('error', 'An unexpected error occurred. Please try again later.')
        }
    };

    const formik = useFormik({
        initialValues: {
            description: info?.description || "",
            price: info?.price || "",
            validity: info?.validity ? info.validity : "",
            category: info?.category ? info.category._id : "",
            // deliverystatus: info?.deliverystatus ? 1 : 0,
        },
        enableReinitialize: true,
        validate,
        onSubmit,
    });

    useEffect(() => {
        const matchedClient = clients.find(
            (item) => item._id === formik.values.category
        );

        if (matchedClient && matchedClient.freetrial_status == 1) {
            setIsFreeTrialZero(1);
        } else {
            setIsFreeTrialZero(0);
        }
    }, [formik.values.category, clients]);


    const fields = [
        {
            name: "category",
            label: "Category",
            type: 'select',
            options: clients.map((item) => ({
                label: item.title,
                value: item._id,
            })),
            label_size: 12,
            col_size: 3,
            disable: true,
            star: true
        },
        {
            name: "validity",
            label: "Validity",
            type: "select",
            label_size: 12,
            col_size: 3,
            disable: isFreeTrialZero == 1 ? false : true,
            options: isFreeTrialZero == 0
                ? [
                    { value: "1 month", label: "1 Month" },
                    { value: "3 months", label: "3 Months" },
                    { value: "6 months", label: "6 Months" },
                    { value: "1 year", label: "1 Year" }
                ]
                : [
                    { value: "1 day", label: "1 day" },
                    { value: "2 days", label: "2 days" },
                    { value: "3 days", label: "3 days" },
                    { value: "4 days", label: "4 days" },
                    { value: "5 days", label: "5 days" },
                    { value: "6 days", label: "6 days" },
                    { value: "7 days", label: "7 days" }
                ],
            star: true
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            label_size: 12,
            col_size: 3,
            disable: false,
            star: true
        },
        // {
        //     name: "deliverystatus",
        //     label: "Plan Delivery status ",
        //     type: "togglebtn",
        //     label_size: 12,
        //     col_size: 3,
        //     disable: false,
        //     star: true
        // },
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
            Page_title="Edit Plan"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <hr />
            <DynamicForm
                fields={fields}
                formik={formik}
                // page_title="Edit Plan"
                btn_name="Edit Plan"
                btn_name1="Cancel"
                sumit_btn={true}
                btn_name1_route={"/employee/plan"}
                additional_field={<></>}
            />
        </Content>

    );
};

export default Editplan;