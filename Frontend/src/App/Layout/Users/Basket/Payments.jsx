import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { HandCoins } from "lucide-react";
import { useLocation } from "react-router-dom";
import { loadScript } from "../../../../Utils/Razorpayment";
import { AddBasketsubscription, getQRcodedata, getBankdetaildata } from "../../../Services/UserService/User";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import { image_baseurl } from "../../../../Utils/config";

const Payments = () => {

    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");


    const [activeTab, setActiveTab] = useState("online");

    const { state } = useLocation()
    const item = state?.item


    const [getkey, setGetkey] = useState([]);
    const [company, setCompany] = useState([]);
    const [bankdetail, setBankdetail] = useState([]);
    const [qrdata, setQrdata] = useState([]);

    useEffect(() => {
        getkeybydata()
        getQRimage()
        getbankdata()
    }, [])


    const getQRimage = async () => {
        try {
            const response = await getQRcodedata();
            if (response.status) {
                setQrdata(response?.data)

            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    const getbankdata = async () => {
        try {
            const response = await getBankdetaildata();
            if (response.status) {
                setBankdetail(response?.data)

            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };



    const getkeybydata = async () => {
        try {
            const response = await basicsettinglist();
            if (response.status) {
                setGetkey(response?.data[0]?.razorpay_key);
                setCompany(response?.data[0]?.from_name);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };



    const AddbasketSubscribeplan = async (item) => {
        try {

            if (!window.Razorpay) {
                await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            }
            const options = {
                key: getkey,
                amount: item?.basket_price * 100,
                name: company,
                currency: "INR",
                title: item?.title || "Subscription Basket",
                handler: async function (response1) {
                    const data = {
                        basket_id: item?._id,
                        client_id: userid,
                        price: item?.basket_price,
                        discount: response1?.orderid,
                        orderid: response1?.orderid,

                    };

                    try {
                        const response2 = await AddBasketsubscription(data, token);
                        if (response2?.status) {
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error("Error while adding plan subscription:", error);
                    }
                },
                prefill: {

                },
                theme: {
                    color: "#F37254",
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Subscription error:", error);
        }
    };





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
                            <div className="card-header"><HandCoins className="me-2 btn-primary p-1 rounded" />your total saving is off ₹ {Number(item?.full_price) - Number(item?.basket_price)}</div>
                            <div className="card-body">
                                <div className="d-md-flex justify-content-between">
                                    <h6 className="card-title mb-0"><strong>{item?.title}</strong></h6>
                                    <h6 className="card-title mb-0"><strong>₹10,000</strong></h6>
                                </div>

                                <p className="mt-1">

                                    - validity {item?.validity}
                                </p>
                                <button className="btn btn-primary w-100" onClick={() => { AddbasketSubscribeplan(item) }} >Subscribe Now <span className="text-decoration-line-through btn btn-primary ">₹ {item?.full_price}</span> ₹ {item?.basket_price}</button>
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
                                {qrdata.length > 0 &&
                                    qrdata.map((item, index) => {
                                        return (
                                            <div key={index} className="text-center">
                                                <h5 className="card-title btn-primary py-2">Scan to Pay</h5>
                                                <img
                                                    src={item?.image}
                                                    alt="QR Code"
                                                    title="QR Code"
                                                    className="img-fluid mb-3"
                                                    style={{ width: 200, height: 200 }}
                                                />
                                            </div>
                                        );
                                    })}




                                {bankdetail?.map((item) => {
                                    return (
                                        <>
                                            <h5 className="btn-primary py-2">Bank Details:</h5>
                                            <ul className="ps-0">
                                                <li className="list-group-item d-flex justify-content-between"> <b>Account Name:</b> {item?.name} </li>
                                                <li className="list-group-item d-flex justify-content-between">  <b>Account Number:</b> {item?.accountno}</li>
                                                <li className="list-group-item d-flex justify-content-between">  <b>IFSC Code:</b> {item?.ifsc}</li>

                                            </ul>


                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Content>
    );
};

export default Payments;
