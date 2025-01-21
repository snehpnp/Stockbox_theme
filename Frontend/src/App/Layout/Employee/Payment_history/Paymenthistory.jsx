import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPayementhistory, getPayementhistorywithfilter } from '../../../Services/Admin';
// import Table from '../../../components/Table';
import Table from '../../../components/Table1';
import { SquarePen, Trash2, PanelBottomOpen, Eye, RefreshCcw, IndianRupee, ArrowDownToLine } from 'lucide-react';
import Swal from 'sweetalert2';
import { image_baseurl } from '../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../Utils/Date_formate';
import { exportToCSV } from '../../../Utils/ExportData';
import Loader from '../../../Utils/Loader';





const History = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [ForGetCSV, setForGetCSV] = useState([])
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    //state for loading
    const [isLoading, setIsLoading] = useState(true)

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        description: "",
        image: "",

    });



    const [title, setTitle] = useState({
        title: "",
        description: "",
        image: "",
        add_by: "",
    });

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
                        Total: item?.segment || '-',
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



    const handleDownload = (row) => {
        const url = `${image_baseurl}uploads/invoice/${row.invoice}`;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };






    const gethistory = async () => {
        try {
            const data = { page: currentPage, fromDate: startDate, toDate: endDate, search: searchInput }
            const response = await getPayementhistorywithfilter(data, token);
            if (response.status) {
                let filteredData = response.data;
                setTotalRows(response.pagination.total)
                setClients(filteredData);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoading(false)
    };



    useEffect(() => {
        gethistory();
    }, [searchInput, startDate, endDate, currentPage]);



    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Name',
            selector: row => row.clientName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row.clientEmail,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone',
            selector: row => row.clientPhoneNo,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Title',
            selector: row => row?.planCategoryTitle ? row?.planCategoryTitle : "N/A",
            sortable: true,
            width: '200px',
        },
        {
            name: 'Client Segment',
            cell: row => (
                <>
                    {Array.isArray(row?.serviceNames) && row.serviceNames.length > 0 ? (
                        row.serviceNames.map((item, index) => (
                            <span
                                key={index}
                                style={{

                                    marginRight: '5px',
                                }}
                            >
                                {item || "N/A"}
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
            name: 'Order_ID',
            selector: row => row.orderid ? row.orderid : "Make By Admin",
            sortable: true,
            width: '200px',
        },
        {
            name: 'Plan Discount',
            selector: row => <div> <IndianRupee />{row.discount}</div>,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Plan Amount',
            selector: row => <div> <IndianRupee />{row.plan_price}</div>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Coupon Id',
            selector: row => row.coupon ? row.coupon : "N/A",
            sortable: true,
            width: '200px',
        },


        {
            name: 'Total',
            selector: row => <div> <IndianRupee />{row.total}</div>,
            sortable: true,
            width: '200px',
        },
        // {
        //     name: 'Plan Price',
        //     selector: row => row.planDetails.plan_price,
        //     sortable: true,
        // },
        {
            name: 'Validity',
            selector: row => row.validity,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Purchase Date.',
            selector: row => fDateTime(row?.created_at),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Invoice',
            cell: row => (
                <>

                    <div className='d-flex '>
                        {row.invoice ?
                            <Link className="btn px-2" onClick={() => handleDownload(row)}>
                                <Tooltip placement="top" overlay="Download">
                                    <ArrowDownToLine />
                                </Tooltip>
                            </Link> : "-"}
                    </div>

                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '200px',

        },
        // {
        //     name: 'Plan End',
        //     selector: row => new Date(row.planDetails.plan_end).toLocaleDateString(),
        //     sortable: true,
        // },
        // {
        //     name: 'Date',
        //     selector: row => fDate(row.planDetails.created_at),
        //     sortable: true,
        // },
        // {
        //     name: 'Actions',
        //     cell: row => (
        //         <>
        //             <div>
        //                 <Tooltip placement="top" overlay="View">
        //                     <Eye
        //                         data-bs-toggle="modal"
        //                         data-bs-target="#example"
        //                         onClick={() => setViewpage(row)}
        //                     />
        //                 </Tooltip>
        //             </div>


        //         </>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // }
    ];





    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Payment History</div>
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
                        <div className="d-lg-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search Payment History"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>

                            </div>


                            <div>

                                <div
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
                                </div>
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <div className="col-md-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    value={startDate}
                                />
                            </div>




                            <div className='col-md-3'>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    value={endDate}
                                />
                            </div>

                            <div className="col-md-1">
                                <div className="refresh-icon mt-1">
                                    <RefreshCcw onClick={resethandle} />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>

                                <div className="table-responsive">
                                    <Table
                                        columns={columns}
                                        data={clients}
                                        totalRows={totalRows}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <div className="button-group">

                <div
                    className="modal fade"
                    id="example"
                    tabIndex={-1}
                    aria-labelledby="example"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="example">
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <ul>
                                    <li>
                                        <div className="row justify-content-between">
                                            <div className="col-md-6">
                                                <b>Title :  {viewpage?.clientName}</b>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row justify-content-between">
                                            <div className="col-md-6">
                                                <b>Price : {viewpage?.planDetails?.price}</b>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row justify-content-between">
                                            <div className="col-md-6">
                                                <b>Validity : {viewpage?.planDetails?.validity}</b>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row justify-content-between">
                                            <div >
                                                <b>Description : {viewpage?.planDetails?.description} </b>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row justify-content-between">
                                            <div className="col-md-8">
                                                {viewpage?.planDetails?.created_at ? (
                                                    <b>Payout Date: {fDateTime(viewpage.planDetails.created_at)}</b>
                                                ) : (
                                                    <b>Payout Date: Not available</b>
                                                )}
                                            </div>
                                            <div className="col-md-6"></div>
                                        </div>
                                    </li>

                                    {/* <li>
                                        <div className="row justify-content-between">
                                            <div className="col-md-6">
                                                <b>Updated At</b>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default History;
