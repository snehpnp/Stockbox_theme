import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "./config";



const brokers = [
    {
        id: 1,
        name: "Angel",
        description: "Angel trading platform link.",
        url: "http://stockboxpnp.pnpuniverse.com/backend/angle/getaccesstoken?key=UserDetails",
        additionalInfo: "Yeh broker ka angle-specific API use karta hai.",
        fields: [
            { name: "API Key", type: "text", placeholder: "Enter API Key" },
            { name: "Token", type: "text", placeholder: "Enter Token" },
        ],
    },
    {
        id: 3,
        name: "Zerodha",
        description: "Zerodha trading platform link.",
        url: "https://kite.zerodha.com/",
        additionalInfo: "Yeh broker bahut popular hai trading ke liye.",
        fields: [
            { name: "Client ID", type: "text", placeholder: "Enter Client ID" },
            { name: "Password", type: "password", placeholder: "Enter Password" },
            { name: "2FA Code", type: "text", placeholder: "Enter 2FA Code" },
        ],
    },
];




const BrokerLogin = (Broker_id, UserDetails) => {

    console.log("Broker_id", Broker_id)
    console.log("UserDetails", UserDetails)

    const [selectedBroker, setSelectedBroker] = useState(null);
    const [formState, setFormState] = useState({});
    const [error, setError] = useState("");




    useEffect(() => {
        if (Broker_id) {
            const broker = brokers.find((b) => b.id === Broker_id);
            if (broker) {
                setSelectedBroker(broker);
                setFormState({});
            } else {
                setError("Invalid Broker ID provided.");
            }
        }
    }, [Broker_id]);



    const handleInputChange = (field, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };




    const handleLogin = async () => {

        if (!selectedBroker) {
            setError("Please select a valid broker.");
            return;
        }

        if (!UserDetails?.Role) {
            setError("UserDetails is missing required information.");
            return;
        }

        try {
            if (selectedBroker.id === 1 && UserDetails.Role === "USER") {
                const data = { parent_id: UserDetails.parent_id };

                const response = await axios.post(`${base_url}angle/placeorder`, data);
                if (response.data?.data?.api_key) {
                    window.location.href = `${selectedBroker.url}${response.data.data.api_key}`;
                }
            } else {
                window.location.href = selectedBroker.url;
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Failed to login. Please try again.");
        }
    };





    return (
        <div>
            <h1>Broker Login</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {brokers.map((broker) => (
                    <li key={broker.id}>
                        <button
                            onClick={() => {
                                setSelectedBroker(broker);
                                setFormState({});
                            }}
                            disabled={Broker_id && broker.id !== Broker_id}
                        >
                            {broker.name}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedBroker && (
                <div className="modal">
                    <h2>{selectedBroker.name}</h2>
                    <p>{selectedBroker.description}</p>
                    <p>{selectedBroker.additionalInfo}</p>

                    <form>
                        {selectedBroker.fields.map((field, index) => (
                            <div key={index}>
                                <label>{field.name}:</label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    onChange={(e) =>
                                        handleInputChange(field.name, e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </form>

                    <button onClick={handleLogin}>
                        Login with {selectedBroker.name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrokerLogin;
