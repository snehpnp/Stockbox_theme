import axios from 'axios';
import * as Config from "../../../Utils/config"

export async function GetPastPerformance(data) {
    const { token, userId } = data;
    try {
        const res = await axios.get(`${Config.base_url}api/list/past-performance/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        return res?.data;
    } catch (err) {
        console.log('Error fetching past performance:', err);
        throw err;
    }
}


export async function GetPrivacyPolicy(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/content/66dbef118b3cf3e8cf23a988`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        return res?.data;
    } catch (err) {
        console.log('Error fetching privacy policy data:', err);
        throw err;
    }
}




export async function getTermsCondition(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/content/66dbec0a9f7a0365f1f4527d`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        return res?.data;
    } catch (err) {
        console.log('Error fetching Terms Condition data:', err);
        throw err;
    }
}

export async function getFaq(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/faq`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        return res?.data;
    } catch (err) {
        console.log('Error fetching Faq data:', err);
        throw err;
    }
}




export async function getMySubscription(id, token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/myplan/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return res?.data;
    } catch (err) {
        console.log('Error fetching plan data:', err);
        throw err;
    }
}




// get service data 

export async function GetServicedata(token) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/service`, {
            headers: {
                'Authorization': `${token}`
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
                'Authorization': `${token}`
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
                'Authorization': `${token}`
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
                'Authorization': `${token}`
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
                'Authorization': `${token}`
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
        const res = await axios.post(`${Config.base_url}api/list/addplansubscription`, data, {
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


// FOR APPLY COUPON 

export async function ApplyCoupondata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}api/list/applycoupon`, data, {
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