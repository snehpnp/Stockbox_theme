import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { GetNewsData } from "../../../Services/UserService/User";
import NewsModal from "./NewsCard";
import Loader from "../../../../Utils/Loader";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    GetNewsData()
      .then((response) => {
        if (response.status) {
          setNewsData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false)
  }, []);

  // Handle card click
  const handleCardClick = (news) => {
    setSelectedNews(news);
    setModalOpen(true);
  };
  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Remove all HTML tags
  };

  return (
    <div>
      <Content Page_title="News" button_status={false} backbutton_status={true}>
        <div style={styles.container}>
          {isLoading ? <Loader /> : <div style={styles.newsList}>
            {newsData.length > 0 ? (
              newsData.map((news, index) => (
                <div
                  key={index}
                  style={styles.card}
                  onClick={() => handleCardClick(news)}
                >
                  <img
                    src={news.image}
                    alt="news"
                    style={styles.image}
                    loading="lazy"
                  />
                  <div style={styles.content}>
                    <h3 style={styles.title}>{news.title}</h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: news.description.substring(0, 100) + "...",
                      }}
                      title={stripHtmlTags(news.description)}
                    />
                    <small style={styles.date}>
                      {new Date(news.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="dark text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 240 160"
                width="240"
                height="160"
              >
                <defs>
                  {/* Gradients for light and dark modes */}
                  <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0f0f0" />
                    <stop offset="100%" stopColor="#dcdcdc" />
                  </linearGradient>
                  <linearGradient id="bgGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#333333" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                  </linearGradient>
            
                  {/* Drop shadow filter for subtle 3D effect */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
                  </filter>
                </defs>
            
                <g id="laptop" filter="url(#shadow)">
                  {/* Laptop outer body */}
                  <rect x="20" y="20" width="200" height="100" rx="10" ry="10" fill="#cccccc" />
            
                  {/* Laptop screen */}
                  <rect
                    x="30"
                    y="30"
                    width="180"
                    height="80"
                    rx="5"
                    ry="5"
                    className="screen-bg"
                  />
            
                  {/* Loader dots */}
                  <g id="loader-dots">
                    <circle cx="110" cy="65" r="3" className="dot" style={{ animationDelay: '0s' }} />
                    <circle cx="120" cy="65" r="3" className="dot" style={{ animationDelay: '0.2s' }} />
                    <circle cx="130" cy="65" r="3" className="dot" style={{ animationDelay: '0.4s' }} />
                  </g>
            
                  {/* "No Data Found" text inside the screen */}
                  <text
                    x="120"
                    y="85"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}
                  >
                    No Data Found
                  </text>
            
                  {/* Laptop base/keyboard */}
                  <rect x="30" y="120" width="180" height="10" rx="3" ry="3" fill="#888888" />
                </g>
              </svg>
            </div>
            )}
          </div>}
        </div>
      </Content>

      {/* Modal for News Details */}
      {modalOpen && selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "10px",
    textAlign: "center",
  },
  newsList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    margin: "15px",
    width: "300px",
    transition: "0.3s",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
  },
  content: {
    padding: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  date: {
    fontSize: "12px",
    color: "#888",
  },
};

export default News;
