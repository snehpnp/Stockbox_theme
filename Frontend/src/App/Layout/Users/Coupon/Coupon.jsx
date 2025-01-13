import React from 'react';
import Content from "../../../components/Contents/Content";

const Coupon = () => {
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Coupon code "${code}" copied to clipboard!`);
    };

    return (
        <div>

       <Content
      Page_title="Coupons"
      button_title="Add Basket"
      button_status={true}
       backbutton_title="Back"
      backbutton_status={true}
    >
          <div className="page-content">
               

                <div className="card radius-5">
                    <div className="card-body">
                        <ul className="list-unstyled">
                            {/* Coupon Item */}
                            {["SUPERHIT", "MEGADEAL", "SAVE20"].map((coupon, index) => (
                                <li className="d-flex align-items-center border-bottom pb-2" key={index}>
                                    <img
                                        src="assets/images/avatars/avatar-8.png"
                                        className="rounded-circle p-1 border"
                                        width={70}
                                        height={70}
                                        alt="..."
                                    />
                                    <div className="flex-grow-1 ms-3">
                                    <p className='mb-2'>
                                            <strong>Segment Name:</strong> Premium Members
                                        </p>
                                        <h5 className="mt-0 mb-1">
                                            Unlock Unbeatable Exclusive redDeals!
                                            <span className="c-offer"> 20% OFF</span>
                                        </h5>
                                        <p className="use-cod">
                                            Use code <span>{coupon}</span> | Valid till 31 Dec |{" "}
                                            <a href="#">T&amp;C</a>
                                        </p>
                                        
                                    </div>
                                    <button
                                        type="button"
                                        className=" btn btn-outline-secondary px-5"
                                        onClick={() => handleCopyCode(coupon)}
                                    >
                                        <i className='bx bx-copy'></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
    </Content>
          
        </div>
    );
};

export default Coupon;
