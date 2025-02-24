import { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReusableModal from "../../../components/Models/ReusableModal";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import Content from "../../../components/Contents/Content";
import { GetUserData } from "../../../Services/UserService/User";
import { UpdateBroker } from "../../../Services/UserService/User";
import BrokersData from "../../../../Utils/BrokersData";

const Demat = () => {



  const [brokers, setbrokers] = useState([
    {
      id: 1,
      name: "Angel One",
      img: "https://play-lh.googleusercontent.com/Ic8lUYwMCgTePpo-Gbg0VwE_0srDj1xD386BvQHO_mOwsfMjX8lFBLl0Def28pO_Mvk",
    },
    {
      id: 2,
      name: "Alice Blue",
      img: "https://media.licdn.com/dms/image/v2/D560BAQHU88VqPp14_w/company-logo_200_200/company-logo_200_200/0/1714714585811/alice_blue_financial_services_ltd_logo?e=2147483647&v=beta&t=-wlK1PYJutu-1MibN_iR2-i5Vga7VWuckKi0jOQp2F0",
    },

    {
      id: 3,
      name: "Kotak Neo",
      img: "https://play-lh.googleusercontent.com/CpJknJt8JrLZJp9-ETaYMWzqphlTNNqGSiSx05dyoGKFi18HOxM6CVp_JrpoZxrlIys",
    },
    {
      id: 4,
      name: "Market Hub",
      img: "https://media.licdn.com/dms/image/v2/D560BAQEB5MsFZkdKwg/company-logo_200_200/company-logo_200_200/0/1681292585114/market_hub_stock_broking_pvt_ltd__logo?e=1746057600&v=beta&t=9YGrMbiPySe_qefvVi7OuaBOhjgc-BbupTeRPPIp1jE",
    },
  ])



  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [userDetail, setUserDetail] = useState();
  const [dlinkstatus, setDlinkstatus] = useState(false);
  const [brokerData, setBrokerData] = useState({});

  const [viewmodel, setViewModel] = useState(false);


  useEffect(() => {
    getuserdetail();
  }, []);




  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");



  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data?.brokerid);
        setDlinkstatus(response.data?.dlinkstatus == 1);
        setBrokerData(response.data);
        if (response.data?.dlinkstatus == 1) {
          const filteredBrokers = brokers.filter(
            (data) => data.id === response.data?.brokerid
          );
          setbrokers(filteredBrokers);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const handleShowModal = (title) => {
    setModalTitle(title);
    if (brokerData.dlinkstatus == 0) {
      setViewModel(true);
    } else {
      if (brokerData.brokerid == 1) {
        window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${brokerData.apikey}`;
      } else if (brokerData.brokerid == 2) {
        window.location.href = `https://ant.aliceblueonline.com/?appcode=${brokerData.apikey}`;
      } else if (brokerData.brokerid == 3) {
      } else if (brokerData.brokerid == 4) {
      }
    }
  };






  const brokerFieldsMap = {
    1: [{ name: "apikey", key: "apikey", label: "API Key", type: "text" }],
    2: [
      { name: "AppCode", key: "AppCode", label: "App Code", type: "text" },
      {
        name: "alice_userid",
        key: "alice_userid",
        label: "User ID",
        type: "tel",
      },
      {
        name: "apisecret",
        key: "apisecret",
        label: "API Secret",
        type: "text",
      },
    ],
    3: [
      { name: "apikey", key: "apikey", label: "API Key", type: "text" },
      {
        name: "apisecret",
        key: "apisecret",
        label: "API Secret",
        type: "text",
      },
      { name: "user_name", key: "user_name", label: "Username", type: "text" },
      {
        name: "pass_word",
        key: "pass_word",
        label: "Password",
        type: "password",
      },
    ],
    4: [
      { name: "apikey", key: "apikey", label: "API Key", type: "text" },
      {
        name: "apisecret",
        key: "apisecret",
        label: "API Secret",
        type: "text",
      },
      {
        name: "Password",
        key: "Password",
        label: "Password",
        type: "password",
      },
    ],
  };



  const fieldTypes = brokerFieldsMap[userDetail || 1];



  // const formik = useFormik({
  //   initialValues: fieldTypes.reduce((acc, field) => {
  //     acc[field.key] = "";
  //     return acc;
  //   }, {}),
  //   enableReinitialize: true,
  //   validate: (values) => { },
  //   onSubmit: async (values) => {



  //   },
  // });


  // useEffect(() => {
  //   formik.setValues(
  //     fieldTypes.reduce((acc, field) => {
  //       acc[field.key] = brokerData[field.key] || "";
  //       return acc;
  //     }, {})
  //   );
  // }, [userDetail]);


  const closeBrokerModal = () => {
    setViewModel(false);
  };



  return (
    <div>

      <Content Page_title="Supported Broker" button_status={false} backbutton_status={false}>
        <div className="page-content d-block">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-4 justify-content-center align-items-center">

            {brokers.length > 0 ? brokers?.map((broker) => (
              <div className="col-md-4 col-sm-6 mb-3" key={broker?.id}>
                <div className="card radius-5" onClick={() => setUserDetail(broker?.id)}>
                  <div className="card-body p-2 text-center cursor-pointer" onClick={() => handleShowModal(broker?.name)}>
                    <div className="p-4 border radius-5">
                      <img className="img-fluid" src={broker?.img} alt={broker?.name} />
                      <h5 className="mb-0 mt-5">{broker?.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            )) : <div className="text-center mt-5">
              <img
                src="/assets/images/norecordfound.png"
                alt="No Records Found"
              />
            </div>}

            {viewmodel && (
              <BrokersData closeModal={closeBrokerModal} data={brokerData} />
            )}
          </div>
        </div>
      </Content>


      {/* <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<>{modalTitle}</>}
        body={
          <FormicForm
            fieldtype={fieldTypes}
            formik={formik}
            ButtonName="Submit"
            BtnStatus={true}
          />
        }
      /> */}
    </div>
  );
};

export default Demat;
