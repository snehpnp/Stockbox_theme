import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { GetNewsData } from "../../../Services/UserService/User";
import NewsModal from "./NewsCard";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
          <div style={styles.newsList}>
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
              <p>No news available</p>
            )}
          </div>
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
    objectFit: "cover",
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
