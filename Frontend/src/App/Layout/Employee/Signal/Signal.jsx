import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetClient } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table1';
import { Eye, Trash2, RefreshCcw, SquarePen, IndianRupee, ArrowDownToLine } from 'lucide-react';
import Swal from 'sweetalert2';
import { GetSignallist, GetSignallistWithFilter, DeleteSignal, SignalCloseApi, getstaffperuser, GetService, GetStockDetail, UpdatesignalReport } from '../../../Services/Admin/Admin';
import { fDateTimeH } from '../../../../Utils/Date_formate'
import { exportToCSV } from '../../../../Utils/ExportData';
import Select from 'react-select';
import { Tooltip } from 'antd';
import { image_baseurl } from '../../../../Utils/config';
import Loader from '../../../../Utils/Loader';
import ReusableModal from '../../../components/Models/ReusableModal';



const Signal = () => {


    const userid = localStorage.getItem('id');



    const [viewMode, setViewMode] = useState("table");
    const token = localStorage.getItem('token');
    const [searchInput, setSearchInput] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [header, setheader] = useState("Open Signal");
    const [permission, setPermission] = useState([]);
    const [updatetitle, setUpdatetitle] = useState({
        report: "",
        id: "",
        description: ""


    });
    const location = useLocation();
    const clientStatus = location?.state?.clientStatus;



    useEffect(() => {
        if (clientStatus == "todayopensignal") {
            setheader("Todays Open Signal")
        }
    }, [clientStatus])


    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);


    const [filters, setFilters] = useState({
        from: '',
        to: '',
        service: '',
        stock: '',
    });


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [model1, setModel1] = useState(false);
    const [serviceid, setServiceid] = useState({});

    //state for loading
    const [isLoading, setIsLoading] = useState(true)



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const [closedata, setClosedata] = useState({
        id: "",
        closestatus: "",
        close_description: "",
        targethit1: "",
        targethit2: "",
        targethit3: "",
        targetprice1: "",
        targetprice2: "",
        targetprice3: "",
        slprice: "",
        exitprice: "",
        closetype: ""
    })





    const [serviceList, setServiceList] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [searchstock, setSearchstock] = useState("");
    const [ForGetCSV, setForGetCSV] = useState([])

    const [checkedIndex, setCheckedIndex] = useState(0);


    const handleTabChange = (index) => {
        setCheckedIndex(index);
    };

    const [checkedTargets, setCheckedTargets] = useState({
        target1: false,
        target2: false,
        target3: false
    });


    const unchecked = () => {
        setCheckedTargets({
            target1: false,
            target2: false,
            target3: false
        })
    }



    const [checkedTargets1, setCheckedTargets1] = useState({
        target1: 0,
        target2: 0,
        target3: 0,
    });


    const handleCheckboxChange = (e, target) => {

        setCheckedTargets1((prevState) => ({
            ...prevState,
            [target]: e.target.checked ? 1 : 0,
        }));


        setCheckedTargets((prev) => {

            const newCheckedTargets = { ...prev, [target]: !prev[target] };
            if (!newCheckedTargets[target]) {
                setClosedata((prevData) => ({
                    ...prevData,
                    [`targethit${target.slice(-1)}`]: ''
                }));
            }
            return newCheckedTargets;
        });
    };



    const handleChange = (e, field) => {

        setClosedata({
            ...closedata,
            [field]: e.target.value
        });



    };



    const options = clients.map((item) => ({
        value: item.stock,
        label: item.stock,
    }));

    const handleChange1 = (selectedOption) => {
        setSearchstock(selectedOption ? selectedOption.value : "");
    };




    const getexportfile = async () => {
        try {
            const response = await GetSignallist(token);
            if (response.status) {
                if (response.data?.length > 0) {
                    let filterdata = response.data.filter((item) => item.close_status === false);
                    const csvArr = filterdata.map((item) => ({
                        Symbol: item.tradesymbol || "",
                        segment: item?.segment || '',
                        EntryType: item?.calltype || '',
                        EntryPrice: item?.price || '',
                        EntryDate: fDateTimeH(item?.created_at) || '',
                    }));
                    exportToCSV(csvArr, 'Open Signal');
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }




    const getAllSignal = async () => {
        try {
            const data = {
                page: currentPage,
                from: clientStatus === "todayopensignal" ? formattedDate : filters.from ? filters.from : "",
                to: clientStatus === "todayopensignal" ? formattedDate : filters.to ? filters.to : "",
                service: filters.service,
                stock: searchstock,
                closestatus: "false",
                search: searchInput,
                add_by: permission.includes("ownsignal") ? userid : ""
            };

            const response = await GetSignallistWithFilter(data, token);

            if (response && response.status) {
                setTotalRows(response.pagination.totalRecords);
                let filterdata = response.data.filter((item) => item.close_status === false);
                setClients(filterdata);
            }
        } catch (error) {
            console.log("Error:", error);
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
            console.log('Error fetching services:', error);
        }
    };



    const fetchStockList = async () => {
        try {
            const response = await GetStockDetail(token);

            if (response.status) {
                setStockList(response.data);
            }
        } catch (error) {
            console.log('Error fetching stock list:', error);
        }
    };



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
        fetchAdminServices()
        fetchStockList()
        getpermissioninfo()
    }, [filters]);


    useEffect(() => {
        getAllSignal();
    }, [filters, searchInput, searchstock, currentPage]);






    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };


    const Signaldetail = async (_id) => {
        navigate(`/employee/signaldetaile/${_id}`)
    }




    const DeleteSignals = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this employee  member? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await DeleteSignal(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The Employee has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getAllSignal();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The Employee deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the Employee.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };

    const checkstatus = closedata.closestatus == true ? "true" : "false"

    const UpdateData = (row) => {
        setModel(true);
        setServiceid({
            ...row,
            "targetprice1": row.targetprice1,
            "targetprice2": row.targetprice2,
            "targetprice3": row.targetprice3,
        });
        setClosedata({
            ...row,
            "targetprice1": row.targetprice1,
            "targetprice2": row.targetprice2,
            "targetprice3": row.targetprice3,
            "slprice": row.stoploss
        })
    }


    useEffect(() => {
        if (closedata.targetprice3) {
            setClosedata(prevState => ({
                ...prevState,
                closestatus: true,
            }));
        } else {
            setClosedata(prevState => ({
                ...prevState,
                closestatus: false,
            }));
        }
    }, [closedata.targetprice3]);





    const closeSignalperUser = async (index) => {
        try {
            const showValidationError = (message) => {
                Swal.fire({
                    title: 'Error!',
                    text: message,
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            };


            if (index === 1) {
                if (closedata.calltype === "BUY") {
                    const target1 = parseFloat(closedata.targetprice1) || null;
                    const target2 = parseFloat(closedata.targetprice2) || null;
                    const target3 = parseFloat(closedata.targetprice3) || null;

                    if (target2 && !target1) {
                        showValidationError('Target 1 must be provided if Target 2 is entered.');
                        return;
                    }
                    if (target3 && (!target1 || !target2)) {
                        showValidationError('Target 1 and Target 2 must be provided if Target 3 is entered.');
                        return;
                    }
                    if (target1 && target2 && target1 >= target2) {
                        showValidationError('Target 2 must be greater than Target 1.');
                        return;
                    }
                    if (target3 && target2 >= target3) {
                        showValidationError('Target 3 must be greater than Target 2.');
                        return;
                    }
                    if (checkedTargets1.target1 && !target1) {
                        showValidationError('Please fill in Target 1 or uncheck it.');
                        return;
                    }
                    if (checkedTargets1.target2 && !target2) {
                        showValidationError('Please fill in Target 2 or uncheck it.');
                        return;
                    }
                    if (checkedTargets1.target3 && !target3) {
                        showValidationError('Please fill in Target 3 or uncheck it.');
                        return;
                    }
                } else if (closedata.calltype === "SELL") {
                    console.log("SELL", closedata.calltype);

                    const target1 = parseFloat(closedata.targetprice1) || null;
                    const target2 = parseFloat(closedata.targetprice2) || null;
                    const target3 = parseFloat(closedata.targetprice3) || null;

                    if (target2 && !target1) {
                        showValidationError('Target 1 must be provided if Target 2 is Entered.');
                        return;
                    }
                    if (target3 && (!target1 || !target2)) {
                        showValidationError('Target 1 and Target 2 must be provided if Target 3 is Entered.');
                        return;
                    }
                    if (target1 && target2 && target1 <= target2) {
                        showValidationError('Target 2 must be Less than Target 1.');
                        return;
                    }
                    if (target3 && target2 <= target3) {
                        showValidationError('Target 3 must be Less than Target 2.');
                        return;
                    }
                    if (checkedTargets1.target1 && !target1) {
                        showValidationError('Please fill in Target 1 or uncheck it.');
                        return;
                    }
                    if (checkedTargets1.target2 && !target2) {
                        showValidationError('Please fill in Target 2 or uncheck it.');
                        return;
                    }
                    if (checkedTargets1.target3 && !target3) {
                        showValidationError('Please fill in Target 3 or uncheck it.');
                        return;
                    }
                }

            }
            if (index === 4) {
                if (!closedata.close_description) {
                    showValidationError('Please Fill in The Description');
                    return;
                }
            }

            const data = {
                id: serviceid._id,
                closestatus: index === 1 ? checkstatus : "",
                closetype: index === 0 ? "1" : index === 1 ? "2" : index === 2 ? "3" : index === 3 ? "4" : "5",
                close_description: closedata.close_description,

                targethit1: index === 1 && closedata.targetprice1 ? checkedTargets1.target1 : "",
                targethit2: index === 1 && closedata.targetprice2 ? checkedTargets1.target2 : "",
                targethit3: index === 1 && closedata.targetprice3 ? checkedTargets1.target3 : "",

                targetprice1: index === 0 ? closedata.tag1 : index === 1 ? closedata.targetprice1 : "",
                targetprice2: index === 0 ? closedata.tag2 : index === 1 ? closedata.targetprice2 : "",
                targetprice3: index === 0 ? closedata.tag3 : index === 1 ? closedata.targetprice3 : "",
                slprice: index === 2 ? closedata.slprice : closedata.stoploss,
                exitprice: index === 3 ? closedata.exitprice : ""
            };


            const response = await SignalCloseApi(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Signal Closed Successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
                });

                setClosedata({
                    closeprice: "", close_description: "", targetprice1: "", targetprice2: "", targetprice3: "",
                    targethit1: "", targethit2: "", targethit3: ""
                });
                setModel(!model);
                getAllSignal();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error closing the signal.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the service.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };



    const handleDownload = (row) => {
        const url = `${image_baseurl}uploads/report/${row.report}`;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };




    // colums
    let columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Segment',
            selector: row => row.segment == "C" ? "CASH" : row.segment == "O" ? "OPTION" : "FUTURE",
            sortable: true,
            width: '140px',
        },

        {
            name: 'Symbol',
            selector: row => row.tradesymbol,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Entry Type',
            selector: row => row.calltype,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Suggested Quantity/Lot',
            selector: row => row.lot,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Entry Price',
            selector: row => <div> <IndianRupee />{row.price}</div>,
            sortable: true,
            width: '200px',
        },

        // {
        //     name: 'Exit Price',
        //     selector: row => row.Ttype == 1 ? row.closeprice : '-',
        //     sortable: true,
        //     width: '132px',

        // },
        {
            name: 'Entry Date',
            selector: row => fDateTimeH(row.created_at),
            sortable: true,
            width: '250px',
        },
        // {
        //     name: 'Exit Date',
        //     selector: row => row.Ttype == 1 ? fDateTimeSuffix(row.closedate) : "-",
        //     sortable: true,
        //     width: '160px',
        // },

        permission.includes("signalstatus") && {
            name: 'Status',
            cell: row => (
                <>
                    <div>
                        <button
                            className="btn btn-sm btn-success btnclose"
                            onClick={() => {
                                UpdateData(row)
                            }}
                        >
                            Open
                        </button>
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        permission.includes("signaldetail") && {
            name: 'Actions',
            cell: row => (
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
            name: 'Upload Report',
          
         
            cell: row => (
                <>

                    <div className='d-flex justify-content-end'>
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
                                        setUpdatetitle({ report: row.report, id: row._id, description: updatetitle.description });
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
            width: '200px',

        },


    ];




    const resethandle = () => {
        setFilters({
            from: '',
            to: '',
            service: '',
            stock: '',
        });
        setSearchstock("")
        setSearchInput("")
        fetchAdminServices()
        fetchStockList()
        getAllSignal();



    }



    // Update service
    const updateReportpdf = async () => {

        try {
            const data = { id: serviceid._id, report: updatetitle.report, description: updatetitle.description };

            const response = await UpdatesignalReport(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'File updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ report: "", id: "", description: "" });
                setModel1(false);
                getAllSignal();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the file.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'server error',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };


    const updateServiceTitle = (updatedField) => {
        setUpdatetitle(prev => ({
            ...prev,
            ...updatedField
        }));
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
                    <hr />
                    {/* <div className="card">
                        <div className="card-body">
                            <div className="d-lg-flex align-items-center mb-4 gap-3">
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

                                <div className="ms-auto">
                                    <Link
                                        to="/admin/addsignal"
                                        className="btn btn-primary"
                                    >
                                        <i
                                            className="bx bxs-plus-square"
                                            aria-hidden="true"
                                        />
                                        Add Signal
                                    </Link>
                                </div>

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

                            <div className="row">

                                <div className="col-md-3">
                                    <label>From date</label>
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
                                        min={filters.from}
                                    />
                                </div>
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
                                </div>

                                <div className="col-md-3 d-flex">
                                    <div style={{ width: "80%" }}>
                                        <label>Select Stock</label>
                                        <Select
                                            options={options}
                                            value={options.find((option) => option.value === searchstock) || null}
                                            onChange={handleChange1}
                                            className="form-control radius-10"
                                            isClearable
                                            placeholder="Select Stock"
                                        />
                                    </div>
                                    <div className='rfreshicon'>
                                        <RefreshCcw onClick={resethandle} />
                                    </div>

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

                    </div> */}

                    <div className="card">
                        <div className="card-body">

                            <div className="d-flex justify-content-between mb-4">
                                <div className="btn-group">
                                    <button
                                        className={`btn btn-outline-primary ${viewMode === "table" ? "active" : ""}`}
                                        onClick={() => setViewMode("table")}
                                    >
                                        Table View
                                    </button>
                                    <button
                                        className={`btn btn-outline-primary ${viewMode === "card" ? "active" : ""}`}
                                        onClick={() => setViewMode("card")}
                                    >
                                        Card View
                                    </button>
                                </div>
                            </div>


                            <div className="d-md-flex align-items-center mb-4 gap-3">
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
                                {permission.includes("addsignal") && <div className="ms-sm-auto mt-2 mt-md-0">
                                    <Link to="/employee/addsignal" className="btn btn-primary">
                                        <i className="bx bxs-plus-square" aria-hidden="true" /> Add Signal
                                    </Link>
                                </div>}
                                <div className="ms-0 ms-md-2 mt-2 mt-md-0" onClick={getexportfile}>
                                    <button type="button" className="btn btn-primary float-md-end" title="Export To Excel">
                                        <i className="bx bxs-download" aria-hidden="true" /> Export-Excel
                                    </button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label>From date</label>
                                    <input
                                        type="date"
                                        name="from"
                                        className="form-control radius-10"
                                        value={filters.from}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>To Date</label>
                                    <input
                                        type="date"
                                        name="to"
                                        className="form-control radius-10"
                                        value={filters.to}
                                        onChange={handleFilterChange}
                                        min={filters.from}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
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
                                </div>
                                <div className="col-md-3 mb-3 d-flex align-items-center justify-content-between">
                                    <div style={{ width: "80%" }}>
                                        <label>Select Stock</label>
                                        <Select
                                            options={options}
                                            value={options.find((option) => option.value === searchstock) || null}
                                            onChange={handleChange1}
                                            isClearable
                                            placeholder="Select Stock"
                                        />
                                    </div>
                                    <div className="rfreshicon">
                                        <RefreshCcw onClick={resethandle} />
                                    </div>
                                </div>
                            </div>


                            {viewMode === "table" ? (
                                isLoading ? (
                                    <Loader />) : (
                                    <>
                                        <Table
                                            columns={columns}
                                            data={clients}
                                            totalRows={totalRows}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    </>
                                )
                            ) : (
                                <div className="row mt-3">
                                    {clients.map((client, index) => (
                                        <div className="col-md-12" key={index}>
                                            <div className="card radius-10 mb-3 border">
                                                <div className="card-body">
                                                    <p className='mb-1'><b>Date: {fDateTimeH(client?.created_at)}</b></p>
                                                    <p className='mb-2'><b>Segment: {client?.segment == "C" ? "CASH" : client?.segment == "O" ? "OPTION" : "FUTURE"}</b></p>
                                                    <p className='mb-1'> {client?.calltype} {client?.stock}  {client?.expirydate && `${client.expirydate}`} {client?.optiontype && `${client.optiontype}`} {client?.calltype} {client?.entrytype} {client?.price}  Target  {client?.tag1}{client?.tag2 && `/${client.tag2}`}
                                                        {client?.tag3 && `/${client.tag3}`}  {client?.stoploss && `SL ${client.stoploss}`}

                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <ReusableModal
                show={model}
                onClose={() => setModel(false)}
                title="Close Signal"
                size='lg'
                body={
                    <>

                        <div className='card mb-2'>
                            <div className='d-flex justify-content-between align-items-center card-body'>
                                {['Fully Closed', 'Partially Closed', 'SL Hit', 'Closed Signal', "Avoid Signal"].map((tab, index) => (
                                    <label key={index} className='labelfont'>
                                        <input
                                            type="radio"
                                            name="tab"
                                            checked={checkedIndex === index}
                                            onChange={() => handleTabChange(index)}
                                        />
                                        <span className='ps-2 fs-14'>{tab}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className='card'>
                            {checkedIndex === 0 && (
                                <form className='card-body'>


                                    <p>

                                        <label className='fs-14'><b> Target 1 :</b></label>
                                        <input
                                            type="number"
                                            className='form-control'
                                            style={{ width: "50%" }}
                                            disabled
                                            value={closedata.targetprice1 || closedata.tag1}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    targetprice1: e.target.value,
                                                })
                                            }

                                        />

                                    </p>

                                    <p>
                                        <label className='fs-14'><b> Target 2 :</b></label>
                                        <input
                                            type="number"
                                            style={{ width: "50%" }}
                                            className='form-control'
                                            disabled
                                            value={closedata.targetprice2 || closedata.tag2}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    targetprice2: e.target.value,
                                                })
                                            } />

                                    </p>

                                    <p>
                                        <label className='fs-14'><b> Target 3 :</b></label>
                                        <input
                                            type="number"
                                            style={{ width: "50%" }}
                                            className='form-control'
                                            disabled
                                            value={closedata.targetprice3 || closedata.tag3}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    targetprice3: e.target.value,
                                                })
                                            } />

                                    </p>

                                    {/* <div className="col-md-12">
                                                    <label htmlFor="input11" className="form-label">
                                                        Remark
                                                    </label>
                                                    <textarea
                                                        className="form-control"

                                                        id="input11"
                                                        placeholder="Remark ..."
                                                        rows={3}
                                                        value={closedata.close_description}
                                                        onChange={(e) =>
                                                            setClosedata({
                                                                ...closedata,
                                                                close_description: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div> */}

                                    <button type="submit" className='btn btn-primary mt-2' onClick={(e) => closeSignalperUser(0, e)}>Submit</button>
                                </form>
                            )}

                            {checkedIndex === 1 && (

                                checkedIndex === 1 && (
                                    <form className='card-body' onSubmit={(e) => closeSignalperUser(1, e)}>
                                        <div className="col-md-12">
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="target1"
                                                    checked={checkedTargets.target1 || !!closedata.targetprice1}
                                                    onChange={(e) => handleCheckboxChange(e, 'target1')}
                                                />
                                                <label className="form-check-label fs-14" htmlFor="target1">
                                                    <b> Target 1</b>
                                                </label>
                                            </div>

                                            {(checkedTargets.target1 || !!closedata.targetprice1) && (
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-control"
                                                        style={{ width: "50%" }}
                                                        type="number"
                                                        id="targethit1"
                                                        Value={closedata.targetprice1 || ""}
                                                        onChange={(e) => handleChange(e, 'targetprice1')}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="target2"
                                                    checked={checkedTargets.target2 || !!closedata.targetprice2}
                                                    onChange={(e) => handleCheckboxChange(e, 'target2')}
                                                />
                                                <label className="form-check-label fs-14" htmlFor="target2">
                                                    <b>Target 2</b>
                                                </label>
                                            </div>

                                            {(checkedTargets.target2 || !!closedata.targetprice2) && (
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        style={{ width: "50%" }}
                                                        id="targethit2"
                                                        Value={closedata.targetprice2 || ""}
                                                        onChange={(e) => handleChange(e, 'targetprice2')}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="target3"
                                                    checked={checkedTargets.target3 || !!closedata.targetprice3}
                                                    onChange={(e) => handleCheckboxChange(e, 'target3')}
                                                />
                                                <label className="form-check-label fs-14" htmlFor="target3">
                                                    <b> Target 3</b>
                                                </label>
                                            </div>

                                            {(checkedTargets.target3 || !!closedata.targetprice3) && (
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        style={{ width: "50%" }}
                                                        id="targethit3"
                                                        Value={closedata.targetprice3 || ""}
                                                        onChange={(e) => handleChange(e, 'targetprice3')}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="close_status"
                                                    checked={closedata.closestatus === true}
                                                    onChange={(e) =>
                                                        setClosedata({
                                                            ...closedata,
                                                            closestatus: e.target.checked,
                                                        })
                                                    }
                                                />
                                                <label className="form-check-label fs-14" htmlFor="close_status">
                                                    <b>Close</b>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label className='mb-1 fs-14'><b>Remark</b></label>
                                            <textarea
                                                className="form-control"
                                                id="close_description"
                                                placeholder="Remark ..."
                                                rows={2}
                                                value={closedata.close_description}
                                                onChange={(e) =>
                                                    setClosedata({
                                                        ...closedata,
                                                        close_description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <button type="submit" className='btn btn-primary mt-2'>Submit</button>
                                    </form>
                                )

                            )}


                            {checkedIndex === 2 && (
                                <form className='card-body'>

                                    <div className="col-md-12">

                                        <p>
                                            <label className='fs-14'><b>Stoploss: </b> </label>
                                            <input
                                                type="number"
                                                className='form-control'
                                                style={{ width: "50%" }}
                                                defaultValue={closedata.slprice}
                                                onChange={(e) =>
                                                    setClosedata({
                                                        ...closedata,
                                                        slprice: e.target.value,
                                                    })
                                                }

                                            />
                                        </p>


                                    </div>

                                    <div className="col-md-12">
                                        <label className='mb-1 fs-14'><b>Remark</b></label>
                                        <textarea
                                            className="form-control"
                                            id="input11"
                                            placeholder="Remark ..."
                                            rows={2}
                                            value={closedata.close_description}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    close_description: e.target.value,
                                                })
                                            }

                                        />
                                    </div>

                                    <button type="submit" className='btn btn-primary mt-2' onClick={(e) => closeSignalperUser(2, e)}>Submit</button>
                                </form>
                            )}

                            {checkedIndex === 3 && (
                                <form className='card-body'>

                                    <div className="col-md-12  mb-2">

                                        <label className='fs-14'><b>Exit price</b></label>
                                        <input
                                            type="number"
                                            className='form-control'
                                            style={{ width: "50%" }}
                                            value={closedata.exitprice}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    exitprice: e.target.value,
                                                })
                                            }

                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <label className='mb-1 fs-14'><b>Remark</b></label>
                                        <textarea
                                            className="form-control"
                                            id="input11"
                                            placeholder="Remark ..."
                                            rows={2}
                                            value={closedata.close_description}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    close_description: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <button type="submit" className='btn btn-primary mt-2' onClick={(e) => closeSignalperUser(3, e)}>Submit</button>
                                </form>
                            )}
                            {checkedIndex === 4 && (
                                <form className='card-body'>

                                    <div className="col-md-12">
                                        <label className='mb-1 fs-14'><b>Remark</b></label>
                                        <textarea
                                            className="form-control"
                                            id="input11"
                                            placeholder="Remark ..."
                                            rows={2}
                                            value={closedata.close_description}
                                            onChange={(e) =>
                                                setClosedata({
                                                    ...closedata,
                                                    close_description: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <button type="submit" className='btn btn-primary mt-2' onClick={(e) => closeSignalperUser(4, e)}>Submit</button>
                                </form>
                            )}
                        </div>

                    </>
                }

            />



            {/* {model1 && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div
                        className="modal fade show"
                        style={{ display: 'block' }}
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Upload Report
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setModel1(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-10">
                                                <label htmlFor="imageUpload">Upload Report </label>
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
                                                                Swal.fire({
                                                                    title: 'Error!',
                                                                    text: 'Only PDF files are allowed!.',
                                                                    icon: 'error',
                                                                    confirmButtonText: 'Try Again',
                                                                });
                                                                return;
                                                            }
                                                            updateServiceTitle({ report: file });
                                                        }
                                                    }}

                                                />
                                            </div>
                                            <div className="col-md-2">


                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label htmlFor="description">Description</label>
                                                <input
                                                    className="form-control mb-2"
                                                    type="text"
                                                    placeholder='Enter Description Title'
                                                    value={updatetitle.description}
                                                    onChange={(e) => updateServiceTitle({ description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                    </form>


                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setModel1(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={updateReportpdf}
                                    >
                                        Update File
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )} */}

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
                                                Swal.fire({
                                                    title: 'Error!',
                                                    text: 'Only PDF files are allowed!',
                                                    icon: 'error',
                                                    confirmButtonText: 'Try Again',
                                                });
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
                                <input
                                    className="form-control mb-2"
                                    type="text"
                                    placeholder="Enter Description Title"
                                    value={updatetitle.description}
                                    onChange={(e) => updateServiceTitle({ description: e.target.value })}
                                />
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


        </div>
    );
}

export default Signal;
