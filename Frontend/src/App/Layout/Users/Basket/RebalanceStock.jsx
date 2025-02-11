import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { RebalanceBasket, GetBasketSell, getversionhistory, ExitPlaceOrderData, GetUserData, AddStockplaceorder } from '../../../Services/UserService/User';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../../../Utils/Loader';
import { IndianRupee } from "lucide-react";
import Swal from "sweetalert2";
import ReusableModal from '../../../components/Models/ReusableModal';


const RebalanceStock = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const location = useLocation();
  const item = location?.state?.data;
  console.log("item", item)

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [baskets, setBaskets] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [inputdata, setInputdata] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [data, setData] = useState({});




  const handleCloseModal = () => setShowModal(false);




  useEffect(() => {
    getbasketRebalance();
    getuserdetail();
  }, []);




  const getbasketRebalance = async () => {
    try {
      const data = { id: id, clientid: userid };
      const response = await RebalanceBasket(data, token);
      if (response.status) {
        const groupedData = groupByVersion(response.data);
        setBaskets(groupedData);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };


  console.log("data", data)


  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data?.brokerid);
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const getbasketsell = async () => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: userDetail, version: "" };
      const response = await GetBasketSell(data, token);
      if (response.status) {
        console.log("response", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const GetbasketVersionhistory = async () => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: userDetail, version: "" };
      const response = await getversionhistory(data, token);
      if (response.status) {
        console.log("response1", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const BUYstockdata = async (type) => {
    try {
      setIsPlacingOrder(true);
      const data = {
        basket_id: id,
        clientid: userid,
        brokerid: userDetail,
        investmentamount: inputdata,
        type: type,
      };

      const response = await AddStockplaceorder(data, token);
      setIsPlacingOrder(false);
      setIsConfirming(false);

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: response.message || "Order Placed Successfully!",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          if (type === 1) {
            setShowModal(false);
            setInputdata("")
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.message || "Order Failed",
          text: "Failed to place the order. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      setIsPlacingOrder(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while placing the order. Please check your network or try again later.",
        confirmButtonText: "Retry",
      });
    }
  };




  const groupByVersion = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.version]) {
        acc[item.version] = [];
      }
      acc[item.version].push(item);
      return acc;
    }, {});

  };



  return (
    <Content
      Page_title="Rebalance Stock"
      button_title="Add Basket"
      backbutton_title="Back"
      button_status={false}
      backbutton_status={false}
      backForword={true}
    >
      {isLoading ? (
        <p><Loader /></p>
      ) : (
        Object.keys(baskets).map((version) => (
          <div className="card mt-4" key={version}>
            <div className="card-body">
              <div className='float-end mb-3'>
                <button className='btn btn-primary'>View</button>
                <button className='btn btn-success ms-2' onClick={() => { setShowModal(true); setData(baskets[version]) }}>{version == 1 ? "Sell" : "Buy"}</button>
              </div>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>CMP</th>
                      <th>Weightage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baskets[version].map((stock) => (
                      <tr key={stock._id}>
                        <td>{stock.name}</td>
                        <td> <IndianRupee /> {stock.price}</td>
                        <td>{stock.total_value / stock.quantity}</td>
                        <td>{stock.weightage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}

      <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<>Investment Amount</>}
        body={
          <div>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Investment Amount"
              value={inputdata}
              onChange={(e) => setInputdata(e.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={() => {
                setIsConfirming(true);
                BUYstockdata(0);
              }}
              disabled={isConfirming}
            >
              Confirm
            </button>
            {/* <p className="fs-14 mb-0 mt-1">
              Minimum Investment Amount: <strong>₹ {baskets?.mininvamount}</strong>
            </p> */}
          </div>
        }
        footer={
          <>
            <button
              className="btn btn-primary"
              onClick={() => BUYstockdata(1)}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
          </>
        }
      />

    </Content>
  );
};

export default RebalanceStock;