import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrokerResponsedata } from '../../../Services/UserService/User';
import Table from '../../../Extracomponents/Table1';
import { RefreshCcw, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../../Utils/Date_formate';





const BrokerReponse = () => {


    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [responsedata, setResponseData] = useState([])


    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const getbrokerhistory = async () => {
        try {
            const data = { clientid: userid }
            const response = await BrokerResponsedata(data, token);
            if (response.status) {
                console.log("response response", response?.data);
                setResponseData(response?.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };




    useEffect(() => {
        getbrokerhistory();
    }, []);





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



    ];


    return (
        <div>
            <div className="page-content">
                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Broker Response</div>
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
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                data={responsedata}
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrokerReponse;
