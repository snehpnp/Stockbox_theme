import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("withdraw");

  return (
    <Content
      Page_title="Wallet"
      button_status={false}
      backbutton_status={false}
    >
      <div className="page-content">
        <div className="wallet">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body p-2">
              <ul className="list-group list-group-flush list shadow-none ">
                <li className="list-group-item ">
                <h6 className="mb-0">Wallet Balance</h6>
                  <hr />
                  <h5 className="mb-0">₹ 0.00</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
          <div className="wallet-content">
          
            <div className="wallet-card">
              <ul className="nav nav-pills mb-3 justify-content-center border-bottom">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "withdraw" ? "active btn-primary" : ""
                    }`}
                    onClick={() => setActiveTab("withdraw")}
                  >
                    withdraw
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "deposit" ? "active btn-primary" : ""
                    }`}
                    onClick={() => setActiveTab("deposit")}
                  >
                    Deposit
                  </button>
                </li>
              </ul>

              <div className="wallet-card-body">
                <div className="wallet-history">
                  {activeTab === "withdraw" && (
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

                  {activeTab === "deposit" && (
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
    </Content>
  );
};

export default Wallet;
