import React, { useState } from "react";
import Content from "../../../components/Contents/Content";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignalStrategy = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementValue = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementValue = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };



  const validationSchema = Yup.object({
    segment: Yup.string().required("Segment is required"),
    stock: Yup.string().required("Stock selection is required"),
    expiry: Yup.string().required("Expiry date is required"),
    calltype: Yup.string().required("Call type is required"),
    price: Yup.number().required("Entry price is required"),
    plan: Yup.number().required("Plan is required"),
    callduration: Yup.string().required("Trade duration is required"),
    entrytype: Yup.string().required("Entry type is required"),
    stoploss: Yup.number().required("Stop loss is required"),
    profit: Yup.number().required("Maximum profit is required"),
    target: Yup.number().required("Fix target is required"),
  });




  return (
    <Content
      Page_title="Signal Strategy"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >
      <div className="card mb-0">
        <Formik
          initialValues={{
            segment: "",
            stock: "",
            expiry: "",
            calltype: "",
            price: "",
            plan: "",
            callduration: "",
            entrytype: "",
            stoploss: "",
            profit: "",
            target: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form Values:", values);
          }}
        >
          {({ handleSubmit }) => (
            <form autoComplete="off">
              <div className="card-body ">
                <form autoComplete="off">
                  <div className="card-body ">
                    <div>
                      <div className="row d-flex ">
                        <div className="col-lg-6">
                          <div className="input-block row mb-3">
                            <label
                              className="col-lg-7  col-form-label p-0 mx-3 "
                              htmlFor="segment"
                            >
                              Segment<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <select
                                className="default-select wide form-control"
                                aria-describedby="basic-addon1"
                                id="segment"
                                name="segment"
                              >
                                <option value="">Select Segment</option>
                                <option value="C">Cash</option>
                                <option value="F">Future</option>
                                <option value="O">Option</option>
                                <option value="O">Option Strategy</option>
                                <option value="O">Future Strategy</option>
                              </select>
                              <ErrorMessage name="segment" component="div" className="text-danger" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <div className="position-relative">
                              <label className="form-label">Select Stock</label>
                              <span className="text-danger">*</span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search stock"
                                name="stock"
                                defaultValue=""
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block row mb-3">
                            <label
                              className="col-lg-7  col-form-label p-0 mx-3 "
                              htmlFor="expiry"
                            >
                              Expiry Date<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <select
                                className="default-select wide form-control"
                                aria-describedby="basic-addon1"
                                id="expiry"
                                name="expiry"
                              >
                                <option value="">Expiry Date</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block row mb-3">
                            <label
                              className="col-lg-7  col-form-label p-0 mx-3 "
                              htmlFor="calltype"
                            >
                              Call Type<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <select
                                className="default-select wide form-control"
                                aria-describedby="basic-addon1"
                                id="calltype"
                                name="calltype"
                              >
                                <option value="">Call Type</option>
                                <option value="BUY">Buy</option>
                                <option value="SELL">Sell</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div className="form-group input-block mb-3">
                                <label htmlFor="price">
                                  Entry Price<span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="price"
                                  aria-describedby="basic-addon1"
                                  className="form-control"
                                  id="price"
                                  placeholder="Enter Entry Price"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div className="form-group input-block mb-3">
                                <label htmlFor="price">
                                  Plan<span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="price"
                                  aria-describedby="basic-addon1"
                                  className="form-control"
                                  id="price"
                                  placeholder="Enter Entry Price"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block row mb-3">
                            <label
                              className="col-lg-7  col-form-label p-0 mx-3 "
                              htmlFor="callduration"
                            >
                              Trade Duration<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <select
                                className="default-select wide form-control"
                                aria-describedby="basic-addon1"
                                id="callduration"
                                name="callduration"
                              >
                                <option value="">Trade Duration</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block row mb-3">
                            <label
                              className="col-lg-7  col-form-label p-0 mx-3 "
                              htmlFor="entrytype"
                            >
                              Entry Type<span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <select
                                className="default-select wide form-control"
                                aria-describedby="basic-addon1"
                                id="entrytype"
                                name="entrytype"
                              >
                                <option value="">Entry Type</option>
                                <option value="At">At</option>
                                <option value="Above">Above</option>
                                <option value="Below">Below</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="col-lg-12">
                              <table className="table border-0 border-light signalstrategy-table">
                                <thead>
                                  <tr>
                                    <td></td>
                                    <td>B/S</td>
                                    <td>Expiry</td>
                                    <td>Strike</td>
                                    <td>Type</td>
                                    <td>Lots</td>
                                    <td width={80}>Price</td>
                                    <td width={80}></td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {" "}
                                      <select className="form-select">
                                        <option value="1">Cash</option>
                                        <option value="2">Future</option>
                                        <option value="3">Option</option>
                                      </select>
                                    </td>
                                    <td>
                                      <select className="form-select">
                                        <option value="1">Buy</option>
                                        <option value="2">Sell</option>
                                      </select>
                                    </td>
                                    <td>
                                      <select className="form-select">
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                      </select>
                                    </td>
                                    <td>
                                      {" "}
                                      <div className="input-group d-flex">
                                        <button
                                          type="button"
                                          className="button-minus btn"
                                          onClick={decrementValue}
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          step="1"
                                          value={quantity}
                                          name="quantity"
                                          className="quantity-field"
                                          readOnly
                                        />
                                        <button
                                          type="button"
                                          className="button-plus btn"
                                          onClick={incrementValue}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>
                                    <td>
                                      <select className="form-select">
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                      </select>
                                    </td>
                                    <td>
                                      <select className="form-select">
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                      </select>
                                    </td>
                                    <td>
                                      <input className="form-control" type="number" />
                                    </td>
                                    <td>
                                      {" "}
                                      <i class="bx bx-trash"></i>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div>
                                <button className="btn btn-sm btn-secondary">Add More</button>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="col-lg-4">
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div className="form-group input-block mb-3">
                                <label htmlFor="stoploss">
                                  Maximum Loss<span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="stoploss"
                                  aria-describedby="basic-addon1"
                                  className="form-control"
                                  id="stoploss"
                                  placeholder="Maximum Loss"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div className="form-group input-block mb-3">
                                <label htmlFor="stoploss">
                                  Maximum Profit<span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="stoploss"
                                  aria-describedby="basic-addon1"
                                  className="form-control"
                                  id="stoploss"
                                  placeholder=" Maximum Profit"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div className="form-group input-block mb-3">
                                <label htmlFor="stoploss">
                                  Fix Target<span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="stoploss"
                                  aria-describedby="basic-addon1"
                                  className="form-control"
                                  id="stoploss"
                                  placeholder="Fix Target"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="add-customer-btns text-end mt-3 ">
                          <a
                            className="btn customer-btn-cancel btn btn-primary"
                            href="#/admin/signal"
                            data-discover="true"
                          >
                            Cancel
                          </a>
                          <button
                            type="submit"
                            className="btn customer-btn-save btn btn-primary m-2"
                          >
                            Add Signal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Content>
  );
};

export default SignalStrategy;

