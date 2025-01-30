import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReusableModal from "../../../components/Models/ReusableModal";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import Content from "../../../components/Contents/Content";
import { GetUserData } from "../../../Services/UserService/User";
const Demat = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [userDetail, setUserDetail] = useState();
  const [dlinkstatus, setDlinkstatus] = useState(false);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");

  const handleShowModal = (title) => {
    setModalTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 6) {
        errors.password = "Password should be at least 6 characters";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log("Form data", values);
    },
  });

  const brokers = [
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
  ];

  const brokerFieldsMap = {
    1: [{ key: "apikey", label: "API Key", type: "text" }],
    2: [
      { key: "AppCode", label: "App Code", type: "text" },
      { key: "alice_userid", label: "User ID", type: "tel" },
      { key: "apisecret", label: "API Secret", type: "text" },
    ],
    3: [
      { key: "apikey", label: "API Key", type: "text" },
      { key: "apisecret", label: "API Secret", type: "text" },
      { key: "user_name", label: "Username", type: "text" },
      { key: "pass_word", label: "Password", type: "password" },
    ],
    4: [
      { key: "apikey", label: "API Key", type: "text" },
      { key: "apisecret", label: "API Secret", type: "text" },
      { key: "Password", label: "Password", type: "password" },
    ],
  };

  const getuserdetail = async () => {
    try {
      const response = await GetUserData(userid, token);
      if (response.status) {
        setUserDetail(response.data?.brokerid);
        setDlinkstatus(response.data?.dlinkstatus == 1);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getuserdetail();
  }, []);

  const fieldTypes = brokerFieldsMap[userDetail || 1];

  return (
    <div>
      <Content
        Page_title="Supported Broker"
        button_status={false}
        backbutton_status={false}
      >
        <div className="page-content">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-4 justify-content-center align-items-center">
            {brokers
              .filter((broker) =>
                dlinkstatus ? broker.id === userDetail : true
              ) // Conditional filtering
              .map((broker) => (
                <div className="col mb-3" key={broker.id}>
                  <div
                    className="card radius-5"
                    onClick={() => setUserDetail(broker.id)}
                  >
                    <div
                      className="card-body text-center cursor-pointer"
                      onClick={() => handleShowModal(broker.name)}
                    >
                      <div className="p-4 border radius-5">
                        <img
                          src={broker.img}
                          width={110}
                          height={110}
                          alt={broker.name}
                        />
                        <h5 className="mb-0 mt-5">{broker.name}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Content>

      <ReusableModal
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
      />
    </div>
  );
};

export default Demat;
