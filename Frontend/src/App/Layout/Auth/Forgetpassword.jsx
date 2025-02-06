import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { ForgetPasswordApi } from '../../Services/Admin/Admin';

const Forgetpassword = () => {


    const token = localStorage.getItem('token');
    const role = localStorage.getItem('Role');



    const UpdateForgetPassword = async (values, { resetForm }) => {
        try {
            const data = {
                Email: values.Email,
            };
            const response = await ForgetPasswordApi(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Password reset email sent successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });
                resetForm();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error sending the password reset email.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error sending the password reset email.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    const validationSchema = Yup.object().shape({
        Email: Yup.string().email('Invalid email format').required('Email is required'),
    });

    return (
        <div>
            <div className="wrapper">
                <div className="authentication-forgot d-flex align-items-center justify-content-center">
                    <div className="card forgot-box">
                        <div className="card-body">
                            <div className="p-3">
                                <div className="text-center">
                                    <img src="assets/images/icons/forgot-2.png" width={100} alt="" />
                                </div>
                                <h4 className="mt-5 font-weight-bold">Forgot Password?</h4>
                                <p className="text-muted">
                                    Enter your registered email ID to reset the password
                                </p>

                                <div className="my-4">
                                    <Formik
                                        initialValues={{
                                            Email: '',
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={UpdateForgetPassword}
                                    >
                                        {({ values, handleSubmit, isSubmitting }) => (
                                            <Form className="row g-3">
                                                <div className="col-md-12">
                                                    <label htmlFor="Email" className="form-label">Email Address</label>
                                                    <div className="input-group">
                                                        <Field
                                                            type="email"
                                                            name="Email"
                                                            className="form-control"
                                                            placeholder="example@user.com"
                                                        />
                                                    </div>
                                                    <ErrorMessage name="Email" component="div" className="text-danger" />
                                                </div>

                                                <div className="d-grid gap-2 col-md-12">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                        {isSubmitting ? 'Sending...' : 'Send'}
                                                    </button>
                                                    <Link
                                                        to="/login"


                                                    >
                                                        <i className="bx bx-arrow-back me-1" />
                                                        Back to Login
                                                    </Link>

                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>


    );
};

export default Forgetpassword;
