import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, RefreshCcw, Trash2, RotateCcw, IndianRupee, X, Plus, History } from 'lucide-react';
import { Tooltip } from 'antd';
// import Table from "../../../components/Table";
import Table from '../../../Extracomponents/Table1';

import { BasketAllActiveList, BasketAllActiveListbyfilter, changestatusrebalance, deletebasket, Basketstatusofdetail, getstaffperuser } from "../../../Services/Admin/Admin";
import { fDate } from "../../../../Utils/Date_formate";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";

const BasketStockPublish = () => {


  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem('id');


  const [searchInput, setSearchInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [permission, setPermission] = useState([]);


  const [isLoading, setIsLoading] = useState(true)



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const getbasketlist = async () => {
    try {
      const data = { page: currentPage, search: searchInput || "" }
      const response = await BasketAllActiveListbyfilter(data, token);
      if (response.status) {
        setTotalRows(response.pagination.total);
        setClients(response.data);
      }
    } catch (error) {
      console.log("error", JSON.stringify(error));

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
    getpermissioninfo();

  }, []);



  useEffect(() => {
    getbasketlist();
  }, [searchInput, currentPage]);



  const handleSwitchChange = async (event, id) => {
    const originalChecked = event.target.checked;
    const user_active_status = originalChecked;
    const data = { id: id, status: user_active_status };

    const result = await showCustomAlert("confirm", "Do you want to save the changes?");

    if (result.isConfirmed) {
      try {
        const response = await Basketstatusofdetail(data, token);
        if (response.status) {
          await showCustomAlert("success", "Changed successfully!");
          getbasketlist();
        }
      } catch (error) {
        await showCustomAlert("error", "There was an error processing your request.");
      }
    } else {
      event.target.checked = !originalChecked;
      getbasketlist();
    }
  };


  const handleSwitchChange1 = async (event, id) => {
    const originalChecked = event.target.checked;
    const user_active_status = originalChecked
    const data = { id: id, status: user_active_status };

    const result = await showCustomAlert("confirm", "Do you want to save the changes?");

    if (result.isConfirmed) {
      try {
        const response = await changestatusrebalance(data, token);
        if (response.status) {
          showCustomAlert("Sucess", "Changed successfully!");
        }
        getbasketlist();
      } catch (error) {
        showCustomAlert("error", "There was an error processing your request.");
      }
    } else {
      event.target.checked = !originalChecked;
      getbasketlist();
    }
  };




  const rebalancePubliceStock = async (row) => {
    if (!row) return
    navigate("/employee/editstock", { state: { row } });
  };


  const rebalancePubliceStockadd = async (row) => {
    navigate("/employee/addstock/" + row._id, { state: { state: "publish" } });
  }



  const viewdetailpage = async (row) => {
    navigate("/employee/viewdetail/" + row._id, { state: { state: "viewdetail" } });
  }

  // Delete basket


  const Deletebasket = async (_id) => {
    try {
      const result = await showCustomAlert("confirm", "Do you want to delete this item? This action cannot be undone.");
      if (result.isConfirmed) {
        const response = await deletebasket(_id, token);
        if (response.status) {
          showCustomAlert("Success", "The item has been successfully deleted.");
          getbasketlist();
        }
      } else {
        showCustomAlert("error", "The item deletion was cancelled.");
      }
    } catch (error) {
      showCustomAlert("error", "There was an error deleting the item.");

    }
  };




  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }




  // Columns for DataTable
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

    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   wrap: true,
    //   width: '200px',
    // },
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
    permission.includes("basketActivestatus") && {
      name: 'Active Status',
      selector: row => (
        <div className="form-check form-switch form-check-info">
          <input
            id={`rating_${row._id}`}
            className="form-check-input toggleswitch"
            type="checkbox"
            defaultChecked={row.publishstatus == true}
            onChange={(event) => handleSwitchChange(event, row._id)}
          />
          <label
            htmlFor={`rating_${row._id}`}
            className="checktoggle checkbox-bg"
          ></label>
        </div>
      ),
      sortable: true,
      width: '180px',
    },
    permission.includes("Rebalancestatus") && {
      name: 'Rebalancing',
      selector: row => (

        <div className="form-check form-switch form-check-info">
          <input
            id={`rating_${row._id}`}
            className="form-check-input toggleswitch"
            type="checkbox"
            checked={row.rebalancestatus === true}
            onChange={(event) => handleSwitchChange1(event, row._id)}
          />
          <label
            htmlFor={`rating_${row._id}`}
            className="checktoggle checkbox-bg"
          ></label>
        </div>

      ),
      sortable: true,
      width: '180px',

    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="w-100">
          {permission.includes("Rebalancebutton") && row.rebalancestatus === false ? (
            row?.stockstatus == 0 ? (
              <Tooltip title="Rebalance">
                <RotateCcw
                  onClick={() => rebalancePubliceStock(row)}
                  style={{ marginRight: "5px" }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Rebalance">
                <RotateCcw
                  onClick={() => rebalancePubliceStockadd(row)}
                  style={{ marginRight: "5px" }}
                />
              </Tooltip>
            )
          ) : null}
          {permission.includes("basketdetail") && <Tooltip title="view">
            <Eye onClick={() => viewdetailpage(row)} />
          </Tooltip>}
          {/* <Tooltip title="Edit">
            <Link
              to={`editbasket/${row._id}`}
              className="btn px-2"
            >
              <SquarePen />
            </Link>
          </Tooltip> */}
          <Tooltip title="History ">
            <Link
              to={`/employee/basket-purchase-history/${row._id}`}
              className="btn px-2"
            >
              <History />
            </Link>
          </Tooltip>
          {/* <button
            className="btn px-2"
            onClick={() => Deletebasket(row._id)}
          >
            <Trash2 />
          </button> */}
        </div>
      ),
      width: '150px',
    },
  ];





  return (
    <div className="page-content">
      <div className="page-breadcrumb  d-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Basket-Stock Published List </div>
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
      <hr />
      <div className="card">
        <div className="card-body">
          <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-5 radius-10"
                placeholder="Search Publish Basket"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              <span className="position-absolute top-50 product-show translate-middle-y">
                <i className="bx bx-search" />
              </span>
            </div>
            {/* <div className="ms-auto">
              <Link to="/employee/addbasket" className="btn btn-primary">
                <i className="bx bxs-plus-square" aria-hidden="true" />
                Add Basket
              </Link>
            </div> */}
            {/* <div className="ms-2">
              <Link to="/employee/basket/rebalancing" className="btn btn-primary">
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

export default BasketStockPublish;
