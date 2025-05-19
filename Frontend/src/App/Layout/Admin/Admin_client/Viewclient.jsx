import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../Extracomponents/Table";
import Table1 from "../../../Extracomponents/Table1";
import { Tooltip } from "antd";
import {
  clientdetailbyid,
  clientplandatabyid,
  getcategoryplan,
  getclientsubscription,
  GetClientSignaldetail,
  Getclientsignaltoexport,
  GetStockDetail,
  GetService,
} from "../../../Services/Admin/Admin";
import {
  fDateTime,
  fDateTimeH,
  fDateTimeSuffix,
} from "../../../../Utils/Date_formate";
import { RefreshCcw, Eye, IndianRupee, ArrowDownToLine } from "lucide-react";
import { exportToCSV } from "../../../../Utils/ExportData";
import Select from "react-select";
import Content from "../../../components/Contents/Content";
import { image_baseurl } from "../../../../Utils/config";
import ReusableModal from "../../../components/Models/ReusableModal";

const Viewclientdetail = () => {

  const { id } = useParams();
  const token = localStorage?.getItem("token");

  const [data, setData] = useState([]);
  const [client, setClient] = useState([]);
  const [service, setService] = useState([]);
  const [clients, setClients] = useState([]);




  const [viewMode, setViewMode] = useState("plan");

  const [serviceList, setServiceList] = useState([]);
  const [searchstock, setSearchstock] = useState("");
  // const [ForGetCSV, setForGetCSV] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [stockList, setStockList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState([])
  const [titename, setTilename] = useState([])


  const [filters, setFilters] = useState({
    from: "",
    to: "",
    service: "",
    stock: "",
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (viewMode === "signal") {

      fetchAdminServices();
    }
    getclientservice();
    fetchAllClientData()
  }, [viewMode]);



  const fetchAllClientData = async () => {
    try {

      const categoryResponse = await getcategoryplan(token);
      if (categoryResponse.status) {
        setTilename(categoryResponse.data);
      }


      const planResponse = await clientplandatabyid(id, token);
      if (planResponse.status) {
        setData(planResponse.data);
      }


      const clientResponse = await clientdetailbyid(id, token);
      if (clientResponse.status) {
        setClient([clientResponse.data]);
      }
    } catch (error) {
      console.error("Error fetching all client data:", error);
    }
  };



  const getclientservice = async () => {
    try {
      const response = await getclientsubscription(id, token);

      if (response.status) {
        setService(response.data);
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };





  const fetchAdminServices = async () => {
    try {
      const response = await GetService(token);
      if (response.status) {
        setServiceList(response.data);
      }
    } catch (error) {
      console.log("Error fetching services:", error);
    }
  };



  const getAllSignal = async () => {
    try {
      const data = {
        page: currentPage,
        client_id: id,
        from: filters.from || "",
        to: filters.to || "",
        service_id: filters.service || "",
        stock: searchstock || "",
        type: "",
        search: searchInput || "",
      };

      const response = await GetClientSignaldetail(data, token);

      if (response.status) {
        if (response?.data?.length > 0 && response?.data) {
          setClients(response.data);
          setTotalRows(response.pagination.total);
        } else {
          setClients([]);
        }
      } else {
        setClients([]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };




  const getexportfile = async () => {
    try {
      const data = { client_id: id };
      const response = await Getclientsignaltoexport(data, token);
      if (response.status) {
        if (response.data?.length > 0) {
          const csvArr = response.data?.map((item) => ({
            Symbol: item?.tradesymbol || "-",
            segment: item?.segment || "-",
            EntryType: item?.calltype || "-",
            EntryPrice: item?.price || "-",
            ExitPrice: item?.closeprice || "-",
            EntryDate: fDateTimeH(item?.created_at) || "-",
            ExitDate: fDateTimeH(item?.closedate) || "-",
          }));
          exportToCSV(csvArr, "Signal Details");
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };




  const fetchStockList = async () => {
    try {
      const response = await GetStockDetail(token);

      if (response.status) {
        setStockList(response.data);
      }
    } catch (error) {
      console.log("Error fetching stock list:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const options = clients.map((item) => ({
    value: item.stock,
    label: item.stock,
  }));

  const handleChange1 = (selectedOption) => {
    setSearchstock(selectedOption ? selectedOption.value : "");
  };

  const resethandle = () => {
    setFilters({
      from: "",
      to: "",
      service: "",
      stock: "",
    });
    setSearchstock("");
    setSearchInput("");
    fetchAdminServices("");
    fetchStockList();

  };

  useEffect(() => {
    if (viewMode === "signal") {
      getAllSignal();
    }

  }, [filters, viewMode, searchInput, searchstock, currentPage]);



  const handleDownload = (row) => {
    const url = `${image_baseurl}uploads/invoice/${row.invoice}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "100px",
    },
    {
      name: "Plan Name",
      selector: (row) => {
        const matchedItem = titename.find((item) => item._id === row?.planDetails?.category);
        return matchedItem ? matchedItem.title : "-";
      },
      width: "180px",
    },

    {
      name: "Amount",
      selector: (row) => <>  <IndianRupee style={{ width: "16px" }} />  {(row.plan_price)?.toFixed(2) ?? "-"} </>,
      width: "189px",
    },
    {
      name: 'GST',
      selector: row => row?.total || "-",
      cell: row => <div>{(row?.total).toFixed(2)} <span style={{ fontSize: "12px" }}>({(row?.gst).toFixed(2)}% Gst Included)</span></div>,
      sortable: true,
      width: '250px',
    },
    {
      name: "Validity Date",
      selector: (row) => row.planDetails?.validity ?? "-",
      width: "180px",
    },
    {
      name: "Order_ID",
      selector: (row) => row.orderid ?? "Assign By Admin",
      width: "189px",
    },

    {
      name: "Purchase Date",
      selector: (row) => (row?.created_at ? fDateTimeH(row?.created_at) : ""),
      width: "260px",
    },
    {
      name: "Start Date",
      selector: (row) => (row?.plan_start ? fDateTimeH(row?.plan_start) : ""),
      width: "260px",
    },
    {
      name: "Expiry Date",
      selector: (row) => (row?.plan_end ? fDateTimeH(row?.plan_end) : ""),
      width: "260px",
    },
    {
      name: 'Invoice',
      cell: row => (
        <>

          <div className='d-flex '>
            {row.invoice ?
              <Link className="btn px-2" onClick={() => handleDownload(row)}>
                <Tooltip placement="top" overlay="Download">
                  <ArrowDownToLine />
                </Tooltip>
              </Link> : "-"}
          </div>

        </>
      ),
      sortable: true,
      width: '200px',
    },
  ];

  let columns1 = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * 10 + index + 1,
      sortable: false,
      width: "78px",
    },
    {
      name: "Segment",
      selector: (row) => {
        const segmentLabel =
          row.segment === "C"
            ? "CASH"
            : row.segment === "O"
              ? "OPTION"
              : "FUTURE";
        return row.closeprice == 0
          ? <div>{segmentLabel}<span style={{ color: "red" }}> (Avoid)<Eye onClick={() => { setShowModal(true); setDescription(row?.close_description) }} /></span></div>
          : segmentLabel;
      },
      sortable: true,
      width: "200px",
    },

    {
      name: "Symbol",
      selector: (row) => row.tradesymbol,
      sortable: true,
      width: "300px",
    },
    {
      name: "Entry Type",
      selector: (row) => row.calltype,
      sortable: true,
      width: "200px",
    },
    {
      name: "Quantity/Lot",
      selector: (row) => row.lot ? row.lot : "-",
      sortable: true,
      width: "200px",
    },
    {
      name: "Entry Price",
      selector: (row) => (
        <div>
          {" "}
          <IndianRupee style={{ width: "16px" }} />
          {row.price}
        </div>
      ),
      sortable: true,
      width: "200px",
    },

    {
      name: "Exit Price",
      selector: (row) => (
        <div>
          {row?.closeprice ? (
            <>
              <IndianRupee style={{ width: "16px" }} />
              {row.closeprice}
            </>
          ) : (
            "–"
          )}
        </div>
      ),
      sortable: true,
      width: "132px",
    },
    {
      name: "Entry Date",
      selector: (row) => fDateTimeH(row?.created_at),
      sortable: true,
      width: "250px",
    },
    {
      name: "Exit Date",
      selector: (row) =>
        row.closeprice ? fDateTimeSuffix(row?.closedate) : "-",
      sortable: true,
      width: "200px",
    },
  ];

  return (
    <div>
      <Content
        Page_title="Client Detail"
        button_status={false}
        backbutton_status={true}
        backForword={true}
      >
        <div className="page-content">
          <div className="card radius-15">
            <div className="card-body">
              <div className="p-4 border radius-15">
                <div className="row justify-content-center align-items-center">
                  {client.map(({ id, FullName, Email, PhoneNo, state, city }) => (
                    <div key={id} className="row">
                      <div className="col-md-2 d-flex align-items-center">
                        <strong>Full Name</strong>
                        <p className="my-0 ms-3">{FullName}</p>
                      </div>
                      <div className="col-md-4 d-flex align-items-center">
                        <strong>Email</strong>
                        <p className="my-0 ms-3">{Email}</p>
                      </div>
                      <div className="col-md-3 d-flex align-items-center">
                        <strong>Phone No</strong>
                        <p className="my-0 ms-4">{PhoneNo}</p>
                      </div>
                      <div className="col-md-3 d-flex align-items-center">
                        <strong>State</strong>
                        <p className="my-0 ms-4">{state}</p>
                      </div>
                      <div className="col-md-3 mt-3 d-flex align-items-center">
                        <strong>City</strong>
                        <p className="my-0 ms-4">{city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">Service Name </h6>
                  <h6 className="mb-0">Expiry Date</h6>
                </li>
                {service &&
                  service.map((item) => (
                    <li
                      key={item._id}
                      className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <h6 className="mb-0">{item?.serviceName}</h6>
                      <span className="text-secondary">{fDateTime(item?.enddate)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-4">
                <div className="btn-group">
                  <button
                    className={`btn btn-secondary ${viewMode === "plan" ? "active" : ""
                      }`}
                    onClick={() => setViewMode("plan")}
                  >
                    Plan View
                  </button>
                  <button
                    className={`btn btn-secondary ${viewMode === "signal" ? "active" : ""
                      }`}
                    onClick={() => setViewMode("signal")}
                  >
                    Signal View
                  </button>
                </div>
              </div>

              {viewMode === "plan" ? (
                <Table columns={columns} data={data} />
              ) : (
                <>
                  <div className="d-lg-flex align-items-center mb-4 gap-3">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control ps-5 radius-10"
                        placeholder="Search Signal"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <span className="position-absolute top-50 product-show translate-middle-y">
                        <i className="bx bx-search" />
                      </span>
                    </div>

                    <div className="ms-2" onClick={(e) => getexportfile()}>
                      <button
                        type="button"
                        className="btn btn-primary float-end"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Export To Excel"
                        delay={{ show: "0", hide: "100" }}
                      >
                        <i className="bx bxs-download" aria-hidden="true"></i>
                        Export-Excel
                      </button>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-3">
                      <label>From date</label>
                      <input
                        type="date"
                        name="from"
                        className="form-control radius-10"
                        placeholder="From"
                        value={filters.from}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>To Date</label>
                      <input
                        type="date"
                        name="to"
                        className="form-control radius-10"
                        placeholder="To"
                        value={filters.to}
                        onChange={handleFilterChange}
                        min={filters.from}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Select Service</label>
                      <select
                        name="service"
                        className="form-control radius-10"
                        value={filters.service || ""}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Service</option>
                        {serviceList?.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3 d-flex">
                      <div className="w-100">
                        <label>Select Stock</label>
                        <Select
                          options={options}
                          value={
                            options.find(
                              (option) => option.value === searchstock
                            ) || null
                          }
                          onChange={handleChange1}
                          className=" radius-10"
                          isClearable
                          placeholder="Select Stock"
                        />
                      </div>
                      <div className="rfreshicon">
                        <RefreshCcw onClick={resethandle} />
                      </div>
                    </div>
                  </div>
                  <Table1
                    columns={columns1}
                    data={clients}
                    totalRows={totalRows}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Content>
      <ReusableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Description"
        body={<p>{description || "No description available."}</p>}
      />
    </div>
  );
};

export default Viewclientdetail;
