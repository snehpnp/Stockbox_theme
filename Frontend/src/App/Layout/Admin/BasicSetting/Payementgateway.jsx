import React, { useState, useEffect } from 'react';
import { basicsettinglist, updatePayementgateway, UpdatePaymentstatus, UpdatePaymentGSTstatus, UpdateGST } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const Payementgateway = () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('id');

    const [clients, setClients] = useState(null);
    const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(false);

    const [addgst, setAddgst] = useState("");

    const [initialValues, setInitialValues] = useState({
        razorpay_secret: "",
        razorpay_key: "",
        paymentstatus: "",
        officepaymenystatus: "",
        gststatus: ""
    });



    const [updateapi, setUpdateapi] = useState(initialValues);

    const getApidetail = async () => {
        try {
            const response = await basicsettinglist(token);
            if (response?.status && response?.data?.length) {
                const clientData = response.data[0];
                setClients(clientData);
                setInitialValues(clientData);
                setUpdateapi(clientData);
                setOnlinePaymentEnabled(clientData.paymentstatus === 1);
                setAddgst(clientData.gst)
            }
        } catch (error) {
            console.log('Error fetching API details:', error);
        }
    };

    useEffect(() => {
        getApidetail();
    }, []);

    const hasChanges = () =>
        JSON.stringify(initialValues) !== JSON.stringify(updateapi);

    const handleInputChange = (field, value) => {
        setUpdateapi((prev) => ({ ...prev, [field]: value }));
    };



    const handleSwitchChange = async (event, type) => {
        const user_active_status = event.target.checked ? 1 : 0;
        const data =
            type === "paymentstatus"
                ? { paymentstatus: user_active_status, officepaymenystatus: clients?.officepaymenystatus }
                : { paymentstatus: clients?.paymentstatus, officepaymenystatus: user_active_status };
        const result = await showCustomAlert("confirm", "Do you want to save the changes?")

        if (result.isConfirmed) {
            try {
                const response = await UpdatePaymentstatus(data, token);
                if (response?.status) {
                    showCustomAlert("Success", "Status Changed")
                    setOnlinePaymentEnabled(user_active_status === 1);
                    getApidetail();
                }
            } catch (error) {
                showCustomAlert("error", "There was an error processing your request.")

            }
        }
    };


    const UpdateApi = async () => {
        try {
            if (!updateapi.razorpay_key.trim() || !updateapi.razorpay_secret.trim()) {
                showCustomAlert("error", 'Please fill all the required fields.')
                return;
            }

            const data = { ...updateapi, id: user_id };
            const response = await updatePayementgateway(data, token);
            if (response?.status) {
                showCustomAlert("Success", 'Your API information was updated successfully.')
                setInitialValues(updateapi);
            }
        } catch (error) {
            showCustomAlert("error", 'There was an error updating the API information. Please try again.')

        }
    };



    const SwitchField = ({ label, checked, onChange }) => (
        <div className="col-md-6 d-flex justify-content-between align-items-center mb-3">
            <label className="form-label">{label}</label>
            <div className="form-check form-switch form-check-info">
                <input
                    className="form-check-input toggleswitch"
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
            </div>
        </div>
    );



    const GSThandleSwitchChange = async (event) => {
        const user_active_status = event.target.checked ? 1 : 0;
        const data = { gststatus: user_active_status }
        const result = await showCustomAlert("confirm", "Do you want to save the changes?")
        if (result.isConfirmed) {
            try {
                const response = await UpdatePaymentGSTstatus(data, token);
                if (response?.status) {
                    showCustomAlert("Success", "Status Changed")
                    getApidetail();
                }
            } catch (error) {
                showCustomAlert("error", "There was an error processing your request.")

            }
        }
    };



    const UpdateGstdata = async () => {
        try {
            const data = { gst: addgst };
            const response = await UpdateGST(data, token);
            if (response?.status) {
                showCustomAlert("Success", 'GST updated successfully.');
                getApidetail();
            }
        } catch (error) {
            showCustomAlert("error", 'There was an error updating GST. Please try again.');
        }
    };




    return (
        <div className="page-content">
            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Payment Gateway Detail</div>
                <nav aria-label="breadcrumb" className="ps-3">
                    <ol className="breadcrumb mb-0 p-0">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard">
                                <i className="bx bx-home-alt" />
                            </Link>
                        </li>
                    </ol>
                </nav>
            </div>
            <hr />
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card mb-4">
                        <div className="card-header">Payment Status</div>
                        <div className="card-body">
                            <form className="row">
                                <SwitchField
                                    label="Online Payment Status"
                                    checked={onlinePaymentEnabled}
                                    onChange={(e) => handleSwitchChange(e, "paymentstatus")}
                                />
                                <SwitchField
                                    label="Offline Payment Status"
                                    checked={clients?.officepaymenystatus === 1}
                                    onChange={(e) => handleSwitchChange(e, "officepaymenystatus")}
                                />
                                <SwitchField
                                    label="GST Status"
                                    checked={clients?.gststatus === 1}
                                    // onChange={(e) => GSThandleSwitchChange(e)}
                                    onChange={()=>showCustomAlert("error","cannot change status")}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">GST %</div>
                        <div className="card-body">
                            <form className="row">
                                <div className="col-md-12 d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control me-2"
                                        id="gst"
                                        value={addgst}
                                        // onChange={(e) => setAddgst(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled
                                        // onClick={UpdateGstdata}
                                    >
                                        Update
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-header">Razorpay</div>
                        <div className="card-body">
                            <form className="row">
                                <label>Razorpay Key</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="razorpay_key"
                                    value={updateapi.razorpay_key}
                                    onChange={(e) => handleInputChange("razorpay_key", e.target.value)}
                                    disabled={onlinePaymentEnabled}
                                />

                                <label>Razorpay Secret Key</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="razorpay_secret"
                                    value={updateapi.razorpay_secret}
                                    onChange={(e) => handleInputChange("razorpay_secret", e.target.value)}
                                    disabled={onlinePaymentEnabled}
                                />
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={UpdateApi}
                                disabled={!hasChanges()}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payementgateway;
