import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import Table from '../../../Extracomponents/Table1';
import { exportToCSV } from '../../../../Utils/ExportData';
import { getclientPlanexpiry, getclientPlanexpirywithfilter, GetService } from '../../../Services/Admin/Admin';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';




const Planexpiry = () => {


    const token = localStorage.getItem('token');

    const [searchInput, setSearchInput] = useState('');
    const [searchStock, setSearchStock] = useState('');
    const [clients, setClients] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [ForGetCSV, setForGetCSV] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    //state for loading
    const [isLoading, setIsLoading] = useState(true)

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAdminServices = async () => {
        try {
            const response = await GetService(token);
            if (response?.status) {
                setServiceList(response.data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const getClientData = async () => {
        try {
            const data = {
                page: currentPage,
                serviceid: searchStock,
                startdate: startDate,
                endddate: endDate,
                search: searchInput,
            };
            const response = await getclientPlanexpirywithfilter(data, token);
            if (response?.status) {
                setClients(response.data);
                setTotalRows(response.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
        setIsLoading(false)
    };





    const getexportfile = async () => {
        try {
            const response = await getclientPlanexpiry(token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({
                        FullName: item.clientFullName || '',
                        Email: item.clientEmail || '',
                        PhoneNo: item.clientMobile || '',
                        Segment: item.serviceTitle || '',
                        StartDate: fDateTime(item.startdate) || '',
                        EndDate: fDateTime(item.enddate) || '',
                    }));
                    exportToCSV(csvArr, 'Client Plan Expiry')
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




    const resetFilters = () => {
        setSearchInput('');
        setSearchStock('');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchAdminServices();
    }, []);



    useEffect(() => {
        getClientData();
    }, [searchInput, searchStock, currentPage, startDate, endDate]);



    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Full Name',
            selector: (row) => row.clientFullName,
            sortable: true, width: '200px'
        },
        {
            name: 'Email',
            selector: (row) => row.clientEmail,
            sortable: true, width: '300px'
        },
        {
            name: 'Mobile',
            selector: (row) => row.clientMobile,
            sortable: true, width: '200px'
        },
        {
            name: 'Segment',
            selector: (row) => row.serviceTitle,
            sortable: true, width: '200px'
        },
        {
            name: 'Start Date',
            selector: (row) => fDateTime(row.startdate),
            sortable: true, width: '200px'
        },
        {
            name: 'End Date',
            selector: (row) => fDateTime(row.enddate),
            sortable: true, width: '200px'
        },
    ];

    return (
        <div className="page-content">
            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Plan Expiry</div>
                <div className="ps-3">
                    <Link to="/admin/dashboard">
                        <i className="bx bx-home-alt" />
                    </Link>
                </div>
            </div>
            <hr />
            <div className="card">
                <div className="card-body">
                    <div className="d-sm-flex align-items-center mb-4 gap-3">
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control ps-5 radius-10"
                                placeholder="Search Client"
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
                    <div className="row ">
                        <div className="col-md-3 mb-3">
                            <label>Select From Date</label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => setStartDate(e.target.value)}
                                value={startDate}
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Select To Date</label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => setEndDate(e.target.value)}
                                value={endDate}
                            />
                        </div>
                        <div className="col-md-3 ">
                            <label>Select Service</label>
                            <select
                                className="form-control radius-10"
                                value={searchStock}
                                onChange={(e) => setSearchStock(e.target.value)}
                            >
                                <option value="">Select Service</option>
                                {serviceList.map((service) => (
                                    <option key={service._id} value={service._id}>
                                        {service.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 mb-3 justify-content-between d-flex align-items-center mt-3">
                            <RefreshCcw className="refresh-icon" onClick={resetFilters} />
                        </div>
                    </div>

                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <Table
                                columns={columns}
                                data={clients}
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Planexpiry;
