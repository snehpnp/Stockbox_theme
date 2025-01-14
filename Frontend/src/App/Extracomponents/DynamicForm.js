import React from 'react';
import { Field, ErrorMessage, FieldArray } from 'formik';
import { Link } from 'react-router-dom';

// FormField component for standard input fields
const FormField = ({ name, label, type, placeholder, col_size, label_size, disable }) => (
  <div className={`form-group col-md-${col_size} mb-3`}>
    <label htmlFor={name} className={`col-md-${label_size} col-form-label`}>
      {label}
    </label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className="form-control"
      disabled={disable}
    />
    <ErrorMessage name={name} component="div" className="text-danger" />
  </div>
);


const BasketField = ({ push, remove, Stock, showRemoveButtons, disable, fieldTypes }) => (
  <div className="content container-fluid" data-aos="fade-left">

    {/* <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fa-regular fa-circle-user pe-2"></i> 
          <input type="search" className="form-control" placeholder="Search Stock" />
        </h5>
      </div> */}
    <div className="card-body">
      {Stock.length > 0 ? (
        Stock.map((BasketData, index) => (
          <div className=" Stock-group mb-3" key={index}>
            <div className="card-header d-flex align-items-center ">
              {/* <h6 className="mb-0">Stock {index + 1}</h6> */}
              <h6 className="mb-0">Search Stock :</h6> <input type="search" className="ms-3 form-control w-50" placeholder="Search Stock" />
            </div>
            <div className="card-body">
              <div className="row">
                {fieldTypes.map((field) => (
                  field.type === 'select' ?
                    <div className="col-lg-4 form-group mb-2" key={field.name}>
                      <label htmlFor={`Stock.${index}.${field.name}`}>{field.label}</label>
                      <select
                        name={`Stock.${index}.${field.name}`}
                        className="form-select mb-2"
                        disabled={disable}>
                        <option value="">Select Type</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>


                      <ErrorMessage name={`Stock.${index}.${field.name}`} component="div" className="text-danger" />
                    </div>
                    : (
                      <div className="col-lg-4 form-group mb-2" key={field.name}>
                        <label htmlFor={`Stock.${index}.${field.name}`}>{field.label}</label>
                        <Field
                          name={`Stock.${index}.${field.name}`}
                          placeholder={`Enter ${field.label}`}
                          className="form-control mb-2"
                          type={field.type}
                          disabled={disable}
                        />
                        <ErrorMessage name={`Stock.${index}.${field.name}`} component="div" className="text-danger" />
                      </div>
                    )
                ))}
              </div>
              {showRemoveButtons && Stock.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(index)}
                >
                  Remove Stock
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No Stock added yet.</p>
      )}
      {showRemoveButtons && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => push({})} // Adjust initial state as needed
        >
          Add Stock
        </button>
      )}
    </div>
  </div>

);

// DynamicForm component for the main form structure
const DynamicForm = ({ fields, page_title, btn_name1, btn_name1_route, formik, sumit_btn, btn_name, btn_name2, submitFunction, showAddRemoveButtons, disable }) => {
  const { values } = formik;


  const stockFieldTypes = [
    { name: 'stocks', label: 'Stocks', type: 'text' },
    { name: 'pricerange', label: 'Price Range', type: 'number' },
    { name: 'stockweightage', label: 'Weightage', type: 'number' },
    { name: 'entryprice', label: 'Entry Price', type: 'number' },
    { name: 'exitprice', label: 'Exit Price', type: 'number' },
    { name: 'exitdate', label: 'Exit Date', type: 'date' },
    { name: 'comment', label: 'Comment', type: 'text' },
  ];

  return (
    <div className="content container-fluid" data-aos="fade-left">
      <div className="card mb-0">
        {page_title && (
          <div className="card-header">
            <h5 className="card-title mt-2 mb-2 w-auto">
              <i className="fa-regular fa-circle-user pe-2"></i>
              {page_title}
            </h5>
          </div>
        )}
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="card-body">
            <div className="row">
              {fields.map((field, index) => {
                const { name, label, type, placeholder, col_size, label_size, disable: fieldDisable } = field;

                if (type === "Stock") {
                  return (
                    <FieldArray name="Stock" key={index}>
                      {({ push, remove }) => (
                        <BasketField
                          Stock={values.Stock}
                          push={push}
                          remove={remove}
                          showRemoveButtons={showAddRemoveButtons}
                          disable={disable || fieldDisable}
                          fieldTypes={stockFieldTypes} // Pass field types here
                        />
                      )}
                    </FieldArray>
                  );
                } else {
                  return (
                    <FormField
                      key={name}
                      name={name}
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      col_size={col_size}
                      label_size={label_size}
                      disable={disable || fieldDisable}
                    />
                  );
                }
              })}
            </div>
            <div className="add-customer-btns text-end mt-3">
              {btn_name1 && (
                <Link to={btn_name1_route} className="btn customer-btn-cancel btn btn-secondary">
                  {btn_name1}
                </Link>
              )}
              {sumit_btn && (
                <button
                  type="submit"
                  className="btn customer-btn-save btn btn-primary m-2"
                  onClick={submitFunction}
                >
                  {btn_name}
                </button>
              )}
              {btn_name2 && (
                <button
                  type="button"
                  className="btn customer-btn-save btn btn-primary"
                  onClick={submitFunction}
                >
                  {btn_name2}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
