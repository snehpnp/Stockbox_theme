import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Tabs, Tab } from "react-bootstrap";
import {
  GetTicketDetaildata,
  GetReplyTicketData,

} from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import { useParams } from "react-router-dom";

const HelpDesk = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const [formData, setFormData] = useState({
    message: "",
    file: null
  });
  const [errors, setErrors] = useState({});

  const { id } = useParams();



  useEffect(() => {
    FetchMessage();
  }, []);




  const FetchMessage = async () => {
    try {
      const response = await GetTicketDetaildata(id, token);

      if (response.status) {
        setMessages(response?.data?.ticket);

      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false);
  };




  // Handle input changes
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };




  // Validate form
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.message) {
      newErrors.message = "Please Enter Message";
      isValid = false;
    }

    if (!formData.file) {
      newErrors.file = "Please Upload File";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (validateForm()) {
      try {
        const data = {
          ticket_id: messages?._id,
          client_id: userid,
          message: formData.message,
          attachment: formData.file
        }

        const response = await GetReplyTicketData(data, token);

        if (response.status) {
          showCustomAlert("Success", "Your reply has been sent successfully!");
          FetchMessage();
          setFormData({
            ticket_id: "",
            client_id: "",
            message: "",
            file: null
          });

          const fileInput = document.getElementById('file');
          if (fileInput) fileInput.value = '';
        } else {
          showCustomAlert("error", "Reply Failed. Please try again.");
        }
      } catch (error) {
        console.error("Error sending reply:", error);
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
                  <h5 className="mb-0">Ticket Details:{messages?.ticketnumber}</h5>
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
        </div>
      </div>
    </Content>
  );
};

export default HelpDesk;