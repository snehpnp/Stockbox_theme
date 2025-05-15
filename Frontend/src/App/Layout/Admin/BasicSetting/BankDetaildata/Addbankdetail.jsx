import React, { useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../../Extracomponents/FormicForm';
import { useNavigate } from 'react-router-dom';
import { AddBankDetailbyadmin } from '../../../../Services/Admin/Admin';
import Content from '../../../../components/Contents/Content';
import showCustomAlert from '../../../../Extracomponents/CustomAlert/CustomAlert';


const Addbankdetail = () => {
    const navigate = useNavigate();

    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);




    const validate = (values) => {
        let errors = {};

        if (!values.name) {
            errors.name = "Please Enter Bank Name";
        }
        if (/\d/.test(values.name)) {
            errors.name = "Numbers are not allowed in the Bank Name";
        }
        if (!values.branch) {
            errors.branch = "Please Enter Branch Name";
        }
        if (/\d/.test(values.branch)) {
            errors.branch = "Numbers are not allowed in the Branch Name";
        }
        if (!values.Confirmnumber) {
            errors.Confirmnumber = "Please Confirm Your Account Number";
        } else if (values.accountno !== values.Confirmnumber) {
            errors.Confirmnumber = "Accout Number Must Match";
        }

        if (!values.accountno) {
            errors.accountno = "Please Account Number Type";
        }
        if (!values.ifsc) {
            errors.ifsc = "Please Enter IFSC Code";
        }
        if (!values.image) {
            errors.image = "Please Enter Image";
        }

        return errors;
    };


    const onSubmit = async (values) => {
        setLoading(!loading)
        const req = {
            name: values.name,
            branch: values.branch,
            accountno: values.accountno,
            ifsc: values.ifsc,
            image: values.image,

        };

        try {
            const response = await AddBankDetailbyadmin(req, token);
            if (response.status) {
                showCustomAlert("Success", response.message, navigate, "/admin/bankdetail")
            } else {
                showCustomAlert("error", response.message)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            showCustomAlert("error", "An unexpected error occurred. Please try again later.")

        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            branch: '',
            accountno: '',
            ifsc: '',
            image: '',
            Conformnumber: '',

        },
        validate,
        onSubmit,
    });

    const fields = [
        {
            name: "name",
            label: "Bank Name",
            type: "text",
            label_size: 6,
            col_size: 6,
            disable: false,
        },
        {
            name: "branch",
            label: "Branch Name",
            type: "text",
            label_size: 12,
            col_size: 6,
            disable: false,
        },
        {
            name: "accountno",
            label: "Account Number",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
        },
        {
            name: "Confirmnumber",
            label: "Confirm Account Number",
            type: "number",
            label_size: 12,
            col_size: 6,
            disable: false,
        },
        {
            name: "ifsc",
            label: "IFSC Code",
            type: "text",
            label_size: 12,
            col_size: 6,
            disable: false,

        },
        {
            name: "image",
            label: "Image",
            type: "file2",
            image: true,
            label_size: 12,
            col_size: 6,
            disable: false,
        },


    ];


    return (
        <Content
            Page_title="Add Bank Account"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                formik={formik}
                page_title="Add Bank Account"
                btn_name="Add Bank Account"
                btn_name1="Cancel"
                sumit_btn={true}
                btnstatus={loading}
                btn_name1_route={"/admin/bankdetail"}
                additional_field={<></>}

            />
        </Content>
    );
};

export default Addbankdetail;
