import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Tabs, Tab } from "react-bootstrap";
import {
  GetTicketmessagedetailbyuser,
  sendTicketReply,
  TicketRaiseStatus,
  getstaffperuser
} from "../../../Services/Admin/Admin";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import { useParams } from "react-router-dom";
import { fDate, Date } from "../../../../Utils/Date_formate";
import { ArrowDownToLine } from "lucide-react";




const ViewTicket = () => {




  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");




  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [sendername, setSetsendername] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    file: null,
    adminname: "",
  });




  const [errors, setErrors] = useState({});
  const { id } = useParams();





  useEffect(() => {
    FetchMessage();
    getpermissioninfo();
  }, []);




  const getpermissioninfo = async () => {
    try {
      const response = await getstaffperuser(userid, token);
      if (response.status) {
        setSetsendername([response.data]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const FetchMessage = async () => {
    try {
      const response = await GetTicketmessagedetailbyuser(id, token);

      if (response.status) {
        setMessages(response?.data);

      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };


  

  // close status 

  const handleSwitchChange = async (event) => {
    const data = { id: messages?.ticket?._id, status: 2 };
    const result = await showCustomAlert("confirm", "Do you want to Close This Ticket?")
    if (result.isConfirmed) {
      try {
        const response = await TicketRaiseStatus(data, token);
        if (response.status) {
          showCustomAlert("Success", "Status Changed")
        }
        FetchMessage();
      } catch (error) {
        showCustomAlert("error", "There was an error processing your request.")
      }
    } else {
      FetchMessage();
    }
  };

  const handleDownload = (messages) => {
    const url = `${messages?.ticket?.attachment}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload1 = (data) => {
    const url = `${data?.attachment}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };





  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };


  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.message) {
      newErrors.message = "Please Enter Message";
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const data = {
          ticket_id: messages?.ticket?._id,
          message: formData.message,
          attachment: formData.file,
          adminname: sendername[0]?.FullName,
        }

        const response = await sendTicketReply(data, token);

        if (response.status) {
          showCustomAlert("Success", "Your reply has been sent successfully!");
          FetchMessage();
          setFormData({
            ticket_id: "",
            subject: "",
            message: "",
            file: null,
            adminname: "",
          });

          const fileInput = document.getElementById('file');
          if (fileInput) fileInput.value = '';
        } else {
          showCustomAlert("error", "Reply Failed. Please try again.");
        }
      } catch (error) {
        showCustomAlert(
          "error",
          "An error occurred while sending the reply. Please check your network or try again later."
        );
      }
    }
  };



  return (
    <Content
      Page_title="Help Desk"
      button_status={false}
      backbutton_status={false}
      backForword={true}
    >
      <div className="row row-cols-1 row-cols-lg-1 mb-3">
        <div className="col">
          <div className="card shadow-lg border-0">
            <div className="card-header border-bottom bg-transparent p-3">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-0">Ticket ID :</h5>
                  <h6 className="mb-0">{messages?.ticket?.ticketnumber}</h6>
                </div>
                <div className="ms-auto">
                  <small className="pe-3">{fDate(messages?.ticket?.created_at)}</small>
                  <button className="btn btn-primary btn-sm"
                    onClick={(event) => handleSwitchChange(event)}
                    disabled={messages?.ticket?.status === 2}
                  >Close Ticket </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header border-bottom bg-transparent p-3">
                <div className="card-title">
                  <h6 className="mb-0">Subject</h6>
                </div>
                <p className="text-muted">
                  {messages?.ticket?.subject}
                </p>
                <div className="card-title">
                  <h6 className="mb-0">Message</h6>
                </div>
                <p className="text-muted">
                  {messages?.ticket?.message}
                </p>
              </div>
              {messages.ticket?.attachment && (
                <button className="btn btn-primary mt-2" onClick={() => handleDownload(messages)}
                >Download</button>
              )}
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
                {messages?.messages?.map((item, index) => (
                  <li key={index} className="list-group-item bg-transparent">
                    <div className="d-flex align-items-center justify-content-between">
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
                            {item?.client_id ? messages?.ticket?.client_id?.FullName : sendername[0]?.FullName}
                            <small className="ms-4">{fDate(item?.created_at)}</small>
                          </h6>
                          <p className="mb-0 small-font">{item?.message}</p>
                        </div>
                      </div>
                      {messages.messages[index]?.attachment && (
                        <button
                          onClick={() => handleDownload1(item)}
                          className="border-0 bg-transparent p-0 d-flex align-items-center justify-content-center"
                          style={{ width: '35px', height: '35px' }}
                        >
                          <ArrowDownToLine size={22} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>


            </div>
          </div>
        </div>
        {messages?.ticket?.status !== 2 && <div className="col">
          <div className="card shadow-lg border-0">
            <div className="card-header border-bottom bg-transparent p-3">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-0">Reply To Ticket</h5>
                </div>
              </div>
            </div>
            <div className="card-body px-3">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    id="message"
                    name="message"
                    placeholder="Enter Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="file" className="form-label">Upload File</label>
                  <input
                    type="file"
                    className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                    id="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary float-end">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>}
      </div>
    </Content>
  );
};

export default ViewTicket;