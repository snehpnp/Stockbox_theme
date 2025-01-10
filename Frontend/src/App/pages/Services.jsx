import React, { useState } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [selectedPlan, setSelectedPlan] = useState("all");

  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  return (
    <div className="page-content">
      <nav className="breadcrumb">
        <ul className="breadcrumb-links">
          <li>
            <a href="#" className="breadcrumb-box">
              <svg
                className="breadcrumb-icon-home"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
          <li>
            <div className="breadcrumb-box">
              <svg
                className="breadcrumb-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              <a href="#" className="breadcrumb-text">
                Services
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <div className="card">
        <div className="card-body">
          <div>
            <label htmlFor="planSelect" className="mb-1">
              Plans For You
            </label>
            <div className="col-lg-4 d-flex">
              <select
                id="planSelect"
                className="form-select"
                onChange={handleSelectChange}
                value={selectedPlan}
              >
                <option value="" disabled>
                  Select Plans
                </option>
                <option value="all">All</option>
                <option value="intraday">
                  Intraday <span className="price-span">(Cash + Option)</span>
                </option>
                <option value="short-term">
                  Short Term <span className="price-span">(Cash + Option)</span>
                </option>
                <option value="long-term">
                  Long Term <span className="price-span">(Cash + Option)</span>
                </option>
              </select>
            </div>
          </div>
          <div className="pricing-container price1 row mt-4">
            {/* Conditionally render cards based on the selected plan */}
            {selectedPlan === "all" && (
              <>
                <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            <h5 className="mb-0 ">Intraday</h5>
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedPlan === "intraday" && (
              <>
                <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedPlan === "short-term" && (
              <>
                <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button className="btn btn-outline-primary rounded-1">
                            {" "}
                            Know More{" "}
                          </button>
                          <button className="btn btn-primary rounded-1">
                            {" "}
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedPlan === "long-term" && (
              <>
                <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3">
                  <div className="col">
                    <div className="card card1 mb-4">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="text-left">
                            <span className="price-original">
                              Cash + Option
                            </span>
                            {/* <h5 className="mb-0 ">Intraday</h5> */}
                          </div>
                          <div className="ms-auto">
                            <div className="price">
                              <p>
                                <del>₹15999</del>
                              </p>
                              <span className="price-current">₹11999</span>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <ul className="features">
                          <li>
                            <b>Validity</b>: 1 Month{" "}
                          </li>
                          <li>Enjoy an ad-free experience on</li>
                          <li>Enjoy an ad-free experience on the platform</li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between mt-4">
                          <button
                            className="btn btn-outline-primary rounded-1"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal1"
                          >
                            {" "}
                            Know More{" "}
                          </button>
                          <Link to="/client/subscribeservice">
                            <button className="btn btn-primary rounded-1">
                              {" "}
                              Subscribe Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div
              class="modal fade"
              id="exampleModal1"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content rounded-1">
                  <div class="modal-header rounded-1">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Discription
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nulla minus nemo aut reiciendis mollitia recusandae
                    dignissimos quaerat incidunt est, sunt suscipit accusamus!
                    Quod repudiandae cumque soluta. Illum nihil soluta ipsum
                    deleniti, harum a laudantium deserunt quis quidem labore
                    dignissimos voluptatibus.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
