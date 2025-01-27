import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "./config";




export const BrokerLogin = async (broker_id, statusinfo, userid) => {


    if (broker_id == 1) {
        if (statusinfo) {
            const data = {
                id: userid,
                signalid: statusinfo.signalid,
                quantity: statusinfo.quantity,
                price: statusinfo.price,
                tsprice: statusinfo.tsprice,
                tsstatus: statusinfo.tsstatus,
                slprice: statusinfo.slprice,
                exitquantity: statusinfo.exitquantity
            };
            axios({
                url: `${base_url}angle/placeorder`,
                method: "post",
                data: data,

            }).then((res) => {
                if (res.data && res.data.data && res.data.data.api_key) {
                    window.location.href = `https://ant.aliceblueonline.com/?appcode=${res.data.data.api_key}`;
                }

            }).catch((error) => {
                console.log("server error")
            });
        }
    }

};


