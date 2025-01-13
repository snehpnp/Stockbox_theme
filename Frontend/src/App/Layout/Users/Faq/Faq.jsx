import React, { useEffect, useState } from "react";
import { getFaq } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";

const Faq = () => {
  const [faq, setFaq] = useState([]);
  let token = localStorage.getItem("token");

  const fetchFaq = async () => {
    try {
      const res = await getFaq({ token });
      console.log('Full Response:', res);
      if (res.status===true) {
        setFaq(res.data); 
      } else {
        console.error('API response status is false.');
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err);
      setFaq([]); // Reset FAQ state to empty on error
    }
  };
  

  useEffect(() => {
    fetchFaq();
  }, []);

  console.log("Faq:", faq);

  return (
    <div>
      
       <Content
      Page_title="FAQ"
      button_title="Add Basket"
      button_status={true}
    >
 <div className="page-content">
     
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Need Help ?</h5>
            <hr />
            <div className="accordion accordion-flush" id="accordionExample2">
            {faq && faq.length > 0 ? (
  faq.map((item, index) => (
    <div className="accordion-item" key={item._id}>
      <h2 className="accordion-header" id={`heading${index}`}>
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${index}`}
          aria-expanded={index === 0 ? "true" : "false"}
          aria-controls={`collapse${index}`}
        >
          {item.title}
        </button>
      </h2>
      <div
        id={`collapse${index}`}
        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
        aria-labelledby={`heading${index}`}
        data-bs-parent="#accordionExample2"
      >
        <div className="accordion-body">
          {item.description}
        </div>
      </div>
    </div>
  ))
) : (
  <p>No FAQs available.</p>
)}

            </div>
          </div>
        </div>
      </div>

    </Content>
     
    </div>
  );
};

export default Faq;
