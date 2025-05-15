import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../Extracomponents/Table";
import {
  Eye,
  UserPen,
  Trash2
} from "lucide-react";
import Swal from "sweetalert2";
import {
  deleteCompany,
  UpdateCompanyStatus,
  GetCompanylist,
  UpdateThemeApi,
} from "../../../Services/Superadmin/Admin";
import { Tooltip } from "antd";
import { fDate } from "../../../../Utils/Date_formate";
import { GetAllThemesNameApi } from '../../../Services/Themes/Theme'
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";

const Company = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [themes, setThemes] = useState([]);

  const [isLoader, setIsLoader] = useState(true)

  useEffect(() => {
    getAdminclient();
    GetAllThemes();
  }, [searchInput]);

  const getAdminclient = async () => {
    try {
      const response = await GetCompanylist(token);
      if (response.status) {
        const filterdata = response.data.filter(
          (item) =>
            searchInput === "" ||
            item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchInput.toLowerCase())
        );
        setClients(searchInput ? filterdata : response.data);
        setIsLoader(false);
      }
    } catch (error) {

    }
  };

  const GetAllThemes = async () => {
    try {
      const response = await GetAllThemesNameApi();
      if (response.status) {
        setThemes(response.data);
      }
    } catch (error) {

    }
  };

  const updateCompany = async (row) => {
    navigate("/superadmin/companyupdate/", { state: { row } });
  };

  const DeleteCompanydata = async (_id) => {
    try {
      const result = await showCustomAlert('confirm', 'Do you want to delete this ? This action cannot be undone.')
       

      if (result.isConfirmed) {
        const response = await deleteCompany(_id, token);
        if (response.status) {
          Swal.fire({
            title: "Deleted!",
            text: "The Client has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
          getAdminclient();
        }
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "The Client deletion was cancelled.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting the Client.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  // update status
  const handleSwitchChange = async (event, id) => {
    const originalChecked = event.target.checked;
    const user_active_status = originalChecked ? "true" : "false";
    const data = { id: id, status: user_active_status };

    const result = await showCustomAlert('confirm', 'Do you want to save the changes?') 

    if (result.isConfirmed) {
      try {
        const response = await UpdateCompanyStatus(data, token);
        if (response.status) {
          Swal.fire({
            title: "Saved!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            Swal.close();
          }, 1000);
        }
        getAdminclient();
      } catch (error) {
        Swal.fire(
          "Error",
          "There was an error processing your request.",
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      event.target.checked = !originalChecked;
      getAdminclient();
    }
  };

  const companydetail = async (_id) => {
    navigate(`/superadmin/companydetail/${_id}`);
  };

  const UpdateTheme = async (id, theme_id) => {
    const data = { id: id, theme_id: theme_id };
    try {
      const response = await UpdateThemeApi(data);
      if (response.status) {
        Swal.fire({
          title: "Theme Updated!",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
        });
        setTimeout(() => {
          Swal.close();
        }, 1000);
      }
      getAdminclient();
    } catch (error) {
      Swal.fire(
        "Error",
        "There was an error processing your request.",
        "error"
      );
    }
  }


  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "100px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "250px",
    },
    {
      name: "Phone No",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Theme Selected",
      sortable: true,
      selector: (row) => (
        <>
          <select className="form-select" onChange={(e) => UpdateTheme(row._id, e.target.value)}>
            {themes.map((item) => (
              <option value={item._id} selected={item._id == row.theme_id}>
                {item.ThemeName}
              </option>
            ))}
          </select>
        </>
      )
    },

    {
      name: "Active Status",
      selector: (row) => (
        <div className="form-check form-switch form-check-info">
          <input
            id={`rating_${row.status}`}
            className="form-check-input toggleswitch"
            type="checkbox"
            defaultChecked={row.status == true}
            onChange={(event) => handleSwitchChange(event, row._id)}
          />
          <label
            htmlFor={`rating_${row.status}`}
            className="checktoggle checkbox-bg"
          ></label>
        </div>
      ),
      sortable: true,
      width: "165px",
    },
    {
      name: "CreatedAt",
      selector: (row) => fDate(row.created_at),
      sortable: true,
      width: "200px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          <Tooltip title="view">
            <Eye onClick={() => companydetail(row._id)} />
          </Tooltip>

          <Tooltip title="Update">
            <UserPen onClick={() => updateCompany(row)} />
          </Tooltip>
          {/* <Tooltip title="delete">
            <Trash2 onClick={() => DeleteCompanydata(row._id)} />
          </Tooltip> */}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "165px",
    },
  ];

  return (
    <div>
      <div>
        <div className="page-content">
          <div className="page-breadcrumb  d-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">Company</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/superadmin/dashboard">
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
                    placeholder="Search Client"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                  />
                  <span className="position-absolute top-50 product-show translate-middle-y">
                    <i className="bx bx-search" />
                  </span>
                </div>
                <div className="ms-auto">
                  <Link to="/superadmin/addcompany" className="btn btn-primary">
                    <i className="bx bxs-plus-square" aria-hidden="true" />
                    Add Company
                  </Link>
                </div>
              </div>
              {isLoader ? (
                <Loader />
              ) : (
                <>
                  <Table columns={columns} data={clients} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
