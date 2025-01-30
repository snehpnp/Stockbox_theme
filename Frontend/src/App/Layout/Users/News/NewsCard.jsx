import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const NewsCard = ({ news }) => {
  const [showModal, setShowModal] = useState(false); // State to toggle the main modal visibility
  const [modalImage, setModalImage] = useState(""); // State to store clicked image

  const handleImageClick = (image) => {
    setModalImage(image); // Set the image to display in the modal
    setShowModal(true); // Open the main modal
  };

  return (
    <div className="card">
      <div className="card-img" style={{ overflow: "hidden", height: "200px" }}>
        <img
          src={news.image}
          alt="news"
          className="img-fluid"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onClick={() => handleImageClick(news.image)} // Handle click to open the modal
        />
      </div>
      <div className="card-header">
        <b>{news.title}</b>
      </div>
      <div className="card-body">
        <p dangerouslySetInnerHTML={{ __html: news.description }} />
        <div className="mt-3">
          {/* Display create and update date */}
          <p>
            <strong>Created on:</strong> {new Date(news.created_at).toLocaleDateString()}
          </p>
          {news.updated_at && (
            <p>
              <strong>Updated on:</strong> {new Date(news.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="card-footer">
        {/* <Link
          to={`/user/newsdetail/${news.id}`}
          className="btn btn-primary w-100"
        >
          Read More
        </Link> */}
      </div>

      {/* Main Modal for Fullscreen Image */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Body>
          <img
            src={modalImage}
            alt="Fullscreen"
            className="img-fluid"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewsCard;
