import React, { useEffect } from 'react'
import Content from "../../../components/Contents/Content";
import { Rebalancehistory, getversionhistory } from '../../../Services/UserService/User';
import { useLocation, useParams } from 'react-router-dom';


const RebalanceHistory = () => {

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const { id } = useParams()


  useEffect(() => {
    gethistory()
    // geVersion()
  }, [])

  const gethistory = async () => {
    try {
      const data = { id: id, clientid: userid };
      const response = await Rebalancehistory(data, token);
      if (response.status) {
        console.log("resp11", response.data)
      }
    } catch (error) {
      console.log("error", error);
    }

  };



  // const geVersion = async () => {
  //   try {
  //     const data = { id: id, clientid: userid, version: 4 };
  //     const response = await getversionhistory(data, token);
  //     if (response.status) {
  //       console.log("verson", response.data)
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }

  // };




  return (
    <Content
      Page_title="Rebalance History"
      button_status={false}
      backbutton_status={false}
      backbutton_title="Back"
      backForword={true}
    >
      <div className="row">
        <div className="col-md-12">
          <div className='card mb-3'>
            <div className='card-body'>
              <div className=''>
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div className="accordion-item rounded-3 border-0 shadow mb-2">
                    <h2 className="accordion-header">
                      <div
                        className="accordion-button border-bottom collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <h6 className="m-0 fw-bold"> Investment Amount: ₹ 35,000</h6>
                          <p className="m-0 pe-2 fs-14"> 28Apr2025</p>
                        </div>
                      </div>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <div className="row  align-items-center">
                          <div className="col-md-12">
                            <div className='table-responsive'>
                              <table className="table table-bordered">
                                <thead className='table-primary'>
                                  <tr>
                                    <td> <p className="mb-1"> Name</p></td>
                                    <td><p className="mb-1">Price</p></td>
                                    <td><p className="mb-1">Weightage</p></td>
                                    <td><p className="mb-1">Quantity</p></td>
                                  </tr>

                                </thead>
                                <tbody>
                                  <tr className=""> <td><b>6 Months</b></td>
                                    <td>  <b>28 oct 2024</b></td>
                                    <td>  <b>51999</b></td>
                                    <td>  <b>28 apr 2025</b></td>
                                  </tr>

                                </tbody>

                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item rounded-3 border-0 shadow mb-2">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button border-bottom collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <h6 className="m-0 fw-bold"> Investment Amount: ₹ 35,000</h6>
                          <p className="m-0 pe-2 fs-14"> 28Apr2025</p>
                        </div>
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <div className="row  align-items-center">
                          <div className="col-md-12">
                            <div className='table-responsive'>
                              <table className="table table-bordered">
                                <thead className='table-primary'>
                                  <tr>
                                    <td> <p className="mb-1"> Name</p></td>
                                    <td><p className="mb-1">Price</p></td>
                                    <td><p className="mb-1">Weightage</p></td>
                                    <td><p className="mb-1">Quantity</p></td>
                                  </tr>

                                </thead>
                                <tbody>
                                  <tr className=""> <td><b>6 Months</b></td>
                                    <td>  <b>28 oct 2024</b></td>
                                    <td>  <b>51999</b></td>
                                    <td>  <b>28 apr 2025</b></td>
                                  </tr>

                                </tbody>

                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item rounded-3 border-0 mb-2 shadow">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button border-bottom collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <h6 className="m-0 fw-bold"> Investment Amount: ₹ 35,000</h6>
                          <p className="m-0 pe-2 fs-14"> 28Apr2025</p>
                        </div>
                      </button>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <div className="row  align-items-center">
                          <div className="col-md-12">
                            <div className='table-responsive'>
                              <table className="table table-bordered">
                                <thead className='table-primary'>
                                  <tr>
                                    <td> <p className="mb-1"> Name</p></td>
                                    <td><p className="mb-1">Price</p></td>
                                    <td><p className="mb-1">Weightage</p></td>
                                    <td><p className="mb-1">Quantity</p></td>
                                  </tr>

                                </thead>
                                <tbody>
                                  <tr className=""> <td><b>6 Months</b></td>
                                    <td>  <b>28 oct 2024</b></td>
                                    <td>  <b>51999</b></td>
                                    <td>  <b>28 apr 2025</b></td>
                                  </tr>

                                </tbody>

                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default RebalanceHistory