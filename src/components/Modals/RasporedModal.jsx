import React, { useState } from "react";

const RasporedModal = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        Name: "",
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        WorkingTime: "",
        BreakBegin: "",
        BreakEnd: "",
        BreakTime: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај Распоред</h3>
                <form onSubmit={handleSubmit}>
                    <table >
                        <tbody>
                            <tr>
                                <td><label>Име на распоред:</label></td>
                                <td>
                                    <input
                                        style={{width: 150 + "px", float: "right"}}
                                        type="text"
                                        name="Name"
                                        placeholder="Име на Распоред"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            {["Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"].map((day, index) => (
                                <tr key={index}>
                                    <td><label>{day}:</label></td>
                                    <td>
                                        <input
                                        style={{width: 100 + "px", float: "right"}}
                                            className="raspored"
                                            type="time"
                                            name={day}
                                            value={formData[day]}
                                            onChange={handleChange}
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td><label>Работно време</label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="WorkingTime"
                                        value={formData.WorkingTime}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Почеток на пауза:</label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="BreakBegin"
                                        value={formData.BreakBegin}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Крај на пауза:</label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="BreakEnd"
                                        value={formData.BreakEnd}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Време на пауза:</label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="BreakTime"
                                        value={formData.BreakTime}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <button type="submit" className="btn-add">Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RasporedModal;
