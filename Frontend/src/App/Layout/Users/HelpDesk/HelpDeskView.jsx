import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import {
  SendHelpRequest,
  GetTicketDetaildata,
  GetReplyTicketData,
} from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table";
import { useParams } from "react-router-dom";


const HelpDesk = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");


  const [messages, setMessages] = useState([]);
  const [messagedata, setMessagedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams()



  useEffect(() => {
    FetchMessage();
  }, []);




  const FetchMessage = async () => {
    try {
      const response = await GetTicketDetaildata(id, token);
      if (response.status) {
        setMessagedata(response.data.ticket);

      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };



  const Sendmessagedata = async (data) => {
    try {
      const response = await GetReplyTicketData(data, token);
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
      message: "",
      file: '',
    },
    validate: (values) => {
      const errors = {};

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

  return (
    <Content
      Page_title="Help Desk"
      button_status={false}
      backbutton_status={true}
      backForword={true}

    >
      <div className="row row-cols-1 row-cols-lg-1 mb-3">
        <div className="col">
          <div className="card shadow-lg border-0">
            <div className="card-header border-bottom bg-transparent p-3">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-0">Ticket Details: #{messagedata.ticketnumber}</h5>

                </div>
                <div className="ms-auto">
                  <small className="pe-3">{messagedata.created_at}</small>
                  <button className="btn btn-primary btn-sm">Pending</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header border-bottom bg-transparent p-3">
                <div className="card-title">
                  <h6 className="mb-0">{messagedata.subject}</h6>
                </div>

                <p className="text-muted">
                  {messagedata.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-lg-2 ">
        <div className="col">
          <div className="card  border-0">
            <div className="card radius-10 w-100">
              <div className="card-header border-bottom bg-transparent">
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="mb-0">Replies</h5>
                  </div>
                </div>
              </div>

              <ul className="list-group list-group-flush review-list">
                {messagedata.length > 0 ? (
                  messagedata.map((msg, index) => (
                    <li key={index} className="list-group-item bg-transparent">
                      <div className="d-flex align-items-center">
                        <img
                          src="assets/images/avatar/1.png"
                          alt="user avatar"
                          className="rounded-circle"
                          width={55}
                          height={55}
                        />
                        <div className="ms-3">
                          <h6 className="mb-0">
                            {msg.subject || "No Subject"} <small className="ms-4">{msg.created_at || ""}</small>
                          </h6>
                          <p className="mb-0 small-font">{msg.message}</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item bg-transparent text-center">
                    No messages found
                  </li>
                )}
              </ul>

              <ul className="list-group list-group-flush review-list">
                <li className="list-group-item bg-transparent">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/avatar/1.png"
                      alt="user avatar"
                      className="rounded-circle"
                      width={55}
                      height={55}
                    />
                    <div className="ms-3">
                      <h6 className="mb-0">
                        iPhone X <small className="ms-4">08.34 AM</small>
                      </h6>
                      <p className="mb-0 small-font">
                        Sara Jhon : This is svery Nice phone in low budget.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="list-group-item bg-transparent">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/avatar/1.png"
                      alt="user avatar"
                      className="rounded-circle"
                      width={55}
                      height={55}
                    />
                    <div className="ms-3">
                      <h6 className="mb-0">
                        Mackbook <small className="ml-4">08.34 AM</small>
                      </h6>
                      <p className="mb-0 small-font">
                        Michle : The brand apple is original !
                      </p>
                    </div>
                  </div>
                </li>
                <li className="list-group-item bg-transparent">
                  <div className="d-flex align-items-center">
                    <img
                      src="assets/images/avatar/1.png"
                      alt="user avatar"
                      className="rounded-circle"
                      width={55}
                      height={55}
                    />
                    <div className="ms-3">
                      <h6 className="mb-0">
                        Air Pod <small className="ml-4">08.34 AM</small>
                      </h6>
                      <p className="mb-0 small-font">
                        Danish Josh : The brand apple is original !
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-lg border-0">
            <div className="card-header border-bottom bg-transparent p-3">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-0">Reply To Ticket</h5>
                </div>
              </div>
            </div>
            <div className="card-body px-3">
              <FormicForm
                fieldtype={fieldtype}
                formik={formik}
                ButtonName="Submit"
                BtnStatus={true}
              />
            </div>
          </div>
        </div>
      </div>


    </Content>
  );
};

export default HelpDesk;
