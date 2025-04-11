import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ReusableModal from "../../../components/Models/ReusableModal";
// import Table from '../../../components/Table';
import {
  Settings2,
  Eye,
  SquarePen,
  RadioTower,
  Trash2,
  Download,
  ArrowDownToLine,
  RefreshCcw,
} from "lucide-react";
import {
  deleteClient,
  UpdateClientStatus,
  PlanSubscription,
  getActivecategoryplan,
  getplanlist,
  BasketSubscription,
  BasketAllList,
  getcategoryplan,
  getPlanbyUser,
  AllclientFilter,
  getclientExportfile,
  BasketAllActiveList,
  BasketListbyUser
} from "../../../Services/Admin/Admin";
import { Tooltip } from "antd";
import { fDateTime } from "../../../../Utils/Date_formate";
import { image_baseurl } from "../../../../Utils/config";
import { IndianRupee } from "lucide-react";
import { exportToCSV } from "../../../../Utils/ExportData";
import Table from "../../../Extracomponents/Table1";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";




const Client = () => {
  useEffect(() => {
    getbasketlist();
    getcategoryplanlist();
    // getActiveBasketdetail();
  }, []);

  const location = useLocation();
  const clientStatus = location?.state?.clientStatus;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [category, setCategory] = useState([]);
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [planlist, setPlanlist] = useState([]);
  const [basketlist, setBasketlist] = useState([]);
  const [client, setClientid] = useState({});
  const [selectcategory, setSelectcategory] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [ForGetCSV, setForGetCSV] = useState([]);
  const [searchkyc, setSearchkyc] = useState("");
  const [statuscreatedby, setStatuscreatedby] = useState("");
  const [header, setheader] = useState("Client");
  const [expired, setExpired] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [getBasket, setGetBasket] = useState({});

  //state for loading
  const [isLoading, setIsLoading] = useState(true);

  //this state for button disable

  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (clientStatus == 1) {
      setheader("Active Client");
    } else if (clientStatus == 0) {
      setheader("Deactive Client");
    } else if (clientStatus === "active") {
      setheader("Total Plan Active Client");
    } else if (clientStatus === "expired") {
      setheader("Total Plan Expired Client");
    }
  }, [clientStatus, clients]);

  const handleDownload = (row) => {
    const url = `${image_baseurl}uploads/pdf/${row.pdf}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [basketdetail, setBasketdetail] = useState({
    basket_id: "",
    client_id: "",
    price: "",
  });

  const [updatetitle, setUpdatetitle] = useState({
    plan_id: "",
    client_id: "",
    price: "",
  });

  const handleTabChange = (index) => {
    setCheckedIndex(index);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectcategory("");
  };

  const handleCategoryChange = (categoryId) => {
    setSelectcategory(categoryId);
    setSelectedPlanId(null);
    setUpdatetitle("");
  };

  const resethandle = () => {
    setSearchkyc("");
    setSearchInput("");
    setStatuscreatedby("");
    setExpired("");
  };

  useEffect(() => {
    getAdminclient();
  }, [searchInput, searchkyc, statuscreatedby, currentPage, expired]);

  const getexportfile = async () => {
    try {
      const data = {
        page: currentPage,
        kyc_verification: searchkyc,
        status: clientStatus == 1 ? 1 : clientStatus == 0 ? 0 : "",
        createdby: statuscreatedby,
        search: searchInput,
        planStatus:
          expired === "active"
            ? "active"
            : expired === "expired"
              ? "expired"
              : clientStatus === "active"
                ? "active"
                : clientStatus === "expired"
                  ? "expired"
                  : expired === "NA" ? "NA" : "",
        add_by: "",
      };

      const response = await getclientExportfile(data, token);
      if (response.status) {
        if (response.data?.length > 0) {
          const csvArr = response.data?.map((item) => ({
            FullName: item?.FullName || "N/A",
            Email: item?.Email || "N/A",
            kyc_verification:
              item?.kyc_verification === 1 ? "Verified" : "Not Verified",
            PlanStatus: item?.plansStatus?.some(
              (statusItem) => statusItem.status === "active"
            )
              ? "Active"
              : item?.plansStatus?.some(
                (statusItem) => statusItem.status === "expired"
              )
                ? "Expired"
                : "N/A",
            ClientActiveSegment:
              item?.plansStatus
                ?.filter((statusItem) => statusItem.status === "active")
                .map((statusItem) => statusItem.serviceName || "N/A")
                .join(", ") || "N/A",
            ClientExpiredSegment:
              item?.plansStatus
                ?.filter((statusItem) => statusItem.status === "expired")
                .map((statusItem) => statusItem.serviceName || "N/A")
                .join(", ") || "N/A",
            CreatedBy:
              item?.addedByDetails?.FullName ||
              (item?.clientcome === 1 ? "WEB" : "APP") ||
              "N/A",
            PhoneNo: item?.PhoneNo || "N/A",
            Created_at: fDateTime(item?.createdAt) || "N/A",
          }));
          exportToCSV(csvArr, "All Clients");
        } else {
          console.log("No data available.");
        }
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };


  const getcategoryplanlist = async () => {
    try {
      const response = await getActivecategoryplan(token);


      if (response.status) {
        setCategory(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };




  const getAdminclient = async () => {
    try {
      const data = {
        page: currentPage,
        kyc_verification: searchkyc,
        status: clientStatus == 1 ? 1 : clientStatus == 0 ? 0 : "",
        createdby: statuscreatedby,
        search: searchInput,
        planStatus:
          expired === "active"
            ? "active"
            : expired === "expired"
              ? "expired"
              : clientStatus === "active"
                ? "active"
                : clientStatus === "expired"
                  ? "expired"
                  : expired === "NA" ? "NA" : "",
        add_by: "",
      };


      const response = await AllclientFilter(data, token);

      if (response.status) {
        setClients(response.data);
        setTotalRows(response.pagination.total);
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };



  const getplanlistassinstatus = async (_id) => {
    try {
      const response = await getPlanbyUser(_id, token);
      if (response.status) {
        setPlanlist(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };


  const getActiveBasketdetail = async (_id) => {
    try {
      const response = await BasketListbyUser(_id, token);
      if (response.status) {
        setGetBasket(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };





  const getbasketlist = async () => {
    try {
      const response = await BasketAllList(token);

      if (response.status) {
        setBasketlist(response.data);
      }
    } catch (error) {
      console.log("error");
    }
  };



  const updateClient = async (row) => {
    navigate("/admin/client/updateclient/" + row._id, { state: { row } });
  };


  const signaldetail = async (row) => {
    navigate("/admin/clientsignaldetail/" + row._id, { state: { row } });
  };

  const Clientdetail = async (row) => {
    navigate("/admin/client/clientdetail/" + row._id, { state: { row } });
  };





  const DeleteClient = async (_id) => {
    try {
      const result = await showCustomAlert("confirm", "Do you want to delete this Client member? This action cannot be undone.");

      if (result.isConfirmed) {
        const response = await deleteClient(_id, token);
        if (response.status) {
          showCustomAlert("error", "The Client has been successfully deleted.");
          getAdminclient();
        }
      } else {
        showCustomAlert("error", "The Client deletion was cancelled.");

      }
    } catch (error) {
      showCustomAlert("error", "There was an error deleting the Client.");
    }
  };



  // update status
  const handleSwitchChange = async (event, id) => {
    const originalChecked = event.target.checked;
    const user_active_status = originalChecked ? "1" : "0";
    const data = { id, status: user_active_status };

    const result = await showCustomAlert("confirm", "Do you want to save the changes?");

    if (result.isConfirmed) {
      try {
        const response = await UpdateClientStatus(data, token);
        if (response.status) {
          showCustomAlert("success", "Status Changed");
        }
        getAdminclient();
      } catch (error) {
        showCustomAlert("error", "There was an error processing your request.");
      }
    } else {
      event.target.checked = !originalChecked;
    }
  };




  // Update service
  const Updateplansubscription = async () => {
    setLoading(true);
    try {
      const data = {
        plan_id: updatetitle.plan_id,
        client_id: client._id,
        price: updatetitle.price,
      };
      const response = await PlanSubscription(data, token);

      if (response && response.status) {
        showCustomAlert("success", response.message);
        setUpdatetitle({ plan_id: "", client_id: "", price: "" });
        getAdminclient();
        handleCancel();
      } else {
        showCustomAlert("error", response.message);
      }
    } catch (error) {
      showCustomAlert("error", "Server error");
    }
    setLoading(false);
  };



  // assign basket
  const UpdateBasketservice = async () => {
    try {
      const data = {
        basket_id: basketdetail.basket_id,
        client_id: client._id,
        price: basketdetail.price,
      };
      const response = await BasketSubscription(data, token);
      if (response && response.status) {
        showCustomAlert("Success", "Basket service updated successfully.");
        setBasketdetail({ basket_id: "", client_id: "", price: "" });
        getAdminclient();
        handleCancel();
      } else {
        showCustomAlert("error", response.message);
      }
    } catch (error) {
      showCustomAlert("error", "There was an error updating the Basket.");
    }
  };





  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * 10 + index + 1,
      sortable: false,
      width: "100px",
    },
    {
      name: "Full Name",
      selector: (row) => row.FullName,
      sortable: true,
      width: "200px",
    },

    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      width: "350px",
    },
    {

      name: "State",
      selector: (row) => row?.state || "-",
      sortable: true,
      width: "300px",

      name: "Phone No",
      selector: (row) => row.PhoneNo,
      sortable: true,
      width: "200px",
    },
    {
      name: "State",
      selector: (row) => row.state ? row.state : "-",
      sortable: true,
      width: "200px",
    },
    {
      name: "Plan Status",
      cell: (row) => {
        const hasActive = row?.plansStatus?.some(
          (item) => item.status === "active"
        );
        const hasExpired = row?.plansStatus?.some(
          (item) => item.status === "expired"
        );

        let statusText = "N/A";
        let color = "red";

        if (hasActive) {
          statusText = "Active";
          color = "green";
        } else if (hasExpired) {
          statusText = "Expired";
          color = "orange";
        }

        return <span style={{ color }}>{statusText}</span>;
      },
      sortable: true,
      width: "200px",
    },

    {
      name: "Client Segment",
      cell: (row) => (
        <>
          {Array.isArray(row?.plansStatus) && row.plansStatus.length > 0 ? (
            row.plansStatus.map((item, index) => (
              <span
                key={index}
                style={{
                  color:
                    item.status === "active"
                      ? "green"
                      : item.status === "expired"
                        ? "red"
                        : "inherit",
                  marginRight: "5px",
                }}
              >
                {item.serviceName || "N/A"}
              </span>
            ))
          ) : (
            <span>N/A</span>
          )}
        </>
      ),
      sortable: true,
      width: "200px",
    },

    // {
    //   name: "Phone No",
    //   selector: (row) => row.PhoneNo,
    //   sortable: true,
    // },

    {
      name: "Created By",
      selector: (row) =>
        row.addedByDetails?.FullName ?? (row.clientcome === 1 ? "WEB" : "APP"),
      sortable: true,
      width: "165px",
    },

    {
      name: "Active Status",
      selector: (row) => (
        <div className="form-check form-switch form-check-info">
          <input
            id={`rating_${row._id}`}
            className="form-check-input toggleswitch"
            type="checkbox"
            checked={row.ActiveStatus == 1}
            onChange={(event) => handleSwitchChange(event, row._id)}
          />
          <label
            htmlFor={`rating_${row._id}`}
            className="checktoggle checkbox-bg"
          ></label>
        </div>
      ),
      sortable: true,
      width: "165px",
    },

    {
      name: "Kyc",
      selector: (row) =>
        row.kyc_verification === 1 ? (
          <div
            style={{ color: "green", cursor: "pointer" }}
            onClick={() => handleDownload(row)}
          >
            <Tooltip placement="top" overlay="Download">
              Verified <ArrowDownToLine />
            </Tooltip>
          </div>
        ) : (
          <div style={{ color: "red" }}>Not Verified</div>
        ),
      sortable: true,
      width: "160px",
    },
    {
      name: "CreatedAt",
      selector: (row) => fDateTime(row.createdAt),
      sortable: true,
      width: "200px",
    },
    // {
    //     name: 'Signal Detail',
    //     selector: (row) => (
    //         <div className='d-flex'>

    //             <Tooltip placement="top" overlay="Signal Detail">
    //                 <span onClick={(e) => { signaldetail(row) }} style={{ cursor: 'pointer' }}>
    //                     <RadioTower />
    //                 </span>
    //             </Tooltip>
    //         </div>
    //     ),
    //     ignoreRowClick: true,
    //     allowOverflow: true,
    //     button: true,
    //     width: '165px',
    // },
    {
      name: "Actions",
      selector: (row) => (
        <div className="d-flex justify-content-end gap-2 " >
          <Tooltip placement="top" overlay="Package Assign">
            <span
              onClick={(e) => {
                if (row.ActiveStatus === 1) {
                  showModal(true);
                  setClientid(row);
                  getplanlistassinstatus(row._id);
                  getActiveBasketdetail(row._id);
                } else {
                  showCustomAlert("error", "Activate the client first Then assign the package.");
                }
              }}
              style={{ cursor: "pointer", color: "orange" }}
            >
              <Settings2 />
            </span>
          </Tooltip>

          <Tooltip title="view">
            <Eye onClick={() => Clientdetail(row)}
              style={{ color: "green" }} />
          </Tooltip>

          <Tooltip title="Update">
            <SquarePen className="" onClick={() => updateClient(row)}
              style={{ color: "#6f42c1" }}
            />
          </Tooltip>

          {/* <Tooltip title="delete">
                  <Trash2 onClick={() => DeleteClient(row._id)} />
                </Tooltip> */}


        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "165px",
    },
  ];

  return (
    <div>
      <div>
        <div className="page-content">
          <div className="page-breadcrumb  d-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">{header}</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/dashboard">
                      <i className="bx bx-home-alt" />
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <hr />

          <div className="card">
            <div className="card-body">
              <div className="d-lg-flex align-items-center mb-4 gap-3">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control ps-5 radius-10"
                    placeholder="Search Client"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                  />
                  <span className="position-absolute top-50 product-show translate-middle-y">
                    <i className="bx bx-search" />
                  </span>
                </div>
                <div className="d-sm-flex gap-3 justify-content-lg-end w-100 mt-3 mt-lg-0">
                  <div className="flaot-lg-auto">
                    <Link to="/admin/addclient" className="btn btn-primary">
                      <i className="bx bxs-plus-square" aria-hidden="true" />
                      Add Client
                    </Link>
                  </div>

                  <div className="" onClick={(e) => getexportfile()}>
                    <button
                      type="button"
                      className="btn btn-primary my-2 my-sm-0"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Export To Excel"
                      delay={{ show: "0", hide: "100" }}
                    >
                      <i className="bx bxs-download" aria-hidden="true"></i>
                      Export-Excel
                    </button>
                  </div>
                  <div className="">
                    <Link
                      to="/admin/clientdeletehistory"
                      className="btn btn-primary"
                    >
                      <i className="bx bxs-trash" aria-hidden="true" />
                      Deleted Client
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-sm-6 col-md-4 mb-3">
                  <div>
                    <label htmlFor="kycSelect">Select Kyc</label>
                    <select
                      id="kycSelect"
                      className="form-control radius-10"
                      value={searchkyc}
                      onChange={(e) => setSearchkyc(e.target.value)}
                    >
                      <option value="">Select Kyc</option>
                      <option value="1">Verified</option>
                      <option value="0">Not Verified</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6  col-md-4 mb-3">
                  <div>
                    <label htmlFor="kycSelect">Select CreatedBy</label>
                    <select
                      id="CreatedBy"
                      className="form-control radius-10"
                      value={statuscreatedby}
                      onChange={(e) => setStatuscreatedby(e.target.value)}
                    >
                      <option value="">Select Created By</option>
                      <option value="web">Web</option>
                      <option value="app">App</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6  col-md-3 mb-3">
                  <div>
                    <label htmlFor="kycSelect">Select Client</label>
                    <select
                      id="CreatedBy"
                      className="form-control radius-10"
                      value={expired}
                      onChange={(e) => setExpired(e.target.value)}
                    >
                      <option value="">Select Client</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired </option>
                      <option value="NA">N/A</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-md-1">
                  <div className="refresh-icon ">
                    <RefreshCcw onClick={resethandle} />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <Loader />
              ) : clients.length > 0 ? (
                <Table
                  columns={columns}
                  data={clients}
                  totalRows={totalRows}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              ) : (
                <div className="text-center mt-5">
                  <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>




      <ReusableModal
        show={isModalVisible}
        onClose={() => handleCancel()}
        title={<> Assign Package</>}
        size="xl"
        body={
          <>
            <div className="card">
              <div className="d-flex justify-content-center align-items-center card-body">
                {["Plan", "Basket"].map((tab, index) => (
                  <label key={index} className="labelfont mx-3">
                    <input
                      style={{ marginLeft: "12px" }}
                      type="radio"
                      name="tab"
                      checked={checkedIndex === index}
                      onChange={() => handleTabChange(index)}
                      aria-label={`Select ${tab}`}
                    />
                    <span className="ps-2 text-secondary">{tab}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              {checkedIndex === 0 && (
                <>
                  <div className="row my-3">
                    {category &&
                      category
                        .filter((cat) =>
                          planlist.some((plan) => plan.category._id === cat._id)
                        )
                        .map((item, index) => (
                          <div className="col-lg-4 mb-3" key={index}>
                            <input
                              style={{
                                border: "1px solid #ddd",
                                margin: "0 8px 1px",
                              }}
                              className="form-check-input"
                              type="radio"
                              name="planSelection"
                              id={`proplus-${index}`}
                              onClick={() => handleCategoryChange(item._id)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`proplus-${index}`}
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                              }}
                            >
                              {item.title} (
                              {item.servicesDetails
                                .map((service) => service.title)
                                .join(", ")}
                              )
                            </label>
                          </div>
                        ))}
                  </div>

                  {selectcategory && (
                    <form
                      className="card-body my-3"
                      style={{ height: "40vh", overflowY: "scroll" }}
                    >
                      <div className="row">
                        {planlist
                          .filter(
                            (item) => item.category._id === selectcategory
                          )
                          .map((item, index) => (
                            <div className="col-md-6 mb-3" key={index}>
                              <div className="card mb-0 shadow-sm">
                                <div className="card-body p-2">
                                  <h5 className="card-title d-flex align-items-center">
                                    <input
                                      style={{
                                        height: "13px",
                                        width: "13px",
                                        marginTop: "0.52rem",
                                        border: "1px solid #ddd",
                                      }}
                                      className="form-check-input"
                                      type="radio"
                                      name="planSelection"
                                      id={`input-plan-${index}`}
                                      checked={selectedPlanId === item._id}
                                      onClick={() => {
                                        setSelectedPlanId(item._id);
                                        setUpdatetitle({
                                          plan_id: item._id,
                                          price: item.price,
                                        });
                                      }}
                                    />
                                    <label
                                      className="form-check-label mx-2"
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "#333",
                                      }}
                                      htmlFor={`input-plan-${index}`}
                                    >
                                      {item.validity}
                                    </label>
                                  </h5>

                                  <div
                                    className="accordion"
                                    id={`accordion-${selectcategory}`}
                                  >
                                    <div className="accordion-item">
                                      <h2
                                        className="accordion-header"
                                        id={`heading-${item._id}`}
                                      >
                                        <button
                                          className={`accordion-button ${selectedPlanId === item._id
                                            ? ""
                                            : "collapsed"
                                            } custom-accordion-button`}
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target={`#collapse-${item._id}`}
                                          aria-expanded={
                                            selectedPlanId === item._id
                                          }
                                          aria-controls={`collapse-${item._id}`}
                                        >
                                          <div className="d-flex justify-content-between w-100">
                                            <div>
                                              <strong className=" heading-color  m-2">
                                                Detail
                                              </strong>
                                              <strong className="text-success m-2 activestrong">
                                                {item?.subscription?.status ===
                                                  "active"
                                                  ? "Active"
                                                  : ""}
                                              </strong>
                                            </div>
                                          </div>
                                        </button>
                                      </h2>
                                      <div
                                        id={`collapse-${item._id}`}
                                        className={`accordion-collapse collapse ${selectedPlanId === item._id
                                          ? "show"
                                          : ""
                                          }`}
                                        aria-labelledby={`heading-${item._id}`}
                                        data-bs-parent={`#accordion-${selectcategory}`}
                                      >
                                        <div className="accordion-body">
                                          <div className="d-flex justify-content-between">
                                            <strong>Price:</strong>
                                            <span style={{ display: "flex", alignItems: "center" }}>
                                              <IndianRupee style={{ width: "15px", height: "15px" }} /> {item.price}
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <strong>Validity:</strong>
                                            <span>{item.validity}</span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <strong>Created At:</strong>
                                            <span>
                                              {fDateTime(item.created_at)}
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <strong>Updated At:</strong>
                                            <span>
                                              {fDateTime(item.updated_at)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </form>
                  )}
                </>
              )}

              {checkedIndex === 1 && (
                <>
                  <div
                    className="card-body my-3"
                    style={{ height: "40vh", overflowY: "scroll" }}
                  >
                    <div className="row">
                      {getBasket.map((item, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                          <div className="card mb-0 shadow-sm">
                            <div className="card-body p-2">
                              <h5 className="card-title d-flex align-items-center">
                                <input
                                  style={{
                                    height: "13px",
                                    width: "13px",
                                    marginTop: "0.52rem",
                                    border: "1px solid #ddd",
                                  }}
                                  className="form-check-input"
                                  type="radio"
                                  name="planSelection"
                                  id={`input-plan-${index}`}
                                  checked={selectedPlanId === item._id}
                                  onClick={() => {
                                    if (item?.client_status === "active") {
                                      showCustomAlert("error", "The Plan is Already Active")
                                      return;
                                    }
                                    setSelectedPlanId(item._id);
                                    setBasketdetail({
                                      basket_id: item._id,
                                      price: item.basket_price,
                                    });
                                  }}
                                />
                                <label
                                  className="form-check-label mx-2"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#333",
                                  }}
                                  htmlFor={`input-plan-${index}`}
                                >
                                  {item.title} ({item.themename})
                                </label>
                              </h5>

                              <div
                                className="accordion"
                                id={`accordion-basket`}
                              >
                                <div className="accordion-item">
                                  <h2
                                    className="accordion-header"
                                    id={`heading-${item._id}`}
                                  >
                                    <button
                                      className={`accordion-button ${selectedPlanId === item._id
                                        ? ""
                                        : "collapsed"
                                        } custom-accordion-button`}
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse-${item._id}`}
                                      aria-expanded={
                                        selectedPlanId === item._id
                                      }
                                      aria-controls={`collapse-${item._id}`}
                                    >
                                      <div className="d-flex justify-content-between w-100">
                                        <div>
                                          <strong className="m-2 heading-color">
                                            Detail
                                          </strong>
                                          <strong className="text-success m-2 activestrong">
                                            {item?.client_status ===
                                              "active"
                                              ? "Active"
                                              : ""}
                                          </strong>
                                        </div>
                                      </div>
                                    </button>
                                  </h2>
                                  <div
                                    id={`collapse-${item._id}`}
                                    className={`accordion-collapse collapse ${selectedPlanId === item._id ? "show" : ""
                                      }`}
                                    aria-labelledby={`heading-${item._id}`}
                                    data-bs-parent={`#accordion-basket`}
                                  >
                                    <div className="accordion-body">
                                      <div className="d-flex justify-content-between">
                                        <strong>Price:</strong>
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                          <IndianRupee style={{ width: "15px", height: "15px" }} /> {item.basket_price}
                                        </span>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <strong>Validity:</strong>
                                        <span>{item.validity}</span>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <strong>
                                          Minimum Investment Amount:
                                        </strong>
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                          <IndianRupee style={{ width: "15px", height: "15px" }} /> {item?.mininvamount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        }
        footer={
          <>
            <button
              className="btn btn-primary rounded-1"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
            {checkedIndex === 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => Updateplansubscription()}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Plan"}
              </button>
            )}
            {checkedIndex === 1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => UpdateBasketservice()}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Plan"}
              </button>
            )}
          </>
        }
      />
    </div>
  );
};

export default Client;
