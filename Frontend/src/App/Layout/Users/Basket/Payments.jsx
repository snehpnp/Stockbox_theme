import React, { useState } from "react";
import Content from "../../../components/Contents/Content";
import { HandCoins } from "lucide-react";

const Payments = () => {
    const [activeTab, setActiveTab] = useState("online");

    return (
        <Content
            Page_title="Payment"
            button_title="Add Basket"
            backbutton_title="back"
            button_status={false}
            backbutton_status={false}
            backForword={true}
        >
            <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "online" ? "active btn-primary" : ""}`}
                        onClick={() => setActiveTab("online")}
                    >
                        Pay Online
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "offline" ? "active btn-primary" : ""}`}
                        onClick={() => setActiveTab("offline")}
                    >
                        Pay Offline
                    </button>
                </li>
            </ul>

            {activeTab === "online" && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <div className="card">
                        <div className="card-header"><HandCoins className="me-2 btn-primary p-1 rounded"/>your total saving is off ₹2,000</div>
                            <div className="card-body">
                            <div className="d-md-flex justify-content-between">
                            <h6 className="card-title mb-0"><strong>Premium Investment Plan</strong></h6>
                            <h6 className="card-title mb-0"><strong>₹10,000</strong></h6>
                            </div>
                               
                                <p className="mt-1">
                                    
                                    - validity 3 months 
                                </p>
                                <button className="btn btn-primary w-100">Subscribe Now <span className="text-decoration-line-through">₹10,000</span> ₹10,000</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "offline" && (
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body text-center">
                                <h5 className="card-title btn-primary py-2">Scan to Pay</h5>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="img-fluid mb-3"  style={{width:'200px',height:'200px'}}/>
                                <h5 className="btn-primary py-2">Bank Details:</h5>
                                <ul className="ps-0">
                                <li className="list-group-item d-flex justify-content-between"> <b>Account Name:</b>  XYZ Investments </li>
                                <li className="list-group-item d-flex justify-content-between">  <b>Account Number:</b> 1234567890</li>
                                <li className="list-group-item d-flex justify-content-between">  <b>IFSC Code:</b> XYZB0001234</li>

                                </ul>
                               
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Content>
    );
};

export default Payments;
