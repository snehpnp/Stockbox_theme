import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import Table from '../../../Extracomponents/Table1';
import { exportToCSV } from '../../../../Utils/ExportData';
import { GetRatingList } from '../../../Services/Admin/Admin';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';


const Rating = () => {







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

    const GetRatingData = async () => {
        try {
            const data = {
                page: currentPage,
                search: searchInput,

            };
            const response = await GetRatingList(data, token);
            if (response?.status) {
                setClients(response.data);
                setTotalRows(response.pagination.total);
            }
        } catch (error) {
            console.log('Error fetching services:', error);
        }

        setIsLoading(false)
    };




    const getexportfile = async () => {
        try {
            const data = {
                page: currentPage,
                search: searchInput
            };
            const response = await GetRatingList(data, token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({
                        FullName: item.clientFullName || '',
                        Email: item.clientEmail || '',
                        PhoneNo: item.clientMobile || '',
                        Segment: item.serviceTitle || '',
                        startdate: fDateTime(item.startdate) || '',
                        enddate: fDateTime(item.enddate) || '',
                    }));

                    exportToCSV(csvArr, 'Client Plan Expiry')
                } else {
                    console.log("No data available.");
                }
            } else {
                console.log("Failed to fetch data:", response.status);
            }
        } catch (error) {
            console.log("Error fetching clients:", error);
        }
    };




    const resetFilters = () => {
        setSearchInput('');
        setSearchStock('');
    };



    useEffect(() => {
        GetRatingData();
    }, [currentPage, searchInput]);


    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Full Name',
            selector: (row) => row?.client?.name,
            sortable: true, width: '200px'
        },
        {
            name: 'Email',
            selector: (row) => row?.client?.email,
            sortable: true, width: '300px'
        },
        {
            name: 'Mobile',
            selector: (row) => row?.client?.phone,
            sortable: true, width: '200px'
        },
        {
            name: 'Rating',
            cell: (row) => {
                const rating = parseFloat(row?.rating) || 0;
                const stars = [];

                for (let i = 1; i <= 5; i++) {
                    if (rating >= i) {
                        stars.push(<FaStar key={i} color="#ffc107" />);
                    } else if (rating >= i - 0.5) {
                        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
                    } else {
                        stars.push(<FaRegStar key={i} color="#e4e5e9" />);
                    }
                }

                return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
            },
            width: '200px',
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row?.text ? row?.text : "-",
            sortable: true, width: '200px'
        },
        {
            name: 'Start Date',
            selector: (row) => fDateTime(row?.created_at),
            sortable: true, width: '200px'
        },

    ];



    return (
        <div className="page-content">
            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Rating</div>
                <div className="ps-3">
                    <Link to="/admin/dashboard">
                        <i className="bx bx-home-alt" />
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
                                placeholder="Search .."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
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
                    {/* <div className="row mb-2">
                        <div className="col-md-3">
                            <label>Select From Date</label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => setStartDate(e.target.value)}
                                value={startDate}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Select To Date</label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => setEndDate(e.target.value)}
                                value={endDate}
                            />
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-3 d-flex align-items-center mt-3">
                            <RefreshCcw className="refresh-icon" onClick={resetFilters} />
                        </div>
                    </div> */}

                    {isLoading ? (
                        <Loader />
                    ) : clients.length > 0 ? (
                        <>
                            <Table
                                columns={columns}
                                data={clients}
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center mt-5">
                            <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Rating;
