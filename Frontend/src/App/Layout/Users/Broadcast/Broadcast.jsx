import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { GetCouponlist } from "../../../Services/UserService/User";
import { fa_time } from "../../../../Utils/Date_formate";
import Swal from "sweetalert2";
import { MessageCircleMore } from "lucide-react";

const Broadcast = () => {


  return (
    <div>
      <Content
        Page_title="Broadcast"
        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content">
          <ul className="list-unstyled">
            <li
              className=" d-sm-flex align-items-center border-bottom py-2"
              
            >
              <div
                className="rounded-circle p-1 border d-flex align-items-center justify-content-center btn-primary"
                style={{
                  width: "50px",
                  height: "50px",
                
                  textAlign: "center",
                }}
              >
                 <MessageCircleMore/>
              </div>

              <div className="flex-grow-1 ms-sm-3">
                <p className="mb-2">
                  <strong>From:</strong> Admin
                </p>
                <p className="mt-0 mb-1">
                  Unlock Unbeatable Exclusive redDeals!
                </p>
               
              </div>
            </li>
            <li
              className=" d-sm-flex align-items-center border-bottom py-2"
              
            >
              <div
                className="rounded-circle p-1 border d-flex align-items-center justify-content-center btn-primary"
                style={{
                  width: "50px",
                  height: "50px",
                
                  textAlign: "center",
                }}
              >
                 <MessageCircleMore/>
              </div>

              <div className="flex-grow-1 ms-sm-3">
                <p className="mb-2">
                  <strong>From:</strong> Admin
                </p>
                <p className="mt-0 mb-1">
                  Unlock Unbeatable Exclusive redDeals!
                </p>
               
              </div>
            </li>
          </ul>
        </div>
      </Content>
    </div>
  );
};

export default Broadcast;
