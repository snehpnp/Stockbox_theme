import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GETPlanList } from '../../../Services/UserService/User';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen, Eye, RefreshCcw, IndianRupee, ArrowDownToLine } from 'lucide-react';
import Swal from 'sweetalert2';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../Utils/Date_formate';
import { exportToCSV } from '../../../../Utils/ExportData';
import Loader from '../../../../Utils/Loader';




const PaymentHistory = () => {


  const token = localStorage.getItem('Token');
  const userid = localStorage.getItem('id');

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isLoading, setIsLoading] = useState(true);



  const resethandle = () => {
    setSearchInput("")
    setStartDate("")
    setEndDate("")


  }



  // const getexportfile = async () => {
  //   try {
  //     const response = await getPayementhistory(token);
  //     if (response.status) {
  //       if (response.data?.length > 0) {
  //         const csvArr = response.data?.map((item) => ({
  //           Name: item.clientName || "-",
  //           Email: item.clientEmail || "-",
  //           Phone: item.clientPhoneNo || "-",
  //           Title: item?.planCategoryTitle || '-',
  //           ClientSegment: item?.serviceNames.map(statusItem => statusItem || 'N/A')
  //             .join(', ') || 'N/A',
  //           OerderId: item.orderid ? item.orderid : "Make By Admin",
  //           PlanDiscount: item.discount || 0,
  //           CouponID: item.coupon || "N/A",
  //           PlanAmount: item.plan_price || 0,
  //           Total: item?.total || '-',
  //           Validity: item.planDetails?.validity || '-',
  //           PurchaseDate: fDateTime(item.created_at) || '-',
  //         }));
  //         exportToCSV(csvArr, 'Payment History')
  //       } else {
  //         console.log("No data available.");
  //       }
  //     } else {
  //       console.error("Failed to fetch data:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching clients:", error);
  //   }
  // };







  const gethistory = async () => {
    try {
      const response = await GETPlanList(userid, token);
  

      if (response.status) {
        let filteredData = response?.data;
        setClients(filteredData);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("Error fetching services:", error);
    }
  };



  useEffect(() => {
    gethistory();
  }, [searchInput, startDate, endDate]);




  const columns = [
    {
      name: 'S.No',
      selector: (row, index) => (currentPage - 1) * 10 + index + 1,
      sortable: false,
      width: '100px',
    },
    {
      name: 'Title',
      selector: row => row?.categoryDetails?.title,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Client Segment',
      cell: row => (
        <>
          {Array.isArray(row?.serviceNames) && row.serviceNames.length > 0 ? (
            row.serviceNames.map((item, index) => (
              <span
                key={index}
                style={{

                  marginRight: '5px',
                }}
              >
                {item || "N/A"}
              </span>
            ))
          ) : (
            <span>N/A</span>
          )}
        </>
      ),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Order_ID',
      selector: row => row.orderid ? row.orderid : "Make By Admin",
      sortable: true,
      width: '200px',
    },

    {
      name: 'Plan Amount',
      selector: row => <div> <IndianRupee />{row.plan_price}</div>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Plan Discount',
      selector: row => <div> <IndianRupee />{row?.discount}</div>,
      sortable: true,
      width: '200px',
    },

    {
      name: 'Coupon Id',
      selector: row => row.coupon ? row.coupon : "N/A",
      sortable: true,
      width: '200px',
    },
    {
      name: 'Total',
      selector: row => <div> <IndianRupee />{row.total}</div>,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Validity',
      selector: row => row?.planDetails?.validity,
      sortable: true,
      width: '200px',
    },
    // {
    //   name: 'Purchase Date.',
    //   selector: row => fDateTime(row?.created_at),
    //   sortable: true,
    //   width: '200px',
    // },

  ];








  return (
    <div>
      <div className="page-content">

        <div className="page-breadcrumb  d-flex align-items-center mb-3">
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
        <hr />
        <div className="card">
          <div className="card-body">
            <div className="d-lg-flex align-items-center mb-4 gap-3 justify-content-between">

              {/* <div className="position-relative">
                <input
                  type="text"
                  className="form-control ps-5 radius-10"
                  placeholder="Search Payment History"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <span className="position-absolute top-50 product-show translate-middle-y">
                  <i className="bx bx-search" />
                </span>

              </div> */}
            </div>
            {/* <div className='row mb-2'>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
              </div>


              <div className='col-md-3'>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>

              <div className="col-md-1">
                <div className="refresh-icon mt-1">
                  <RefreshCcw onClick={resethandle} />
                </div>
              </div>
            </div> */}
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

export default PaymentHistory;
