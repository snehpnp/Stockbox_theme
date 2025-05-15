import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { RebalanceBasket, GetBasketSell, getversionhistory, GetLivePricedata, ExitPlaceorderstockbasket, GetUserData, AddStockplaceorder } from '../../../Services/UserService/User';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../../../Utils/Loader';
import { IndianRupee } from "lucide-react";
import ReusableModal from '../../../components/Models/ReusableModal';
import { soket_url } from '../../../../Utils/config';
import io from 'socket.io-client';
import $ from "jquery";
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const RebalanceStock = () => {


  // const SOCKET_SERVER_URL = "https://stockboxpnp.pnpuniverse.com:1001/"
  const SOCKET_SERVER_URL = soket_url

  const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const location = useLocation();
  const item = location?.state?.data;

  const { id } = useParams();



  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(true);
  const [baskets, setBaskets] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [inputdata, setInputdata] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExitorder, setIsExitorder] = useState(false);
  const [data, setData] = useState([]);
  const [viewdata, setViewdata] = useState([]);
  const [basket, setBasketdata] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [getlivedata, setLiveprice] = useState([])




  useEffect(() => {
    getbasketRebalance();
    getuserdetail();
    getlivepricedata();
  }, []);



  const groupByVersion = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.version]) {
        acc[item.version] = [];
      }
      acc[item.version].push({ ...item, livePrice: null });
      return acc;
    }, {});
  };



  const getbasketRebalance = async () => {
    try {
      const data = { id: id, clientid: userid };
      const response = await RebalanceBasket(data, token);
      if (response.status) {
        setData(response.data)
        const groupedData = groupByVersion(response.data);
        setBaskets(groupedData);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  const handleLiveData = (livedata) => {
    if (data) {
      const stockData = data?.find((item) => item?.instrument_token === livedata?.tk);

      if (stockData) {
        const priceElement = $(`#stock-price-${livedata.tk}`);

        if (priceElement.length && livedata.lp && stockData.price) {
          priceElement.text(livedata.lp);


          if (livedata.lp > stockData.price) {
            priceElement.css({ color: "green", transition: "color 0.5s ease-in-out" });
          } else if (livedata.lp < stockData.price) {
            priceElement.css({ color: "red", transition: "color 0.5s ease-in-out" });
          }
        }
      }
    }


  };

  useEffect(() => {

    socket.on("Live_data", handleLiveData);

    return () => {
      socket.off("Live_data", handleLiveData);
    };
  }, [data]);



  const getlivepricedata = async () => {
    try {
      const response = await GetLivePricedata(userid, token);
      if (response.status) {
        const getlive = response?.data
          .filter((item) => item.token === data?.instrument_token)
          .map((item) => item.lp);

        setLiveprice(getlive);
      }
    } catch (error) {
      console.log("error", error);
    }
  };




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






  const getbasketsell = async (item) => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: userDetail, version: item[0]?.version };
      const response = await GetBasketSell(data, token);
      if (response.status) {
        console.log("resp", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };






  const GetbasketVersionhistory = async (basketData) => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: userDetail, version: basketData[0]?.version };
      const response = await getversionhistory(data, token);
      if (response.status) {
        setViewdata(response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading1(false)
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
        showCustomAlert("Success", response.message || "Order Placed Successfully!")
          .then(() => {
            if (type === 1) {
              setShowModal(false);
              setInputdata("")
            }
          });
      } else {
        showCustomAlert("error", response.message || "Order Failed")
      }
    } catch (error) {
      setIsPlacingOrder(false);
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")
    }
  };





  const SellExistOrder = async () => {
    try {
      setIsExitorder(true);

      const data = {
        basket_id: id,
        clientid: userid,
        brokerid: userDetail,
        version: basket[0]?.version || "",
        ids: "",
      };
      const response = await ExitPlaceorderstockbasket(data, token);
      setIsExitorder(false);

      if (response.status) {
        showCustomAlert("Success", response.message || "Order Placed Successfully!")
      } else {
        showCustomAlert("error", response.message || "Order Failed")
      }
    } catch (error) {
      setIsExitorder(false);
      showCustomAlert("error", "An error occurred while placing the order. Please check your network or try again later.")
    }
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
                <button className='btn btn-primary' onClick={() => {
                  GetbasketVersionhistory(baskets[version]);
                  setShowModal1(true)
                }}>View</button>
                <button
                  className={`btn ms-2 ${version == 1 ? "btn-danger" : "btn-success"}`}
                  onClick={() => {
                    if (version == 1) {
                      getbasketsell(baskets[version])
                      setShowModal2(true);
                      setBasketdata(baskets[version])
                    } else {
                      setShowModal(true);
                      setData(baskets[version]);
                    }
                  }}

                >
                  {version == 1 ? "Sell" : "Buy"}
                </button>

              </div>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>CMP</th>
                      <th>Weightage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baskets[version].map((stock) => (
                      <tr key={stock._id}>
                        <td>{stock.name}</td>
                        <td><IndianRupee /> {(stock.price).toFixed(2)}</td>
                        <td>{stock.quantity}</td>
                        <td id={`stock-price-${stock.instrument_token}`} >
                          <span className="live-price"> {stock.livePrice ? stock.livePrice : "-"} </span>
                        </td>
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
        onClose={() => { setShowModal(false) }}
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
            <p className="fs-14 mb-0 mt-1">
              Minimum Investment Amount: <strong>₹ {item?.mininvamount}</strong>
            </p>
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
            <button className="btn btn-secondary" onClick={() => { setShowModal(false) }}>
              Cancel
            </button>
          </>
        }
      />



      <ReusableModal
        show={showModal1}
        onClose={() => { setShowModal1(false) }}
        title={<>Stock Detail</>}
        body={
          <div className="table-responsive">
            <table className="table mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {isLoading1 ? <Loader /> : viewdata?.map((stock) => (
                  <tr key={stock?._id}>
                    <td>{stock?.tradesymbol}</td>
                    <td> <IndianRupee /> {(stock?.price).toFixed(2)}</td>
                    <td>{stock?.quantity}</td>
                    <td>{stock?.ordertype}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />

      <ReusableModal
        show={showModal2}
        onClose={() => setShowModal2(false)}
        title={<>Exit Order</>}
        body={
          <div className="table-responsive">
            <label className="d-flex align-items-center">
              Order 1
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="ms-2"
              />
            </label>
          </div>
        }
        footer={
          <>
            <button
              className="btn btn-primary"
              onClick={() => SellExistOrder()}
              disabled={isExitorder || !isChecked}
            >
              Exit Order
            </button>
            <button className="btn btn-secondary"
              onClick={() => setShowModal2(false)}
              disabled={isExitorder}
            >
              Cancel
            </button>
          </>
        }
      />



    </Content>
  );
};

export default RebalanceStock;