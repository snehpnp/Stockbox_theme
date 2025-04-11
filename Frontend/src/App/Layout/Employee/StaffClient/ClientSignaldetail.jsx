import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '../../../Extracomponents/Table1';
import { RefreshCcw, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';
import { GetSignallist, GetSignallistWithFilter, GetService, GetStockDetail, GetClientSignaldetail, Getclientsignaltoexport } from '../../../Services/Admin/Admin';
import { fDateTimeH, fDateTimeSuffix } from '../../../../Utils/Date_formate'
import { exportToCSV } from '../../../../Utils/ExportData';
import Select from 'react-select';
import { Tooltip } from 'antd';
import { image_baseurl } from '../../../../Utils/config';



const ClientSignaldetail = () => {

    const { id } = useParams()

    const token = localStorage.getItem('token');
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        service: '',
        stock: '',
    });


    const [clients, setClients] = useState([]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const [serviceList, setServiceList] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [searchstock, setSearchstock] = useState("");
    const [ForGetCSV, setForGetCSV] = useState([])

    const [checkedIndex, setCheckedIndex] = useState(null);




    const getexportfile = async () => {
        try {
            const data = { client_id: id }
            const response = await Getclientsignaltoexport(data, token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({
                        Symbol: item?.tradesymbol || "-",
                        segment: item?.segment || "-",
                        EntryType: item?.calltype || "-",
                        EntryPrice: item?.price || "-",
                        ExitPrice: item?.closeprice || "-",
                        EntryDate: fDateTimeH(item?.created_at) || "-",
                        ExitDate: fDateTimeH(item?.closedate) || "-",
                    }));
                    exportToCSV(csvArr, 'Signal Details');
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
                client_id: id,
                from: filters.from,
                to: filters.to,
                service_id: filters.service,
                stock: searchstock,
                type: "",
                search: searchInput,
            };

            const response = await GetClientSignaldetail(data, token);

            if (response && response.status) {
                setTotalRows(response.pagination.total);
                setClients(response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
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





    useEffect(() => {
        fetchAdminServices()
        fetchStockList()
    }, [filters]);


    useEffect(() => {
        getAllSignal();
    }, [filters, searchInput, searchstock, currentPage]);



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };


    const options = clients.map((item) => ({
        value: item.stock,
        label: item.stock,
    }));

    const handleChange1 = (selectedOption) => {
        setSearchstock(selectedOption ? selectedOption.value : "");
    };





    // colums
    let columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '78px',
        },
        {
            name: 'Segment',
            selector: row => row.segment == "C" ? "CASH" : row.segment == "O" ? "OPTION" : "FUTURE",
            sortable: true,
            width: '132px',
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
            name: 'Quantity/Lot',
            selector: row => row.lot,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Price',
            selector: row => <div> <IndianRupee />{(row.price).toFixed(2)}</div>,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Exit Price',
            selector: row => row.closeprice ? row.closeprice : '-',
            sortable: true,
            width: '132px',

        },
        {
            name: 'Entry Date',
            selector: row => fDateTimeH(row.created_at),
            sortable: true,
            width: '250px',
        },
        {
            name: 'Exit Date',
            selector: row => row.closeprice ? fDateTimeSuffix(row.closedate) : "-",
            sortable: true,
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



    return (
        <div>
            <div>
                <div className="page-content">

                    <div className="row">
                        <div className="col-md-6">
                            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                                <div className="breadcrumb-title pe-3">Signal Details</div>
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
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <Link to="/admin/client">
                                <Tooltip title="Back">
                                    <i className="lni lni-arrow-left-circle" style={{ fontSize: "2rem", color: "#000" }} />
                                </Tooltip>
                            </Link>
                        </div>
                    </div>
                    <hr />
                    <div className="card">
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

                    </div>

                </div>
            </div>

        </div>
    );
}

export default ClientSignaldetail;
