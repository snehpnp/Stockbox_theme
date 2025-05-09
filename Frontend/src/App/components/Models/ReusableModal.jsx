import React from "react";
import { Modal } from "react-bootstrap";

const ReusableModal = ({ show, onClose, title, body, footer, size = "md" }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size={size}
      id="verticalycentered"
    >
      <Modal.Header closeButton>
        <Modal.Title className="heading-color">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
        {body}
      </Modal.Body>
      <Modal.Footer>{footer || null}</Modal.Footer>
    </Modal>
  );
};

export default ReusableModal;
