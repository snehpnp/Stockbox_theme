import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClientRequestforfilter, DeleteClientRequest } from '../../../../Services/Admin/Admin';
import Table from '../../../../Extracomponents/Table1';
import { SquarePen, Trash2, PanelBottomOpen, Eye, RefreshCcw, IndianRupee } from 'lucide-react';
import { image_baseurl } from '../../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../../Utils/Date_formate';
import Loader from '../../../../../Utils/Loader'
import showCustomAlert from '../../../../Extracomponents/CustomAlert/CustomAlert';



const ClientRequest = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [ForGetCSV, setForGetCSV] = useState([])
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    //state for loading
    const [isLoading, setIsLoading] = useState(true)

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const resethandle = () => {
        setSearchInput("")
        setStartDate("")
        setEndDate("")
    }





    const gethistory = async () => {
        try {
            const data = { page: currentPage, search: searchInput }
            const response = await getClientRequestforfilter(data, token);
            if (response.status) {
                setTotalRows(response.pagination.total)
                setClients(response?.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoading(false)
    };



    useEffect(() => {
        gethistory();
    }, [searchInput, currentPage]);



    // staff delete 

    const DeleteClient = async (_id) => {
        try {
            const result = await showCustomAlert("confirm", 'Do you want to delete this member This action cannot be undone.');

            if (result) {
                const response = await DeleteClientRequest(_id, token);
                if (response.status) {
                    showCustomAlert("Success", 'The Client has been successfully deleted.');
                    gethistory();
                }
            } else {
                showCustomAlert("error", 'The Client deletion was cancelled.');

            }
        } catch (error) {
            showCustomAlert("error", 'There was an error deleting the Client.');

        }
    };




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Full Name',
            selector: row => row?.FullName,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Email',
            selector: row => row?.Email,
            sortable: true,
            width: '350px',
        },
        {
            name: 'Phone',
            selector: row => row?.PhoneNo,
            sortable: true,
            width: '250px',
        },

        {
            name: 'Type',
            selector: row => row?.type,
            sortable: true,
            width: '200px',
        },
        // {
        //     name: 'Service',
        //     selector: row =>
        //         row?.planData?.serviceTitles?.length > 0
        //             ? row?.planData?.serviceTitles.join(", ")
        //             : row?.basketData?.map(item => item.title).join(", "),
        //     sortable: true,
        //     width: '200px',
        // },
        {
            name: 'Entry time',
            selector: row => fDateTime(row.created_at),
            sortable: true,
            width: '200px',
        },


        {
            name: 'Actions',
            cell: row => (
                <>
                    <div >
                        <Tooltip placement="top" overlay="Delete">
                            <Trash2 onClick={() => DeleteClient(row._id)} />
                        </Tooltip>
                    </div>


                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '230px',
        }
    ];



    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Client Request</div>
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
                <div className="card">
                    <div className="card-body">
                        <div className="d-lg-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search Client Request"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>

                            </div>


                            {/* <div>

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
                            </div> */}
                        </div>

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table 
                                        columns={columns}
                                        data={clients}
                                        totalRows={totalRows}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ClientRequest;
