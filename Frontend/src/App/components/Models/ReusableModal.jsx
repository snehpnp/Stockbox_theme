import React from "react";
import { Modal } from "react-bootstrap";

const ReusableModal = ({
  show,
  onClose,
  title,
  body,
  footer,
  size = "md",
  disableClose = true,
}) => {
  return (
    <Modal
      show={show}
      onHide={disableClose ? onClose : () => { }}
      centered
      size={size}
      id="verticalycentered"
      backdrop={disableClose ? true : "static"}
      keyboard={disableClose}
    >
      <Modal.Header closeButton={disableClose}>
        <Modal.Title className="heading-color ">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>{footer || null}</Modal.Footer>
    </Modal>
  );
};

export default ReusableModal;
