import React from "react";

const SectorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Додај нов сектор</h3>
        <form>
          <input type="text" placeholder="Име на сектор" required />
          <textarea placeholder="Опис на сектор" rows="3" />
          <div>
            <button type="button" className="btn-add" onClick={onClose}>
              Зачувај
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

export default SectorModal;
