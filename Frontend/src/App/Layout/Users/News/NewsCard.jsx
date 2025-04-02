import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const NewsCard = ({ news, onClose }) => {
  return (
    <Modal show={!!news} onHide={onClose} size="lg" centered>
      <Modal.Body>
        <h2>{news?.title}</h2>
        <img src={news?.image} alt="news" style={styles.image} />
        <p dangerouslySetInnerHTML={{ __html: news?.description }} />
        <small style={styles.date}>
          {news?.created_at
            ? new Date(news.created_at).toLocaleDateString()
            : ""}
        </small>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

const styles = {
  image: { width: "100%", height: "400px", borderRadius: "5px" },
  date: { fontSize: "12px", color: "#888" },
};

export default NewsCard;
