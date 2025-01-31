import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPayementhistory, getOrderlistofclient } from '../../../Services/Admin/Admin';

import Table from '../../../Extracomponents/Table1';
import Table1 from '../../../Extracomponents/Table';
import { RefreshCcw, IndianRupee, Eye, ArrowDownToLine } from 'lucide-react';
import Swal from 'sweetalert2';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../Utils/Date_formate';
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
            const data = { page: currentPage, clientid: userid, signalid: "" }
            const response = await getOrderlistofclient(data, token);
            if (response.status) {
                let filteredData = response.data;
                setTotalRows(response.pagination.totalRecords)
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
            name: 'Full Name',
            selector: row => row?.clientDetails?.FullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row?.clientDetails?.Email,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone',
            selector: row => row?.clientDetails?.PhoneNo,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Order_ID',
            selector: row => row.orderid ? row.orderid : "Make By Admin",
            sortable: true,
            width: '200px',
        },
        {
            name: "Actions",
            selector: (row) => (
                <div className="d-flex">
                    <Tooltip title="view">
                        <Eye onClick={() => { setShowModal(true) }} />
                    </Tooltip>

                </div>
            ),
            width: "165px",
        },


    ];


    const columns1 = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Symbol',
            selector: row => row?.signalDetails?.tradesymbol,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Stock',
            selector: row => row?.signalDetails?.stock,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Call Type',
            selector: row => row?.signalDetails?.calltype,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Call Duration',
            selector: row => row.signalDetails?.callduration,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Type',
            selector: row => row.signalDetails?.entrytype,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Price',
            selector: row => row.signalDetails?.price,
            sortable: true,
            width: '200px',
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

                            {/* <div className="position-relative">
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

                            </div> */}


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

                        <div className="table-responsive">
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

            <ReusableModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={<>Signal Detail</>}
                size="xl"
                body={
                    <>
                        <div className="card custom-card">
                            <div>
                                <Table1
                                    columns={columns1}
                                    data={clients}
                                    pagination
                                    striped
                                    highlightOnHover
                                    dense
                                />
                            </div>
                        </div>
                    </>
                }
            />

        </div>
    );
};

export default ClientOrderlist;
