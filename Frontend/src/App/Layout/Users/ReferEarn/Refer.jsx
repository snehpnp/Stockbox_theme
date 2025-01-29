import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";
import Content from "../../../components/Contents/Content";
import { basicsettinglist } from "../../../Services/Admin/Admin";
import { GetUserData, ReferAndEarnData } from "../../../Services/UserService/User";
import { base_url, image_baseurl } from "../../../../Utils/config";
import { fDate } from "../../../../Utils/Date_formate";
import Loader from "../../../../Utils/Loader";

const Refer = () => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const [data, setData] = useState([]);
  const [refertoken, setRefertoken] = useState({});
  const [isLoading, setIsLoading] = useState(true)

  const [referdata, setReferData] = useState([])

  useEffect(() => {
    FetchMessage();
    FetchUserdata();
    FetchReferandearn();
  }, []);



  const FetchMessage = async () => {
    try {
      const response = await basicsettinglist(userid, token);
      if (response.status) {
        setData(response?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false)
  };


  const FetchReferandearn = async () => {
    try {
      const data = { id: userid }
      const response = await ReferAndEarnData(data, token);
      if (response.status) {
        setReferData(response.data)
        console.log("response", response.data)
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false)
  };




  const FetchUserdata = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setRefertoken(response?.data);
      }
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
    setIsLoading(false)
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(refertoken?.refer_token);
    Swal.fire({
      icon: "success",
      title: "Referral Code copied to clipboard!",
      showConfirmButton: false,
      timer: 1500,
    });
  };


  const handleShare = () => {
    const referralLink = `${base_url}api/refer?ref=${refertoken?.refer_token}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Referral Code",
          text: `Use my link ${referralLink} to Earn rewards!`,
        })
        .catch((error) =>
          Swal.fire("Error sharing referral code", error.message, "error")
        );
    } else {
      Swal.fire("Sharing not supported on this browser.", "", "warning");
    }
  };




  return (
    <div>
      {isLoading ? <Loader /> : <Content Page_title="Referral & Rewards" button_status={false}>
        <div className="page-content">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div>
                <h3 style={{ color: "#0092E4" }}>{data?.refer_title}</h3>
                <p>{data?.refer_description}</p>
              </div>
              <hr />
              <div>
                <ul className="nav nav-pills border-bottom mb-3" role="tablist">
                  <li className="nav-item mt-2 ms-2" role="presentation">
                    <a
                      className="nav-link active  border-bottom"
                      data-bs-toggle="pill"
                      href="#primary-pills-home"
                      role="tab"
                      aria-selected="false"
                      tabIndex={-1}
                    >
                      <div className="d-flex align-items-center">
                        <div className="tab-title" >Share Your Referral Link</div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item mt-2" role="presentation">
                    <a
                      className="nav-link border-bottom "
                      data-bs-toggle="pill"
                      href="#primary-pills-profile"
                      role="tab"
                      aria-selected="true"
                    >
                      <div className="d-flex align-items-center">
                        <div className="tab-title">Rewards</div>
                      </div>
                    </a>
                  </li>
                </ul>
                <div className="card">
                  <div className="card-body">
                    <div className="tab-content" id="pills-tabContent">
                      <div
                        className="tab-pane fade active show"
                        id="primary-pills-home"
                        role="tabpanel"
                      >
                        {/* <p>
                          Refer code to your friend and earn up to 5% on their
                          first installation. They also receive 9%.
                        </p> */}
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control w-50"
                            value={refertoken?.refer_token}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary ms-2"
                            onClick={handleCopy}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-copy"
                            >
                              <rect
                                x={9}
                                y={9}
                                width={13}
                                height={13}
                                rx={2}
                                ry={2}
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-outline-secondary ms-2"
                            onClick={handleShare}
                          >
                            <i className="bx bx-share-alt"></i>
                          </button>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade "
                        id="primary-pills-profile"
                        role="tabpanel"
                      >

                        <div className="table-responsive">
                          <table className="table mb-0">
                            <thead className="table-primary">
                              <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Earning Amt.</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {referdata?.map((item) => (
                                <tr key={item?.id}>
                                  <th scope="row">{item?.clientName}</th>
                                  <td>{item?.amountType?.amount}</td>
                                  <td>{item?.status === 1 ? "Completed" : "Pending"}</td>
                                  <td>{fDate(item?.created_at)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-center align-items-center mt-md-0 mt-3">
              <div className="card">
                <img src={`${image_baseurl}uploads/basicsetting/${data?.refer_image}`} alt="" />
              </div>
            </div>

          </div>
        </div>
      </Content>}
    </div>
  );
};

export default Refer;
