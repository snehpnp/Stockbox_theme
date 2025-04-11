import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { GetUserData, GetWithdrawRequest, GetReferEarning, GetPayoutDetail } from "../../../Services/UserService/User";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import { fDateTime, fDateTimeH } from "../../../../Utils/Date_formate";



const Wallet = () => {



  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [activeTab, setActiveTab] = useState("earning");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});
  const [earning, setEarning] = useState({});
  const [payout, setPayout] = useState({});

  const [request, setRequest] = useState({
    clientId: "",
    amount: ""
  })



  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setData(response.data);

      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const getEarning = async () => {
    try {
      const response = await GetReferEarning(userid, token);

      if (response.status) {
        setEarning(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const getPayoutdata = async () => {
    try {
      const response = await GetPayoutDetail(userid, token);
      console.log("response",response)
      if (response.status) {
        setPayout(response.data);

      }
    } catch (error) {
      console.log("error", error);
    }
  };





  useEffect(() => {
    getuserdetail();
    if (activeTab == "earning") {
      getEarning();
    } else if (activeTab == "payout") {
      getPayoutdata();
    }

  }, [activeTab]);



  const withdrawRequest = async () => {
    try {
      const data = { clientId: userid, amount: request.amount };
      const response = await GetWithdrawRequest(data, token);

      if (response.status !==400) {
        
        showCustomAlert("Success", response.data.message || 'Your withdrawal request has been processed successfully.')
        setRequest({ clientId: "", amount: "" });
      } else {
        console.log("response data for checking 55555");
        showCustomAlert("error", response.response.data.message || 'There was an issue processing your withdrawal request.')

      }
    } catch (error) {
      showCustomAlert("error", 'An unexpected error occurred. Please try again later.')

    }
  };


  // const withdrawRequest = async () => {
  //   try {
  //     const data = { clientId: userid, amount: request.amount };
  //     const response = await GetWithdrawRequest(data, token);
      
  //     // yahan pahucha matlab status 2xx hi hai
  //     if (response.status) {
  //       console.log("response for ceck")
  //       showCustomAlert("Success", response.message || 'Your withdrawal request has been processed successfully.');
  //       setRequest({ clientId: "", amount: "" });
  //     }
  //   } catch (error) {
  //     // error.response exist kare to uska message dikhao
  //     const message = error?.response?.data?.message || 'There was an issue processing your withdrawal request.';
  //     showCustomAlert("error", message);
  //   }
  // };
  


  return (
    <Content Page_title="Wallet"
      button_status={false}
      backbutton_status={false}
      backForword={true}
    >

      <div className="page-content">
        <div className="wallet card p-4 shadow-lg">
          <div className="d-flex align-items-center mb-3">
            <div
              className="profile-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {data?.FullName ? data?.FullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h5 className="mb-0">{data?.FullName}</h5>
              <p className="text-muted mb-0">{data?.Email}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-2">
              <ul className="list-group list-group-flush list shadow-none">
                <li className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Wallet Balance</h6>
                    <span>
                      <button
                        className="btn btn-primary btn-sm rounded-pill"
                        onClick={() => setShowModal(true)}
                      >
                        Withdraw
                      </button>
                    </span>
                  </div>
                  <hr />
                  <h5 className="mb-0">₹ {data?.wamount}</h5>
                </li>
              </ul>
            </div>
          </div>

          <div className="wallet-content">
            <div className="wallet-card">
              <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "earning" ? "active btn-primary" : ""
                      }`}
                    onClick={() => setActiveTab("earning")}
                  >
                    Earning
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "payout" ? "active btn-primary" : ""
                      }`}
                    onClick={() => setActiveTab("payout")}
                  >
                    Payout
                  </button>
                </li>
              </ul>

              <div className="wallet-card-body mt-3">
                <div className="wallet-history">
                  {activeTab === "earning" && (
                    <table className="table table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Earning Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earning.length > 0 ? (
                          earning.map((item, index) => (
                            <tr key={index}>
                              <td>{item.clientName || "-"}</td>
                              <td>{item.amountType?.amount || "-"}</td>
                              <td>{item.status ? "Completed" : "Pending"}</td>

                              <td>{fDateTime(item.created_at)}</td>
                              
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No Data Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {activeTab === "payout" && (
                    <table className="table table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payout.length > 0 ? (
                        <tr>
                          <td>{payout.transaction_id}</td>
                          <td>{payout.amount}</td>
                          <td>{payout.date}</td>
                        </tr>
                        ):(
                          <tr>
                            <td colSpan="5">No Data Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReusableModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setRequest({ clientId: "", amount: "" });
        }}


        title="Withdraw Request"
        body={
          <>
            <p className="fs-14 mb-2">
              Available Amount <strong>{data?.wamount}</strong>
            </p>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={request.amount}
              onChange={(e) => { setRequest({ ...request, amount: e.target.value }); }}

            />
          </>
        }
        footer={
          <>
            <button className="btn btn-primary btn-sm" onClick={() => withdrawRequest()}>Submit</button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setShowModal(false);
                setRequest({ clientId: "", amount: "" });
              }}
            >
              Cancel
            </button>
          </>
        }
      />
    </Content>
  );
};

export default Wallet;
