import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateCondition } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';

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
                    Swal.fire({
                        title: "Update Successful!",
                        text: response.message,
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        navigate("/admin/termsandcondtion");
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
        <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Update Condition</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard">
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <hr />
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
        </div>
    );
};

export default Updatecondition;
