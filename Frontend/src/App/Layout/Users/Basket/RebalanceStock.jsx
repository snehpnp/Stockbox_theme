import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { RebalanceBasket, GetBasketSell, getversionhistory, ExitPlaceOrderData } from '../../../Services/UserService/User';
import { useParams } from 'react-router-dom';
import Loader from '../../../../Utils/Loader';
import { IndianRupee } from "lucide-react";
import Swal from "sweetalert2";


const RebalanceStock = () => {


  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [baskets, setBaskets] = useState([]);



  useEffect(() => {
    getbasketRebalance();
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


  const getbasketsell = async () => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: "", version: "" };
      const response = await GetBasketSell(data, token);
      if (response.status) {
        console.log("response", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const GetVersionhistory = async () => {
    try {
      const data = { basket_id: id, clientid: userid, brokerid: "", version: "" };
      const response = await getversionhistory(data, token);
      if (response.status) {
        console.log("response1", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const ExitOrderplace = async (type) => {
    try {

      const data = {
        basket_id: "",
        clientid: "",
        brokerid: "",
        investmentamount: "",
        type: "",
      };

      const response = await ExitPlaceOrderData(data, token);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: response.message || "Order Placed Successfully!",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
        })
      } else {
        Swal.fire({
          icon: "error",
          title: response.message || "Order Failed",
          text: "Failed to place the order. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
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
                <button className='btn btn-success ms-2'>Buy</button>
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
    </Content>
  );
};

export default RebalanceStock;