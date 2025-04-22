import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReferAndEarnlist } from '../../../Services/Admin/Admin';
// import Table from '../../../components/Table';
import Table from '../../../Extracomponents/Table1';
import { SquarePen, Trash2, PanelBottomOpen, Eye, RefreshCcw, IndianRupee, ArrowDownToLine } from 'lucide-react';
import { fDateTime, fDateTimeH } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';





const ReferAndEarnlist = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");



    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const [isLoading, setIsLoading] = useState(true)


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const getlist = async () => {
        try {
            const data = { page: currentPage, clientName: searchInput }
            const response = await getReferAndEarnlist(data, token);
            if (response.status) {
                let filteredData = response.data;


                setTotalRows(response.pagination.totalRecords)
                setClients(filteredData);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoading(false)
    };



    useEffect(() => {
        getlist();
    }, [searchInput, currentPage]);



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
            width: '150px',
        },
        {
            name: 'Token',
            selector: row => row?.token,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Receiver Amount',
            selector: row => <div> <IndianRupee style={{height:"20px",marginRight: "-3px"}}/>{row?.receiveramount?.toFixed(2)}</div>,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Sender Amount',
            selector: row => <div> <IndianRupee style={{height:"20px",marginRight: "-3px"}}/>{row?.senderamount?.toFixed(2)}</div>,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Receiver Earn',
            selector: row => <div> <IndianRupee style={{height:"20px",marginRight: "-3px"}}/>{row?.receiverearn?.toFixed(2)}</div>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Sender Earn',
            selector: row => <div> <IndianRupee style={{height:"20px",marginRight: "-3px"}}/>{row?.senderearn?.toFixed(2)}</div>,
            sortable: true,
            width: '200px',
        },



    ];








    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Refer And Earn List</div>
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
                        <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search ..."
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>

                            </div>
                            <div>
                            </div>
                        </div>
                        {isLoading ? (
                            <Loader />
                        ) : clients.length > 0 ? (
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    data={clients}
                                    totalRows={totalRows}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        ) : (
                            <div className="text-center mt-5">
                                <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferAndEarnlist;
