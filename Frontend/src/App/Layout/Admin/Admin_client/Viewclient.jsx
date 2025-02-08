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
  fDate,
  fDateTime,
  fDateTimeH,
  fDateTimeSuffix,
} from "../../../../Utils/Date_formate";
import { RefreshCcw, IndianRupee } from "lucide-react";
import { exportToCSV } from "../../../../Utils/ExportData";
import Select from "react-select";
import Content from "../../../components/Contents/Content";

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
  const [ForGetCSV, setForGetCSV] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [stockList, setStockList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
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
    getPlanDetail();
    getClientDetail();
    getclientservice();
    fetchAdminServices();
  }, []);

  const getCategoryTitle = async (categoryId) => {
    try {
      const response = await getcategoryplan(token);
      if (response.status) {
        const category = response.data.find((item) => item._id === categoryId);
        return category ? category.title : "-";
      }
    } catch (error) {
      console.error("Error fetching category title:", error);
    }
    return "-";
  };

  const getPlanDetail = async () => {
    try {
      const response = await clientplandatabyid(id, token);
      if (response.status) {
        const plansWithTitles = await Promise.all(
          response.data.map(async (plan) => {
            const categoryId = plan.planDetails?.category;
            if (categoryId) {
              const categoryTitle = await getCategoryTitle(categoryId);
              return { ...plan, categoryTitle };
            }
            return plan;
          })
        );

        setData(plansWithTitles);
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
    }
  };

  const getClientDetail = async () => {
    try {
      const response = await clientdetailbyid(id, token);

      if (response.status) {
        setClient([response.data]);
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
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
        from: filters.from,
        to: filters.to,
        service_id: filters.service,
        stock: searchstock,
        type: "",
        search: searchInput,
      };

      const response = await GetClientSignaldetail(data, token);
      if (response && response.status) {
        setTotalRows(response.pagination.total);
        setClients(response.data);
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
    getAllSignal();
  };

  useEffect(() => {
    getAllSignal();
  }, [filters, searchInput, searchstock, currentPage]);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "100px",
    },
    {
      name: "Plan Name",
      selector: (row) => row.categoryTitle || "-",
      width: "180px",
    },
    {
      name: "Amount",
      selector: (row) => <>  <IndianRupee />  {row.plan_price ?? "-"} </>,
      width: "189px",
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
      selector: (row) => (row?.created_at ? fDateTime(row?.created_at) : ""),
      width: "180px",
    },
    {
      name: "Start Date",
      selector: (row) => (row?.plan_start ? fDateTime(row?.plan_start) : ""),
      width: "180px",
    },
    {
      name: "Expiry Date",
      selector: (row) => (row?.plan_end ? fDateTime(row?.plan_end) : ""),
      width: "195px",
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
      selector: (row) =>
        row.segment == "C" ? "CASH" : row.segment == "O" ? "OPTION" : "FUTURE",
      sortable: true,
      width: "132px",
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
      selector: (row) => row.lot,
      sortable: true,
      width: "200px",
    },
    {
      name: "Entry Price",
      selector: (row) => (
        <div>
          {" "}
          <IndianRupee />
          {row.price}
        </div>
      ),
      sortable: true,
      width: "200px",
    },

    {
      name: "Exit Price",
      selector: (row) =>
        <>
          <IndianRupee />  {row.closeprice ? row.closeprice : "-"}
        </>,
      sortable: true,
      width: "150px",
    }, ,
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
                  {client.map(({ id, FullName, Email, PhoneNo }) => (
                    <div key={id} className="row">
                      <div className="col-md-4 d-flex align-items-center">
                        <strong>Full Name</strong>
                        <p className="my-0 ms-4">{FullName}</p>
                      </div>
                      <div className="col-md-4 d-flex align-items-center">
                        <strong>Email</strong>
                        <p className="my-0 ms-4">{Email}</p>
                      </div>
                      <div className="col-md-4 d-flex align-items-center">
                        <strong>Phone No</strong>
                        <p className="my-0 ms-4">{PhoneNo}</p>
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
                        value={filters.service}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Service</option>
                        {serviceList.map((service) => (
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
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    paginationDefaultPage={currentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Viewclientdetail;
