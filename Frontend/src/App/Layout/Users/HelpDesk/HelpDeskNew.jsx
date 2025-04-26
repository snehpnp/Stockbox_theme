import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import {
  GetTicketForhelp,
  GetAllTicketData,
} from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";



const HelpDesk = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
 //const ticketid = localStorage.getItem("ticketid")
  const [key, setKey] = useState("sendMessage");
  const [messages, setMessages] = useState([]);
  const [messagedata, setMessagedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    FetchMessage();
  }, []);

  const FetchMessage = async () => {

    try {
      const data= {page: '1', clientId:userid}
      const response = await GetAllTicketData(data, token);
      if (response.status) {
        setMessagedata(response.data);
        console.log("response", response.data);
        console.log("id", response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };



  const Sendmessagedata = async (data) => {
    try {
      const response = await GetTicketForhelp(data, token);
      console.log("response", response)
      if (response.status) {
        showCustomAlert("Success", response.message);
      } else {
        showCustomAlert("error", response.message);
      }
    } catch (error) {
      showCustomAlert(
        "error",
        "An error occurred while sending the message. Please check your network or try again later."
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      message: "",
      file: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.subject) {
        errors.subject = "Please Enter Subject";
      }
      if (!values.message) {
        errors.message = "Please Enter Message";
      }
      if (!values.file) {
        errors.file = "Please Upload File";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        client_id: userid,
        subject: values.subject,
        message: values.message,
        attachment: values.file,
      };

      await Sendmessagedata(data);
      setMessages([...messages, values]);
      resetForm();
    },
  });

  let fieldtype = [
    {
      type: "text",
      name: "subject",
      label: "Subject",
      placeholder: "Enter Subject",
      required: true,
      label_size: 5,
      col_size: 12,
      disable: false,
    },
    {
      type: "textarea",
      name: "message",
      label: "Message",
      placeholder: "Enter Message",
      required: true,
      label_size: 5,
      col_size: 12,
      disable: false,
    },
    {
      type: "file",
      name: "file",
      label: "Upload File",
      placeholder: "Upload File",
      required: false,
      label_size: 5,
      col_size: 12,
      disable: false,
    },
  ];

  const columns = [
    {
      name: "Ticket No.",
      selector: (row) => row.ticketnumber,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    
    {
      name: "Description",
      selector: (row) => row.message,
      width: "300px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
        {row.status === true ? (
          <button className="btn btn-outline-success btn-sm transition-0" >Open</button>
         
        ) : (
          <button className="btn btn-outline-warning btn-sm transition-0" >In Progress</button>
        )}
      </div>
      )
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Link to='/user/help-desk-view' className="btn btn-secondary btn-sm p-0">

            <Eye width="15px" />
          </Link>
        </div>
      ),
    },
  ];



  return (
    <Content Page_title="Help Desk"
      button_status={false}>

      <FormicForm
        fieldtype={fieldtype}
        formik={formik}
        ButtonName="Submit"
        BtnStatus={true}
      />
      <div className="table-responsive">
        <Table
          columns={columns}
          data={messagedata} />
      </div>

    </Content>
  );
};

export default HelpDesk;
