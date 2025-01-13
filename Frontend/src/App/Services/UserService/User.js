import axios from 'axios';
import * as Config from "../Utils/config";

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
        console.error('Error fetching past performance:', err);
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
        console.error('Error fetching privacy policy data:', err);
        throw err;
    }
}

export async function getTermsCondition(token)
{
    try{
        const res= await axios.get(`${Config.base_url}api/list/content/66dbec0a9f7a0365f1f4527d`,
            {
                headers: {
                    "Authorization":`Bearer ${token}`
                }
            });
            
            return res?.data;
        } catch (err) {
            console.error('Error fetching Terms Condition data:', err);
            throw err;
        }
    }

    export async function getFaq(token)
{
    try{
        const res= await axios.get(`${Config.base_url}api/list/faq`,
            {
                headers: {
                    "Authorization":`Bearer ${token}`
                }
            });
            
            return res?.data;
        } catch (err) {
            console.error('Error fetching Faq data:', err);
            throw err;
        }
    }

export async function getMySubscription(token, id) {
    try {
        const res = await axios.get(`${Config.base_url}api/list/myplan/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return res?.data;
    } catch (err) {
        console.error('Error fetching plan data:', err);
        throw err;
    }
}