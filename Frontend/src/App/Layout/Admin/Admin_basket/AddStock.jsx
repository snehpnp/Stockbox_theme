import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as Config from "../../../../Utils/config";
import { Tooltip } from 'antd';
import Swal from "sweetalert2";
import { Addstockbasketform } from "../../../Services/Admin/Admin";



const AddStock = () => {


  const { id: basket_id } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formikValues, setFormikValues] = useState({});
  const [weightagecounting, setWeightagecounting] = useState(0);
  const [currentlocation, setCurrentlocation] = useState({})
  const [header, setHeader] = useState("Add Stock")



  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location?.state) {
      setCurrentlocation(location?.state?.state);
    } if (location?.state?.state == "publish") {
      setHeader("Rebalance Stock")
    }
  }, [location]);

  const redirectTo = (currentlocation === "publish") ? "/admin/basket/basketstockpublish" : "/admin/basket";

  const fetchOptions = async (inputValue) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${Config.base_url}stock/getstockbysymbol`,
        { symbol: inputValue },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.data) {
        setOptions(
          response.data.data.map((item) => ({
            label: String(item._id),
            value: String(item._id),
            tradesymbol: item.data[0]?.tradesymbol,
          }))
        );
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (selectedOption) => {
    setSelectedServices(selectedOption || []);

    const updatedValues = {};
    (selectedOption || []).forEach((service) => {
      updatedValues[service.value] = formikValues[service.value] || {
        tradesymbol: service.tradesymbol,
        name: service.label,
        percentage: "",
        price: "",
        type: "",
      };
    });
    setFormikValues(updatedValues);


  };




  const handleRemoveService = (serviceValue) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.value !== serviceValue)
    );

    setFormikValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[serviceValue];
      return updatedValues;
    });

    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.value !== serviceValue)
    );



  };

  const handleInputChange = (value) => {
    setInputValue(value);
    fetchOptions(value);
  };

  const handleInputFieldChange = (serviceId, fieldKey, value) => {
    setFormikValues((prevValues) => {
      const updatedValues = { ...prevValues };
      if (!updatedValues[serviceId]) {
        updatedValues[serviceId] = {};
      }
      updatedValues[serviceId][fieldKey] = value;


      return updatedValues;
    });

  };

  const handleSubmit = async (status) => {
    setLoading(true);

    if (Object.keys(formikValues).length === 0) {
      Swal.fire("Warning", "Please add stock", "warning");
      return;
    }

    const invalidStocks = Object.values(formikValues).filter(
      (stock) => Number(stock.percentage || 0) <= 0
    );


    if (invalidStocks.length > 0) {
      Swal.fire(
        "Error",
        "Each stock's weightage should be greater than zero.",
        "error"
      );
      return;
    }


    let totalWeightage = 0;
    Object.values(formikValues).forEach((stock) => {
      totalWeightage += Number(stock.percentage || 0);
    });

    if (totalWeightage !== 100) {
      Swal.fire(
        "Error",
        "Total weightage of all stocks must be exactly 100.",
        "error"
      );
      return;
    }

    if (!basket_id) {
      Swal.fire("Error", "Basket ID is missing. Please try again.", "error");
      return;
    }

    const emptyType = Object.values(formikValues).filter(
      (stock) => stock.type === ""
    );

    if (emptyType.length > 0) {
      Swal.fire(
        "Warning",
        "Please select type.",
        "warning"
      );
      return;
    }

    const stocksWithStatus = Object.values(formikValues).map((stock) => ({
      ...stock,
      status,
    }));

    const requestData = {
      basket_id,
      stocks: stocksWithStatus,
      publishstatus: status === 1,
    };


    try {
      const response = await Addstockbasketform(requestData);
      if (response?.status) {
        Swal.fire("Success", response.message, "success");
        setTimeout(() => navigate(redirectTo), 1500);
      } else {
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      setLoading(false);

      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error"
      );
    }

  };

  useEffect(() => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) =>
        selectedServices.some((service) => service.value === option.value)
      )
    );
  }, [selectedServices]);

  useEffect(() => {

    if (formikValues) {
      const newWeightage = Object.values(formikValues).reduce((sum, stock) => sum + Number(stock.percentage || 0), 0);
      setWeightagecounting(newWeightage);
    }


  }, [formikValues])


  return (

    <div className="page-content">
      <div className="row">
        <div className="col-md-6">
          <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
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
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Link to={redirectTo}>
            <Tooltip title="Back">
              <i
                className="lni lni-arrow-left-circle"
                style={{ fontSize: "2rem", color: "#000" }}
              />
            </Tooltip>
          </Link>
        </div>
      </div>
      <hr />

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <Select
                inputValue={inputValue}
                onInputChange={handleInputChange}
                options={options}
                onChange={handleServiceChange}
                value={selectedServices}
                placeholder="Search and select stocks..."
                isClearable
                isMulti
                isLoading={loading}
                noOptionsMessage={() =>
                  loading ? "Loading..." : "No options found"
                }
              />
              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-6 text-end">
                  <h6 className="mt-3">Total Weightage : {weightagecounting}  </h6>
                </div>

              </div>
              <hr />
            </div>
          </div>
          <form>
            {selectedServices.slice().reverse().map((service => (
              <div key={service.value} className="mt-4">
                <h5>
                  {service.label}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm float-end"
                    onClick={() => handleRemoveService(service.value)}
                  >
                    <i className="bx bx-trash" />
                  </button>
                </h5>
                <div className="row">
                  {Object.keys(formikValues[service.value] || {}).map(
                    (fieldKey) =>
                      fieldKey !== "tradesymbol" && (
                        <div key={fieldKey} className="col-md-3">
                          <label>
                            {fieldKey === "percentage"
                              ? "Weightage"
                              : fieldKey.charAt(0).toUpperCase() +
                              fieldKey.slice(1)}
                          </label>
                          {fieldKey === "type" ? (
                            <select
                              className="form-control"
                              // value={formikValues[service.value]?.[fieldKey] || ""}
                              value={formikValues[service.value]?.type || ""}

                              onChange={(e) =>
                                handleInputFieldChange(
                                  service.value,
                                  fieldKey,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select an option</option>
                              <option value="Large Cap">Large Cap</option>
                              <option value="Mid Cap">Mid Cap</option>
                              <option value="Small Cap">Small Cap</option>
                            </select>
                          ) : (
                            <input
                              type={
                                fieldKey === "percentage" ||
                                  fieldKey === "price"
                                  ? "number"
                                  : "text"
                              }
                              className="form-control"
                              placeholder={`Enter ${fieldKey}`}
                              value={formikValues[service.value]?.[fieldKey] || ""}
                              onChange={(e) =>
                                handleInputFieldChange(
                                  service.value,
                                  fieldKey,
                                  e.target.value
                                )
                              }
                              readOnly={fieldKey === "name"}
                            />
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            )))}
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => handleSubmit(0)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-primary mt-4 ms-2"
              onClick={() => handleSubmit(1)}
              disabled={loading}
            >
              {loading ? "Publishing..." : " Submit & Publish"}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
