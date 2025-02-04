import React, { useEffect } from "react";
import Content from "../../../components/Contents/Content";
import ReusableModal from "../../../components/Models/ReusableModal";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BasketPurchaseList } from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";



const BasketStockList = () => {


  useEffect(() => {
    getbasketpurchasedata()
  }, [])

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);


  const [isLoading, setIsLoading] = useState(true)
  const [purchasedata, setPurchasedata] = useState([])

  console.log("purchasedata", purchasedata)

  const getbasketpurchasedata = async () => {
    try {
      const data = { clientid: userid }
      const response = await BasketPurchaseList(data, token)
      if (response.status) {
        setPurchasedata(response.data)

      }
    } catch (error) {
      console.log("error", error)
    }
    setIsLoading(false)
  }





  return (
    <Content
      Page_title="Stock List"
      button_status={true}
      button_title={"Rebalance History"}
      route={"/user/rebalancehistory"}
      backbutton_status={false}
      backbutton_title="Back"
      backForword={true}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body p-2">
              <ul className="list-group list-group-flush list shadow-none ">
                <li className="list-group-item ">
                  Total Investment
                  <hr />
                  <h5 className="mb-0">₹105666</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body p-2">
              <ul className="list-group list-group-flush list shadow-none ">
                <li className="list-group-item ">
                  Current Value
                  <hr />
                  <h5 className="mb-0">₹10</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body p-2">
              <ul className="list-group list-group-flush list shadow-none ">
                <li className="list-group-item ">
                  Total P&L
                  <hr />
                  <h5 className="mb-0">₹1055666</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive">
          <table className="table ">
            <thead className="table-primary">
              <tr>
                <th>Instrument</th>
                <th>Qty</th>
                <th> Avg. Cost </th>
                <th>LTP</th>
                <th>Current Value</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reliance</td>
                <td>2</td>
                <td>RELIANCE</td>
                <td>2000</td>
                <td>10</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Infosys</td>
                <td>1</td>
                <td>INFY</td>
                <td>1000</td>
                <td>20</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="btn btn-success w-auto ms-3" onClick={() => setShowModal(true)}>
          Buy Now
        </button>
      </div>

      <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<>Investement Amount</>}
        body={
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Investment Amount"
            />
            <p className="fs-14 mb-0 mt-1">
              Minimum Investment Amount: <strong>₹ 35000</strong>
            </p>
          </div>
        }
        footer={
          <>
            {" "}
            <button className="btn btn-primary">Place Order</button>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
          </>
        }
      />
    </Content>
  );
};

export default BasketStockList;
