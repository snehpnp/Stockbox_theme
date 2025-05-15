import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetClient } from '../../../Services/Admin/Admin';
// import Table from '../../../components/Table';
import { Settings2, Eye, SquarePen, Trash2, Download, ArrowDownToLine, RefreshCcw } from 'lucide-react';
import { deleteClient, UpdateClientStatus, PlanSubscription, getplanlist, BasketSubscription, BasketAllList, getcategoryplan, getPlanbyUser, DeleteClientHistory, getclientExportfile } from '../../../Services/Admin/Admin';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../Utils/Date_formate';
import { image_baseurl } from '../../../../Utils/config';
import { IndianRupee } from 'lucide-react';
import { exportToCSV } from '../../../../Utils/ExportData';
import Table from '../../../Extracomponents/Table1';



const ClientDeleteHistory = () => {

    useEffect(() => {

        getcategoryplanlist()
    }, []);


    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const location = useLocation();
    const clientStatus = location?.state?.clientStatus;




    const [category, setCategory] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clients, setClients] = useState([]);
    const [planlist, setPlanlist] = useState([]);
    const [basketlist, setBasketlist] = useState([]);
    const [client, setClientid] = useState({});
    const [selectcategory, setSelectcategory] = useState(null)
    const [searchInput, setSearchInput] = useState("");
    const [selectedPlanId, setSelectedPlanId] = useState(null)
    const [ForGetCSV, setForGetCSV] = useState([])
    const [searchkyc, setSearchkyc] = useState("");
    const [statuscreatedby, setStatuscreatedby] = useState("");
    const [expired, setExpired] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [basketdetail, setBasketdetail] = useState({
        plan_id: "",
        client_id: "",
        price: "",
        discount: ""
    });

    const [updatetitle, setUpdatetitle] = useState({
        plan_id: "",
        client_id: "",
        price: ""
    });



    const resethandle = () => {
        setSearchkyc("")
        setSearchInput("")
        setStatuscreatedby("")
        setExpired("")


    }


    useEffect(() => {
        getAdminclient();
    }, [searchInput, searchkyc, statuscreatedby, currentPage, expired]);



    const getexportfile = async () => {
        try {
            const response = await getclientExportfile(token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({
                        FullName: item?.FullName || 'N/A',
                        Email: item?.Email || 'N/A',
                        kyc_verification: item?.kyc_verification === 1 ? "Verified" : "Not Verified",
                        PlanStatus: item?.plansStatus?.some(statusItem => statusItem.status === 'active')
                            ? 'Active'
                            : item?.plansStatus?.some(statusItem => statusItem.status === 'expired')
                                ? 'Expired'
                                : 'N/A',
                        ClientActiveSegment: item?.plansStatus
                            ?.filter(statusItem => statusItem.status === 'active')
                            .map(statusItem => statusItem.serviceName || 'N/A')
                            .join(', ') || 'N/A',
                        ClientExpiredSegment: item?.plansStatus
                            ?.filter(statusItem => statusItem.status === 'expired')
                            .map(statusItem => statusItem.serviceName || 'N/A')
                            .join(', ') || 'N/A',
                        CreatedBy: item?.addedByDetails?.FullName ||
                            (item?.clientcome === 1 ? "WEB" : "APP") ||
                            'N/A',
                        PhoneNo: item?.PhoneNo || 'N/A',
                        Created_at: fDateTime(item?.createdAt) || 'N/A',
                    }));
                    exportToCSV(csvArr, 'All Clients')
                } else {
                    console.log("No data available.");
                }
            } else {
                console.error("Failed to fetch data:", response.status);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };




    const getcategoryplanlist = async () => {
        try {
            const response = await getcategoryplan(token);
            if (response.status) {
                setCategory(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    };




    const getAdminclient = async () => {
        try {
            const data = {
                page: currentPage,
                kyc_verification: searchkyc,
                status: clientStatus == 1 ? 1 : clientStatus == 0 ? 0 : "",
                createdby: statuscreatedby,
                search: searchInput,
                planStatus: expired === "active" ? "active" : expired === "expired" ? "expired" : clientStatus === "active" ? "active" : clientStatus === "expired" ? "expired" : "",
                add_by: ""

            };
            const response = await DeleteClientHistory(data, token);
            if (response.status) {
                setClients(response.data);
                setTotalRows(response.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };



    // const getplanlistbyadmin = async () => {
    //     try {

    //         const response = await getplanlist(client._id, token);
    //         if (response.status) {
    //             // setPlanlist(response.data);
    //         }
    //     } catch (error) {
    //         console.log("error");
    //     }
    // }




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
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
            width: '350px',
        },
        {
            name: 'Phone No',
            selector: row => row.PhoneNo,
            sortable: true,
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
            name: 'Created By',
            selector: row => row.addedByDetails?.FullName ?? (row.clientcome === 1 ? "WEB" : "APP"),
            sortable: true,
            width: '165px',
        },

        // {
        // name: 'Date',
        // selector: row => row.Status,
        // sortable: true,
        // width: '165px',
        // },

        // {
        //     name: 'Active Status',
        //     selector: row => (
        //         <div className="form-check form-switch form-check-info">
        //             <input
        //                 id={`rating_${row.ActiveStatus}`}
        //                 className="form-check-input toggleswitch"
        //                 type="checkbox"
        //                 defaultChecked={row.ActiveStatus == 1}
        //                 onChange={(event) => handleSwitchChange(event, row._id)}
        //             />
        //             <label
        //                 htmlFor={`rating_${row.ActiveStatus}`}
        //                 className="checktoggle checkbox-bg"
        //             ></label>
        //         </div>
        //     ),
        //     sortable: true,
        //     width: '165px',
        // },

        {
            name: 'Deleted Date',
            selector: row => fDateTime(row.updatedAt),
            sortable: true,
            width: '200px',
        },
        // {
        //     name: 'Actions',
        //     selector: (row) => (
        //         <div className='d-flex'>


        //             <Tooltip placement="top" overlay="Package Assign">
        //                 <span onClick={(e) => { showModal(true); setClientid(row); getplanlistassinstatus(row._id) }} style={{ cursor: 'pointer' }}>
        //                     <Settings2 />
        //                 </span>
        //             </Tooltip>

        //             <Tooltip title="view">
        //                 <Eye

        //                     onClick={() => Clientdetail(row)} />
        //             </Tooltip>

        //             <Tooltip title="Update">
        //                 <SquarePen className='ms-3' onClick={() => updateClient(row)} />
        //             </Tooltip>
        //             {/* <Tooltip title="delete">
        //                 <Trash2 onClick={() => DeleteClient(row._id)} />
        //             </Tooltip> */}
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        //     width: '165px',
        // }
    ];

    return (
        <div>
            <div>
                <div className="page-content">
                    <div className="page-breadcrumb  d-flex align-items-center mb-3 ">
                        <div className="breadcrumb-title pe-3">Client Delete History</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/admin/dashboard">
                                            <i className="bx bx-home-alt" />
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>


                    <hr />

                    <div className="card">
                        <div className="card-body">
                            <div className="d-lg-flex align-items-center  gap-3">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control ps-5 radius-10"
                                        placeholder="Search delete client"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        value={searchInput}
                                    />
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>
                                {/* <div
                                    className="ms-2"
                                    onClick={(e) => getexportfile()}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary float-end"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Export To Excel"
                                        delay={{ show: "0", hide: "100" }}

                                    >
                                        <i className="bx bxs-download" aria-hidden="true"></i>

                                        Export-Excel
                                    </button>



                                </div> */}


                            </div>
                            <div className="row mb-4">
                                <div className="col-md-4 mt-3">
                                    <div>
                                        <label htmlFor="kycSelect">Select Kyc</label>
                                        <select
                                            id="kycSelect"
                                            className="form-control radius-10"
                                            value={searchkyc}
                                            onChange={(e) => setSearchkyc(e.target.value)}
                                        >
                                            <option value="">Select Kyc</option>
                                            <option value="1">Verified</option>
                                            <option value="0">Not Verified</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4 mt-3">
                                    <div >
                                        <label htmlFor="kycSelect">Select CreatedBy</label>
                                        <select
                                            id="CreatedBy"
                                            className="form-control radius-10"
                                            value={statuscreatedby}
                                            onChange={(e) => setStatuscreatedby(e.target.value)}
                                        >
                                            <option value="">Select Created By</option>
                                            <option value="web">Web</option>
                                            <option value="app">App</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3 mt-3">
                                    <div>
                                        <label htmlFor="kycSelect">Select Client</label>
                                        <select
                                            id="CreatedBy"
                                            className="form-control radius-10"
                                            value={expired}
                                            onChange={(e) => setExpired(e.target.value)}
                                        >
                                            <option value="">Select Client</option>
                                            <option value="active">Active</option>
                                            <option value="expired">Expired </option>
                                            0
                                        </select>
                                    </div>

                                </div>
                                <div className="col-md-1">
                                    <div className="refresh-icon mt-4">
                                        <RefreshCcw onClick={resethandle} />
                                    </div>
                                </div>

                            </div>


                            <Table
                                columns={columns}
                                data={clients}
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div >


    );
}

export default ClientDeleteHistory;
