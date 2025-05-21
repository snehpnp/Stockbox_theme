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
        <>
            {/* Dark blurred background that blocks interaction */}
            {show && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay
                        backdropFilter: "blur(2px)", // Optional blur
                        zIndex: 1040,
                        pointerEvents: "all",
                    }}
                />
            )}

            <Modal
                show={show}
                onHide={disableClose ? onClose : () => { }}
                centered
                size={size}
                id="verticalycentered"
                backdrop="static"
                keyboard={false}
                style={{ zIndex: 1050 }}
            >
                <Modal.Header closeButton={disableClose}>
                    <Modal.Title className="heading-color">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {body}
                </Modal.Body>
                <Modal.Footer>{footer || null}</Modal.Footer>
            </Modal>
        </>
    );
};

export default ReusableModal;
