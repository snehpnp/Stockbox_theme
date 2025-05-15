import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GetClient } from "../../../Services/Admin/Admin";
import Table from "../../../Extracomponents/Table1";
import {
    Eye,
    RefreshCcw,
    Trash2,
    SquarePen,
    IndianRupee,
    ArrowDownToLine,
    CircleX,
    MessageCircle
} from "lucide-react";
import {
    GetSignallist,
    GetSignallistWithFilter,
    DeleteSignal,
    SignalCloseApi,
    GetService,
    GetStockDetail,
    UpdatesignalReport,
    GetOpenMultipleSignaldata,
    Updatemultiplesignalpdf,
    GetSignalNotificationdata,
    getstaffperuser

} from "../../../Services/Admin/Admin";

import { fDateTimeSuffix, fDateTimeH } from "../../../../Utils/Date_formate";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { exportToCSV, exportToCSV1 } from "../../../../Utils/ExportData";
import Select from "react-select";
import { Tooltip } from "antd";
import { image_baseurl } from "../../../../Utils/config";
import ReusableModal from "../../../components/Models/ReusableModal";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";



const Closesignal = () => {



    const [activeTab, setActiveTab] = useState("table");
    const [isLoading, setIsLoading] = useState(true)


    const token = localStorage.getItem("token");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [header, setheader] = useState("Close Signal");
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState([])
    const [permission, setPermission] = useState([]);

    const [cardData, setCardData] = useState([])

    const userid = localStorage.getItem('id');

    const [updatetitle, setUpdatetitle] = useState({
        report: "",
        id: "",
        description: "",
    });



    const [signalmessage, setSignalmessage] = useState([]);

    const [multiplereport, setMultiplereport] = useState({
        report: "",
        id: "",
        description: ""

    })

    const location = useLocation();
    const clientStatus = location?.state?.clientStatus;



    useEffect(() => {
        if (clientStatus == "todayclosesignal") {
            setheader("Todays Close Signal");
        }
    }, [clientStatus]);



    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    const [filters, setFilters] = useState({
        from: "",
        to: "",
        service: "",
        stock: "",
    });



    const [serviceList, setServiceList] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [searchstock, setSearchstock] = useState("");
    const [ForGetCSV, setForGetCSV] = useState([]);
    const [model1, setModel1] = useState(false);
    const [model3, setModel3] = useState(false);
    const [model4, setModel4] = useState(false);

    const [serviceid, setServiceid] = useState({});

    const [strategyData, setStrategyData] = useState([])
    const [strategyTotalRows, setStrategyTotalRows] = useState(0)
    const rowsPerPage = 10;

    const [clients1, setClients1] = useState([]);


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const options = clients.map((item) => ({
        value: item.stock,
        label: item.stock,
    }));

    const handleChange1 = (selectedOption) => {
        setSearchstock(selectedOption ? selectedOption.value : "");
    };


    const options1 = clients1?.map((item) => ({

        value: item.stock,
        label: item.stock,
    }));


    const handleChange2 = (selectedOption) => {
        setSearchstock(selectedOption ? selectedOption.value : "");
    };



    const getexportfile = async () => {
        try {

            const data = {
                page: currentPage,
                from:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.from
                            ? filters.from
                            : "",
                to:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.to
                            ? filters.to
                            : "",
                service: filters.service,
                stock: searchstock,
                closestatus: "true",
                search: searchInput,
                add_by: permission.includes("ownsignal") ? userid : ""
            };
            const response = await GetSignallist(data, token);
            if (response.status) {
                if (response.data?.length > 0) {
                    let filterdata = response.data.filter(
                        (item) => item.close_status === true
                    );
                    const csvArr = filterdata.map((item) => {
                        let profitAndLoss = 0;
                        if (item.calltype === "BUY") {
                            profitAndLoss = (
                                (item.closeprice - item.price) *
                                item.lotsize
                            ).toFixed(2);
                        } else if (item.calltype === "SELL") {
                            profitAndLoss = (
                                (item.price - item.closeprice) *
                                item.lotsize
                            ).toFixed(2);
                        }

                        return {
                            Symbol: item.tradesymbol || "",
                            segment: item?.segment || "",
                            EntryType: item?.calltype || "",
                            EntryPrice: item?.price || "",
                            ExitPrice: item?.closeprice || "",
                            ProfitAndLoss: profitAndLoss || "",
                            EntryDate: fDateTimeH(item?.created_at) || "",
                            ExitDate: fDateTimeH(item?.closedate) || "",
                        };
                    });
                    exportToCSV(csvArr, "Close Signal");
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };



    const getexportfile1 = async () => {
        try {
            const data = {
                page: currentPage,
                from:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.from
                            ? filters.from
                            : "",
                to:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.to
                            ? filters.to
                            : "",
                service: filters.service,
                stock: searchstock,
                closestatus: "true",
                search: searchInput,
                add_by: permission.includes("ownsignal") ? userid : ""
            };
            const response = await GetSignallist(data, token);
            if (response.status) {
                if (response.data?.length > 0) {
                    let filterdata = response.data.filter(
                        (item) => item.close_status === true
                    );
                    const csvArr = filterdata.map((item) => {
                        let profitAndLossPercentage = 0;
                        if (item.calltype === "BUY") {
                            profitAndLossPercentage = (
                                ((item.closeprice - item.price) / item.price) *
                                100
                            ).toFixed(2);
                        } else if (item.calltype === "SELL") {
                            profitAndLossPercentage = (
                                ((item.price - item.closeprice) / item.price) *
                                100
                            ).toFixed(2);
                        }

                        const entryType = `BUY POSITION CLOSED IN ${item.tradesymbol || ""} ${item.expirydate || ""
                            } ${item.optiontype || ""} SL ${item.stoploss || ""}, ${(() => {
                                const count = [item.tag1, item.tag2, item.tag3].filter(Boolean).length;
                                return count === 1
                                    ? "1st"
                                    : count === 2
                                        ? "2nd"
                                        : count === 3
                                            ? "3rd"
                                            : "";
                            })()
                            } Target Achieved Exit Price ${item?.closeprice}`;

                        return {
                            CloseSignal: `${fDateTimeH(item?.created_at)}  Segment: ${item.segment === "C"
                                ? "CASH"
                                : item.segment === "O"
                                    ? "OPTION"
                                    : item.segment === "F"
                                        ? "FUTURE"
                                        : ""
                                }   P/L: ${profitAndLossPercentage}%   Entry Type: ${entryType}`,
                        }
                    });
                    exportToCSV1(csvArr, "Close Signal");
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };






    const getAllSignal = async () => {
        try {
            const data = {
                page: currentPage,
                from:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.from
                            ? filters.from
                            : "",
                to:
                    clientStatus === "todayclosesignal"
                        ? formattedDate
                        : filters.to
                            ? filters.to
                            : "",
                service: filters.service,
                stock: searchstock,
                closestatus: "true",
                search: searchInput,
                add_by: permission.includes("ownsignal") ? userid : ""
            };

            const response = await GetSignallistWithFilter(data, token);
            if (response && response.status) {
                let filterdata = response.data.filter(
                    (item) => item.close_status === true
                );

                setClients(filterdata);
                setCardData(filterdata);
                setTotalRows(response.pagination.totalRecords);
            }
        } catch (error) {
            console.log("error", error);
        }
        setIsLoading(false)
    };




    const fetchAdminServices = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServiceList(response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };




    const fetchStockList = async () => {
        try {
            const response = await GetStockDetail(token);
            if (response.status) {
                setStockList(response.data);
            }
        } catch (error) {
            console.log("Error fetching stock list:", error);
        }
    };



    const GetStrategydata = async (data) => {
        try {
            const data = {
                page: currentPage,
                from: clientStatus === "todayopensignal" ? formattedDate : filters.from ? filters.from : "",
                to: clientStatus === "todayopensignal" ? formattedDate : filters.to ? filters.to : "",
                service: filters.service,
                stock: searchstock,
                closestatus: "true",
                search: searchInput,
                add_by: permission.includes("ownsignal") ? userid : ""

            };
            const response = await GetOpenMultipleSignaldata(data, token);
            if (response?.status) {
                setStrategyTotalRows(response?.data?.pagination?.totalRecords)
                setStrategyData(response?.data?.signals);
                let filterdata = response.data?.signals?.filter((item) => item.close_status === false);

                setClients1(filterdata);

            }
        } catch (error) {
            console.log('Error fetching strategy data:', error);
        }
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
    }




    useEffect(() => {
        getpermissioninfo()
        fetchAdminServices();
        fetchStockList();
    }, [filters]);



    useEffect(() => {
        const fetchData = () => {
            if (activeTab === "strategy") {
                GetStrategydata();
            } else {
                getAllSignal();
            }
        };

        fetchData();
    }, [activeTab, filters, searchInput, searchstock, currentPage]);

    useEffect(() => {
        if (activeTab) {
            setCurrentPage(1);
        }
    }, [activeTab]);



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };



    const Signaldetail = async (_id) => {
        navigate(`/employee/signaldetaile/${_id}`, { state: { state: "closesignalpage" } });
    };



    const handleDownload = (row) => {
        const url = `${image_baseurl}uploads/report/${row.report}`;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    // for signal message

    const getsignalmessage = async (signalid) => {
        try {
            const response = await GetSignalNotificationdata(signalid, token);

            if (response.status) {
                setSignalmessage(response.notifications);

            }
        } catch (error) {
            console.log("Error fetching stock list:", error);
        }
    };




    let columns = [
        {
            name: "S.No",
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: "100px",
        },
        {
            name: "Segment",
            selector: (row) => {
                const segmentLabel =
                    row.segment === "C"
                        ? "CASH"
                        : row.segment === "O"
                            ? "OPTION"
                            : "FUTURE";
                return row.closeprice == 0
                    ? <div>{segmentLabel}<span style={{ color: "red" }}> (Avoid)<Eye onClick={() => { setShowModal(true); setDescription(row?.close_description) }} /></span></div>
                    : segmentLabel;
            },
            sortable: true,
            width: "200px",
        },
        {
            name: "Symbol",
            selector: (row) => row.tradesymbol,
            sortable: true,
            width: "300px",
        },
        {
            name: 'Plan',
            selector: row => row?.plan_category_title ? row?.plan_category_title : "-",
            sortable: true,
            width: '200px',
        },
        {
            name: "Entry Type",
            selector: (row) => row.calltype,
            sortable: true,
            width: "200px",
        },
        {
            name: "Suggested Quantity/Lot",
            selector: (row) => row.lot,
            sortable: true,
            width: "250px",
        },
        {
            name: "Entry Price",
            selector: (row) => (
                <div>
                    {" "}
                    <IndianRupee style={{ width: "16px" }} />
                    {row.price}
                </div>
            ),
            sortable: true,
            width: "200px",
        },

        {
            name: "Exit Price",
            selector: (row) => (
                <div>
                    {row?.closeprice == 0 ? (
                        "N/A"
                    ) : (
                        <>
                            <IndianRupee style={{ width: "16px" }} />
                            {row.closeprice}
                        </>
                    )}
                </div>
            ),
            sortable: true,
            width: "132px",
        },
        {
            name: "Total P&L",
            cell: (row) => {
                if (row?.closeprice == 0) {
                    return "N/A";
                }

                let totalPL = 0;
                if (row.calltype === "BUY") {
                    totalPL = ((row.closeprice - row.price) * row.lotsize);
                } else if (row.calltype === "SELL") {
                    totalPL = ((row.price - row.closeprice) * row.lotsize);
                }

                const style = {
                    color: totalPL < 0 ? "red" : "green",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                };

                return (
                    <span style={style}>
                        <IndianRupee style={{ width: "16px" }} />
                        {totalPL.toFixed(2)}
                    </span>
                );
            },
            sortable: true,
            width: "200px",
        },
        {
            name: "Entry Date",
            selector: (row) => fDateTimeH(row.created_at),
            sortable: true,
            width: "200px",
        },
        {
            name: "Exit Date",
            selector: (row) => fDateTimeH(row?.closedate),
            sortable: true,
            width: "200px",
        },

        permission.includes("signaldetail") && {
            name: "Actions",
            cell: (row) => (
                <>
                    <div>
                        <Eye onClick={() => Signaldetail(row._id)} />
                    </div>
                    {/* <div>
                        <Trash2 onClick={() => DeleteSignals(row._id)} />
                    </div> */}
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: "Message",
            className: "text-end",
            cell: (row) => (
                <>
                    <div
                        className="d-flex  justify-content-center"
                        style={{ width: "150px" }}
                    >
                        <Tooltip placement="top" overlay="Update">
                            <MessageCircle
                                style={{ color: "red" }}
                                onClick={() => {
                                    setModel4(true);
                                    getsignalmessage(row._id);

                                }}
                            />
                        </Tooltip>
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "200px",
        },
        {
            name: "Upload Report",
            cell: (row) => (
                <>
                    <div className='d-flex justify-content-end' style={{ width: "150px" }}>
                        {row.report ?
                            <Link className="btn px-2" onClick={() => handleDownload(row)}>
                                <Tooltip placement="top" overlay="Download">
                                    <ArrowDownToLine />
                                </Tooltip>
                            </Link> : ""}
                        <Link className="btn px-2">
                            <Tooltip placement="top" overlay="Update">
                                <SquarePen
                                    onClick={() => {
                                        setModel1(true);
                                        setServiceid(row);
                                        setUpdatetitle({ report: row.report, id: row._id, description: row.description });
                                    }}
                                />
                            </Tooltip>
                        </Link>
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "200px",
        },
    ];

    const resethandle = () => {
        setFilters({
            from: "",
            to: "",
            service: "",
            stock: "",
        });
        setSearchstock("");
        setSearchInput("");
        fetchAdminServices();
        fetchStockList();
        getAllSignal();
    };




    // Update service
    const updateReportpdf = async () => {
        try {
            const data = {
                id: serviceid._id,
                report: updatetitle.report,
                description: updatetitle.description,
            };

            const response = await UpdatesignalReport(data, token);
            if (response && response.status) {
                showCustomAlert("Success", response.message)
                setUpdatetitle({ report: "", id: "", description: "" });
                setModel1(false);
                getAllSignal();
            } else {
                showCustomAlert("error", response.message)
            }
        } catch (error) {
            showCustomAlert("error", "Server Error")
        }
    };



    // Update service
    const MultipleSignalupdateReportpdf = async () => {

        try {
            const data = { id: multiplereport.id, report: multiplereport.report, description: multiplereport.description };
            const response = await Updatemultiplesignalpdf(data, token);
            if (response && response.status) {
                showCustomAlert("Success", response.message)
                setMultiplereport({ report: "", id: "", description: "" });
                setModel3(false);
                GetStrategydata();
            } else {
                showCustomAlert("error", response.message)
            }
        } catch (error) {
            showCustomAlert("error", error.message)

        }
    };


    const updateServiceTitle1 = (updatedField) => {
        setMultiplereport(prev => ({
            ...prev,
            ...updatedField
        }));
    };






    const updateServiceTitle = (updatedField) => {
        setUpdatetitle((prev) => ({
            ...prev,
            ...updatedField,
        }))
    }




    const downloadPDF = (strategy) => {
        if (!strategy?.report) {
            showCustomAlert("error", "No report available!");
            return;
        }
        const url = `${image_baseurl}uploads/report/${strategy?.report}`;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div>
            <div>
                <div className="page-content">
                    <div className="page-breadcrumb  d-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">{header}</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/employee/dashboard">
                                            <i className="bx bx-home-alt" />
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-body">
                            {/* Tab Navigation */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="btn-group">
                                    <button
                                        className={`btn btn-outline-primary  ${activeTab === "table" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("table")}
                                    >
                                        Table View
                                    </button>
                                    <button
                                        className={`btn btn-outline-primary  ${activeTab === "card" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("card")}
                                    >
                                        Card View
                                    </button>
                                    {permission.includes("Strategy") && <button
                                        className={`btn btn-outline-primary ${activeTab === "strategy" ? "active" : ""}`}
                                        onClick={() => setActiveTab("strategy")}
                                    >
                                        Strategy
                                    </button>}
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control ps-5 radius-10"
                                        placeholder="Search Signal"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>
                                {/* <div className="ms-2" onClick={(e) => getexportfile()}>
                  <button
                    type="button"
                    className="btn btn-primary float-end"
                    title="Export To Excel"
                  >
                    <i className="bx bxs-download" aria-hidden="true"></i>
                    Export-Excel
                  </button>
                </div> */}

                                <div className="mt-2 mt-sm-0">
                                    {activeTab === "table" ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary float-sm-end"
                                            title="Export To Excel"
                                            onClick={getexportfile}
                                        >
                                            <i className="bx bxs-download" aria-hidden="true" /> Export-Excel
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary float-sm-end"
                                            title="Export Card data"
                                            onClick={getexportfile1}

                                        >
                                            <i className="bx bxs-download" aria-hidden="true" /> Export-Excel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <label>From Date</label>
                                    <input
                                        type="date"
                                        name="from"
                                        className="form-control radius-10"
                                        placeholder="From"
                                        value={filters.from}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>To Date</label>
                                    <input
                                        type="date"
                                        name="to"
                                        className="form-control radius-10"
                                        placeholder="To"
                                        value={filters.to}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                {activeTab != "strategy" &&
                                    <div className="col-md-3">
                                        <label>Select Service</label>
                                        <select
                                            name="service"
                                            className="form-control radius-10"
                                            value={filters.service}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Select Service</option>
                                            {serviceList.map((service) => (
                                                <option key={service._id} value={service._id}>
                                                    {service.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>}
                                <div className="col-md-3 d-flex">
                                    {activeTab != "strategy" ? <div style={{ width: "80%" }}>
                                        <label>Select Stock</label>
                                        <Select
                                            options={options}
                                            value={options.find((option) => option.value === searchstock) || null}
                                            onChange={handleChange1}
                                            isClearable
                                            placeholder="Select Stock"
                                        />
                                    </div> :
                                        <div style={{ width: "80%" }}>
                                            <label>Select Stock</label>
                                            <Select
                                                options={options1}
                                                value={options1.find((option) => option.value === searchstock) || null}
                                                onChange={handleChange2}
                                                isClearable
                                                placeholder="Select Stock"
                                            />
                                        </div>
                                    }
                                    <div className="rfreshicon">
                                        <RefreshCcw onClick={resethandle} />
                                    </div>
                                </div>
                            </div>

                            {activeTab === "table" ?
                                isLoading ? (
                                    <Loader />
                                ) :

                                    (

                                        <Table
                                            columns={columns}
                                            data={clients}
                                            totalRows={totalRows}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    ) : activeTab === "card" ?

                                    (
                                        <>
                                            <div className="row">
                                                {cardData.map((client) => (
                                                    <div className="col-md-12 mb-3" key={client.id}>
                                                        <div className="card card radius-10 mb-3 border">
                                                            <div className="card-body ">
                                                                <div className="d-flex justify-content-between">
                                                                    <div>
                                                                        <p className="mb-1">
                                                                            <b>Date: {fDateTimeH(client?.created_at)}</b>
                                                                        </p>
                                                                        <p className="mb-2">
                                                                            <b>Segment: {client?.segment == "C" ? "CASH" : client?.segment == "O" ? "OPTION" : "FUTURE"}, {client?.closeprice == 0 ? <span style={{ color: "red" }}> (Avoid)<Eye onClick={() => { setShowModal(true); setDescription(client?.close_description) }} /></span> : ""} </b>
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        {(() => {
                                                                            let totalPL = 0;
                                                                            if (client.calltype === "BUY") {
                                                                                totalPL = ((client.closeprice - client.price) * client.lotsize).toFixed(2);
                                                                            } else if (client.calltype === "SELL") {
                                                                                totalPL = ((client.price - client.closeprice) * client.lotsize).toFixed(2);
                                                                            }

                                                                            const style = {
                                                                                color: totalPL < 0 ? "red" : "green",
                                                                            };


                                                                            const plPercentage = ((totalPL / (client.price * client.lotsize)) * 100).toFixed(2);
                                                                            return (
                                                                                <p className="mb-1">
                                                                                    <b>
                                                                                        P/L :
                                                                                        <span className={plPercentage < 0 ? "text-danger" : "text-success"}>
                                                                                            {plPercentage}%
                                                                                            <i className={plPercentage < 0 ? 'bx bx-down-arrow-alt' : 'bx bx-up-arrow-alt'}></i>
                                                                                        </span>
                                                                                    </b>
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                    </div>

                                                                </div>
                                                                <p className='mb-1'> Entry Type {client?.calltype}  POSITION CLOSED IN {client?.stock}  {client?.expirydate && `${client.expirydate}`} {client?.optiontype && `${client.optiontype}`} {client?.stoploss && `SL ${client.stoploss}`}  {(() => {
                                                                    const count = [client?.tag1, client?.tag2, client?.tag3].filter(Boolean).length;
                                                                    if (count === 1) return "1st";
                                                                    if (count === 2) return "2nd";
                                                                    if (count === 3) return "3rd";
                                                                    return "";
                                                                })()}   Target  Achived  Exit Price {client?.closeprice}

                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {totalRows > 0 && (
                                                <div className="d-flex justify-content-center mt-4">
                                                    <nav>
                                                        <ul className="pagination">

                                                            {(() => {
                                                                const totalPages = Math.ceil(totalRows / 10);
                                                                return (
                                                                    <>

                                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                            <button
                                                                                className="page-link"
                                                                                onClick={() => handlePageChange(currentPage - 1)}
                                                                            >
                                                                                Previous
                                                                            </button>
                                                                        </li>


                                                                        {currentPage > 2 && (
                                                                            <li className="page-item">
                                                                                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                                                                            </li>
                                                                        )}
                                                                        {currentPage > 3 && (
                                                                            <li className="page-item disabled">
                                                                                <span className="page-link">...</span>
                                                                            </li>
                                                                        )}


                                                                        {[...Array(totalPages).keys()]
                                                                            .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
                                                                            .map(num => (
                                                                                <li key={num} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                                                                    <button
                                                                                        className="page-link"
                                                                                        onClick={() => handlePageChange(num + 1)}
                                                                                    >
                                                                                        {num + 1}
                                                                                    </button>
                                                                                </li>
                                                                            ))}


                                                                        {currentPage < totalPages - 2 && (
                                                                            <li className="page-item disabled">
                                                                                <span className="page-link">...</span>
                                                                            </li>
                                                                        )}
                                                                        {currentPage < totalPages - 1 && (
                                                                            <li className="page-item">
                                                                                <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                                                                            </li>
                                                                        )}



                                                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                            <button
                                                                                className="page-link"
                                                                                onClick={() => handlePageChange(currentPage + 1)}
                                                                            >
                                                                                Next
                                                                            </button>
                                                                        </li>
                                                                    </>
                                                                )
                                                            })()}
                                                        </ul>
                                                    </nav>
                                                </div>
                                            )}

                                        </>
                                    )
                                    :
                                    activeTab === "strategy" ? (

                                        <div className="strategy-content mt-4">
                                            {strategyData.map((strategy, index) => (
                                                <div className='card py-3 mb-4' key={strategy._id}>
                                                    <div className='row w-100 mx-auto'>
                                                        <div className='col-md-3'>
                                                            <div className='d-flex flex-column gap-3 p-4 sticky-card'>
                                                                {/* <button className='btn btn-secondary w-100'>Open Signal</button> */}
                                                                <button className='btn btn-secondary w-100' onClick={() => navigate(`/employee/multipleSignaldetail/${strategy._id}`)}>View</button>
                                                                <button className='btn btn-secondary w-100' onClick={() => downloadPDF(strategy)}>PDF</button>
                                                                <button className='btn btn-secondary w-100' onClick={() => { setModel3(true); setMultiplereport({ description: strategy.description, id: strategy._id }) }}>Edit Report</button>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <div className='row w-100'>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Stock Name</label>
                                                                    <p>{strategy?.stock}</p>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Strategy</label>
                                                                    <p>{strategy?.strategy_name}</p>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Plan Name</label>
                                                                    <p>{strategy?.plan_category_title}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row w-100'>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Trade Duration</label>
                                                                    <p>{strategy?.callduration}</p>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Max. Loss</label>
                                                                    <p>{strategy?.maximum_loss}</p>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Max. Profit</label>
                                                                    <p>{strategy?.maximum_profit}</p>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <label className='text-muted'>Required Margin</label>
                                                                    <p>{strategy?.required_margin}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row w-100'>
                                                                <div className='shadow card p-3'>
                                                                    <table className='table table-bordered'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Segment</th>
                                                                                <th>Call Type</th>
                                                                                <th>Strike Price</th>
                                                                                <th>Option Type</th>
                                                                                <th>Price</th>
                                                                                <th>Trade Symbol</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {strategy.stocks.map((stock) => (
                                                                                <tr key={stock._id}>
                                                                                    <td>{stock?.segment == "F" ? "FUTURE" : "OPTION"}</td>
                                                                                    <td>{stock?.calltype}</td>
                                                                                    <td>{stock?.strikeprice}</td>
                                                                                    <td>{stock?.optiontype || '-'}</td>
                                                                                    <td>{stock?.price}</td>
                                                                                    <td>{stock?.tradesymbol}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="d-flex justify-content-center mt-4">
                                                <nav>
                                                    <ul className="pagination">
                                                        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                                                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                                                Previous
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: Math.ceil(strategyTotalRows / rowsPerPage) }, (_, i) => (
                                                            <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                                    {i + 1}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === Math.ceil(strategyTotalRows / rowsPerPage) && "disabled"}`}>
                                                            <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                                                                Next
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>

                                    )
                                        : (
                                            <div className="text-center mt-5">
                                                <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                                            </div>
                                        )

                            }
                        </div>
                    </div>
                </div>
            </div>


            <ReusableModal
                show={model1}
                onClose={() => setModel1(false)}
                title="Upload Report"
                body={
                    <form>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="imageUpload">Upload Report</label>
                                <span className="text-danger">*</span>
                                <input
                                    className="form-control mb-3"
                                    type="file"
                                    accept="application/pdf"
                                    id="imageUpload"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.type !== "application/pdf") {
                                                showCustomAlert("error", 'Only PDF files are Allowed!')
                                                return;
                                            }
                                            updateServiceTitle({ report: file });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Enter Description Title"
                                    value={updatetitle.description}
                                    onChange={(e) => updateServiceTitle({ description: e.target.value })}
                                    rows={2}
                                >

                                </textarea>
                            </div>
                        </div>
                    </form>
                }
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setModel1(false)}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateReportpdf}>
                            Update File
                        </button>
                    </>
                }
            />


            <ReusableModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Description"
                body={<p>{description || "No description available."}</p>}
            />

            <ReusableModal
                show={model3}
                onClose={() => setModel3(false)}
                title="Upload Report"
                body={
                    <form>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="imageUpload">Upload Report</label>
                                <span className="text-danger">*</span>
                                <input
                                    className="form-control mb-3"
                                    type="file"
                                    accept="application/pdf"
                                    id="imageUpload"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.type !== "application/pdf") {
                                                showCustomAlert("error", 'Only PDF files are allowed!')
                                                return;
                                            }
                                            updateServiceTitle1({ report: file });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Enter Description Title"
                                    value={multiplereport.description}
                                    onChange={(e) => updateServiceTitle1({ description: e.target.value })}
                                    rows={2}
                                >

                                </textarea>

                            </div>
                        </div>
                    </form>
                }
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setModel3(false)}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={MultipleSignalupdateReportpdf}>
                            Update File
                        </button>
                    </>
                }
            />



            <ReusableModal
                show={model4}
                onClose={() => setModel4(false)}
                title="Message"
                body={
                    <form>
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    className="border p-3 rounded shadow-sm"
                                    style={{
                                        backgroundColor: "#fdfdfd",
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {signalmessage?.length > 0 ? (
                                        signalmessage.map((item, index) => (
                                            <div key={index} className="mb-4">
                                                <p className="mb-1" style={{ fontSize: "14px" }}>
                                                    {item?.message}
                                                </p>
                                                <div
                                                    className="text-end text-muted"
                                                    style={{ fontWeight: "bold", fontSize: "12px" }}
                                                >
                                                    {fDateTimeH(item?.createdAt)}
                                                </div>
                                                <hr className="mt-2 mb-0" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted text-center">No messages found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                }
                footer={
                    <>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setModel4(false)}
                        >
                            Close
                        </button>
                    </>
                }
            />




        </div>
    );
};

export default Closesignal;
