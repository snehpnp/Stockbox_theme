import React, { useState, useEffect } from 'react';
import { basicsettinglist, popupdescription, PopUpstatusdata } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PopupDescription = () => {
    const token = localStorage.getItem('token');
    const [clients, setClients] = useState(null);
    const [description, setDescription] = useState("");
    const [initialValues, setInitialValues] = useState({ popupstatus: "" });

    const getApidetail = async () => {
        try {
            const response = await basicsettinglist(token);
            if (response?.status && response?.data?.length) {
                const clientData = response.data[0];
                setClients(clientData);
                setInitialValues(clientData);
                setDescription(clientData.popupcontent);
            }
        } catch (error) {
            console.error('Error fetching API details:', error);
        }
    };

    useEffect(() => {
        getApidetail();
    }, []);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.checked ? 1 : 0;
        const data = { popupstatus: newStatus };
        const confirm = await showCustomAlert("confirm", "Do you want to save the changes?");
        if (confirm) {
            try {
                const response = await PopUpstatusdata(data, token);
                if (response?.status) {
                    showCustomAlert("Success", "Status updated successfully.");
                    getApidetail();
                }
            } catch (error) {
                showCustomAlert("error", "Something went wrong. Please try again.");
            }
        }
    };

    const handleSaveDescription = async () => {
        const data = { popupcontent: description };
        try {
            const response = await popupdescription(data, token);
            if (response?.status) {
                showCustomAlert("Success", "Description updated successfully.");
                getApidetail();
            }
        } catch (error) {
            showCustomAlert("error", "Failed to update description.");
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
        "clean",
    ];

    return (
        <div className="page-content">
            <div className="page-breadcrumb d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Popup Description Setting</div>
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

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Status Card */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header fw-semibold">Pop-up Status</div>
                        <div className="card-body">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={clients?.popupstatus === 1}
                                    onChange={handleStatusChange}
                                    id="popupStatusSwitch"
                                />
                                <label className="form-check-label" htmlFor="popupStatusSwitch">
                                    Enable Pop-up on Site
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header fw-semibold">Pop-up Description</div>
                        <div className="card-body">
                            <ReactQuill
                                value={description}
                                onChange={(value) => setDescription(value)}
                                modules={quillModules}
                                formats={quillFormats}
                                style={{
                                    height: "230px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    padding: "10px",
                                    backgroundColor: "#fff",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                    overflow: "hidden",
                                }}
                            />
                        </div>
                        <div className="card-footer text-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveDescription}
                            >
                                Save Description
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupDescription;
