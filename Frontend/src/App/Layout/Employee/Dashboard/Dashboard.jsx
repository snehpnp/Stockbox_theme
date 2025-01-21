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
                <div className="row newbg">
                    <div className="col-md-3">
                    <div className="card radius-10 bg-gradient-moonlit">
                            <Link to="/staff/planexpirymonth">
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
                            <Link to="/staff/client" className="text-decoration-none">
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
                            <Link to="/staff/client" state={{ clientStatus: 1 }}>
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
                                        <p className="mb-0">Total Active Client</p>
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
                            <Link to="/staff/client" state={{ clientStatus: 0 }}>
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
                                        <p className="mb-0">Total Deactive Client</p>
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
                            <Link to="/staff/signal" state={{ clientStatus: "todayopensignal" }}>
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
                                        <p className="mb-0">Todays Open Signal</p>
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
                            <Link to="/staff/closesignal" state={{ clientStatus: "todayclosesignal" }}>
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
                                        <p className="mb-0">Todays Close Signal</p>
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
                            <Link to="/staff/signal">
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
                                        <p className="mb-0">Total Open Signal</p>
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
                            <Link to="/staff/closesignal">
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
                                        <p className="mb-0">Total Close Signal </p>
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
                            <Link to="/staff/client" state={{ clientStatus: "active" }}>
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
                                        <p className="mb-0">Total Plan Active Client </p>
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
                            <Link to="/staff/client" state={{ clientStatus: "expired" }}>
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
                            <Link to="/staff/freeclient" state={{ clientStatus: "active" }}>
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
                                        <p className="mb-0">Total Active Free Client</p>
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
                            <Link to="/staff/freeclient" state={{ clientStatus: "expired" }}>
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
                                        <p className="mb-0">Total InActive Free Client</p>
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
