import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as Config from "../../../../Utils/config";
import { Tooltip } from 'antd';
import { Addstockbasketform } from "../../../Services/Admin/Admin";
import Content from "../../../components/Contents/Content";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";

const AddStock = () => {


  const { id: basket_id } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [formikValues, setFormikValues] = useState({});
  const [weightagecounting, setWeightagecounting] = useState(0);
  const [currentlocation, setCurrentlocation] = useState({})
  const [header, setHeader] = useState("Add Stock")
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [description, setDescription] = useState("")

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
    setLoadingOptions(true);

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
      setOptions([]);
    } finally {
      setLoadingOptions(false);
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
    if (Object.keys(formikValues).length === 0) {
      showCustomAlert("error", "Please add stock", null, null)
      return;
    }

    const invalidStocks = Object.values(formikValues).filter(
      (stock) => Number(stock.percentage || 0) <= 0
    );


    if (invalidStocks.length > 0) {
      showCustomAlert("error", "Each stock's weightage should be greater than zero.", null, null)
      return;
    }


    let totalWeightage = 0;
    Object.values(formikValues).forEach((stock) => {
      totalWeightage += Number(stock.percentage || 0);
    });

    if (totalWeightage !== 100) {
      showCustomAlert("error", "Total weightage of all stocks must be exactly 100.", null, null)
      return;
    }

    if (!basket_id) {
      showCustomAlert("error", "Basket ID is missing. Please try again.", null, null)
      return;
    }

    const emptyType = Object.values(formikValues).filter(
      (stock) => stock.type === ""
    );

    if (emptyType.length > 0) {
      showCustomAlert("error", "Please select type.", null, null)
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
      comments: description
    };


    if (status === 1) {
      setLoadingPublish(true);
    } else {
      setLoadingSubmit(true);
    }

    try {
      const response = await Addstockbasketform(requestData);
      if (response?.status) {
        showCustomAlert("Success", response.message, navigate, redirectTo)

      } else {
        showCustomAlert("error", response.message, null, null)
      }
    } catch (error) {
      showCustomAlert("error", "An unexpected error occurred. Please try again.", null, null)
    } finally {
      setLoadingSubmit(false);
      setLoadingPublish(false);
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
    <Content
      Page_title={header}
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
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
                isLoading={loadingOptions}
                noOptionsMessage={() =>
                  loadingOptions ? "Loading..." : "No options found"
                }
              />
              <div className="row">
                <div className="col-md-6"> <h5 className="mt-3">Stock</h5></div>
                <div className="col-md-6 text-end">
                  <h6 className="mt-3">Total Weightage : {weightagecounting}  </h6>
                </div>
              </div>
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
            <div style={{ marginTop: "15px" }}>
              <label>Rationale</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>


            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => handleSubmit(0)}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-primary mt-4 ms-2"
              onClick={() => handleSubmit(1)}
              disabled={loadingPublish}
            >
              {loadingPublish ? "Publishing..." : "Submit & Publish"}
            </button>
          </form>
        </div>
      </div>

    </Content>
  );
};

export default AddStock;
