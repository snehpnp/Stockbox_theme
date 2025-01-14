import React from "react";
import Table from "../../../components/Tabels/Table";
import Content from "../../../components/Contents/Content";

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
    <div>
            <Content
      Page_title="Payment History"

      button_status={false}
      
      backbutton_status={false}
    >
    <div className="page-content">
      
      <div className="card">
        <Table columns={columns} data={PayementHistory} />
      </div>
    </div>
    </Content>
    </div>
  );
};

export default PaymentHistory;
