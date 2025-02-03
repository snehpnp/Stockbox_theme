import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { GetCouponlist } from '../../../Services/UserService/User';
import { fa_time } from '../../../../Utils/Date_formate';
import Swal from 'sweetalert2';
import Loader from '../../../../Utils/Loader';

const Coupon = () => {

    const [coupon, setCoupon] = useState([])
    const [isLoading, setIsLoading] = useState(true)



    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            Swal.fire({
                title: 'Copied!',
                text: `Coupon code "${code}" has been copied to your clipboard.`,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 2000,
            });
        }).catch((err) => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to copy the coupon code. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        });
    };




    const getCoupon = async () => {
        try {
            const response = await GetCouponlist()
            if (response.status) {
                setCoupon(response?.data)
                console.log("response", response.data)
            }
        } catch (error) {

        }
        setIsLoading(false)
    }


    useEffect(() => {
        getCoupon()
    }, [])


    return (
        <div>

            <Content
                Page_title="Coupons"

                button_status={false}
                backbutton_title="Back"
                backbutton_status={false}
            >
                <div className="page-content">

                    {isLoading ? <Loader /> : <ul className="list-unstyled">
                        {coupon &&
                            coupon?.map((item, index) => (
                                <li
                                    className=" d-sm-flex align-items-center border-bottom py-4"
                                    key={index}
                                >
                                    <div
                                        className="rounded-circle p-1 border d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            backgroundColor: '#f0f0f0',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.serviceName}
                                    </div>

                                    <div className="flex-grow-1 ms-sm-3">
                                        <p className="mb-2">
                                            <strong>Segment Name:</strong> {item.serviceName || "Premium Members"}
                                        </p>
                                        <h5 className="mt-0 mb-1">
                                            Unlock Unbeatable Exclusive redDeals!

                                        </h5>
                                        <p className="use-cod">
                                            Use code <span>{item?.code}</span> | Valid till {fa_time(item?.enddate)} {" "}

                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-5"
                                        onClick={() => handleCopyCode(item.code)}
                                    >
                                        <i className="bx bx-copy"></i>
                                    </button>
                                </li>
                            ))}
                    </ul>}


                </div>
            </Content>

        </div>
    );
};

export default Coupon;
