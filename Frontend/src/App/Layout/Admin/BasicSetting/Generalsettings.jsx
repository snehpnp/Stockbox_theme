import React, { useEffect, useState } from 'react';
import { basicsettinglist, Updatebasicsettings } from '../../../Services/Admin/Admin';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { image_baseurl } from '../../../../Utils/config';



const Generalsettings = () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('id');
    const navigate = useNavigate();

    const [clients, setClients] = useState(null);
    const [isModified, setIsModified] = useState(false);
    const [istoggle, setToggle] = useState([])

    const getsettinglist = async () => {
        try {
            const response = await basicsettinglist(token);
            if (response.status) {
                setClients(response.data);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        getsettinglist();
    }, []);

    if (!clients) {
        return <div>Loading...</div>;
    }




    return (
        <div className="page-content">
            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">General Settings</div>
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
            <div className="row">
                <div className="col-lg-12 mx-auto">
                    <div className="card radius-15">

                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                id: user_id,
                                from_name: clients[0].from_name || '',
                                address: clients[0].address || '',
                                contact_number: clients[0].contact_number || '',
                                email_address: clients[0].email_address || '',
                                favicon: null,
                                logo: null,
                                offer_image: null,

                            }}
                            onSubmit={async (values) => {
                                const req = {
                                    from_name: values.from_name,
                                    address: values.address,
                                    contact_number: values.contact_number,
                                    email_address: values.email_address,
                                    favicon: values.favicon,
                                    logo: values.logo,
                                    offer_image: values.offer_image,
                                    id: user_id,

                                };

                                try {
                                    const response = await Updatebasicsettings(req, token);
                                    if (response.status) {
                                        Swal.fire({
                                            title: "Update Successful!",
                                            text: response.message,
                                            icon: "success",
                                            timer: 1500,
                                            timerProgressBar: true,
                                        });
                                        setIsModified(false);
                                    } else {
                                        Swal.fire({
                                            title: "Error",
                                            text: response.message,
                                            icon: "error",
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
                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <>


                                    <Form className="card-body p-4" onChange={() => setIsModified(true)}>
                                        <div className=" ">

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="from_name" className="col-sm-3 col-form-label">
                                                    <b> Company Name</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fadeIn animated bx bx-building" />
                                                        </span>
                                                        <Field name="from_name"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your Name"

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="contact_number" className="col-sm-3 col-form-label">
                                                    <b> Phone No</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fadeIn animated bx bx-phone" />
                                                        </span>
                                                        <Field name="contact_number"
                                                            type="text" className="form-control"
                                                            placeholder="Phone No"

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="email_address" className="col-sm-3 col-form-label">
                                                    <b> Email Address</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bx bx-envelope" />
                                                        </span>
                                                        <Field name="email_address"
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Email"

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="favicon" className="col-sm-3 col-form-label">
                                                    <b>Favicon</b>
                                                </label>
                                                <div className="col-sm-8">
                                                    <input
                                                        name="favicon"
                                                        type="file"
                                                        className="form-control"

                                                        onChange={(event) => setFieldValue("favicon", event.currentTarget.files[0])}
                                                    />
                                                </div>
                                                <div className="col-sm-1">
                                                    {clients[0].favicon && (
                                                        <div className="file-preview">
                                                            <img src={`${image_baseurl}uploads/basicsetting/${clients[0].favicon}`} alt="Favicon Preview" className="image-preview"

                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="logo" className="col-sm-3 col-form-label">
                                                    <b> Logo</b>
                                                </label>
                                                <div className="col-sm-8">
                                                    <input
                                                        name="logo"
                                                        type="file"
                                                        className="form-control"
                                                        onChange={(event) => setFieldValue("logo", event.currentTarget.files[0])}

                                                    />
                                                </div>
                                                <div className="col-sm-1">
                                                    {clients[0].logo && (
                                                        <div className="file-preview">
                                                            <img src={`${image_baseurl}uploads/basicsetting/${clients[0].logo}`} alt="Logo Preview" className="image-preview" />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="logo" className="col-sm-3 col-form-label">
                                                    <b>Offer Image</b>
                                                </label>
                                                <div className="col-sm-8">
                                                    <input
                                                        name="offer_image"
                                                        type="file"
                                                        className="form-control"
                                                        onChange={(event) => setFieldValue("offer_image", event.currentTarget.files[0])}

                                                    />
                                                </div>
                                                <div className="col-sm-1">
                                                    {clients[0].offer_image && (
                                                        <div className="file-preview">
                                                            <img src={`${image_baseurl}uploads/basicsetting/${clients[0].offer_image}`} alt="offer_image Preview" className="image-preview" />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            <div className="row">
                                                <label className="col-sm-3 col-form-label" />
                                                <div className="col-sm-9">
                                                    <div className="d-md-flex d-grid align-items-center justify-content-end gap-3">
                                                        <button type="submit" className="btn btn-primary px-4" disabled={!isModified} >
                                                            Update
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </>
                            )}

                        </Formik>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .general-settings {
                    width: 50%;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .file-preview {
                    width: 40px;
                    height: 40px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 10px;
                }

                .image-preview {
                    width: 100%;
                    height: auto;
                }

                .error {
                    color: red;
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default Generalsettings;
