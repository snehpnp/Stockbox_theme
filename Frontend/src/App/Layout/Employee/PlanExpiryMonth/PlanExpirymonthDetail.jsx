import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GetPlanexpiryCount } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table1';
import Content from '../../../components/Contents/Content';



const PlanExpirymonthDetail = () => {

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



    // const getexportfile = async () => {
    //     try {
    //         const data = { page: "", fromDate: startDate, toDate: endDate, search: searchInput }
    //         const response = await getPayementhistory(data, token);
    //         if (response.status) {
    //             if (response.data?.length > 0) {
    //                 const csvArr = response.data?.map((item) => ({
    //                     Name: item.clientName || "-",
    //                     Email: item.clientEmail || "-",
    //                     Phone: item.clientPhoneNo || "-",
    //                     Title: item?.planCategoryTitle || '-',
    //                     ClientSegment: item?.serviceNames.map(statusItem => statusItem || 'N/A')
    //                         .join(', ') || 'N/A',
    //                     OerderId: item.orderid ? item.orderid : "Make By Admin",
    //                     PlanDiscount: item.discount || 0,
    //                     CouponID: item.coupon || "N/A",
    //                     PlanAmount: item.plan_price || 0,
    //                     Total: item?.total || '-',
    //                     Validity: item.planDetails?.validity || '-',
    //                     PurchaseDate: fDateTime(item.created_at) || '-',
    //                 }));
    //                 exportToCSV(csvArr, 'Payment History')
    //             } else {
    //                 console.log("No data available.");
    //             }
    //         } else {
    //             console.error("Failed to fetch data:", response.status);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching clients:", error);
    //     }
    // };


    const monthCode = item?.month?.slice(0, 2);
    const year = item?.month?.slice(2)




    const gethistory = async () => {
        try {
            const data = { page: currentPage, month: monthCode, year: year, search: searchInput }
            const response = await GetPlanexpiryCount(data, token);
            if (response.status) {
                let filteredData = response.data;
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
            selector: row => row.client_name,
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
            selector: row => row.phone,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Total Month',
            selector: row => row?.totalMonths,
            sortable: true,
            width: '200px',
        },



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
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default PlanExpirymonthDetail;
