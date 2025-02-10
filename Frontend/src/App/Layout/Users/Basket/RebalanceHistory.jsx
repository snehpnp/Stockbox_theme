import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import { Rebalancehistory } from '../../../Services/UserService/User';
import { useParams } from 'react-router-dom';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';
import { IndianRupee } from "lucide-react";


const RebalanceHistory = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const { id } = useParams();
  const [groupedData, setGroupedData] = useState({});
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    gethistory();
  }, []);




  const gethistory = async () => {
    try {
      const data = { id: id, clientid: userid };
      const response = await Rebalancehistory(data, token);
      if (response.status) {
        groupByVersion(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false)
  };





  const groupByVersion = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.version]) {
        acc[item.version] = [];
      }
      acc[item.version].push(item);
      return acc;
    }, {});
    setGroupedData(grouped);

  };


  const calculateTotalInvestment = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };



  return (
    <Content
      Page_title="Rebalance History"
      button_status={false}
      backbutton_status={false}
      backbutton_title="Back"
      backForword={true}
    >
      <div className="row">
        {isLoading ? <Loader /> : <div className="col-md-12">
          {Object.keys(groupedData).map((version, index) => {
            const totalInvestment = calculateTotalInvestment(groupedData[version]);
            const date = groupedData[version][0]?.created_at || "N/A";
            return (
              <div className='card mb-3' key={index}>
                <div className=''>
                  <div className="accordion accordion-flush" id={`accordionFlushExample${index}`}>
                    <div className="accordion-item rounded-3 border-0 shadow">
                      <h2 className="accordion-header">
                        <div className="accordion-button border-bottom collapsed fw-semibold d-flex justify-content-between align-items-center w-100" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                          <div>
                            <h6 className="m-0 fw-bold">Investment Amount: ₹ {totalInvestment?.toFixed(2)}</h6>
                            <p className="m-0 fw-bold text-muted fs-20">Date: {fDateTime(date)}</p>

                          </div>
                          <div className="ms-auto d-flex justify-content-end ml-20">
                            {/* <button className="btn btn-primary btn-sm">View</button> */}
                          </div>
                        </div>
                      </h2>
                      <div id={`flush-collapse${index}`} className="accordion-collapse collapse" data-bs-parent={`#accordionFlushExample${index}`}>
                        <div className="accordion-body">
                          <div className="row align-items-center">
                            <div className="col-md-12">
                              <div className='table-responsive'>
                                <table className="table table-bordered">
                                  <thead className='table-primary'>
                                    <tr>
                                      <td><p className="mb-1">Name</p></td>
                                      <td><p className="mb-1">Price</p></td>
                                      <td><p className="mb-1">Weightage</p></td>
                                      <td><p className="mb-1">Quantity</p></td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {groupedData[version].map((item, idx) => (
                                      <tr key={idx}>
                                        <td><b>{item.name}</b></td>
                                        <td><b> <IndianRupee /> {item.price}</b></td>
                                        <td><b>{item.weightage}</b></td>
                                        <td><b>{item.quantity}</b></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        }
      </div>
    </Content>
  );
};

export default RebalanceHistory;
