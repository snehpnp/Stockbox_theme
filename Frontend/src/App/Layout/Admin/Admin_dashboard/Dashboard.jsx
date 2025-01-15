import React, { useEffect, useState } from 'react'
import { getDashboarddetail, getExpiryByMonth } from '../../../Services/Admin/Admin';
import { GetClient } from '../../../Services/Admin/Admin';
import { fDateTime, fDateMonth } from '../../../../Utils/Date_formate';
import Table from '../../../Extracomponents/Table';
import { Link } from 'react-router-dom';
import Dashboard from '../../../components/Dashboard/DashbaordMain';


const Dashbord = () => {

    useEffect(() => {
        getdetail()
        getAdminclient()
        getExpirydata()
    }, [])


    const token = localStorage.getItem('token');

    const [data, setData] = useState([])
    const [clients, setClients] = useState([]);
    const [monthexpiry, setMonthexpiry] = useState([]);

    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const getdetail = async () => {
        try {
            const response = await getDashboarddetail(token);
            if (response.status) {

                setData(response.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
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
    }






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
            name: 'Created At',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },

    ];



    return (
        <div>
<Dashboard />
            <div className="page-content">
                <div className="row newbg">
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-moonlit">
                            <Link to="/admin/planexpirymonth">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">
                                            {monthexpiry?.length > 0
                                                ? monthexpiry?.some((item) => fDateMonth(item.month) === currentMonthYear)
                                                    ? monthexpiry.reduce((acc, item) => {
                                                        return fDateMonth(item.month) === currentMonthYear
                                                            ? acc + (item.noofclient || 0)
                                                            : acc;
                                                    }, 0)
                                                    : 0
                                                : 0}
                                        </h5>

                                        <div className="ms-auto">
                                            <i className="bx bx-user-plus fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Current Month Active License</p>
                                        <p className="mb-0 ms-auto">
                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/client" className="text-decoration-none">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">
                                            {data.clientCountTotal && data.clientCountTotal}
                                        </h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-user fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Clients</p>
                                        <p className="mb-0 ms-auto">
                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-ohhappiness">
                            <Link to="/admin/client" state={{ clientStatus: 1 }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.clientCountActive && data.clientCountActive}</h5>
                                        <div className="ms-auto">
                                            <i className="fadeIn animated bx bx-user-circle fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Active Clients</p>
                                        <p className="mb-0 ms-auto">

                                            <span>

                                                <i className="bx bx-up-arrow-alt text-white" />


                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-ibiza">
                            <Link to="/admin/client" state={{ clientStatus: 0 }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.clientCountTotal - data.clientCountActive}</h5>
                                        <div className="ms-auto">
                                            <i className="fadeIn animated bx bx-user-x fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Deactive Clients</p>
                                        <p className="mb-0 ms-auto">

                                            <span>

                                                <i className="bx bx-up-arrow-alt text-white" />                                        </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-moonlit ">
                            <Link to="/admin/signal" state={{ clientStatus: "todayopensignal" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.todayOpenSignal && data.todayOpenSignal}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Today's Open Signal</p>
                                        <p className="mb-0 ms-auto">

                                            <span>



                                                <i className="bx bx-up-arrow-alt text-white" />

                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-ibiza ">
                            <Link to="/admin/closesignal" state={{ clientStatus: "todayclosesignal" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.todayCloseSignal && data.todayCloseSignal}</h5>
                                        <div className="ms-auto">
                                            <i className="fadeIn animated bx bx-wifi-off fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Today's Close Signal</p>
                                        <p className="mb-0 ms-auto">

                                            <span>


                                                <i className="bx bx-up-arrow-alt text-white" />

                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-ohhappiness">
                            <Link to="/admin/signal">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.OpensignalCountTotal && data.OpensignalCountTotal}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bxl-redux fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Open Signals</p>
                                        <p className="mb-0 ms-auto">

                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/closesignal">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.CloseSignalCountTotal && data.CloseSignalCountTotal}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Close Signals </p>
                                        <p className="mb-0 ms-auto">

                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/client" state={{ clientStatus: "active" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.activePlanclient && data.activePlanclient}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Plan Active Clients </p>
                                        <p className="mb-0 ms-auto">

                                            <span>

                                                <i className="bx bx-up-arrow-alt text-white" />

                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/client" state={{ clientStatus: "expired" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.inActivePlanclient && data.inActivePlanclient}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Plan Expired </p>
                                        <p className="mb-0 ms-auto">

                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />

                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/freeclient" state={{ clientStatus: "active" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.activeFreetrial && data.activeFreetrial}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Active Free Clients</p>
                                        <p className="mb-0 ms-auto">

                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card radius-10 bg-gradient-deepblue">
                            <Link to="/admin/freeclient" state={{ clientStatus: "expired" }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <h5 className="mb-0 text-white">{data.inActiveFreetrial && data.inActiveFreetrial}</h5>
                                        <div className="ms-auto">
                                            <i className="bx bx-wifi-2 fs-3 text-white" />
                                        </div>
                                    </div>
                                    <div
                                        className="progress my-2 bg-opacity-25 bg-white"
                                        style={{ height: 4 }}
                                    >
                                        <div
                                            className="progress-bar bg-white"
                                            role="progressbar"
                                            style={{ width: "55%" }}
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center text-white">
                                        <p className="mb-0">Total Inactive Free Clients</p>
                                        <p className="mb-0 ms-auto">

                                            <span>
                                                <i className="bx bx-up-arrow-alt text-white" />
                                                {/* <i className="bx bx-up-arrow-alt" /> */}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card radius-10">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div>
                                <h5 className="mb-0">Recent Clients</h5>
                            </div>

                        </div>
                        <hr />

                        <div className="table-responsive d-flex justify-content-center">
                            <Table

                                columns={columns}
                                data={clients}
                            />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashbord
