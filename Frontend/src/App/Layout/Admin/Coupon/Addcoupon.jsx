import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Addcouponbyadmin, GetService } from '../../../Services/Admin/Admin';
import Content from '../../../components/Contents/Content';


const Addcoupon = () => {
    const navigate = useNavigate();

    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [servicedata, setServicedata] = useState([]);

    const today = new Date().toISOString().slice(0, 10);

    const [loading, setLoading] = useState(false);



    useEffect(() => {
        getservice();
    }, []);



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

        if (!values.name) {
            errors.name = "Please Enter  Name";
        }
        if (!values.code) {
            errors.code = "Please Enter code";
        }
        if (values.code) {
            if (values.code.length < 6 || values.code.length > 8) {
                errors.code = "Please Enter Between 6 and 8 Characters.";
            } else if (!/^[a-zA-Z0-9]+$/.test(values.code)) {
                errors.code = "Code Must contain Only Numbers and Letters.";
            }
        }

        if (values.minpurchasevalue && parseFloat(values.minpurchasevalue) < parseFloat(values.mincouponvalue)) {
            errors.minpurchasevalue = "Please Enter Value Greater Than  Max Discount Value "
        }
        if (values.mincouponvalue && parseFloat(values.minpurchasevalue) < parseFloat(values.mincouponvalue)) {
            errors.mincouponvalue = "Please Enter Value Less Than Min Purchase Value "
        }
        if (values.value && parseFloat(values.minpurchasevalue) < parseFloat(values.value)) {
            errors.minpurchasevalue = "Please Enter Greater Than Discount value";
        }
        if (values.enddate && values.startdate > values.enddate) {
            errors.enddate = "Please Enter Greater Than Start date";
        }
        if (!values.type) {
            errors.type = "Please Enter Type";
        }
        if (!values.value) {
            errors.value = "Please Enter Value";
        }
        if (!values.startdate) {
            errors.startdate = "Please Enter Start Date";
        }
        if (!values.enddate) {
            errors.enddate = "Please Enter End Date";
        }
        if (!values.minpurchasevalue) {
            errors.minpurchasevalue = "Please Enter Min Purchase Value";
        }
        if (values.mincouponvalue && !values.mincouponvalue) {
            errors.mincouponvalue = "Please Enter Min Coupon Value";
        }
        if (!values.limitation) {
            errors.limitation = "Please Enter Limit";
        }
        if (!values.service) {
            errors.service = "Please Select Service";
        }

        return errors;
    };


    const onSubmit = async (values) => {
        setLoading(!loading)
        const req = {
            name: values.name,
            code: values.code,
            type: values.type,
            value: values.value,
            startdate: values.startdate,
            enddate: values.enddate,
            minpurchasevalue: values.minpurchasevalue,
            mincouponvalue: values.mincouponvalue,
            description: values.description,
            image: values.image,
            limitation: values.limitation,
            service: values.service,
            add_by: user_id,
        };

        try {
            const response = await Addcouponbyadmin(req, token);

            if (response.status) {

                Swal.fire({
                    title: "Create Successful!",
                    text: response.message,
                    icon: "success",
                    timer: 1500,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    navigate("/admin/coupon");
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
            name: '',
            code: '',
            type: '',
            value: '',
            startdate: today,
            enddate: '',
            minpurchasevalue: '',
            mincouponvalue: '',
            description: '',
            image: '',
            limitation: '',
            service: "",
            add_by: ''
        },
        validate,
        onSubmit,
    });

    const fields = [
        {
            name: "name",
            label: "Name",
            type: "text",
            label_size: 6,
            col_size: 6,
            disable: false,
            star: true
        },
        {
            name: "code",
            label: "Coupon Code",
            type: "text",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true
        },
        {
            name: "type",
            label: "Type",
            type: "select",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true,
            options: [
                { value: "percentage", label: "Percentage" },
                { value: "fixed", label: "Fixed" },
            ]
        },

        {
            name: "value",
            label: "Percent/Fixed Discount",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true,
            showWhen: (values) => values.type === "fixed"
        },
        {
            name: "value",
            label: "Percentage/Fixed Discount",
            type: "text4",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true,
            showWhen: (values) => values.type === "percentage"
        },

        {
            name: "minpurchasevalue",
            label: "Min Purchase Value",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true
        },
        {
            name: "mincouponvalue",
            label: "Max Discount Value",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true,
            showWhen: (values) => values.type === "percentage"
        }, {
            name: "limitation",
            label: "Set Limit",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true,
        },
        {
            name: "service",
            label: "Select Service",
            type: "select",
            label_size: 12,
            col_size: 6,
            disable: false,
            options: [
                { label: "All", value: "0" },
                ...servicedata?.map((item) => ({
                    label: item?.title,
                    value: item?._id,
                })),
            ],
            star: true,
        },
        {
            name: "startdate",
            label: "Start Date",
            type: "date1",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true

        },
        {
            name: "enddate",
            label: "End Date",
            type: "date",
            label_size: 12,
            col_size: 6,
            disable: false,
            star: true
        },


        // {
        //     name: "image",
        //     label: "Image",
        //     type: "file2",
        //     label_size: 12,
        //     col_size: 6,
        //     disable: false,
        // },
        // {
        //     name: "description",
        //     label: "Description",
        //     type: "text",
        //     label_size: 12,
        //     col_size: 6,
        //     disable: false,
        // },

    ];



    return (
        <Content
            Page_title="Add Coupon Code"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                formik={formik}
                // page_title="Add Coupon Code"
                btn_name="Add Coupon"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/admin/coupon"}
                additional_field={<></>}

            />
        </Content>
    );
};

export default Addcoupon;
