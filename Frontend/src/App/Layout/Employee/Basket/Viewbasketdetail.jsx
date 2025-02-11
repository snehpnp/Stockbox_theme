import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { image_baseurl } from "../../../../Utils/config";
import { Modal } from 'react-bootstrap';
import { Formik } from "formik";
import * as Yup from "yup";
import { Viewbasket, getstocklistById } from "../../../Services/Admin/Admin";
import Swal from "sweetalert2";
import { Tooltip } from 'antd';
import { SquarePen, Eye } from 'lucide-react';
import Content from '../../../components/Contents/Content';






function cleanHtmlContent(html) {


  const div = document.createElement("div");
  div.innerHTML = html;

  const scripts = div.getElementsByTagName("script");
  const styles = div.getElementsByTagName("style");

  Array.from(scripts).forEach((script) => script.remove());
  Array.from(styles).forEach((style) => style.remove());


  const unorderedLists = div.querySelectorAll("ul");
  unorderedLists.forEach((list) => {
    list.style.listStyleType = "disc";
  });


  const orderedLists = div.querySelectorAll("ol");
  orderedLists.forEach((list) => {
    list.style.listStyleType = "decimal";
  });

  return div.innerHTML;
}





const fieldConfigurations = [

  {
    name: "title",
    label: "Basket Name",
    type: "text",
    label_size: 6,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "themename",
    label: "Theme Name",
    type: "text",
    label_size: 6,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "full_price",
    label: "Actual Basket Price",
    type: "number",
    label_size: 6,
    col_size: 4,
    disable: false,

  },
  {
    name: "basket_price",
    label: "Discounted/Net Basket price",
    type: "number",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true

  },

  {
    name: "mininvamount",
    label: "Minimum Investment Amount",
    type: "number",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },

  {
    name: "frequency",
    label: "Rebalance Frequency",
    type: "select",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },

  {
    name: "validity",
    label: "Validity",
    type: "select",
    label_size: 12,
    col_size: 4,
    disable: false,
    options: [
      { value: "1 month", label: "1 Month" },
      { value: "3 months", label: "3 Months" },
      { value: "6 months", label: "6 Months" },
      { value: "1 year", label: "1 Year" }
    ],
    star: true
  },
  {
    name: "cagr",
    label: "CAGR",
    type: "number",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "next_rebalance_date",
    label: "Rebalance Date",
    type: "text",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "type",
    label: "Risk Type",
    type: "select",
    label_size: 12,
    col_size: 4,
    disable: false,
    options: [
      { value: "HIGH", label: "High" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LOW", label: "Low" },
    ],
    star: true
  },

  {
    name: "short_description",
    label: "Short discription",
    type: "text",
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "image",
    // label: "Image",
    type: "file2",
    image: true,
    label_size: 12,
    col_size: 4,
    disable: false,
    star: true
  },
  {
    name: "url",
    label: "url",
    type: "text",
    label_size: 12,
    col_size: 4,
    disable: false,
  },
  {
    name: "description",
    label: "Description",
    type: "ckeditor",
    label_size: 12,
    col_size: 12,
    disable: false,
    star: true
  },
  {
    name: "rationale",
    label: "Rationale",
    type: "ckeditor",
    label_size: 12,
    col_size: 12,
    disable: false,
    star: true
  },
  {
    name: "methodology",
    label: "Methodology",
    type: "ckeditor",
    label_size: 12,
    col_size: 12,
    disable: false,
    star: true
  },
  {
    col_size: 12,
    name: "Stock",
    label: "Stock",
    type: "Stock",
    placeholder: "Add Stock",
    data: [
      { stocks: "", pricerange: "", stockweightage: "", entryprice: "", exitprice: "", exitdate: "", comment: "" },
    ],
  },
];


const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  accuracy: Yup.string().required("Accuracy is required"),
  mininvamount: Yup.string().required("Minimum Investment Amount is required"),
  portfolioweightage: Yup.string().required("Portfolio Weightage is required"),
  themename: Yup.string().required("Theme Name is required"),
  returnpercentage: Yup.string().required("Return percentage is required"),
  holdingperiod: Yup.string().required("Holding period is required"),
  potentialleft: Yup.string().required("Potential left is required"),
  Stock: Yup.array().of(
    Yup.object().shape({
      stocks: Yup.string().required("Stocks are required"),
      pricerange: Yup.string().required("Price range is required"),
      stockweightage: Yup.string().required("Stock weightage is required"),
      entryprice: Yup.string().required("Entry price is required"),
      exitprice: Yup.string().required("Exit price is required"),
      exitdate: Yup.string().required("Exit date is required"),
      comment: Yup.string().required("Comment is required"),
    })
  ),
  type: Yup.string().required("Type is required"),
  image: Yup.string().required("Image is required"),
  short_description: Yup.string().required("Short description is required"),
  rationale: Yup.string().required("Rationale is required"),
  methodology: Yup.string().required("Methodology is required"),


});

