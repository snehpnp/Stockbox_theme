import React, { useState, useEffect } from "react";
import ReusableModal from "../App/components/Models/ReusableModal";
import { BrokerLogin } from "./Brokerintergate";

export const BrokerData = ({ broker_id, userid }) => {

    const [viewModel, setViewModel] = useState(true);
    const [statusinfo, setStatusinfo] = useState({});
    const [showBrokerData, setShowBrokerData] = useState(false);
    const [brokerLoginData, setBrokerLoginData] = useState(null);
    const [loading, setLoading] = useState(false);


    const brokerFieldsMap = {
        1: [
            { key: "signalid", label: "Signal Id", type: "text" },
            { key: "quantity", label: "Quantity", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "tsprice", label: "TS Price", type: "text" },
            { key: "slprice", label: "Sl Price", type: "text" },
            { key: "exitquantity", label: "Exit Quantity", type: "text" }
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

    const handleSave = async () => {
        setLoading(true);
        try {
            const loginData = await BrokerLogin(broker_id, statusinfo, userid);
            setBrokerLoginData(loginData);
            setShowBrokerData(true);
        } catch (error) {
            console.error("Error during broker login", error);
        } finally {
            setLoading(false);
        }
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
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    Save
                                </button>
                                {loading && <div>Loading...</div>}
                                {showBrokerData && brokerLoginData && (
                                    <BrokerLogin
                                        broker_id={broker_id}
                                        broker_data={brokerLoginData}
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
