import React, { useState, useEffect } from "react";
import ReusableModal from "../App/components/Models/ReusableModal";
import { UpdateBroker } from "../App/Services/UserService/User";
import Swal from "sweetalert2";

function BrokersData({ data }) {
  const [viewModel, setViewModel] = useState(true);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [brokerStatus, setBrokerStatus] = useState(false);
  const [statusInfo, setStatusInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [brokerId, setBrokerId] = useState(null);



  const brokerFieldsMap = {

    1: [{ key: "apikey", label: "API Key", type: "text" }],
    2: [
      { key: "AppCode", label: "App Code", type: "text" },
      { key: "alice_userid", label: "User ID", type: "tel" },
      { key: "apisecret", label: "API Secret", type: "text" },
    ],
    3: [
      { key: "apikey", label: "API Key", type: "text" },
      { key: "apisecret", label: "API Secret", type: "text" },
      { key: "user_name", label: "Username", type: "text" },
      { key: "pass_word", label: "Password", type: "password" },
    ],
    4: [
      { key: "apikey", label: "API Key", type: "text" },
      { key: "apisecret", label: "API Secret", type: "text" },
      { key: "Password", label: "Password", type: "password" },
    ],
  };


  const fields = brokerFieldsMap[brokerId] || [];

  const handleFieldChange = (key, value) => {
    setStatusInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };



  const handleSave = async () => {
    setLoading(true);
    try {
  
      let data = { ...statusInfo, brokerid: brokerId, id: userId };
      let loginData 

       loginData = await UpdateBroker(data, token);
   
      if (loginData.status) {
        if (brokerId == 1) {
          window.location.href = loginData.url;
        } else if (brokerId == 2) {
          window.location.href = loginData.url;
        }else if (brokerId == 3) {
          console.log("Kotak Neo", loginData);
        }
      }else{
        Swal.fire({ icon: "error", title: "Oops...", text: loginData.message ,timer: 2000});
      }
    } catch (error) {
      console.error("Error during broker login", error);
    } finally {
      setLoading(false);
    }
  };

  

  const brokers = [
    {
      id: 1,
      name: "Angel One",
      img: "https://play-lh.googleusercontent.com/Ic8lUYwMCgTePpo-Gbg0VwE_0srDj1xD386BvQHO_mOwsfMjX8lFBLl0Def28pO_Mvk",
    },
    {
      id: 2,
      name: "Alice Blue",
      img: "https://media.licdn.com/dms/image/v2/D560BAQHU88VqPp14_w/company-logo_200_200/company-logo_200_200/0/1714714585811/alice_blue_financial_services_ltd_logo?e=2147483647&v=beta&t=-wlK1PYJutu-1MibN_iR2-i5Vga7VWuckKi0jOQp2F0",
    },
    {
      id: 3,
      name: "Kotak Neo",
      img: "https://play-lh.googleusercontent.com/CpJknJt8JrLZJp9-ETaYMWzqphlTNNqGSiSx05dyoGKFi18HOxM6CVp_JrpoZxrlIys",
    },
    {
      id: 4,
      name: "Market Hub",
      img: "https://media.licdn.com/dms/image/v2/D560BAQEB5MsFZkdKwg/company-logo_200_200/company-logo_200_200/0/1681292585114/market_hub_stock_broking_pvt_ltd__logo?e=1746057600&v=beta&t=9YGrMbiPySe_qefvVi7OuaBOhjgc-BbupTeRPPIp1jE",
    },
  ];

  useEffect(() => {
    setBrokerStatus(data?.dlinkStatus);
  }, [data]);

  return (
    <ReusableModal
      show={viewModel}
      onClose={() => setViewModel(false)}
      title={<span className="text-xl font-semibold">Select Broker</span>}
      size="xl"
      body={
        <>
          {!brokerStatus ? (
            <div className="page-content flex flex-col items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 d-flex justify-content-center">
                {brokers.map((broker) => (
                  <div
                    key={broker.id}
                    className="card bg-white shadow-lg rounded-xl p-4 cursor-pointer hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                    onClick={() => {
                      setBrokerId(broker.id);
                      setShowModal(true);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={broker.img}
                        alt={broker.name}
                        className="w-28 h-28 rounded-full object-cover mb-4"
                        style={{
                          objectPosition: "center",
                          objectFit: "contain",
                          height: "100px",
                          width: "100px",
                        }}
                      />
                      <h5 className="text-lg font-medium text-center">
                        {broker.name}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showModal && brokerId && (
            <div className="modal-body mt-6">
              <div>
                {fields.map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      className="form-control w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={statusInfo[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  className="btn btn-primary w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}

export default BrokersData;
