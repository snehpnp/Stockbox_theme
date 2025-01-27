import React, { useState } from "react";
import ReusableModal from "../App/components/Models/ReusableModal";
import { BrokerLogin } from "./Brokerintergate";

export const BrokerData = ({ broker_id }) => {
    const [viewModel, setViewModel] = useState(true);
    const [statusinfo, setStatusinfo] = useState({});
    const [showBrokerData, setShowBrokerData] = useState(false);

    const brokerFieldsMap = {
        1: [
            { key: "name", label: "Broker Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
        ],
        2: [
            { key: "name", label: "Broker Name", type: "text" },
            { key: "phone", label: "Phone Number", type: "tel" },
            { key: "location", label: "Location", type: "text" },
        ],
        3: [
            { key: "company", label: "Company Name", type: "text" },
            { key: "license", label: "License Number", type: "text" },
        ],
    };

    const fields = brokerFieldsMap[broker_id] || [];

    const handleFieldChange = (key, value) => {
        setStatusinfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };


    return (
        <ReusableModal
            show={viewModel}
            onClose={() => setViewModel(false)}
            title={<span>Broker Details</span>}
            body={
                <>
                    <div className="modal-body">
                        <form>
                            {fields.map((field, index) => (
                                <div key={index} className="mb-3">
                                    <label>{field.label}</label>
                                    <input
                                        type={field.type || "text"}
                                        className="form-control"
                                        value={statusinfo[field.key] || ""}
                                        onChange={(e) =>
                                            handleFieldChange(field.key, e.target.value)
                                        }
                                    />
                                </div>
                            ))}

                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => { setShowBrokerData(true) }}
                                >
                                    Save
                                </button>
                                {showBrokerData && (
                                    <BrokerLogin
                                        broker_id={broker_id}
                                        broker_data={statusinfo}
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                </>
            }
        />
    );
};
