import React, { useState, useEffect } from "react";
import ReusableModal from "../App/components/Models/ReusableModal";
import { UpdateBroker } from "../App/Services/UserService/User";
import { base_url } from "./config";
import { brokerContentMap } from "./BrokerApiInfo";
import showCustomAlert from "../App/Extracomponents/CustomAlert/CustomAlert";

function BrokersData({ data, closeModal, type }) {

  const [viewModel, setViewModel] = useState(true);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [brokerStatus, setBrokerStatus] = useState(false);
  const [statusInfo, setStatusInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [brokerId, setBrokerId] = useState(null);



  useEffect(() => {
    if (type) {
      setBrokerId(type);
      setStatusInfo(
        brokerFieldsMap[type]?.reduce((acc, field) => {
          acc[field.key] = "";
          return acc;
        }, {}) || {}
      );
      setShowModal(true);
    }
  }, [type]);





  const brokerFieldsMap = {
    1: [{
      key: "apikey",
      label: "API Key",
      type: "text"
    }],
    2: [
      {
        key: "AppCode",
        label: "App Code",
        type: "text"
      },
      {
        key: "alice_userid",
        label: "User ID",
        type: "tel"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
    ],
    3: [
      {
        key: "apikey",
        label: "API Key",
        type: "text"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
      {
        key: "user_name",
        label: "Username",
        type: "text"
      },
      {
        key: "pass_word",
        label: "Password",
        type: "password"
      },
    ],
    4: [
      {
        key: "apikey",
        label: "API Key",
        type: "text"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
      {
        key: "Password",
        label: "Password",
        type: "password"
      },
    ],
    5: [
      {
        key: "apikey",
        label: "API Key",
        type: "text"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
    ],
    6: [
      {
        key: "apikey",
        label: "API Key",
        type: "text"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
    ],
    7: [
      {
        key: "apikey",
        label: "API Key",
        type: "text"
      },
      {
        key: "apisecret",
        label: "API Secret",
        type: "text"
      },
    ],
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
      img: "https://yt3.googleusercontent.com/yM-KyoT9t4jHt8-cqgi_tU0MqbDV6LhgNo7mQkvN8nTsMegf_D1qDwIGYzbWNYUOkgnW7jVuhYA=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 4,
      name: "Market Hub",
      img: "https://media.licdn.com/dms/image/v2/D560BAQEB5MsFZkdKwg/company-logo_200_200/company-logo_200_200/0/1681292585114/market_hub_stock_broking_pvt_ltd__logo?e=1746057600&v=beta&t=9YGrMbiPySe_qefvVi7OuaBOhjgc-BbupTeRPPIp1jE",
    },
    {
      id: 5,
      name: "Zerodha",
      img: "https://media.licdn.com/dms/image/D4D12AQGJnj8j3sb2TQ/article-cover_image-shrink_720_1280/0/1683270116246?e=2147483647&v=beta&t=H0c3cHnPKzjoiJVSlrKlWw0gD_6I4rnWHGYwVOhrPTs",
    },
    {
      id: 6,
      name: "Upstox",
      img: "https://website-assets-fd.freshworks.com/attachments/clogvv27a034uwzoavav3omzt-featured-img-copy2.full.png",
    },
    {
      id: 7,
      name: "Dhan ",
      img: "https://play-lh.googleusercontent.com/lVXf_i8Gi3C7eZVWKgeG8U5h_kAzUT0MrmvEAXfM_ihlo44VEk01HgAi6vbBNsSzBQ",
    }
  ];




  const filteredBrokers = type ? brokers.filter((b) => b.id === type) : brokers;
  const fields = brokerId ? brokerFieldsMap[brokerId] || [] : [];

  const brokerContent = brokerId ? brokerContentMap[brokerId] || [] : [];


  const handleFieldChange = (key, value) => {
    setStatusInfo((prev) => ({ ...prev, [key]: value }));
  };




  const handleSave = async () => {
    setLoading(true);
    try {
      let data = { ...statusInfo, brokerid: brokerId, id: userId };
      let loginData = await UpdateBroker(data, token);

      if (loginData.status) {
        window.location.href = loginData.url;
      } else {
        showCustomAlert("error","Oops")
      }
    } catch (error) {
      console.error("Error during broker login", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBrokerStatus(data?.dlinkStatus);
  }, [data]);



  return (
    <>


      <ReusableModal
        show={viewModel}
        onClose={closeModal}
        title={<span className="text-xl font-semibold">Select Broker</span>}
        size="xl"
        body={
          <>
            {!brokerStatus ? (
              <div className="page-content flex flex-col items-center">
                <div className="form-control row d-flex justify-content-center">
                  {filteredBrokers.map((broker) => (

                    <>      <div>
                      <img
                        src={broker.img}
                        alt={broker.name}
                        style={{
                          height: "50px",
                          width: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <h5 className=" font-weight-bold mt-2">{broker.name}</h5>
                    </div>

                      <div
                        key={broker.id}
                        className="col-lg-2 card card-body d-flex flex-column align-items-center justify-content-center m-2"
                        onClick={() => {
                          setBrokerId(broker.id);
                          setShowModal(true);
                        }}
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.3s ease-in-out",

                          borderRadius: "15px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          padding: "20px",
                          marginBottom: "20px",
                        }}

                      >

                        <div
                          className="w-100 card-image mb-3">

                          {brokerContent?.length > 0 && (
                            <div className="timeline">

                              <div className="timeline-container">
                                {brokerContent?.map((item, index) => (
                                  <div className="timeline-item" key={index}>
                                    <div className="timeline-header">
                                      <h2 className="timeline-title">{item.HeadingTitle}</h2>
                                      <p className="timeline-description">{item.description}</p>
                                    </div>
                                    <div className="timeline-content" >
                                      <p>{item.Apicreate}</p>
                                      <a href={item.LinkOne} target="_blank" rel="noopener noreferrer" className="timeline-link">
                                        Visit Angel Broking API
                                      </a>
                                      <a href={item.LinkTwo} target="_blank" rel="noopener noreferrer" className="timeline-link">
                                        Generate Access Token
                                      </a>
                                      <p>Example: {item.link3}</p>
                                      <a href={item.youTube} target="_blank" rel="noopener noreferrer" className="timeline-link">
                                        Watch Tutorial
                                      </a>
                                    </div>
                                    <div className="timeline-images" style={{ margin: "0", padding: "0" }}>
                                      <img src={item.img1} alt="Angel Step 1" style={{ width: "600px", height: "80px" }} />
                                      <img src={item.img2} alt="Angel Step 2" style={{ width: "600px", height: "150px" }} />
                                      {/* <img src={item.img3} alt="Angel Step 3" style={{ width: "600px", height: "80px" }} /> */}
                                    </div>
                                  </div>
                                ))}
                              </div>

                            </div>
                          )}


                        </div>

                      </div>
                    </>
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
                        className="form-control"
                        value={statusInfo[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </>
        }
      />
    </>
  );
}

export default BrokersData;
