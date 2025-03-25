import React, { useState } from "react";
import Select from "react-select";


import { Formik } from 'formik';
import * as Yup from 'yup';
import DynamicForm from '../FormicForm';
import { Addstockbasketform } from '../../../Services/Admin';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SelectForm = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({});

  const serviceOptions = [
    { value: "service1", label: "Service 1" },
    { value: "service2", label: "Service 2" },
    { value: "service3", label: "Service 3" },
  ];

  const handleServiceChange = (selectedOption) => {
    if (selectedOption && !selectedServices.some((service) => service.value === selectedOption.value)) {
      setSelectedServices((prevServices) => [...prevServices, selectedOption]);
      setFormData((prevData) => ({
        ...prevData,
        [selectedOption.value]: {
          serviceField1: "",
          serviceField2: "",
          additionalField: "",
        },
      }));
    }
  };

  const handleInputChange = (e, serviceValue) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [serviceValue]: {
        ...prevData[serviceValue],
        [name]: value,
      },
    }));
  };

  const handleRemoveService = (serviceValue) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service.value !== serviceValue)
    );
    setFormData((prevData) => {
      const newData = { ...prevData };
      delete newData[serviceValue];
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };




  const fieldConfigurations = [
    {
      col_size: 12,
      name: 'Stock',
      label: 'Stock',
      type: 'Stock',
      placeholder: 'Add Stock',
      data: [
        {
          stocks: '',
          type: '', // Dropdown for Type (buy, sell, hold)
          typeOptions: [ // Options for the select field
            { label: 'Buy', value: 'buy' },
            { label: 'Sell', value: 'sell' },
            { label: 'Hold', value: 'hold' },
          ],
          suggestedPrice: { min: '', max: '' }, // Two input fields for Suggested Price
          stockWeightage: '', // Input for Weightage
          quantity: '', // Input for Quantity
        },
      ],
    },
  ];


  const initialValues = {

    Stock:
      [
        { stocks: '', pricerange: '', stockweightage: '', entryprice: '', exitprice: '', exitdate: '', comment: '' }],
  };

  const validationSchema = Yup.object().shape({

    Stock: Yup.array().of(
      Yup.object().shape({
        stocks: Yup.string().required('Stocks are required'),
        pricerange: Yup.string().required('Price range is required'),
        stockweightage: Yup.string().required('Stock weightage is required'),
        entryprice: Yup.string().required('Entry price is required'),
        exitprice: Yup.string().required('Exit price is required'),
        exitdate: Yup.string().required('Exit date is required'),
        comment: Yup.string().required('Comment is required'),
      })
    ),
  });




  const navigate = useNavigate();
  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const onSubmit = async (values) => {

    const req = {

      Stock: values.Stock
    };



    try {
      const response = await Addstockbasketform(req, token);


      if (response.status) {
        Swal.fire({
          title: "Create Successful!",
          text: response.message,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/admin/basket");
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };


  return (
    <div >


      {/* Dropdown */}
      <Select
        options={serviceOptions}
        onChange={handleServiceChange}
        placeholder="Select a service"
        isClearable
      />

      {/* List of selected services */}
      <div style={{ marginTop: "20px" }}>
        {selectedServices.map((service, index) => (
          <div
            key={service.value}

          >
            <h4 className="d-flex justify-content-between">
              {service.label || "Unnamed Service"}
              {selectedServices.length > 1 &&
                <button
                  onClick={() => handleRemoveService(service.value)}
                  className="text-danger btn"
                >
                  <i class='bx bx-trash'></i>
                </button>
              }
            </h4>
            <form>
              <div className="row">
                <div className="col-md-3">
                  <label>Field 1 for {service.label}</label>
                  <input
                    type="text"
                    name="serviceField1"
                    value={formData[service.value]?.serviceField1 || ""}
                    onChange={(e) => handleInputChange(e, service.value)}
                    placeholder="Enter Field 1"
                    required
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  />
                </div>

                <div className="col-md-3">
                  <div style={{ marginBottom: "10px" }}>
                    <label>Field 2 for {service.label}</label>
                    <input
                      type="text"
                      name="serviceField2"
                      value={formData[service.value]?.serviceField2 || ""}
                      onChange={(e) => handleInputChange(e, service.value)}
                      placeholder="Enter Field 2"
                      required
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ marginBottom: "10px" }}>
                    <label>Additional Field</label>
                    <input
                      type="text"
                      name="additionalField"
                      value={formData[service.value]?.additionalField || ""}
                      onChange={(e) => handleInputChange(e, service.value)}
                      placeholder="Enter Additional Info"
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ marginBottom: "10px" }}>
                    <label>Additional Field</label>
                    <input
                      type="text"
                      name="additionalField"
                      value={formData[service.value]?.additionalField || ""}
                      onChange={(e) => handleInputChange(e, service.value)}
                      placeholder="Enter Additional Info"
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>
        ))}
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className="btn btn-primary"
      >
        Submit All
      </button>
    </div>
  );
};

export default SelectForm;
