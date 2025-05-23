import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import { House, Tally1 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { CircleUserRound, ShoppingCart, History, Shield, CreditCard, Puzzle } from 'lucide-react'
import { getpastperformaceCashdata, getpastperformaceFuturedata, getpastperformaceOptiondata, GetUserData } from "../../../Services/UserService/User";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { clientKycAndAgreement } from "../../../Services/UserService/User"
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Loader from "../../../../Utils/Loader";
import ReusableModal from '../../../components/Models/ReusableModal';
import {
  getbannerlist,
} from "../../../Services/Admin/Admin";
import { getblogslist } from "../../../Services/Admin/Admin";
import { GetNewsData } from "../../../Services/UserService/User";
import { image_baseurl } from "../../../../Utils/config";
import { Getdashboardata } from "../../../Services/UserService/User";
import Kyc from "../Profile/Kyc";



const Dashboard = () => {


  const [cashpastdata, setCashPastdata] = useState([]);
  const [futurepastdata, setFuturePastdata] = useState([]);
  const [optionpastdata, setOptionPastdata] = useState([]);
  const [cashAvgProfit, setCashAvgProfit] = useState(0);
  const [futureAvgProfit, setFutureAvgProfit] = useState(0);
  const [optionAvgProfit, setOptionAvgProfit] = useState(0);
  const [months, setMonths] = useState([]);
  const [bannerimg, setBannerimg] = useState([]);
  const [blogslist, setBlogslist] = useState([]);
  const [newslist, setNewslist] = useState([]);
  const [model, setModel] = useState(false);
  const [viewmodel2, setViewModel2] = useState(false);



  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    getCashpastdata();
    getFuturepastdata();
    getOptionpastdata();
    getBannerList();
    getNewslist();
    getBloglist();
    getuserdetail();
    getdashboardata();
  }, []);


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhar: "",
    panno: "PAN",
  });




  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    aadhar: false,
    panno: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhar: "",
    panno: "",
  });

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 3) {
          errorMessage = "Name must be at least 3 characters";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Name should contain only letters and spaces";
        }
        break;

      case "email":
        if (!value) {
          errorMessage = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value) {
          errorMessage = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          errorMessage = "Please enter a valid 10-digit Indian mobile number";
        }
        break;

      case "aadhar":
        if (!value) {
          errorMessage = "Aadhar number is required";
        } else if (!/^\d{12}$/.test(value)) {
          errorMessage = "Aadhar number must be 12 digits";
        }
        break;

      case "panno":
        if (!value) {
          errorMessage = "PAN number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          errorMessage = "PAN must be in valid format (e.g., ABCDE1234F)";
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {};


    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const errorMessage = validateField(key, formData[key]);
      newErrors[key] = errorMessage;
      if (errorMessage) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();


    if (!validateForm()) {
      showCustomAlert("error", "Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('email', formData.email);
    data.append('name', formData.fullName);
    data.append('phone', formData.phone);
    data.append('panno', formData.panno);
    data.append('aadhaarno', formData.aadhar);
    data.append('id', userid);

    try {
      const token = localStorage.getItem('token');
      const result = await clientKycAndAgreement(data, token);
      showCustomAlert("success", "KYC form submitted successfully!")
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        aadhar: "",
        panno: "",
      });
      setTouched({
        fullName: false,
        email: false,
        phone: false,
        aadhar: false,
        panno: false,
      });
    } catch (err) {
      showCustomAlert("error", "KYC submission failed. Please try again.");
    }
    setLoading(false);
  };


  const getBannerList = async () => {
    try {
      const response = await getbannerlist(token);
      setBannerimg(response.data);
    } catch (error) {
      console.error("Error fetching banner list:", error);
    }
  };



  const getNewslist = async () => {
    try {
      const response = await GetNewsData(token);
      setNewslist(response.data);
    }
    catch (error) {
      console.error("Error fetching blog list:", error);
    }

  };


  const getBloglist = async () => {
    try {
      const response = await getblogslist(token);
      setBlogslist(response.data);

    }
    catch (error) {
      console.error("Error fetching blog list:", error);
    }
  };

  const getdashboardata = async () => {
    try {
      const response = await Getdashboardata(token);

      if (response) {
        setDashboard(response);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };



  const formatMonth = (key) => {
    const [year, month] = key.split("-");
    return new Date(year, month - 1).toLocaleString("en-US", { month: "long" });
  };

  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);

      if (response.status) {
        setUserDetail(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };




  const getCashpastdata = async () => {
    try {
      const response = await getpastperformaceCashdata({ id: "66d2c3bebf7e6dc53ed07626" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setMonths(Object.keys(months).map(formatMonth));
        setCashPastdata(Object.values(months).map(m => m.netProfit));
        setCashAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Cash data:", error);
    }
  };





  const getFuturepastdata = async () => {
    try {
      const response = await getpastperformaceFuturedata({ id: "66dfede64a88602fbbca9b72" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setFuturePastdata(Object.values(months).map(m => m.netProfit));
        setFutureAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Future data:", error);
    }
  };




  const getOptionpastdata = async () => {
    try {
      const response = await getpastperformaceOptiondata({ id: "66dfeef84a88602fbbca9b79" }, token);
      if (response?.status) {
        const { months, avgMonthlyProfit } = response.data["6_months"];
        setOptionPastdata(Object.values(months).map(m => m.netProfit));
        setOptionAvgProfit(avgMonthlyProfit);
      }
    } catch (error) {
      console.error("Error fetching Option data:", error);
    }
  };




  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Cash",
        data: cashpastdata,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Future",
        data: futurepastdata,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Option",
        data: optionpastdata,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };



  // Other chart progress configurations follow similarly

  return (

    <div className="">
      <div className="page-titles">
        <nav className="breadcrumb">
          <div className="col-lg-6 col-sm-6 col-12">
            <ul className="breadcrumb-links">
              <li>
                <House ></House>

                <a href="/" className="breadcrumb-box" />
              </li>
              <li style={{ width: "3px" }}>
                <Tally1 />
              </li>
              <li>
                <div className="breadcrumb-box">
                  <h6 className="heading-color mb-0 breadcrumb-text">
                    Dashboard
                  </h6>
                </div>
              </li>
            </ul>
          </div>

        </nav>
      </div>

      <div class="row g-3 mt-4" >
        <div className="col-lg-4 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="btn-primary p-3 rounded-circle " style={{ marginTop: '-50px', width: '100px', height: '100px' }}>
                  <CircleUserRound className="w-100 h-100 m-0" />
                </div>
                <div className="mt-3">
                  <h4>Hello,{userDetail?.FullName}</h4>
                  <hr />
                  <h3 class="h6 fw-semibold">Wallet Balance</h3>
                  <p class="h3 font-weight-bold">₹<span id="totalBalance">{userDetail?.wamount}</span></p>


                </div>
              </div>
              <hr className="my-3" />

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <Link to="/user/subscription" className="text-dark">
                    <CreditCard className="me-2" /> My Subscription
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link onClick={() => setViewModel2(true)} className="text-dark">
                    <Shield className="me-2" /> KYC Pending
                  </Link>
                </li>
                <li className="list-group-item" >
                  <Link to="/user/subscription" className="text-dark">
                    <History className="me-2" /> Payment History
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/user/basket"
                    state={{ activeTab: 'basket' }}
                    className="text-dark">
                    <ShoppingCart className="me-2" /> My Basket Subscription
                  </Link>

                </li>
                <li className="list-group-item">
                  <Link to="/user/refer-earn" className="text-dark">
                    <Puzzle className="me-2" /> Refer & Earn
                  </Link>

                </li>
                {/* <li className="list-group-item">
                  <button className="btn btn-primary mt-3 w-100">View Proflie</button>
                </li> */}
              </ul>

            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-8">
          <div className="card h-100 user-card">
            <div className="card-body">
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                <div className="col">
                  <div className="card radius-10 bg-gradient-deepblue">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">{dashboard?.open}</h5>
                        <div className="ms-auto">
                          <i className="bx bx-cart fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0 text-white">Live Trade</p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card radius-10 bg-gradient-ohhappiness">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">{dashboard?.closed}</h5>
                        <div className="ms-auto">
                          <i className="bx bx-dollar fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0  text-white">Close Trade</p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card radius-10 bg-gradient-ibiza">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 text-white">{dashboard?.openstrategy}</h5>
                        <div className="ms-auto">
                          <i className="bx bx-group fs-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="progress my-2 bg-opacity-25 bg-white"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-white"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <div className="d-flex align-items-center text-white">
                        <p className="mb-0  text-white">Strategy Trade</p>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="row mt-3">


                <Swiper
                  spaceBetween={50}
                  slidesPerView={1}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  navigation
                  pagination={{ clickable: true }}
                  modules={[Autoplay, Navigation, Pagination]}

                >
                  {bannerimg?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={`${image_baseurl}uploads/banner/${item.image}`}
                          style={{ height: '300px', width: '100%' }}
                          alt={`banner-${index}`}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

              </div>
            </div>
          </div>

        </div>

      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>
                <Link to="/user/past-performance/cash" className="text-decoration-none text-dark">
                  Cash
                </Link>
              </h5>
              <Bar data={{ labels: months, datasets: [chartData?.datasets[0]] }} />
              <hr />
              <div className="row">
                <div className="col-md-2 pe-0 border-right">
                  <h6>
                    <i className="bx bx-rupee fs-1 text-success"></i>
                  </h6>
                </div>
                <div className="col-md-6">
                  <h6>Average Profit</h6>
                  <h4>{cashAvgProfit.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>
                <Link to="/user/past-performance/future" className="text-decoration-none text-dark">
                  Future
                </Link>
              </h5>
              <Bar data={{ labels: months, datasets: [chartData.datasets[1]] }} />
              <hr />
              <div className="row">
                <div className="col-md-2 pe-0 border-right">
                  <h6>
                    <i className="bx bx-rupee fs-1 text-success"></i>
                  </h6>
                </div>
                <div className="col-md-6">
                  <h6>Average Profit</h6>
                  <h4>{futureAvgProfit.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>
                <Link to="/user/past-performance/option" className="text-decoration-none text-dark">
                  Option
                </Link>
              </h5>
              <Bar data={{ labels: months, datasets: [chartData.datasets[2]] }} />
              <hr />
              <div className="row">
                <div className="col-md-2 pe-0 border-right">
                  <h6>
                    <i className="bx bx-rupee fs-1 text-success"></i>
                  </h6>
                </div>
                <div className="col-md-6">
                  <h6>Average Profit</h6>
                  <h4>{optionAvgProfit.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card radius-10 w-100">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-1">News</h5>
                </div>

              </div>
            </div>
            <div className="product-list p-3 mb-3 ps ps--active-y">
              <div className="d-flex flex-column gap-3">
                {newslist?.slice(0, 5).map((item, index) => {
                  return (
                    <div key={index} className="d-flex align-items-center justify-content-between gap-3 p-2 border radius-10">
                      <div className="">
                        <img src={`${item.image}`} width={50} alt={item.title} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{item.title}</h6>
                      </div>
                      <div className="">
                        <small className="text-muted" style={{ fontSize: 12 }}> {new Date(item.created_at).toLocaleDateString()}</small>
                      </div>
                    </div>
                  );
                }
                )}

              </div>
            </div>


          </div>


        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="mb-1">Blogs</h5>
                </div>

              </div>
            </div>
            <div className="card-body">

              <ul className="list-unstyled" style={{ margin: 0, padding: 0 }}>
                {blogslist?.slice(0, 5)?.map((item, index) => {
                  return (
                    <li key={index} className="d-flex my-2 align-items-center justify-content-between gap-3 p-2 border radius-10">
                      <div className="">
                        <img src={`${image_baseurl}uploads/blogs/${item.image}`} width={50} alt={item.title} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{item.title}</h6>
                        <p className="mb-0 mt-2" style={{ fontSize: 12 }}> {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </li>
                  );
                })}

              </ul>

            </div>
          </div>
        </div>
      </div>

      <ReusableModal
        show={viewmodel2}
        onClose={() => setViewModel2(false)}
        title={<span><b>KYC Details</b></span>}
        body={
          <Kyc setViewModel2={setViewModel2} />
        }

      />
    </div>


  );
};

export default Dashboard;
