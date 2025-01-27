import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "./config";




export const BrokerLogin = async ({ broker_id, broker_data }) => {

    console.log("broker_id", broker_id)
    console.log("broker_data", broker_data)

    return
    if (broker_id === "1" || broker_id === 1) {

        if (broker_data) {
            const data = { parent_id: broker_data };
            axios({
                url: `${base_url}api/list/angle/placeorder`,
                method: "post",
                data: data,

            }).then((res) => {
                if (res.data && res.data.data && res.data.data.api_key) {

                    window.location.href = `https://ant.aliceblueonline.com/?appcode=${res.data.data.api_key}`;
                }

            }).catch((error) => {

            });
        }
    }

};


