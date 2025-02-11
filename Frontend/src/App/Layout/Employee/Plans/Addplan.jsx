import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Addplanbyadmin, getcategoryplan, getplanlist, getActivecategoryplan } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';



const Addplan = () => {


    const navigate = useNavigate();
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [clients, setClients] = useState([]);
    const [plan, setPlan] = useState([]);

    const [loading, setLoading] = useState(false);




    const getcategoryplanlist = async () => {
        try {
            const response = await getActivecategoryplan(token);
            if (response.status) {
                setClients(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    }



    useEffect(() => {
        getcategoryplanlist();
    }, []);



    const validate = (values) => {
        let errors = {};


        if (!values.description || values.description === "<p><br></p>") {
            errors.description = "Please Enter Description";
        }
        if (!values.price) {
            errors.price = "Please Enter Price";
        }
        if (values.price && values.price < 0) {
            errors.price = "Please Enter Price Greater Than 0";
        }
        if (!values.validity) {
            errors.validity = "Please Select Validity";
        }
        if (!values.category) {
            errors.category = "Please Select Category";
        }

        return errors;
    };

    const onSubmit = async (values) => {
        setLoading(!loading);
        console.log("values", values.Status)
        const req = {
            title: "",
            description: values.description,
            price: values.price,
            validity: values.validity,
            category: values.category,
            add_by: user_id,
            deliverystatus: values.Status === 1 ? true : values.Status == 0 ? false : ""
        };

        try {
            const response = await Addplanbyadmin(req, token);


            if (response.status) {
                Swal.fire({
                    title: "Create Successful!",
                    text: response.message,
                    icon: "success",
                    timer: 1500,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    navigate("/employee/plan");
                }, 1500);
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message,
                    icon: "error",
                    timer: 1500,
                    timerProgressBar: true,
                });
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
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
            title: "",
            description: "",
            price: "",
            validity: "",
            category: "",
            add_by: "",
            Status: ""
        },
        validate,
        onSubmit,
    });






    const fields = [
        {
            name: "category",
            label: "Category",
            type: 'select',
            options: clients.map((item) => ({
                label: `${item.title} (${item.servicesDetails.map(service => service.title).join(', ')})`,
                value: item._id,
            })),
            label_size: 12,
            col_size: 3,
            disable: false,
            star: true
        },
        {
            name: "validity",
            label: "Validity",
            type: "select",
            label_size: 12,
            col_size: 3,
            disable: false,
            options: [
                { value: "1 month", label: "1 Month" },
                { value: "3 months", label: "3 Months" },
                { value: "6 months", label: "6 Months" },
                { value: "1 year", label: "1 Year" }
            ].filter((option) => {
                return !plan.some((item) => item?.validity === option.value);
            }),
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
        {
            name: "Status",
            label: "Plan Delivery status ",
            type: "togglebtn",
            label_size: 12,
            col_size: 3,
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



    useEffect(() => {
        const getplanlistfordetail = async () => {
            try {
                const response = await getplanlist(token);
                if (response.status) {
                    const filteredPlans = response.data.filter(item => item.category === formik.values.category);
                    setPlan(filteredPlans);

                }
            } catch (error) {
                console.error("Plan list fetch error:", error);
            }
        };

        if (formik.values.category) {
            getplanlistfordetail();
        }
    }, [formik.values.category]);





    return (
        <Content
            Page_title="Add New Package"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                formik={formik}
                // page_title="Add New Package"
                btn_name="Add Package"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/employee/plan"}
                additional_field={<></>}
            />
        </Content>

    );
};

export default Addplan;
