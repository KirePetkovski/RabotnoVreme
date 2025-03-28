import React from "react";

const KorisniciModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај нов корисник</h3>
                <form>
                    <input
                        type="text"
                        name="username"
                        placeholder="Корисничко име"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Е-пошта"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Лозинка"
                        required
                    />
                    <select
                        name="role"
                        required
                    >
                        <option value="">Одберете улога</option>
                        <option value="Admin">Администратор</option>
                        <option value="User">Корисник</option>
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

export default KorisniciModal;
