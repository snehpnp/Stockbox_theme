import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import Table from '../../../Extracomponents/Table1';
import { exportToCSV } from '../../../../Utils/ExportData';
import { getAllNotificationlist } from '../../../Services/Admin/Admin';
import { fDateTime } from '../../../../Utils/Date_formate';



const Notificationlist = () => {


    const token = localStorage.getItem('token');

    const [searchInput, setSearchInput] = useState('');
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const getClientData = async () => {
        try {
            const data = {
                page: currentPage
            };
            const response = await getAllNotificationlist(data, token);

            if (response?.status) {
                setTotalRows(response.pagination.totalItems);
                setClients(response.data);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };



    useEffect(() => {
        getClientData();
    }, [currentPage]);




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',

        },
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
            width: '300px',

        },
        {
            name: 'Message',
            selector: (row) => row.message,
            sortable: true,
            width: '600px',

        },
        {
            name: 'Date',
            selector: (row) => fDateTime(row.createdAt),
            sortable: true,

        },
    ];



    return (
        <div className="page-content">
            <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">All Notification</div>
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
                                placeholder="Search notification"
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
    );
};

export default Notificationlist;
