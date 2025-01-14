import React from "react";
import Table from "../../../components/Tabels/Table";

const PaymentHistory = () => {
  // Static data
  const PayementHistory = [
    {
      count: 10,
      totalProfit: "$5000",
      totalLoss: "$2000",
      profitCount: 7,
      lossCount: 3,
      accuracy: "70%",
   
    },
    {
      count: 20,
      totalProfit: "$8000",
      totalLoss: "$1000",
      profitCount: 18,
      lossCount: 2,
      accuracy: "90%",

    },
  ];

  const columns = [
    { name: "Name", selector: (row) => row.count },
    { name: "Paid Amount", selector: (row) => row.totalProfit },
    { name: "Plan Discount", selector: (row) => row.totalLoss },
    { name: "Purchase Type", selector: (row) => row.profitCount },
    { name: "Plan Validity", selector: (row) => row.lossCount },
    { name: "Order Id", selector: (row) => row.accuracy },
    
  ];

  return (
    <div className="page-content">
      <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Payement History</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <a href="/admin/dashboard">
                  <i className="bx bx-home-alt" />
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <hr />
      <div className="card">
        <Table columns={columns} data={PayementHistory} />
      </div>
    </div>
  );
};

export default PaymentHistory;
