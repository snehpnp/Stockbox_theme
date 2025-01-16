import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import { GetCategorylist, GETPlanList } from "../../../Services/UserService/User";
import { IndianRupee } from 'lucide-react';

function Service() {


  const token = localStorage.getItem('Token');
  const userid = localStorage.getItem('Id');

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [category, setCategory] = useState([])
  const [plan, setPlan] = useState([])


  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };


  const getCategory = async () => {
    try {
      const response = await GetCategorylist()
      if (response.status) {
        setCategory(response?.data)
      }
    } catch (error) {

    }
  }


  const getplan = async () => {
    try {
      const response = await GETPlanList(userid, token)
      if (response.status) {
        setPlan(response.data)
      }
    } catch (error) {

    }
  }




  useEffect(() => {
    getCategory()
    getplan()
  }, [])


  const getFilteredPlans = () => {
    if (selectedPlan === "all") {
      return plan;
    }
    return plan.filter((item) => item?.planDetails?.category
      === selectedPlan);
  };


  const stripHtmlTags = (input) => {
    if (!input) return '';
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  }



  return (
    <Content
      Page_title="Service"
      button_title="Back"
      button_status={false}

    >
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
                {category && category?.map((item) => {
                  return (
                    <>
                      <option value={item?._id} key={item._id}  >
                        <span className="price-span">{item?.title}</span>
                      </option>
                    </>
                  )
                })}

              </select>
            </div>
          </div>
          <div className="pricing-container price1 row mt-4 ">
            <>
              <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-3 ">

                {getFilteredPlans().map((item) => (
                  <>
                    <div className="col ">
                      <div className="card card1 mb-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="text-left">
                              <span className="price-original">
                                {Array.isArray(item?.serviceNames)
                                  ? item.serviceNames
                                    .map((service) =>
                                      typeof service === "string"
                                        ? service.split(/(?=[A-Z])/).join(" + ")
                                        : service
                                    )
                                    .join(" + ")
                                  : "N/A"}
                              </span>

                              <h5 className="mb-0 ">{item?.categoryDetails?.title}</h5>
                            </div>
                            <div className="ms-auto">
                              <div className="price">
                                <p>
                                  <del>
                                    {item?.discount > 0 && (
                                      <>
                                        <IndianRupee />
                                        {item?.discount}
                                      </>
                                    )}
                                  </del>
                                </p>
                                <span className="price-current"> <IndianRupee />{item?.plan_price}</span>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <ul className="features ">
                            <li>
                              <b>Validity</b>: {item?.planDetails?.validity}{" "}
                            </li>
                            <li><b className='mb-1'>Description</b>:<textarea className='form-control' value={stripHtmlTags(item?.planDetails?.description || '')} >{item?.planDetails?.description}</textarea></li>
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

                  </>
                ))}
              </div>
            </>

          </div>
        </div>
      </div>

    </Content>
  );
}

export default Service;
