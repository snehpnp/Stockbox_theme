import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPayementhistory, getOrderlistofclient } from '../../../Services/Admin/Admin';

import Table1 from '../../../Extracomponents/Table1';
import Table from '../../../Extracomponents/Table';
import { RefreshCcw, IndianRupee, Eye, ArrowDownToLine } from 'lucide-react';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime, fDateTimeH } from '../../../../Utils/Date_formate';
import { exportToCSV } from '../../../../Utils/ExportData';
import ReusableModal from '../../../components/Models/ReusableModal';



const ClientOrderlist = () => {


    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [ForGetCSV, setForGetCSV] = useState([])
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const resethandle = () => {
        setSearchInput("")
        setStartDate("")
        setEndDate("")


    }



    const getexportfile = async () => {
        try {
            const response = await getPayementhistory(token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({
                        Name: item.clientName || "-",
                        Email: item.clientEmail || "-",
                        Phone: item.clientPhoneNo || "-",
                        Title: item?.planCategoryTitle || '-',
                        ClientSegment: item?.serviceNames.map(statusItem => statusItem || 'N/A')
                            .join(', ') || 'N/A',
                        OerderId: item.orderid ? item.orderid : "Make By Admin",
                        PlanDiscount: item.discount || 0,
                        CouponID: item.coupon || "N/A",
                        PlanAmount: item.plan_price || 0,
                        Total: item?.total || '-',
                        Validity: item.planDetails?.validity || '-',
                        PurchaseDate: fDateTime(item.created_at) || '-',
                    }));
                    exportToCSV(csvArr, 'Payment History')
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







    const getorder = async () => {
        try {
            const data = { page: currentPage, clientid: "", signalid: "" }
            const response = await getOrderlistofclient(data, token);
            if (response.status) {
                let filteredData = response.data;
                setTotalRows(response.pagination?.totalRecords)
                setClients(filteredData);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };



    useEffect(() => {
        getorder();
    }, [currentPage]);




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Date',
            selector: row => fDateTimeH(row?.createdAt),
            sortable: true,
            width: '300px',
        },
        {
            name: 'Name',
            selector: row => row?.clientDetails?.FullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row?.clientDetails?.Email,
            sortable: true,
            width: '320px',
        },
        {
            name: 'Phone No',
            selector: row => row?.clientDetails?.PhoneNo,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Order Status',
            selector: row => row?.data?.data?.status,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Type',
            selector: row => row?.data?.data?.transactiontype,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Symbol',
            selector: row => row?.data?.data?.tradingsymbol,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Price',
            selector: row => row?.data?.data?.price,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Quantity',
            selector: row => row?.data?.data?.quantity,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Broker',
            selector: row => row?.borkerid == 1 ? "Angel One" : row?.borkerid == 2 ? "Alice Blue" : row?.borkerid == 3 ? "Kotak Neo" : row?.borkerid == 4 ? "Market Hub" : "",
            sortable: true,
            width: '200px',
        },
        {
            name: 'Order Id',
            selector: row => row?.data?.data?.orderid,
            sortable: true,
            width: '300px',
        },
        {
            name: "Actions",
            selector: (row) => (
                <div className="d-flex">
                    <Tooltip title="view">
                        <Eye onClick={() => { setShowModal(true); setText(row?.data?.data?.text) }} />
                    </Tooltip>

                </div>
            ),
            width: "165px",
        },


    ];




    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Order List</div>
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

                <div className="card">
                    <div className="card-body">
                        <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search...  "
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>

                            </div>


                            {/* <div>

                                <div
                                    className="ms-sm-2 mt-2 mt-sm-0"
                                    onClick={(e) => getexportfile()}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary float-md-end"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Export To Excel"
                                        delay={{ show: "0", hide: "100" }}

                                    >
                                        <i className="bx bxs-download" aria-hidden="true"></i>

                                        Export-Excel
                                    </button>
                                </div>
                            </div> */}
                        </div>
                        <div className='row mb-2'>
                            <div className="col-md-3 col-sm-4 mb-3 mb-sm-0">
                                <label htmlFor="">From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    value={startDate}
                                />
                            </div>


                            <div className='col-md-3 col-sm-4 mb-3 mb-sm-0'>
                                <label htmlFor="">To Date</label>

                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    value={endDate}
                                />
                            </div>
                            <div className='col-md-3 col-sm-4 mb-3 mb-sm-0'>
                                <label htmlFor="">Type</label>

                                <select
                                    className="form-control"

                                >
                                    <option value="">Select</option>
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div className='col-md-3 col-sm-4 mb-3 mb-sm-0'>
                                <label htmlFor="">Status</label>

                                <select
                                    className="form-control"

                                >
                                    <option value="">Select</option>
                                    <option value="BUY">Pending</option>
                                    <option value="SELL">Rejected</option>
                                    <option value="SELL">Completed</option>
                                </select>
                            </div>
                            <div className='col-md-3 col-sm-4 mb-3 mb-sm-0 mt-1'>
                                <label htmlFor="">Broker</label>

                                <select
                                    className="form-control"

                                >
                                    <option value="">Select</option>
                                    <option value="1">Angel One</option>
                                    <option value="2">Alice Blue</option>
                                    <option value="3">Kotak Neo</option>
                                    <option value="4">Market Hub</option>
                                </select>
                            </div>



                            <div className="col-md-1 col-sm-2">
                                <div className="refresh-icon mt-4">
                                    <RefreshCcw onClick={resethandle} />
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table1
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

            <ReusableModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={<>Signal Detail</>}
                size="l"
                body={
                    <>
                        <div className="card custom-card">
                            <textarea
                                className="w-full h-full border-none outline-none p-2 resize-none bg-transparent"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                    </>
                }
            />

        </div>
    );
};

export default ClientOrderlist;
