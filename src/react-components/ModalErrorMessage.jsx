import React from "react";
import Modal from "./modals/Modal";

const ModalErrorMessage = ({ isOpen, customMessage = false, onClose }) => (
  <Modal
    isOpen={isOpen}
    alertModal
    children={[
      <>
        <div className="modal-body">
          <div className="alert-main">
            <div className="alert-message">
              <h2>{customMessage ? customMessage : "This form is invalid"}</h2>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </>,
    ]}
  />
);

export default ModalErrorMessage;
