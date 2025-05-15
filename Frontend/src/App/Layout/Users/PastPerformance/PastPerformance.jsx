import React, { useEffect } from "react";

import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "chart.js/auto";
import Content from "../../../components/Contents/Content";

const PastPerformance = () => {




  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example months
    datasets: [
      {
        label: "Cash",
        data: [12, 19, 3, 5, 2, 3], // Replace with actual data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Future",
        data: [8, 11, 7, 10, 5, 6], // Replace with actual data
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Option",
        data: [6, 9, 5, 8, 4, 3], // Replace with actual data
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  return (

    <div>
    <Content
   Page_title="Past Performance"
   button_status={false}
 >
  <div className="page-content">
  
      
      <div className="row mt-4">
        <div className="col-md-4">
        <div className="card">
        <div className="card-body">
          <h5>
            <Link to="/user/past-performance/cash" className="text-decoration-none text-dark">  Cash</Link>
          
            </h5>
          <Bar
            data={{
              ...chartData,
              datasets: [chartData.datasets[0]], // Cash dataset
            }}
          />
          <hr/>
          <div className="row ">
            <div className="col-md-2 pe-0 border-right">
              <h6> <i className='bx bx-rupee fs-1 text-success'></i> </h6>
            </div>
            <div className="col-md-6">
              <h6>Average Profit</h6>
              <h4> 12000 <span className="fs-6"> P/M</span></h4>
          </div>
          </div>
          </div>
        </div>
        </div>
        <div className="col-md-4">
        <div className="card">
        <div className="card-body">
          <h5> <Link to="/user/past-performance/future" className="text-decoration-none text-dark">  Future</Link></h5>
          <Bar
            data={{
              ...chartData,
              datasets: [chartData.datasets[1]], // Future dataset
            }}
          />
              <hr/>
          <div className="row ">
            <div className="col-md-2 pe-0 border-right">
              <h6> <i className='bx bx-rupee fs-1 text-success'></i> </h6>
            </div>
            <div className="col-md-6">
              <h6>Average Profit</h6>
              <h4> 12000 <span className="fs-6"> P/M</span></h4>
          </div>
          </div>
          </div>
          </div>
        </div>
        <div className="col-md-4">
        <div className="card">
        <div className="card-body">
          <h5> <Link to="/user/past-performance/option" className="text-decoration-none text-dark">  Option</Link></h5>
          <Bar
            data={{
              ...chartData,
              datasets: [chartData.datasets[2]], // Option dataset
            }}
          />
              <hr/>
          <div className="row ">
            <div className="col-md-2 pe-0 border-right">
              <h6> <i className='bx bx-rupee fs-1 text-success'></i> </h6>
            </div>
            <div className="col-md-6">
              <h6>Average Profit</h6>
              <h4> 12000 <span className="fs-6"> P/M</span></h4>
          </div>
          </div>
        </div>
        </div>
        </div>
      </div>
       
      </div>
  </Content>
    
     </div>
  );
};

export default PastPerformance;
