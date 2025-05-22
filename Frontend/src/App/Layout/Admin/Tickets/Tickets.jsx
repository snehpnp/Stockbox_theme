import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import {
  GetTicketRaiseMesaage,
  DeleteRaiseTicket
} from "../../../Services/Admin/Admin";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table1";
import { Eye, Trash2, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { fDate } from "../../../../Utils/Date_formate";




const Ticket = () => {




  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [isLoading, setIsLoading] = useState(true);

  const [messagedata, setMessagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",

  });


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    FetchMessage();
  }, [currentPage, searchInput, filters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };




  const FetchMessage = async () => {
    try {
      const data = { from: filters.from, to: filters.to, status: filters.status, search: searchInput, page: currentPage }
      const response = await GetTicketRaiseMesaage(data, token);
      if (response.status) {
        setMessagedata(response?.data);

      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };



  const DeleteTicket = async (_id) => {
    try {
      const result = await showCustomAlert(
        "confirm",
        "Do you want to delete this Ticket? This action cannot be undone."
      );

      if (!result.isConfirmed) return;

      const response = await DeleteRaiseTicket(_id, token);
      if (response.status) {
        showCustomAlert("success", "Successfully deleted!");
        FetchMessage();
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      showCustomAlert("error", "There was an error deleting this Ticket.");
    }
  };


  //
  const resethandle = () => {
    setFilters({
      from: "",
      to: "",
      status: "",
    });
    FetchMessage("");

  };






  const columns = [
    {
      name: "Ticket ID",
      selector: (row) => `#${row?.ticketnumber}`,

    },
    {
      name: "Email",
      selector: (row) => row?.client?.Email,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    {
      name: "Created At",
      selector: (row) => fDate(row?.created_at),
    },
   {
    name: "Status",
    cell: (row) => (
        <div>
            <span
                className={`badge ${row.status === 0
                    ? "bg-warning "
                    : row.status === 1
                        ? "bg-success"
                        : "bg-danger"
                    }`}
            >
                {row.status === 0 ? "Pending" : row.status === 1 ? "Open" : "Close"}
            </span>
        </div>
    ),
},



    {
      name: "Action",
      cell: (row) => (
        <>
          <div>
            <Link to={`/admin/viewticket/${row._id}`} className="btn btn-secondary btn-sm p-0">

              <Eye width="15px" />
            </Link>
          </div>
          {/* <div>
            <Tooltip placement="top" overlay="Delete">
              <Trash2 onClick={() => DeleteTicket(row._id)} />
            </Tooltip>
          </div> */}
        </>
      ),
    },
  ];





  return (
    <Content
      Page_title="Help Desk"
      button_status={false}
      backbutton_status={false}
    >

      <div className="d-md-flex align-items-center mb-4 gap-3">
        <div className="position-relative">
          <input
            type="text"
            className="form-control ps-5 radius-10"
            placeholder="Search Ticket"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <span className="position-absolute top-50 product-show translate-middle-y">
            <i className="bx bx-search" />
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label>From Date</label>
          <input
            type="date"
            name="from"
            className="form-control radius-10"
            value={filters.from}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label>To Date</label>
          <input
            type="date"
            name="to"
            className="form-control radius-10"
            value={filters.to}
            onChange={handleFilterChange}
            min={filters.from}
          />
        </div>
        <div className="col-md-4 mb-3 ">
          <div className="d-flex align-items-center gap-2 ">
            <div className="w-100">
              <label>Select Status</label>
              <select
                name="status"
                className="form-control radius-10"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Select</option>
                <option value="0">Pending</option>
                <option value="1">OPEN</option>
                <option value="2">CLOSE</option>

              </select>
            </div>
            <div className="rfreshicon ">
              <RefreshCcw onClick={resethandle} />
            </div>
          </div>
        </div>


      </div>
      <Table
        columns={columns}
        data={messagedata}
        totalRows={totalRows}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />


    </Content >
  );
};

export default Ticket;
