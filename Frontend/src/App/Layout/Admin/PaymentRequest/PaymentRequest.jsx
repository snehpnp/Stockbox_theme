import React, { useState, useEffect } from 'react';
import { PaymentRequestlist, ChangePaymentStatus } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { fDateTime, fDateTimeH, fDate } from '../../../../Utils/Date_formate';
import { Link } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';
import { GetUserData } from '../../../Services/UserService/User';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';
import Loader from '../../../../Utils/Loader';


const PaymentRequest = () => {




    const token = localStorage.getItem('token');
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState('Pending');
    const [selectedValues, setSelectedValues] = useState({});

    const [isLoading, setIsLoading] = useState(true)




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
        setIsLoading(false)
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
                showCustomAlert('Success', 'Status updated successfully.')
                getpaymentrequest();
            } else {
                showCustomAlert('error', 'Failed to update status.')
                window.location.reload();
            }
        } catch (error) {
            showCustomAlert('error', 'Failed to update status.')
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
            width: '80px',
        },
        {
            name: 'User name',
            selector: row => <div>{row?.client_details?.FullName}</div>,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Mobile no',
            selector: row => <div>{row?.client_details?.PhoneNo}</div>,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Email Id',
            selector: row => <div>{row?.client_details?.Email}</div>,
            sortable: true,
            width: '300px',

        },
        {
            name: 'Available balance',
            selector: row => <div> <IndianRupee />{(row?.client_details?.wamount).toFixed(2)}</div>,
            sortable: true,
            width: '220px',
        },
        {
            name: 'Amount',
            selector: row => <div> <IndianRupee />{(row?.amount).toFixed(2)}</div>,
            sortable: true,
            width: '130px',
        },
        {
            name: 'Requested Date',
            selector: row => fDateTime(row.created_at),
            sortable: true,
            width: '195px',
        },
        {
            name: 'Updated At',
            selector: row => fDateTime(row.updated_at),
            sortable: true,
            width: '160px',
        },
        {
            name: 'Status',
            selector: row => {
                switch (row.status) {
                    case 0:
                        return "Pending";
                    case 1:
                        return "Completed";
                    case 2:
                        return "Rejected";
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
                <div >
                    <select
                        className='form-select' style={{ width: "120px", marginRight: "100px" }}
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
        const selectedValue = event.target.value;
        const statusMap = {
            0: 'Pending',
            1: 'Complete',
            2: 'Reject',
        };

        const result = await showCustomAlert("confirm", "Do you want to save the changes?");

        if (result.isConfirmed) {
            try {
                await Updatestatus(rowId, selectedValue);
                setSelectedValues((prevValues) => ({
                    ...prevValues,
                    [rowId]: selectedValue,
                }));
            } catch (error) {
                showCustomAlert('error', 'There was a problem updating the status.')
            }
        } else {
            window.location.reload()
        }
    };




    const filterDataByStatus = (status) => {
        return clients.filter(item => item.status === status);
    };





    const renderTable = (status) => {
        const filteredData = filterDataByStatus(status);
    
        return (
            <div className="table-responsive">
                <h5>{activeTab} Transactions</h5>
    
                {isLoading ? (
                    <Loader/>
                ) : filteredData.length > 0 ? (
                    <Table columns={columns} data={filteredData} />
                ) : (
                    <div className="text-center mt-5">
                        <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                    </div>
                )}
            </div>
        );
    };
    




    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };





    return (
        <div>
            <div className='page-content'>

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Withdrawal Request</div>
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

                <div className='card'>
                    <div className=''>



                       


                        <div className="tab-content" id="myTabContent3">
                            <div className="tab-pane fade show active" id="NavPills">
                                <div className="card-body pt-0">
                                    <div className="d-lg-flex align-items-center mb-4 gap-3">
                                       
                                    </div>

                                    <ul className="nav nav-pills border-bottom nav-pills1 mb-4 light justify-content-center" id="pills-tab" role="tablist">
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
