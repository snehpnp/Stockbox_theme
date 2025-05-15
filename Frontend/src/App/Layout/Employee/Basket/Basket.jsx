import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, RefreshCcw, Trash2, SquarePen, IndianRupee, X, Plus, RotateCcw } from 'lucide-react';
import { Tooltip } from 'antd';
// import Table from "../../../components/Table";
import Table from '../../../Extracomponents/Table1';
import { BasketAllList, deletebasket, Basketstatus, changestatusrebalance, getstocklistById, getstaffperuser } from "../../../Services/Admin/Admin";
import { fDate } from "../../../../Utils/Date_formate";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";



const Basket = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem('id');


  const navigate = useNavigate();


  const [clients, setClients] = useState([]);
  const [stockdata, setStockdata] = useState({})

  const [searchInput, setSearchInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState([]);



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  // Fetch basket list
  const getbasketlist = async () => {
    try {
      const data = { page: currentPage, search: searchInput || "" }
      const response = await BasketAllList(data, token);

      if (response.status) {
        setClients(response.data);
        setTotalRows(response.pagination.totalRecords);
      }
    } catch (error) {
      console.log("error");
    }
    setIsLoading(false)
  };



  const getpermissioninfo = async () => {
    try {
      const response = await getstaffperuser(userid, token);


      if (response.status) {
        setPermission(response.data.permissions);
      }
    } catch (error) {
      console.log("error", error);
    }
  }


  useEffect(() => {
    getpermissioninfo()

  }, [])


  useEffect(() => {
    getbasketlist()

  }, [searchInput, currentPage])





  const handleSwitchChange = async (event, id) => {
    const user_active_status = true;
    const data = { id, status: user_active_status };

    try {
      const result = await showCustomAlert("confirm", "Do you want to save the changes?");
      if (!result?.isConfirmed) {
        event.target.checked = !event.target.checked;
        return;
      }

      const response = await Basketstatus(data, token);
      if (response?.status) {
        showCustomAlert("success", response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      event.target.checked = !event.target.checked;
      showCustomAlert("error", error.message, "There was an error processing your request.");
    } finally {
      getbasketlist();
    }
  };






  const handleSwitchChange1 = async (event, id) => {
    const originalChecked = event.target.checked;
    const user_active_status = originalChecked
    const data = { id: id, status: user_active_status };
    const confirmed = await showCustomAlert("confirm", "Do you want to save the changes ?");

    if (!confirmed) return
    try {
      const response = await changestatusrebalance(data, token);
      if (response.status) {
        showCustomAlert("Success", "Publish Stock Successfully ")
      } else {
        showCustomAlert("error", response.message)
      }
      getbasketlist();
    } catch (error) {
      showCustomAlert("error", "There was an error processing your request.")
    }
  };




  // Delete basket


  const Deletebasket = async (_id) => {
    try {
      const result = await showCustomAlert("confirm", "Do you want to delete this item? This action cannot be undone.");

      if (!result.isConfirmed) return;

      const response = await deletebasket(_id, token);

      if (response?.status) {
        showCustomAlert("success", "The item has been successfully deleted.");
        getbasketlist();
      } else {
        showCustomAlert("error", response?.message || "Failed to delete item.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showCustomAlert("error", "There was an error deleting the item.");
    }
  };



  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }



  const columns = [
    {
      name: 'S.No',
      selector: (row, index) => (currentPage - 1) * 10 + index + 1,
      sortable: false,
      width: '100px',
    },
    {
      name: "Basket Name",
      selector: (row) => row.title,
      sortable: true,
      width: '200px',
    },
    {
      name: "Theme Name",
      selector: (row) => row.themename,
      sortable: true,
      width: '200px',
    },
    {
      name: "Min. Inv. Amount",
      selector: (row) => row.mininvamount,
      width: '200px',
    },

    {
      name: "Description",
      selector: (row) => stripHtml(row.description),
      cell: (row) => (
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          maxWidth: '200px',
          textAlign: 'left',
          whiteSpace: 'normal',
        }}>
          {stripHtml(row.description)}
        </div>
      ),
      wrap: true,
      width: '200px',
    },
    {
      name: "Validity",
      selector: (row) => row.validity,
      sortable: true,

    },
    {
      name: "Stock Quantity",
      selector: (row) => row.stock_details?.length || 0,
      sortable: true,
      width: "200px",
    },
    // {
    //   name: "Type",
    //   selector: (row) => row.type,
    //   sortable: true,
    //   width: '150px',
    // },
    {
      name: "Created date",
      selector: row => fDate(row.created_at),
      sortable: true,
      width: '250px',
    },
    permission.includes("publishstock") ||
      permission.includes("addstock") ||
      permission.includes("basketdetail") ||
      permission.includes("editstock") ||
      permission.includes("deletebasket") ? {
      name: "Actions",
      cell: (row) => (
        <div className="w-100 d-flex align-items-center gap-1">

          {permission.includes("publishstock") && row.stock_details.length > 0 && (
            <Tooltip title="Published Stock">
              <button
                className="btn px-2"
                onClick={(event) => handleSwitchChange(event, row._id)}
              >
                <RotateCcw checked={row.status} />
              </button>
            </Tooltip>
          )}


          {permission.includes("addstock") && row.stock_details?.length <= 0 && (
            <Tooltip title="Add Stock">
              <Link to={`/employee/addstock/${row._id}`} className="btn px-2">
                <Plus />
              </Link>
            </Tooltip>
          )}


          {permission.includes("basketdetail") && (
            <Tooltip title="View">
              <Link to={`/employee/viewdetail/${row._id}`} className="btn px-2">
                <Eye />
              </Link>
            </Tooltip>
          )}


          {permission.includes("editstock") && (
            <Tooltip title="Edit">
              <Link to={`editbasket/${row._id}`} className="btn px-2">
                <SquarePen />
              </Link>
            </Tooltip>
          )}


          {permission.includes("deletebasket") && (
            <Tooltip title="Delete">
              <button className="btn px-2" onClick={() => Deletebasket(row._id)}>
                <Trash2 />
              </button>
            </Tooltip>
          )}
        </div>

      ),
      width: "220px"
    } : "",
  ];





  return (
    <div className="page-content">
      <div className="page-breadcrumb  d-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3"> Basket List</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link to="/employee/dashboard">
                  <i className="bx bx-home-alt" />
                </Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-sm-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-5 radius-10"
                placeholder="Search Basket"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              <span className="position-absolute top-50 product-show translate-middle-y">
                <i className="bx bx-search" />
              </span>
            </div>
            {permission.includes("addbasket") && <div className="ms-auto mt-2 mt-sm-0">
              <Link to="/employee/addbasket" className="btn btn-primary">
                <i className="bx bxs-plus-square" aria-hidden="true" />
                Add Basket
              </Link>
            </div>}
            {/* <div className="ms-2">
              <Link to="/admin/basket/rebalancing" className="btn btn-primary">
                <i className="bx bxs-plus-square" aria-hidden="true" />
                RebBalancing
              </Link>
            </div> */}
          </div>
          {isLoading ? (
            <Loader />
          ) : clients.length > 0 ? (
            <>
              <Table
                columns={columns}
                data={clients}
                totalRows={totalRows}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center mt-5">
              <img src="/assets/images/norecordfound.png" alt="No Records Found" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Basket;
