import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { updateStockList,getstocklistById } from "../../../Services/Admin/Admin";
import { Tooltip } from 'antd';
import axios from "axios";
import * as Config from "../../../../Utils/config";
import Content from "../../../components/Contents/Content";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";


const EditStock = () => {


    const location = useLocation();

    const token = localStorage.getItem("token");



    const { stock } = location.state || {};
    const [selectedServices, setSelectedServices] = useState([]);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [formValues, setFormValues] = useState({});
    const [weightagecounting, setWeightagecounting] = useState(0);
    const [currentlocation, setCurrentlocation] = useState({})

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingPublish, setLoadingPublish] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [description, setDescription] = useState(stock && stock[0]?.comment || "")



    const [stockdata, setStockdata] = useState([])


    const [getrebalance, setGetrebalance] = useState({})
    const [header, setHeader] = useState("Edit Stock")





    const navigate = useNavigate();

    useEffect(() => {
        if (location?.state?.row) {
            setGetrebalance(location?.state?.row);

        }
    }, [location]);





    useEffect(() => {
        if (getrebalance) {
            GetStocklistbyid();
        }
    }, [getrebalance]);



    useEffect(() => {
        if (stock && Array.isArray(stock) && stock.length > 0) {
            const initialServices = stock.map((item) => ({
                label: item.name || item.symbol || item.tradesymbol || "",
                value: String(item._id),
                tradesymbol: item.tradesymbol,
                name: item.name || item.symbol || "",
                weightage: item.weightage || "",
                price: item.price || "",
                type: item.type || "",
            }));

            setSelectedServices(initialServices);

            const initialFormValues = initialServices.reduce((acc, service) => {
                acc[service.value] = {
                    tradesymbol: service.tradesymbol,
                    name: service.name,
                    weightage: service.weightage,
                    price: service.price,
                    type: service.type,
                };
                return acc;
            }, {});

            setFormValues(initialFormValues);
        } else if (stockdata && Array.isArray(stockdata) && stockdata.length > 0) {
            const initialServices = stockdata?.map((item) => ({
                label: item.name || item.symbol || item.tradesymbol || "",
                value: String(item._id),
                tradesymbol: item.tradesymbol,
                name: item.name || item.symbol || "",
                weightage: item.weightage || "",
                price: item.price || "",
                type: item.type || "",
            }));

            setSelectedServices(initialServices);

            const initialFormValues = initialServices.reduce((acc, service) => {
                acc[service.value] = {
                    tradesymbol: service.tradesymbol,
                    name: service.name,
                    weightage: service.weightage,
                    price: service.price,
                    type: service.type,
                };
                return acc;
            }, {});

            setFormValues(initialFormValues);
        }
    }, [stock, stockdata]);




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
                    response.data.data.filter((item) =>
                        !selectedServices.some(service => service.label === item._id)
                    ).map((item) => ({
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
            setLoadingOptions(false);
        }
    };

    const handleServiceChange = (selectedOption) => {

        const uniqueServices = selectedOption.filter(
            (newOption) =>
                !selectedServices.some((service) => service.value === newOption.value)
        );



        const updatedServices = [...uniqueServices, ...selectedServices].filter(
            (service) =>
                service?.weightage ||
                selectedOption.some((option) => option.label === service.label)
        );


        setSelectedServices(updatedServices);

        const newFormValues = { ...formValues };
        uniqueServices.forEach((service) => {
            newFormValues[service.value] = {
                tradesymbol: service.tradesymbol,
                name: service.label,
                weightage: service.weightage || "",
                price: service.price || "",
                type: service.type || "",
            };
        });

        const arrayValues = updatedServices.map(item => item.value);

        for (const key in newFormValues) {
            if (!arrayValues.includes(key)) {
                delete newFormValues[key];
            }
        }

        setFormValues(newFormValues);
    };

    const handleRemoveService = (serviceValue) => {
        setSelectedServices((prev) =>
            prev.filter((service) => service.value !== serviceValue)
        );
        setFormValues((prevValues) => {
            const updatedValues = { ...prevValues };
            delete updatedValues[serviceValue];
            return updatedValues;
        });
    };


    useEffect(() => {
        fetchOptions(inputValue);
    }, [inputValue])




    const handleInputChange = (event, serviceValue, field) => {
        const value = event.target.value;
        setFormValues((prev) => ({
            ...prev,
            [serviceValue]: {
                ...prev[serviceValue],
                [field]: value,
            },
        }));
    };




    const handleSubmit = async (status) => {
        try {
            if (Object.keys(formValues).length === 0) {
                showCustomAlert("error", "Stock is required for edit", "warning");
                return;
            }

            const invalidStocks = Object.values(formValues).filter(
                ({ weightage }) => Number(weightage || 0) <= 0
            );

            if (invalidStocks.length > 0) {
                showCustomAlert("error", "Each stock's weightage should be greater than zero.");
                return;
            }

            const totalWeightage = Object.values(formValues).reduce(
                (sum, { weightage }) => sum + Number(weightage || 0),
                0
            );

            if (totalWeightage !== 100) {
                showCustomAlert("error", "Total weightage of all stocks must be exactly 100.");
                return;
            }

            const missingTypeStocks = Object.values(formValues).filter(
                ({ type }) => !type?.trim()
            );

            if (missingTypeStocks.length > 0) {
                showCustomAlert("error", "Please select a Type.");
                return;
            }

            const stocksWithStatus = Object.values(formValues).map(({ weightage, ...rest }) => ({
                ...rest,
                status,
                percentage: weightage
            }));

            const version = stock?.[0]?.version || stockdata?.[0]?.version || "";
            const basket_id = stock?.[0]?.basket_id || stockdata?.[0]?.basket_id || "";

            const requestData = {
                basket_id,
                stocks: stocksWithStatus,
                version,
                publishstatus: status === 1,
                comments: description
            };

            status === 1 ? setLoadingPublish(true) : setLoadingSubmit(true);



            const response = await updateStockList(requestData);

            if (response?.status) {
                showCustomAlert("Success", response.message, navigate, "/admin/basket/basketstockpublish");
            } else {
                showCustomAlert("error", response.message);
            }
        } catch (error) {
            showCustomAlert("error", `An unexpected error occurred: ${error.message || ""}`);
        } finally {
            setLoadingSubmit(false);
            setLoadingPublish(false);
        }
    };


    useEffect(() => {
        if (formValues) {
            const newWeightage = Object.values(formValues).reduce((sum, stock) => sum + Number(stock.weightage || 0), 0);
            setWeightagecounting(newWeightage);
        }

    }, [formValues])

    const GetStocklistbyid = async () => {
        try {
            if (getrebalance) {
                const response = await getstocklistById(getrebalance._id, token);

                if (response?.status && Array.isArray(response.data)) {
                    const filteredStockData = response.data?.filter(item => item.status == 0);
                    setStockdata(filteredStockData && filteredStockData);
                    setDescription(filteredStockData[0]?.comment)
                    setHeader(filteredStockData.length > 0 ? "Rebalance Stock" : "Edit Stock");
                } else {
                    console.error("Invalid data received:", response?.data);
                }
            }

        } catch (error) {
            console.error("Error fetching stock list:", error);
        }
    };



    return (
        <Content
            Page_title={header}
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >

            <div className="card">

                <div className="card-body">

                    <Select
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        options={options}
                        onChange={handleServiceChange}
                        value={selectedServices.filter((service) => !service.weightage)}
                        placeholder="Search and select stocks..."
                        isClearable
                        isMulti
                        isLoading={loadingOptions}
                        noOptionsMessage={() => (loadingOptions ? "Loading..." : "No options found")}
                    />

                    <div className="row">
                        <div className="col-md-6"></div>
                        <div className="col-md-6 text-end">
                            <h6 className="mt-3">Total Weightage : {weightagecounting}</h6>
                        </div>

                    </div>
                    <hr />
                    {selectedServices.map((service) => (
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
                                <div className="col-md-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formValues[service.value]?.name || ""}
                                        onChange={(e) => handleInputChange(e, service.value, "name")}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Weightage</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formValues[service.value]?.weightage || ""}
                                        onChange={(e) => handleInputChange(e, service.value, "weightage")}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formValues[service.value]?.price || ""}
                                        onChange={(e) => handleInputChange(e, service.value, "price")}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Type</label>
                                    <select
                                        className="form-control"
                                        value={formValues[service.value]?.type || ""}
                                        onChange={(e) => handleInputChange(e, service.value, "type")}

                                    >
                                        <option value="">Select Type</option>
                                        <option value="Large Cap">Large Cap</option>
                                        <option value="Mid Cap">Mid Cap</option>
                                        <option value="Small Cap">Small Cap</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

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

                </div>
            </div>

        </Content>
    );
};

export default EditStock;
