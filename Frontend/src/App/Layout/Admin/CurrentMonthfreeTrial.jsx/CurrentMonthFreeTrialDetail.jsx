import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FreeTrialDetail } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import Content from '../../../components/Contents/Content';



const CurrentMonthFreeTrialDetail = () => {

    const location = useLocation()
    const item = location?.state?.row


    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [ForGetCSV, setForGetCSV] = useState([])
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

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


    const monthName = item?.month?.split(' ')[0]; 
    const monthNumber = new Date(`${monthName} 1, 2000`).getMonth() + 1; 

    const year = item?.month?.slice(3)



    const gethistory = async () => {
        try {
            const data = { month: monthNumber, year: year, }
            const response = await FreeTrialDetail(data, token);
            if (response) {
                let filteredData = response;
                setTotalRows(response.totalRecords)
                setClients(filteredData);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };



    useEffect(() => {
        gethistory();
    }, [searchInput, location, currentPage]);


    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Name',
            selector: row => row.fullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone',
            selector: row => row.phoneNo,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Plan Title',
            selector: row => row?.plan_title,
            sortable: true,
            width: '200px',
        },
        {
            name: "Client Segment",
            cell: (row) => {
                return (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {row.services?.length > 0
                            ? row.services.join(", ")
                            : "N/A"}
                    </div>
                );
            },
            sortable: true,
            width: "200px",
        }




    ];








    return (
        <Content
            Page_title="Monthly Detail"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >

            <div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search "
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
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                data={clients}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default CurrentMonthFreeTrialDetail;