const Viewbasketdetail = () => {


  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stockdata, setStockdata] = useState({})

  const [currentlocation, setCurrentlocation] = useState({})

  const location = useLocation()

  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    if (location?.state) {
      setCurrentlocation(location?.state?.state);
    }
  }, [location]);

  const redirectTo = (currentlocation === "viewdetail") ? "/employee/basket/basketstockpublish" : "/employee/basket";

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    accuracy: "",
    price: "",
    cagr: "",
    mininvamount: "",
    portfolioweightage: "",
    themename: "",
    returnpercentage: "",
    holdingperiod: "",
    potentialleft: "",
    validity: "",
    next_rebalance_date: "",
    Stock: [{ stocks: "", pricerange: "", stockweightage: "", entryprice: "", exitprice: "", exitdate: "", comment: "" }],
    type: "",
    image: "",
    short_description: "",
    url:"",
    rationale: "",
    methodology: "",
  });

  useEffect(() => {
    getbasketdetail();
    GetStocklistbyid()
  }, []);


  const GetStocklistbyid = async () => {
    try {
      const response = await getstocklistById(id, token);
      if (response.status) {
        setStockdata(response?.data)
      }
    } catch (error) {
      console.log("error");
    }
  };


  const updateStock = async (stock) => {
    navigate("/employee/editstock/" + stock._id, { state: { stock } })
  }




  const getbasketdetail = async () => {
    try {
      const response = await Viewbasket(id, token);
      if (response.status) {
        const basketData = response.data;
        setInitialValues({
          title: basketData?.title || "",
          description: cleanHtmlContent(basketData?.description) || "",
          full_price: basketData?.full_price || "",
          basket_price: basketData?.basket_price || "",
          mininvamount: basketData?.mininvamount || "",
          themename: basketData?.themename || "",
          frequency: basketData?.frequency ? basketData?.frequency : "",
          validity: basketData?.validity ? basketData?.validity : "",
          next_rebalance_date: basketData?.next_rebalance_date ? basketData?.next_rebalance_date : "",
          cagr: basketData?.cagr || "",
          type: basketData?.type || "",
          image: basketData?.image || "",
          short_description: basketData?.short_description || "",
          url: basketData?.url || "",
          rationale: basketData?.rationale || "",
          methodology: basketData?.methodology || "",
        });
      }
    } catch (error) {
      console.error("Error fetching basket details:", error);
      Swal.fire("Error", "Failed to fetch basket details.", "error");
    }
  };


  const imageViewModel = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <Content
        Page_title="View Basket"
        button_status={false}
        backbutton_status={true}
        backForword={true}
      >
    <div className="page-content">
      {/* <div className="page-breadcrumb  d-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">View Basket</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <Link to="/employee/dashboard"><i className="bx bx-home-alt" /></Link>
              </li>
            </ol>
          </nav>
        </div>
      </div> 
      <hr />*/}
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ values }) => (
              <div>
                <h4>Basket Details</h4>
                <div className="row">
                  {fieldConfigurations?.map((field) =>
                    field.type !== "Stock" ? (
                      <div key={field.name} className={`col-md-${field.col_size}`}>
                        <label>{field.label}</label>

                        {field.name === "description" || field.name === "rationale" || field.name === "methodology" ? (
                          <div
                            className="form-control basket_img"
                            dangerouslySetInnerHTML={{
                              __html: values[field.name] || "",
                            }}
                          />
                        ) : field.name === "image" ? (
                          <div className="mt-2">
                            {values[field.name] ? (
                              <>
                                {/* <img
                                  src={`${image_baseurl}/uploads/basket/${values[field.name]}`}
                                  alt="Basket"
                                  className="img-thumbnail"
                                  style={{ width: "100%", maxWidth: "300px", height: "100px" }}
                                /> */}
                                <div style={{ display: 'flex' }}>
                                  <p>View image</p><Eye onClick={imageViewModel} />
                                </div>
                              </>
                            ) : (
                              <div>No Image Available</div>
                            )}
                            <Modal show={showModal} onHide={closeModal} centered>
                              <Modal.Header closeButton>
                                <Modal.Title>Image</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {values[field.name] ? (
                                  <img
                                    src={`${image_baseurl}/uploads/basket/${values[field.name]}`}
                                    alt="Basket"
                                    style={{ width: "100%" }}
                                  />
                                ) : (
                                  <div>No Image Available</div>
                                )}
                              </Modal.Body>
                            </Modal>

                          </div>

                        ) : (
                          <input
                            type={field.type}
                            className="form-control"
                            value={values[field.name] || ""}
                            disabled
                          />
                        )}
                      </div>
                    ) : (
                      <div key={field.name} className="col-md-12">
                        {Object.keys(
                          (Array.isArray(stockdata) ? stockdata : Object.values(stockdata)).reduce((acc, stock) => {
                            if (!acc[stock.version]) {
                              acc[stock.version] = [];
                            }
                            acc[stock.version].push(stock);
                            return acc;
                          }, {})
                        ).map((version) => {
                          const versionStocks = (Array.isArray(stockdata) ? stockdata : Object.values(stockdata)).filter(
                            (stock) => stock.version === parseInt(version)
                          );

                          return (
                            <div key={version}>
                              <h5 className="mt-4 mb-3">Stock Details</h5>
                              <div className="d-flex justify-content-between align-items-center">
                                <h6>Version {version}</h6>
                                {versionStocks[0].status === 0 ? (
                                  <Tooltip title="Update All">
                                    <SquarePen className="cursor-pointer" onClick={() => updateStock(versionStocks)} />
                                  </Tooltip>
                                ) : (
                                  ""
                                )}
                              </div>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Stock Name</th>
                                    <th>Weightage</th>
                                    <th>Price</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {versionStocks.map((stock, index) => (
                                    <tr key={index}>
                                      <td>{stock?.name}</td>
                                      <td>{stock?.weightage}</td>
                                      <td>{stock?.price}</td>
                                      <td>{stock?.type}</td>
                                      <td>{stock?.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}

                </div>
                <div className="mt-3">
                  <Link to={redirectTo} className="btn btn-secondary">
                    Back
                  </Link>
                </div>
              </div>
            )}
          </Formik>

        </div>
      </div>

    </div>
    </Content>
  );
};

export default Viewbasketdetail;
