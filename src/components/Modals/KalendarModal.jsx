import React from "react";

const KalendarModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај нов празник</h3>
                <form >
                    <input
                        type="text"
                        placeholder="Име на празник"
                        required
                    />
                    <input
                        type="date"
                        name="newHolidayDate"
                        required
                    />
                    <select
                        name="category"
                    >
                        <option value="Христијански">Христијански</option>
                        <option value="Муслимански">Муслимански</option>
                        <option value="Македонски">Македонски</option>
                        <option value="Други">Други</option>
                    </select>
                    <div>
                        <button type="submit" className="btn-add">Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KalendarModal;