import axios from "axios";
import * as Config from "../../../Utils/config";

export async function GetPastPerformance(data) {
    const { token, userId } = data;
    try {
        const res = await axios.get(
            `${Config.base_url}api/list/past-performance/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        console.log("Error fetching past performance:", err);
        throw err;
    }
}

export async function GetPrivacyPolicy(token) {
    try {
        const res = await axios.get(
            `${Config.base_url}api/list/content/66dbef118b3cf3e8cf23a988`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        console.log("Error fetching privacy policy data:", err);
        throw err;
    }
}

export async function getTermsCondition(token) {
    try {
        const res = await axios.get(
            `${Config.base_url}api/list/content/66dbec0a9f7a0365f1f4527d`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        console.log("Error fetching Terms Condition data:", err);
        throw err;
    }
}

export async function getFaq(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/faq`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        console.log("Error fetching Faq data:", err);
        throw err;
    }
}

export async function getMySubscription(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/myplan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        console.log("Error fetching plan data:", err);
        throw err;
    }
}



export async function getMyBasketSubscription(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/mybasketplan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        console.log("Error fetching plan data:", err);
        throw err;
    }
}




// get service data

export async function GetServicedata(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/service`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// get category  list

export async function GetCategorylist(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/planbycategory`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// get plan list

export async function GETPlanList(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/myplan/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// get plan by category

export async function GetPlanByCategory(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/planbycategory`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// get coupon

export async function GetCouponlist(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/coupon`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// get user detail  



export async function GetUserData(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/client/detail/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// add subscribe plan

export async function AddplanSubscription(data, token) {
    try {
        const res = await axios.post(
            `${Config.base_url}api/list/addplansubscription`,
            data,
            {
                headers: {
                    data: {},
                    Authorization: `${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}

// FOR APPLY COUPON

export async function ApplyCoupondata(data, token) {
    try {
        const res = await axios.post(
            `${Config.base_url}api/list/applycoupon`,
            data,
            {
                headers: {
                    data: {},
                    Authorization: `${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}

// get open client signal

export async function GetSignalClient(data, token) {
    try {
        const res = await axios.post(
            `${Config.base_url}api/list/signalclient`,
            data,
            {
                headers: {
                    data: {},
                    Authorization: `${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}

// close client signal

export async function GetCloseSignalClient(data, token) {
    try {
        const res = await axios.post(
            `${Config.base_url}api/list/closesignalclient`,
            data,
            {
                headers: {
                    data: {},
                    Authorization: `${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}



//help desk api for add

export async function SendHelpRequest(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/addhelpdesk`,
            data,
            {
                headers: {
                    data: {},
                    Authorization: `${token}`,
                },
            }
        );

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}



// get help message 

export async function GetHelpMessage(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/client/helpdesk/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


export async function UpdateBroker(data, token) {
    try {
        let url = "api/client/brokerlink";

        if (data.brokerid == 1 || data.brokerid == 2) {
            url = "api/client/brokerlink";
        } else if (data.brokerid == 3) {
            url = "kotakneo/getaccesstoken";
        } else if (data.brokerid == 4) {
            url = "markethub/getaccesstoken";
        }

        const res = await axios.post(`${Config.base_url}${url}`, data, {
            headers: {
                data: {},
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}



// broker response  


export async function BrokerResponsedata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/orderlist`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}



export async function PlaceOrderApi(data, token, brokerstatus) {
    try {

        let url;
        if (brokerstatus == 1) {
            url = `${Config.base_url}angle/placeorder`;
        } else if (brokerstatus == 2) {
            url = `${Config.base_url}alice/placeorder`;
        } else if (brokerstatus == 3) {
            url = `${Config.base_url}kotakneo/placeorder`;
        } else if (brokerstatus == 4) {
            url = `${Config.base_url}markethub/placeorder`;
        }

        const res = await axios.post(url, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}


// exit place order


export async function ExitPlaceOrderData(data, token, brokerstatus) {
    try {

        let url;
        if (brokerstatus == 1) {
            url = `${Config.base_url}angle/exitplaceorder`;
        } else if (brokerstatus == 2) {
            url = `${Config.base_url}alice/exitplaceorder`;
        } else if (brokerstatus == 3) {
            url = `${Config.base_url}kotakneo/exitplaceorder`;
        } else if (brokerstatus == 4) {
            url = `${Config.base_url}markethub/exitplaceorder`;
        }

        const res = await axios.post(url, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}




export async function UserBasketData(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/baskets`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}


// get service 

export async function GETServiceData(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/myservice/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// refer and earn data 


export async function ReferAndEarnData(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/referearn`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}


// chage client password

export async function ChangePasswordOfclient(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/change-password`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}

export async function UpdateUserProfile(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/update-profile`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;
    }
    catch (err) {
        return err.response?.data || err.message;
    }
}

export async function DeleteClient(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/client/deleteclient/:${data}`, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;

    } catch (err) {
        return err.response?.data || err.message;
    }
}

export async function DeleteDematAccount(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/deletebrokerlink`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },
        });

        return res?.data;

    } catch (err) {
        return err.response?.data || err.message;
    }
}



export async function GetNewsData(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/news`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// /api/list/broadcast

export async function GetBroadcastData(token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/broadcast`, {}, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}



export async function GetNotificationData(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/notification/${data.user_id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// api/list/blogspagination

export async function GetBlogData(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/blogspagination`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// basket order list 

// /api/list/broadcast

export async function Getbasketorderlist(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/basketorderlist`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// withdrw reuest 



export async function GetWithdrawRequest(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/requestpayout`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}



//refer earning 

export async function GetReferEarning(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/referearn`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// get payout 


export async function GetPayoutDetail(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/client/payoutlist`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// basket service


export async function GetBasketService(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/baskets`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}



// basket purchase 


export async function BasketPurchaseList(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/mybasketpurchaselist`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// add basket subscription 

export async function AddBasketsubscription(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/addbasketsubscription`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// basket stock list 

export async function BasketStockListdata(data, token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/basketstock/${data.id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

// get offline qr 


export async function getQRcodedata(token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/qrcode`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// get offline bank  detail 


export async function getBankdetaildata(token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/bank`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// add  stock  place order 

export async function AddStockplaceorder(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/placeorder`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


export async function PortfolioStock(data, token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/myportfolio/${data.id}/${data.clientid}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// get basket rebalance history 

export async function Rebalancehistory(data, token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/basketstocks/${data.id}/${data.clientid}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// version api for history 

export async function getversionhistory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/getbasketversionorder`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}



// get basket rebalance 

export async function RebalanceBasket(data, token) {

    try {
        const res = await axios.get(`${Config.base_url}api/list/basketstockbalance/${data.id}/${data.clientid}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}


// get basket sell 

// version api for history 

export async function GetBasketSell(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/checkbasketsell`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}
