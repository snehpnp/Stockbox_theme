import React, { useState, useEffect } from 'react';
import { PaymentRequestlist, ChangePaymentStatus } from '../../../Services/Admin';
import Table from '../../../components/Table';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../Utils/Date_formate';
import { Link } from 'react-router-dom';

const PaymentRequest = () => {
    const token = localStorage.getItem('token');
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState('Pending');
    const [selectedValues, setSelectedValues] = useState({});





    const getpaymentrequest = async () => {
        try {
            const response = await PaymentRequestlist(token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };






    const Updatestatus = async (id, status) => {
        try {
            const data = {
                payoutRequestId: id,
                remark: status == 0 ? "Pending" : status == 1 ? "Complete" : "Reject",
                status: status
            };
            const response = await ChangePaymentStatus(data, token);
            if (response.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message || "Status updated successfully.",
                    timer: 2000
                });
                getpaymentrequest();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to update the request. Please try again.',
                    timer: 2000
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An unexpected error occurred. Please try again.',
                timer: 2000
            });
            console.log("Error:", error);
        }
    };





    useEffect(() => {
        getpaymentrequest();
    }, [searchInput]);





    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '70px',
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => fDateTime(row.created_at),
            sortable: true,
        },
        {
            name: 'Updated At',
            selector: row => fDateTime(row.updated_at),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => {
                switch (row.status) {
                    case 0:
                        return "Pending";
                    case 1:
                        return "Complete";
                    case 2:
                        return "Reject";
                    default:
                        return "Unknown";
                }
            },
            sortable: true,
        }
    ];





    if (activeTab === 'Pending') {
        columns.push({
            name: 'Action',
            selector: row => (
                <div>
                    <select
                        className="form-select"
                        onChange={(event) => handleSelectChange(row._id, event)}
                        defaultValue={selectedValues[row._id] || "0"}

                    >
                        <option value="0">Pending</option>
                        <option value="2">Reject</option>
                        <option value="1">Complete</option>
                    </select>
                </div>
            ),
            sortable: false,
        });
    }





    const handleSelectChange = async (rowId, event) => {
        const newSelectedValues = {
            ...selectedValues,
            [rowId]: event.target.value,
        };
        setSelectedValues(newSelectedValues);
        await Updatestatus(rowId, newSelectedValues[rowId]);
    };




    const filterDataByStatus = (status) => {
        return clients.filter(item => item.status === status);
    };





    const renderTable = (status) => {
        return (
            <div className="table-responsive">
                <h5>{activeTab} Transactions</h5>
                <Table columns={columns} data={filterDataByStatus(status)} />
            </div>
        );
    };




    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };





    return (
        <div>
            <div className='page-content'>

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

                <div className='card'>
                    <div className='card-body'>



                        {/* <div className="card-header flex-wrap border-0">
                                        <h4 className="card-title">Payment Request</h4>
                                    </div> */}


                        <div className="tab-content" id="myTabContent3">
                            <div className="tab-pane fade show active" id="NavPills">
                                <div className="card-body pt-0">
                                    <div className="d-lg-flex align-items-center mb-4 gap-3">
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control ps-5 radius-10"
                                                placeholder="Search Order"
                                                defaultValue=""
                                            />
                                            <span className="position-absolute top-50 product-show translate-middle-y">
                                                <i className="bx bx-search" />
                                            </span>
                                        </div>

                                    </div>

                                    <ul className="nav nav-pills nav-pills1 mb-4 light">
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link navlink ${activeTab === 'Pending' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('Pending')}
                                            >
                                                Pending
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link navlink ${activeTab === 'Complete' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('Complete')}
                                            >
                                                Complete
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link navlink ${activeTab === 'Reject' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('Reject')}
                                            >
                                                Reject
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="navpills-1" className={`tab-pane ${activeTab === 'Pending' ? 'active' : ''}`}>
                                            {renderTable(0)}
                                        </div>
                                        <div id="navpills-2" className={`tab-pane ${activeTab === 'Complete' ? 'active' : ''}`}>
                                            {renderTable(1)}
                                        </div>
                                        <div id="navpills-3" className={`tab-pane ${activeTab === 'Reject' ? 'active' : ''}`}>
                                            {renderTable(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentRequest;
