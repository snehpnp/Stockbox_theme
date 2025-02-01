import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { GetUserData } from "../../../Services/UserService/User";


const Wallet = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [activeTab, setActiveTab] = useState("earning");
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({});


  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setData(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  useEffect(() => {
    getuserdetail()
  }, [])

  return (
    <Content
      Page_title="Wallet"
      button_status={false}
      backbutton_status={false}
    >
      <div className="page-content">
        <div className="wallet">
          <div className="col-md-12">
            <div className="card mb-3">
              <div className="card-body p-2">
                <ul className="list-group list-group-flush list shadow-none ">
                  <li className="list-group-item ">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Wallet Balance</h6>
                      <spna><button className="btn btn-primary" onClick={setShowModal}> Withdraw</button></spna>
                    </div>

                    <hr />
                    <h5 className="mb-0">₹ 0.00</h5>
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

                <div className="wallet-card-body">
                  <div className="wallet-history">
                    {activeTab === "earning" && (
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>₹ 0.00</td>
                            <td>2021-10-07T12:11:00.000Z</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {activeTab === "payout" && (
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>₹ 0.00</td>
                            <td>2021-10-07T12:11:00.000Z</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Withdraw Request"
        body={
          <>
            <p className="fs-14 mb-2">Availabel Amount <strong>₹4545846</strong></p>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Amount"
            />
          </>
        }
        footer={
          <>
            <button className="btn btn-primary">Submit</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </>
        }
      />
    </Content>
  );
};

export default Wallet;
