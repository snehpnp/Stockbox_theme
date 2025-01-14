import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import Table from "../../../Extracomponents/Table";
import { BasketAllList, deletebasket } from "../../../Services/Admin/Admin";
import { fDate } from "../../../../Utils/Date_formate";


const BasketInformation = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem("token");



  // Fetch basket list
  const getbasketlist = async () => {
    try {
      const response = await BasketAllList(token);
      if (response.status) {
        setClients(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getbasketlist();
  }, []);





  // Delete basket
  const Deletebasket = async (_id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this item? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        const response = await deletebasket(_id, token);
        if (response.status) {
          Swal.fire({
            title: "Deleted!",
            text: "The item has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
          getbasketlist();
        }
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "The item deletion was cancelled.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting the item.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };




  // Columns for DataTable
  const columns = [
    {
      name: "Basket Name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Theme Name",
      selector: (row) => row.themename,
      sortable: true,
    },
    {
      name: "Min. Inv. Amount",
      selector: (row) => row.mininvamount,
    },
    // {
    //   name: "CAGR",
    //   selector: (row) => row.cagr,
    // },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Validity",
      selector: (row) => row.validity,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <Link
            to={`addstock/${row._id}`}
            className="btn btn-primary btn-sm mx-1"
          >
            Add Stock
          </Link>
          <Link
            to={`viewdetail/${row._id}`}
            className="btn btn-primary btn-sm mx-1"
          >
            View
          </Link>
          <Link
            to={`editbasket/${row._id}`}
            className="btn btn-warning btn-sm mx-1"
          >
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => Deletebasket(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];




  return (
    <div className="page-content">
      <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3"> Basket List</div>
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
          <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-5 radius-10"
                placeholder="Search Basket"
              />
              <span className="position-absolute top-50 product-show translate-middle-y">
                <i className="bx bx-search" />
              </span>
            </div>
            <div className="ms-auto">
              <Link to="/admin/addbasket" className="btn btn-primary">
                <i className="bx bxs-plus-square" aria-hidden="true" />
                Add Basket
              </Link>
            </div>
            <div className="ms-2">
              <Link to="/admin/addbasket" className="btn btn-primary">
                <i className="bx bxs-plus-square" aria-hidden="true" />
                Rebbalancing
              </Link>
            </div>
          </div>
          <Table
            columns={columns}
            data={clients}
            pagination
            highlightOnHover
            striped
          />
        </div>
      </div>
    </div>
  );
};

export default BasketInformation;
