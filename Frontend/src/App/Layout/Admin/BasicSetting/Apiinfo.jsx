import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { basicsettinglist, updateApiinfo, UpdateKycstatus, Invoicestatus } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';

const Apiinfo = () => {


    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('id');
    const navigate = useNavigate();

    const [clients, setClients] = useState("");
    const [kycstatus, setKycstatus] = useState({});
    const [initialApiData, setInitialApiData] = useState({
        digio_client_id: "",
        digio_client_secret: "",
        digio_template_name: ""
    });
    const [updateapi, setUpdateapi] = useState({
        digio_client_id: "",
        digio_client_secret: "",
        digio_template_name: ""
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const getApidetail = async () => {
        try {
            const response = await basicsettinglist(token);
            if (response?.status && response?.data) {
                const clientData = response.data[0];
                setClients(clientData);
                setKycstatus(clientData);

                setUpdateapi({
                    digio_client_id: clientData.digio_client_id || "",
                    digio_client_secret: clientData.digio_client_secret || "",
                    digio_template_name: clientData.digio_template_name || ""
                });
                setInitialApiData({
                    digio_client_id: clientData.digio_client_id || "",
                    digio_client_secret: clientData.digio_client_secret || "",
                    digio_template_name: clientData.digio_template_name || ""
                });
            }
        } catch (error) {
            console.log('Error fetching API details:', error);
        }
    };

    useEffect(() => {
        getApidetail();
    }, []);

    useEffect(() => {
        const isDataChanged =
            updateapi.digio_client_id !== initialApiData.digio_client_id ||
            updateapi.digio_client_secret !== initialApiData.digio_client_secret ||
            updateapi.digio_template_name !== initialApiData.digio_template_name;

        setIsButtonDisabled(!isDataChanged);
    }, [updateapi, initialApiData]);

    const UpdateApi = async () => {
        try {
            if (!updateapi.digio_client_id || !updateapi.digio_client_secret) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Update Failed',
                    text: 'Please fill all the required fields.',
                    timer: 1500,
                    timerProgressBar: true,
                });
                return;
            }
            const data = {
                id: user_id,
                digio_client_id: updateapi.digio_client_id,
                digio_client_secret: updateapi.digio_client_secret,
                digio_template_name: updateapi.digio_template_name,
            };

            const response = await updateApiinfo(data, token);

            if (response?.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successful!',
                    text: 'Your API information was updated successfully.',
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating the API information. Please try again.',
                timer: 1500,
                timerProgressBar: true,
            });
        }
    };

    const handleSwitchChange = async (event) => {

        const originalChecked = event.target.checked;
        const user_active_status = originalChecked ? 1 : 0;
        const data = { kyc: user_active_status };

        const result = await Swal.fire({
            title: "Do you want to change the status?",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await UpdateKycstatus(data, token);
                if (response.status) {
                    Swal.fire({
                        title: "Success!",
                        text: "Status changed successfully!",
                        icon: "success",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        Swal.close();
                    }, 1000);
                    getApidetail();
                }
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            event.target.checked = !originalChecked;
            getApidetail();
        }
    };


    const handleSwitchChange1 = async (event) => {
        const originalChecked = event.target.checked;
        const user_active_status = originalChecked ? 1 : 0;
        const data = { invoicestatus: user_active_status };

        const result = await Swal.fire({
            title: "Do you want to change the status?",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await Invoicestatus(data, token);
                if (response.status) {
                    Swal.fire({
                        title: "Success!",
                        text: "Status changed successfully!",
                        icon: "success",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        Swal.close();
                    }, 1000);
                    getApidetail();
                }
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            event.target.checked = !originalChecked;
            getApidetail();
        }
    };





    return (
        <div>
            <div className="page-content">
                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Api Information</div>
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

                <div className="row row-cols-12 justify-content-center">
                    <div className="col" >
                        <div className="card">
                            <div className="card-header mt-2">
                                <div className="row justify-content-end mb-3">
                                    <div className="col-md-5">
                                        <h5>Kyc Status</h5>
                                    </div>

                                    <div className="col-md-1 d-flex justify-content-end">
                                        <div className="form-check form-switch form-check-info">
                                            <input
                                                id={`rating_${kycstatus?._id}`}
                                                className="form-check-input toggleswitch"
                                                type="checkbox"
                                                checked={kycstatus?.kyc === 1}
                                                onChange={handleSwitchChange}
                                            />
                                            <label
                                                htmlFor={`rating_${kycstatus?._id}`}
                                                className="checktoggle checkbox-bg"
                                            ></label>
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <h5>Invoice Status</h5>
                                    </div>

                                    <div className="col-md-1 d-flex justify-content-end">
                                        <div className="form-check form-switch form-check-info">
                                            <input
                                                id={`rating_${kycstatus?._id}`}
                                                className="form-check-input toggleswitch"
                                                type="checkbox"
                                                checked={kycstatus?.invoicestatus == 1}
                                                onChange={handleSwitchChange1}
                                            />
                                            <label
                                                htmlFor={`rating_${kycstatus?._id}`}
                                                className="checktoggle checkbox-bg"
                                            ></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header mt-2">
                                <div className="row justify-content-end mb-3">

                                    <h5>Digio API Key</h5>
                                </div>

                            </div>

                            <div className="card-body mt-2">
                                <form className="row g-3 mt-2 mb-3">
                                    <div className="row">
                                        <div className="col-md-12 mb-2">
                                            <label htmlFor="digioTemplateName" className="form-label">
                                                Template Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="digioTemplateName"
                                                disabled={kycstatus?.kyc === 1}
                                                value={updateapi.digio_template_name}
                                                onChange={(e) => setUpdateapi({ ...updateapi, digio_template_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <label htmlFor="digioClientId" className="form-label">
                                                Digio Client ID
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="digioClientId"
                                                disabled={kycstatus?.kyc === 1}
                                                value={updateapi.digio_client_id}
                                                onChange={(e) => setUpdateapi({ ...updateapi, digio_client_id: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <label htmlFor="digioClientSecret" className="form-label">
                                                Digio Client Secret
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="digioClientSecret"
                                                disabled={kycstatus?.kyc === 1}
                                                value={updateapi.digio_client_secret}
                                                onChange={(e) => setUpdateapi({ ...updateapi, digio_client_secret: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer text-end">
                                <button
                                    type="button"
                                    className="btn btn-primary mb-2"
                                    onClick={UpdateApi}
                                    disabled={isButtonDisabled || kycstatus.kyc === 1}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apiinfo;
