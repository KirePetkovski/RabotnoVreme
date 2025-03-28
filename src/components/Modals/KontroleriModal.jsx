import React from "react";

const KontroleriModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (

        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај нов контролер</h3>
                <form>
                    <input
                        type="text"
                        name="IPAdress"
                        placeholder="IP Адреса"
                        required
                    />
                    <select name="IsActive">
                        <option value="1">Активен</option>
                        <option value="0">Неактивен</option>
                    </select>
                    <select name="Enable">
                        <option value="1">Овозможен</option>
                        <option value="0">Оневозможен</option>
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

export default KontroleriModal;