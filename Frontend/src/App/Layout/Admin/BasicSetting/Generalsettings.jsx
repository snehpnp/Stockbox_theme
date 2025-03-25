import React, { useEffect, useState } from 'react';
import { basicsettinglist, Updatebasicsettings } from '../../../Services/Admin/Admin';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { image_baseurl } from '../../../../Utils/config';
import Loader from '../../../../Utils/Loader';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const Generalsettings = () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('id');
    const navigate = useNavigate();

    const [clients, setClients] = useState(null);

    const [isModified, setIsModified] = useState(false);
    const [istoggle, setToggle] = useState([])

    const indianStates = [
        { name: "Andhra Pradesh" },
        { name: "Arunachal Pradesh" },
        { name: "Assam" },
        { name: "Bihar" },
        { name: "Chhattisgarh" },
        { name: "Goa" },
        { name: "Gujarat" },
        { name: "Haryana" },
        { name: "Himachal Pradesh" },
        { name: "Jharkhand" },
        { name: "Karnataka" },
        { name: "Kerala" },
        { name: "Madhya Pradesh" },
        { name: "Maharashtra" },
        { name: "Manipur" },
        { name: "Meghalaya" },
        { name: "Mizoram" },
        { name: "Nagaland" },
        { name: "Odisha" },
        { name: "Punjab" },
        { name: "Rajasthan" },
        { name: "Sikkim" },
        { name: "Tamil Nadu" },
        { name: "Telangana" },
        { name: "Tripura" },
        { name: "Uttar Pradesh" },
        { name: "Uttarakhand" },
        { name: "West Bengal" }
    ];

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
        return <div><Loader /></div>;
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
                                simage: null,
                                gstin: clients[0].gstin || '',
                                state: clients[0].state || '',

                            }}
                            onSubmit={async (values, { resetForm }) => {
                                const req = {
                                    from_name: values.from_name,
                                    address: values.address,
                                    contact_number: values.contact_number,
                                    email_address: values.email_address,
                                    favicon: values.favicon,
                                    logo: values.logo,
                                    offer_image: values.offer_image,
                                    simage: values.simage,
                                    gstin: values.gstin,
                                    state: values.state,
                                    id: user_id,

                                };

                                try {
                                    const response = await Updatebasicsettings(req, token);
                                    
                                    if (response.status) {
                                        showCustomAlert("Success", response.message)
                                        setIsModified(false);
                                        document.querySelectorAll('input[name="offer_image"], input[name="logo"], input[name="favicon"],input[name="simage"]').forEach(input => {
                                            input.value = "";
                                        });


                                    } else {
                                        showCustomAlert("error", response.message)
                                    }
                                } catch (error) {
                                    showCustomAlert("error", "An unexpected error occurred. Please try again later.")

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
                                                        accept="image/*"
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
                                                        accept="image/*"
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
                                                <label htmlFor="offer_image" className="col-sm-3 col-form-label">
                                                    <b>Offer Image</b>
                                                </label>
                                                <div className="col-sm-8">
                                                    <input
                                                        name="offer_image"
                                                        type="file"
                                                        accept="image/*"
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

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="simage" className="col-sm-3 col-form-label">
                                                    <b>Signature Image</b>
                                                </label>
                                                <div className="col-sm-8">
                                                    <input
                                                        name="simage"
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-control"
                                                        onChange={(event) => setFieldValue("simage", event.currentTarget.files[0])}

                                                    />
                                                </div>
                                                <div className="col-sm-1">
                                                    {clients[0].simage && (
                                                        <div className="file-preview">
                                                            <img src={`${image_baseurl}uploads/basicsetting/${clients[0].simage}`} alt="simage Preview" className="image-preview" />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="address" className="col-sm-3 col-form-label">
                                                    <b> Address</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bx bx-home" />
                                                        </span>
                                                        <Field
                                                            name="address"
                                                            as="textarea"
                                                            className="form-control"
                                                            placeholder="Address"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="gstin" className="col-sm-3 col-form-label">
                                                    <b> GSTIN</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bx bx-calculator" />
                                                        </span>
                                                        <Field
                                                            name="gstin"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="GSTIN"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3 align-items-center">
                                                <label htmlFor="state" className="col-sm-3 col-form-label">
                                                    <b>State</b>
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bx bx-globe" />
                                                        </span>
                                                        <Field as="select" name="state" className="form-control">
                                                            <option value="">Select State</option>
                                                            {indianStates.map((state, index) => (
                                                                <option key={index} value={state.name}>
                                                                    {state.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
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
        </div >
    );
};

export default Generalsettings;
