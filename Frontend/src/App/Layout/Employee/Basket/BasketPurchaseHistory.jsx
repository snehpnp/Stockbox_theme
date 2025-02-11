import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllSubscriptionListById } from '../../../Services/Admin/Admin';
// import Table from '../../../components/Table';
import Table from '../../../Extracomponents/Table1';
import { SquarePen, Trash2, PanelBottomOpen, Eye, RefreshCcw, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../Utils/Date_formate';
import { exportToCSV } from '../../../../Utils/ExportCSV';
import Content from '../../../components/Contents/Content'; 




const BasketPurchaseHistory = () => {


  const { id } = useParams()

  const [clients, setClients] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [ForGetCSV, setForGetCSV] = useState([])
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const token = localStorage.getItem('token');



  const resethandle = () => {
    setSearchInput("")
    setStartDate("")
    setEndDate("")


  }




  const gethistory = async () => {
    try {
      const data = { basket_id: id, page: currentPage, fromDate: startDate, toDate: endDate, search: searchInput }
      const response = await getAllSubscriptionListById(data, token);
      if (response.status) {
        let filteredData = response.data;
        setTotalRows(response.pagination.total)
        setClients(filteredData);
      }
    } catch (error) {
      console.log("Error fetching services:", error);
    }
  };



  useEffect(() => {
    gethistory();
  }, [searchInput, startDate, endDate, currentPage]);



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
    {
      name: 'Order_ID',
      selector: row => row.orderid ? row.orderid : "Make By Admin",
      sortable: true,
      width: '200px',
    },
    // {
    //     name: 'Plan Discount',
    //     selector: row => <div> <IndianRupee />{row.discount}</div>,
    //     sortable: true,
    //     width: '200px',
    // },

    {
      name: 'Plan Amount',
      selector: row => <div> <IndianRupee />{row.plan_price}</div>,
      sortable: true,
      width: '200px',
    },

    // {
    //     name: 'Coupon Id',
    //     selector: row => row.coupon ? row.coupon : "N/A",
    //     sortable: true,
    //     width: '200px',
    // },

    {
      name: 'Total',
      selector: row => <div> <IndianRupee />{row.total}</div>,
      sortable: true,
      width: '200px',
    },

    {
      name: 'Validity',
      selector: row => row.validity,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Purchase Date.',
      selector: row => fDateTime(row?.created_at),
      sortable: true,
      width: '200px',
    },

  ];




  return (

    <Content
      Page_title="Basket History"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <div>
        <div className="card">
          <div className="card-body">
            <div className="d-lg-flex align-items-center mb-4 gap-3 justify-content-between">

              <div className="position-relative">
                <input
                  type="text"
                  className="form-control ps-5 radius-10"
                  placeholder="Search History"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <span className="position-absolute top-50 product-show translate-middle-y">
                  <i className="bx bx-search" />
                </span>

              </div>

            </div>
            <div className='row mb-2'>
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


export default BasketPurchaseHistory;