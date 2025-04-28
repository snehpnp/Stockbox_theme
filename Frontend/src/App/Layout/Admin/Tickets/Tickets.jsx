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
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";



const Ticket = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [isLoading, setIsLoading] = useState(true);

  const [messagedata, setMessagedata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    FetchMessage();
  }, [currentPage]);



  const FetchMessage = async () => {
    try {
      const data = { from: "", to: "", status: "", search: "", page: currentPage }
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






  const columns = [
    {
      name: "Ticket ID",
      selector: (row) => row?.ticketnumber,
      width: "250px",
    },
    {
      name: "Email",
      selector: (row) => row?.client?.Email,
      width: "250px",
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      width: "300px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <button className="btn btn-primary btn-sm">
            {row.status ? "Close" : "Open"}
          </button>
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
          <div>
            <Tooltip placement="top" overlay="Delete">
              <Trash2 onClick={() => DeleteTicket(row._id)} />
            </Tooltip>
          </div>
        </>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      ticket: "123456",
      email: "test@gmail.com",
      subject: "Beetlejuice",
      description:
        "Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.",
    },

    {
      id: 2,
      ticket: "123456",
      email: "test@gmail.com",
      subject: "Ghostbusters",
      description:
        "Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.",
    },
  ];

  return (
    <Content
      Page_title="Help Desk"
      button_status={false}
      backbutton_status={false}
    >
      <div className="table-responsive">
        <Table
          columns={columns}
          data={messagedata}
          totalRows={totalRows}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

    </Content>
  );
};

export default Ticket;
