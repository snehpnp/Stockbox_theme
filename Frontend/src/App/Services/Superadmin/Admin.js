import axios from 'axios';
import * as Config from "../../../Utils/config";






// get change password api 

export async function ChangePassword(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}user/change-password`, data, {
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


//  forget api 

export async function ForgetPasswordApi(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}user/forgot-password`, data, {
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


// get dasboard api 

export async function getDashboarddetail(token) {

    try {
        const res = await axios.get(`${Config.base_url}dashboard/getcount`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return { error: err.response?.data || err.message };
    }
}


// get company list 

// get list for staaf
export async function GetCompanylist(token) {
    try {
        const res = await axios.get(`${Config.base_url}company/list`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return err;
    }
}





// update company status

export async function UpdateCompanyStatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}company/change-status`, data, {
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



// delete company

export async function deleteCompany(_id, token) {
    try {
        const res = await axios.get(`${Config.base_url}company/delete/${_id}`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return { error: err.response?.data || err.message };
    }
}



// update company data 

// update company status

export async function Updatecompanydata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}company/update`, data, {
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


// add company data 

export async function AddComapanydata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}company/add`, data, {
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


// company detail

// delete company

export async function CompanyDetailbyadmin(_id, token) {
    try {
        const res = await axios.get(`${Config.base_url}company/clientlist/${_id}`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return { error: err.response?.data || err.message };
    }
}