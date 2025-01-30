import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { Link } from "react-router-dom";
import { GetNewsData } from "../../../Services/UserService/User";
import NewsCard  from "./NewsCard";

const News = () => {
  const [newsData, setNewsData] = useState([]);
const [NewsFullData, setNewsFullData] = useState([]);
  useEffect(() => {
    GetNewsData()
      .then((response) => {
        console.log(response);
        if (response.status) {
          setNewsData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const chunkedNewsData = () => {
    const chunkSize = 3;
    let result = [];
    for (let i = 0; i < newsData.length; i += chunkSize) {
      result.push(newsData.slice(i, i + chunkSize));
    }
    return result;
  };

  return (
    <div>
      <Content
        Page_title="News"
        button_status={false}
        backbutton_title="Back"
        backbutton_status={false}
      >
        <div className="page-content">
          <div
            id="newsCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {chunkedNewsData().map((chunk, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <div className="row">
                    {chunk.map((news, index) => (
                      <div className="col-md-4 col-sm-6" key={index}>
                        {" "}
                        <NewsCard news={news} />{" "}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Only show the controls if there are more than one carousel items */}
            {chunkedNewsData().length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#newsCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#newsCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      </Content>

    </div>
  );
};

export default News;
