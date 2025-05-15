import React, { useState } from "react";
import { useFormik } from "formik";
import DynamicForm from "../../../Extracomponents/FormicForm";
import { useNavigate } from "react-router-dom";
import { Addbasketplan } from "../../../Services/Admin/Admin";
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";

const Strategy = () => {
  return (
    <Content
      Page_title="Strategy"
      button_status={false}
      backbutton_status={false}
      backForword={true}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="trade-card">
            <div className="trade-header ">
              <div>📅 22 Mar, 2:30</div>
              <div className="tags">
                <div className="tag">Intraday</div>
                <div className="tag">CASH</div>
              </div>
            </div>
            <div className="strategy-title ">
              Kotak Bank{" "}
              <button
                className="btn btn-sm btn-primary"
                style={{ float: "right" }}
              >
                <i className="fa fa-eye fs-6" /> Report
              </button>
            </div>
            <table className="strategy-table table border mt-4">
              <tbody>
                <tr>
                  <th>Strategy (execute all)</th>
                  <th>Entry</th>
                  <th>LTP</th>
                </tr>
                <tr>
                  <td><span className="alert alert-success px-2 py-1 me-2 ">Buy </span> 27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
                <tr>
                  <td><span className="alert alert-success px-2 py-1 me-2">Buy </span> 27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
                <tr>
                  <td><span className="alert alert-success px-2 py-1 me-2">Buy </span> 27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
              </tbody>
            </table>
            <div className="strategy-actions">
              <div className="info d-flex justify-content-between w-100">
                <div>Maximum Loss: ₹100</div>
                <div>Maximum Profit: 120</div>
                <div>Maximum Profit: 120</div>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between mt-2">
            <button className="btn-success btn">Place Order</button>
              <button className="btn btn-secondary">About trade</button>
              
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="trade-card">
            <div className="trade-header ">
              <div>📅 22 Mar, 2:30</div>
              <div className="tags">
                <div className="tag">Intraday</div>
                <div className="tag">CASH</div>
              </div>
            </div>
            <div className="strategy-title ">
              Kotak Bank{" "}
              <button
                className="btn btn-sm btn-primary"
                style={{ float: "right" }}
              >
                <i className="fa fa-eye fs-6" /> Report
              </button>
            </div>
            <table className="strategy-table table border mt-4">
              <tbody>
                <tr>
                  <th>Strategy (execute all)</th>
                  <th>Entry</th>
                  <th>LTP</th>
                </tr>
                <tr>
                  <td> <span className="alert alert-success px-2 py-1 me-2">Buy </span>27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
                <tr>
                  <td> <span className="alert alert-success px-2 py-1 me-2">Buy </span> 27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
                <tr>
                  <td> <span className="alert alert-success px-2 py-1 me-2">Buy </span> 27 Mar 1980 CE</td>
                  <td>₹44.50</td>
                  <td>₹28.05</td>
                </tr>
              </tbody>
            </table>
            <div className="strategy-actions">
              <div className="info d-flex justify-content-between w-100">
                <div>Maximum Loss: ₹100</div>
                <div>Maximum Profit: 120</div>
                <div>Maximum Profit: 120</div>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between mt-2">
            <button className="btn-success btn">Place Order</button>
              <button className="btn btn-secondary">About trade</button>
            
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default Strategy;
