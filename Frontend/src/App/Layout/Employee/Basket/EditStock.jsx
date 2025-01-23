import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { updateStockList } from "../../../Services/Admin/Admin";
import Swal from "sweetalert2";
import { Tooltip } from 'antd';
import axios from "axios";
import * as Config from "../../../../Utils/config";
import Content from "../../../components/Contents/Content";




const EditStock = () => {
    const location = useLocation();
    const { stock } = location.state || {};
    const [selectedServices, setSelectedServices] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [formValues, setFormValues] = useState({});
    const [weightagecounting, setWeightagecounting] = useState(0);

    const navigate = useNavigate();




    useEffect(() => {
        if (stock && Array.isArray(stock)) {
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
        }
    }, [stock]);




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
            setLoading(false);
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
        if (Object.keys(formValues).length === 0) {
            Swal.fire("Error", "Stock is required for edit", "warning");
            return;
        }

        const invalidStocks = Object.values(formValues).filter(
            (stock) => Number(stock.weightage || 0) <= 0
        );

        if (invalidStocks.length > 0) {
            Swal.fire(
                "Error",
                "Each stock's weightage should be greater than zero.",
                "error"
            );
            return;
        }


        const totalWeightage = Object.values(formValues).reduce(
            (sum, stock) => sum + Number(stock.weightage || 0),
            0
        );

        if (totalWeightage !== 100) {
            Swal.fire(
                "Error",
                "Total weightage of all stocks must be exactly 100.",
                "error"
            );
            return;
        }

        const stocksWithStatus = Object.values(formValues).map((stock) => ({
            ...stock,
            status,
            percentage: stock.weightage,
        }));

        const version = stock && stock[0]?.version ? stock[0].version : "";

        const requestData = {
            basket_id: stock[0]?.basket_id || "",
            stocks: stocksWithStatus,
            version,
            publishstatus: status === 0 ? false : status === 1 ? true : "",
        };

        try {
            const response = await updateStockList(requestData);
            if (response?.status) {
                Swal.fire("Success", response.message, "success");
                setTimeout(() => navigate("/employee/basket"), 1500);
            } else {
                Swal.fire("Error", response.message, "error");
            }
        } catch (error) {
            Swal.fire(
                "Error",
                "An unexpected error occurred. Please try again.",
                "error"
            );
        }
    };

    useEffect(() => {
        console.log("formValues", formValues)
        if (formValues) {
            const newWeightage = Object.values(formValues).reduce((sum, stock) => sum + Number(stock.weightage || 0), 0);
            setWeightagecounting(newWeightage);
        }

    }, [formValues])



    return (

        <Content
        Page_title="Edit Stock"
        button_status={false}
        backbutton_status={true}
        backForword={true}
      >

        <div className="page-content">
            {/* <div className="row">
                <div className="col-md-6">
                    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Edit Stock</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/employee/dashboard">
                                            <i className="bx bx-home-alt" />
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                </div>

                <div className="col-md-6 d-flex justify-content-end">
                    <Link to="/employee/basket">
                        <Tooltip title="Back">
                            <i
                                className="lni lni-arrow-left-circle"
                                style={{ fontSize: "2rem", color: "#000" }}
                            />
                        </Tooltip>
                    </Link>
                </div>
            </div>
            <hr /> */}

            <div className="card">

                <div className="card-body">

                    <Select
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        options={options}
                        onChange={handleServiceChange}
                        // defaultValue={selectedServices}
                        value={selectedServices.filter(
                            (service) => !service.weightage
                        )}
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
                    <button
                        type="button"
                        className="btn btn-primary mt-4"
                        onClick={() => handleSubmit(0)}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary mt-4 ms-2"
                        onClick={() => handleSubmit(1)}
                    >
                        Submit & Publish
                    </button>
                </div>
            </div>
        </div>
        </Content>
    );
};

export default EditStock;
