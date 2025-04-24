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

const HelpDesk = () => {
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

  const Sendmessagedata = async (data) => {
    try {
      const response = await SendHelpRequest(data, token);
      if (response.status) {
        showCustomAlert("Success", "Your message has been sent successfully!");
      } else {
        showCustomAlert("error", "Message Failed. Please try again.");
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
      file: "",
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
      if (values.file && values.file.size > 2 * 1024 * 1024) {
        errors.file = "File size should be less than 2MB";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        client_id: userid,
        subject: values.subject,
        message: values.message,
        file: values.file,
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
      accept: "image/*",
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
                  <h5 className="mb-0">Ticket Details:#qw232334</h5>
                </div>
                <div className="ms-auto">
                  <small className="pe-3">08.34 AM</small>
                  <button className="btn btn-primary btn-sm">Pending</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header border-bottom bg-transparent p-3">
                <div className="card-title">
                  <h6 className="mb-0">Messages</h6>
                </div>

                <p className="text-muted">
                  Lorem ipsum is a dummy or placeholder text commonly used in
                  graphic design, publishing, and web development.
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

      {/* {isLoading ? <Loader /> : <div>
                        {messages?.length > 0 ? (
                            messages?.map((msg, index) => (
                                <div key={index} className="p-3 border mb-2 relative">
                                    <h6><strong>Subject:</strong> {msg.subject}</h6>
                                    <p><strong>Message:</strong> {msg.message}</p>
                                    <p><strong>Date:</strong> {fDateTime(msg.created_at)}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center mt-5">
                                <img
                                    src="/assets/images/norecordfound.png"
                                    alt="No Records Found"
                                />
                            </div>
                        )}
                    </div>} */}
    </Content>
  );
};

export default HelpDesk;
