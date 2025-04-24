import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import {
  SendHelpRequest,
  GetHelpMessage,
} from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Ticket = () => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [key, setKey] = useState("sendMessage");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    FetchMessage();
  }, []);

  const FetchMessage = async () => {
    try {
      const response = await GetHelpMessage(userid, token);
      if (response.status) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };



  const columns = [
    {
      name: "Ticket ID",
      selector: (row) => row.ticket,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "300px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <button className="btn btn-primary btn-sm">Pending</button>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Link to='/admin/viewticket' className="btn btn-secondary btn-sm p-0">
           
            <Eye width="15px" />
          </Link>
        </div>
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
    <Content Page_title="Help Desk" button_status={true}>
    
         
          <div className="table-responsive">
            <Table columns={columns} data={data} />
          </div>
       
    </Content>
  );
};

export default Ticket;
