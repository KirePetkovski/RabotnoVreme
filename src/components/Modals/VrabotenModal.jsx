import React from "react";

const VraboteniModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Додај Нов Вработен</h3>
        <form>
          <input type="text" placeholder="Име и Презиме" required />
          <input type="text" placeholder="Националност" required />
          <input type="text" placeholder="Број на карта" required />
          <select required>
            <option value="">-- Избери Сектор --</option>
            <option value="1">ИТ</option>
            <option value="2">Финансии</option>
          </select>
          <select required>
            <option value="">-- Избери Распоред --</option>
            <option value="1">Прва смена</option>
            <option value="2">Втора смена</option>
          </select>
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

export default VraboteniModal;
