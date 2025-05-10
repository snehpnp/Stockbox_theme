import React, { useEffect, useState } from 'react'
import { getDashboarddetail, getExpiryByMonth } from '../../../Services/Admin'
import { GetClient } from '../../../Services/Admin';
import { fDateTime, fDateMonth } from '../../../Utils/Date_formate';
import Table from '../../../components/Table';
import { getstaffperuser } from '../../../Services/Admin';
import { Link } from 'react-router-dom';
import Loader from '../../../Utils/Loader';


const Dashbord = () => {


    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    useEffect(() => {
        getdetail()
        getAdminclient()
        getpermissioninfo()
        getExpirydata()
    }, [])


    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [data, setData] = useState([])
    const [clients, setClients] = useState([]);
    const [permission, setPermission] = useState([]);
    const [monthexpiry, setMonthexpiry] = useState([]);

    // state for loader
    const [isLoader, setIsLoader] = useState(true)


    const getdetail = async () => {
        try {
            const response = await getDashboarddetail(token);
            if (response.status) {

                setData(response.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoader(false)
    };



    const getExpirydata = async () => {
        try {
            const response = await getExpiryByMonth(token);
            if (response.status) {
                setMonthexpiry(response.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoader(false)
    };

    const getAdminclient = async () => {
        try {
            const response = await GetClient(token);
            if (response.status) {
                const topClients = response.data.slice(0, 5);
                setClients(topClients);
            }
        } catch (error) {
            console.log("error");
        }
        setIsLoader(false)
    }



    const getpermissioninfo = async () => {
        try {
            const response = await getstaffperuser(userid, token);
            if (response.status) {
                setPermission(response.data.permissions);
            }
        } catch (error) {
            console.log("error", error);
        }
        setIsLoader(false)
    };







    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Full Name',
            selector: row => row.FullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row.Email,
            sortable: true,
            width: '400px',

        },
        {
            name: 'Plan Status',
            cell: row => {
                const hasActive = row?.plansStatus?.some(item => item.status === 'active');
                const hasExpired = row?.plansStatus?.some(item => item.status === 'expired');

                let statusText = 'N/A';
                let color = 'red';

                if (hasActive) {
                    statusText = 'Active';
                    color = 'green';
                } else if (hasExpired) {
                    statusText = 'Expired';
                    color = 'orange';
                }

                return (
                    <span style={{ color }}>
                        {statusText}
                    </span>
                );
            },
            sortable: true,
            width: '200px',
        },

        {
            name: 'Client Segment',
            cell: row => (
                <>
                    {Array.isArray(row?.plansStatus) && row.plansStatus.length > 0 ? (
                        row.plansStatus.map((item, index) => (
                            <span
                                key={index}
                                style={{
                                    color: item.status === 'active' ? 'green' : item.status === 'expired' ? 'red' : 'inherit',
                                    marginRight: '5px',
                                }}
                            >
                                {item.serviceName || "N/A"}
                            </span>
                        ))
                    ) : (
                        <span>N/A</span>
                    )}
                </>
            ),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Phone No',
            selector: row => row.PhoneNo,
            sortable: true,
            width: '200px',
        },


        {
            name: 'Created By',
            selector: row => row.addedByDetails?.FullName ?? (row.clientcome === 1 ? "WEB" : "APP"),
            sortable: true,
            width: '165px',
        },

        {
            name: 'CreatedAt',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },

    ];



    return (
        <div>
            {isLoader ? (
                <Loader />
            ) : (<>

                <div className="page-content">

                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <h5 className="mb-0">Recent Client</h5>
                                </div>

                            </div>
                            <hr />

                            {permission.includes("viewclient") ? <Table
                                columns={columns}
                                data={clients}
                            /> : ""}

                        </div>
                    </div>

                </div>

            </>)}

        </div>
    )
}

export default Dashbord
