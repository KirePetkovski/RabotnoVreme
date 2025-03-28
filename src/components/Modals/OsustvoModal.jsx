import React from "react";

const OsustvaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Побарај осуство</h3>
        <form>
          <label>Од ден:</label>
          <input type="date" required />

          <label>До ден:</label>
          <input type="date" required />

          <label>Причина:</label>
          <textarea rows="3" placeholder="Внесете ја причината..." required />

          <div className="modal-buttons">
            <button type="button" className="btn-add" onClick={onClose}>
              Побарај
            </button>
            <button type="button" className="btn-delete" onClick={onClose}>
              Откажи
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OsustvaModal;
