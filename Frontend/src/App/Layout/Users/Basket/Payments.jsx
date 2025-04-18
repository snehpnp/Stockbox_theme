import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { HandCoins } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadScript } from "../../../../Utils/Razorpayment";
import { AddBasketsubscription, getQRcodedata, getBankdetaildata } from "../../../Services/UserService/User";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import { image_baseurl } from "../../../../Utils/config";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";

const Payments = () => {

    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
    const navigate = useNavigate();
    const location = useLocation();
    const key = location?.state?.key;
    const { state } = useLocation()
    const item = state?.item
    const [activeTab, setActiveTab] = useState("online");
    const [allKey, setAllKey] = useState([])
    const [bankdetail, setBankdetail] = useState([]);
    const [qrdata, setQrdata] = useState([]);



    useEffect(() => {
        getkeybydata()
        getQRimage()
        getbankdata()
    }, [])

    useEffect(() => {
        if (location.state?.key) {
            setActiveTab("offline");
        }
    }, [location.state?.key]);


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
                setAllKey(response.data[0])
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

            const price = item?.basket_price;
            const finalAmount = Math.round(price * (1 + allKey?.gst / 100) * 100);

            const options = {
                key: allKey.razorpay_key,
                amount: finalAmount,
                name: allKey.from_name,
                currency: "INR",
                title: item?.title || "Subscription Basket",
                handler: async function (response1) {
                    const data = {
                        basket_id: item?._id,
                        client_id: userid,
                        price: finalAmount,
                        discount: 0,
                        orderid: response1?.razorpay_order_id || "",
                        coupon: "",
                    };

                    try {
                        const response2 = await AddBasketsubscription(data, token);
                        if (response2?.status) {
                            navigate("/user/basket")
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error("Error while adding plan subscription:", error);
                    }
                },
                prefill: {},
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

    useEffect(() => {
        if (allKey?.paymentstatus === 0 && activeTab === "online") {
            setActiveTab("offline");
        }
    }, [allKey?.paymentstatus, activeTab]);


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

                {!key && allKey?.paymentstatus === 1 && (
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "online" ? "active btn-primary" : ""}`}
                            onClick={() => setActiveTab("online")}
                        >
                            Pay Online
                        </button>
                    </li>
                )}


                {allKey?.officepaymenystatus === 1 && (
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "offline" ? "active btn-primary" : ""}`}
                            onClick={() => setActiveTab("offline")}
                        >
                            Pay Offline
                        </button>
                    </li>
                )}
            </ul>

            {!key && activeTab === "online" && allKey?.paymentstatus === 1 && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><HandCoins className="me-2 btn-primary p-1 rounded" />Your total saving is off ₹ {Number(item?.full_price) - Number(item?.basket_price)}</div>
                            <div className="card-body">
                                <div className="d-md-flex justify-content-between py-2">
                                    <h6 className="card-title mb-0"><strong>Validity</strong></h6>
                                    <h6 className="card-title mb-0"><strong>{item?.validity} Month</strong></h6>
                                </div>
                               
                                <div className="d-md-flex justify-content-between py-2">
                                    <h6 className="card-title mb-0"><strong>GST ({allKey?.gst}%)</strong></h6>
                                    <h6 className="card-title mb-0"><strong>₹ {(((item?.basket_price) * allKey?.gst) / 100).toFixed(2)}</strong></h6>
                                </div>
                                <div className="d-md-flex justify-content-between py-2 pb-3">
                                    <h6 className="card-title mb-0"><strong>Grand Total</strong></h6>
                                    <h6 className="card-title mb-0">
                                        <strong>
                                            ₹ {(
                                                allKey?.gststatus === 1
                                                    ? item?.basket_price + (item?.basket_price * allKey?.gst) / 100
                                                    : item?.basket_price
                                            ).toFixed(2)}
                                        </strong>
                                    </h6>
                                </div>

                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => AddbasketSubscribeplan(item)}
                                >
                                    Subscribe Now
                                    <span className="text-decoration-line-through text-light small mx-2">
                                        ₹ {item?.full_price}
                                    </span>
                                    ₹ {(allKey?.gstStatus === 1
                                        ? (item?.basket_price + (item?.basket_price * allKey?.gst) / 100)
                                        : item?.basket_price
                                    ).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {allKey?.officepaymenystatus === 1 && activeTab === "offline" && (
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
                                                <li className="list-group-item d-flex justify-content-between">  <b>Branch Name :</b> {item?.branch}</li>

                                            </ul>


                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </Content >
    );
};

export default Payments;
