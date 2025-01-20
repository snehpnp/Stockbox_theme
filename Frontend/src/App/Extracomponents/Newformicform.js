import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";



const FormicForm = ({ fieldtype, formik, Heading,ButtonName,BtnStatus
}) => {


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <h1>{Heading}</h1>

                </div>
                <div className="row">
                    {fieldtype.map((field, index) => {

                      return (
                        field.type === "select" ? <div className={`col-md-${field.col_size}`}>
                        <div className="mb-3">
                            <div className="form-group">

                                <label className="form-label">{field.label}</label>
                                <select
                                    className="form-control"
                                    name={field.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[field.name]}
                                >
                                    <option value="">Select</option>
                                    {field.option.map((option) => (
                                        <option value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div> :
                        field.type === "checkbox" ? <div className={`col-md-${field.col_size}`}>
                            <div className="mb-3">

                                <label className="form-label">{field.label}</label>
                                {field.option.map((option) => (
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={field.name}
                                            value={option.value}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <label className="form-check-label">{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div> :
                            <div className={`col-md-${field.col_size}`}>
                                <div className="mb-3">
                                    <label   className={`col-lg-${field.label_size}`} >{field.label}</label>
                                    <input
                                        type={field.type}
                                        className="form-control"
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values[field.name]}
                                    />
                                    {formik.touched[field.name] && formik.errors[field.name] ? (
                                        <div className="text-danger">{formik.errors[field.name]}</div>
                                    ) : null}
                                </div>
                            </div>
                      )

                    })}
                </div>
                {BtnStatus && <div className="row">
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary">{ButtonName}</button>
                    </div>
                </div>}



            </form>
        </>
    )


}
export default FormicForm;
