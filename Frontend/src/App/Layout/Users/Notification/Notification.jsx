import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { GetCouponlist } from '../../../Services/UserService/User';
import { fa_time } from '../../../../Utils/Date_formate';
import Swal from 'sweetalert2';
import { Bell } from 'lucide-react';

const Notification = () => {



    return (
        <div>
        <Content
          Page_title="Notification"
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
                    width: "40px",
                    height: "40px",
                 
                    textAlign: "center",
                  }}
                >
                   <Bell/>
                </div>
  
                <div className="flex-grow-1 ms-sm-3">
                 
                  <h6 className="mt-0 mb-1">
                    Unlock Unbeatable Exclusive redDeals!
                  </h6>
                 
                </div>
              </li>
              <li
                className=" d-sm-flex align-items-center border-bottom py-2"
                
              >
                <div
                  className="rounded-circle p-1 border d-flex align-items-center justify-content-center btn-primary"
                  style={{
                    width: "40px",
                    height: "40px",
                  
                    textAlign: "center",
                  }}
                >
                   <Bell/>
                </div>
  
                <div className="flex-grow-1 ms-sm-3">
                 
                  <h6 className="mt-0 mb-1">
                    Unlock Unbeatable Exclusive redDeals!
                  </h6>
                 
                </div>
              </li>
              <li
                className=" d-sm-flex align-items-center border-bottom py-2"
                
              >
                <div
                  className="rounded-circle p-1 border d-flex align-items-center justify-content-center btn-primary"
                  style={{
                    width: "40px",
                    height: "40px",
                    
                    textAlign: "center",
                  }}
                >
                   <Bell/>
                </div>
  
                <div className="flex-grow-1 ms-sm-3">
                 
                  <h6 className="mt-0 mb-1">
                    Unlock Unbeatable Exclusive redDeals!
                  </h6>
                 
                </div>
              </li>
            </ul>
          </div>
        </Content>
      </div>
    );
};

export default Notification;
