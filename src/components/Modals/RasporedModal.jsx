import React, { useState, useEffect } from "react";
import axios from "axios";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const RasporedModal = ({ isOpen, onClose, fetchRasporedi, raspored }) => {    
    const [formData, setFormData] = useState({
        RasporedIme: "",
        Ponedelnik: "",
        Vtornik: "",
        Sreda: "",
        Cetvrtok: "",
        Petok: "",
        Sabota: "",
        RabotnoVreme: "",
        PauzaPocetok: "",
        PauzaKraj: "",
        PauzaVreme: "",
    });

//    const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";

    useEffect(() => {
        if (raspored) {
            setFormData({ ...raspored });
        } else {
            setFormData({});
        }

    }, [raspored, isOpen]);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value || "" });
    };

    const handleDodadiRaspored = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(raspored_api, {
              ...formData,
              action: "create"
            }, {
              headers: { "Content-Type": "application/json" }
            });  
            console.log(response.data);
            fetchRasporedi();
            setFormData({ 
                Ponedelnik: "",
                Vtornik: "",
                Sreda: "",
                Cetvrtok: "",
                Petok: "",
                Sabota: "",
                RabotnoVreme: "",
                PauzaPocetok: "",
                PauzaKraj: "",
                PauzaVreme: "",});
            onClose(); 
        } catch (error) {
            console.error("Error adding :", error);
            alert("Грешка при додавање на распоред!"); 
          }
    };

    const handleIzmeniRaspored = async (e) => {
        e.preventDefault();
    
        if (!raspored?.RasporedID) {
            alert("Грешка: ID на распоред недостасува!");
            return;
        }
        
    
        console.log("FormData before update:", formData); // Debugging
    
        try {
            await axios.post(raspored_api,
              {
                ...formData,
                action: "update",
                RasporedID: raspored.RasporedID
              }, {
                headers: { "Content-Type": "application/json" }
            });
    
            alert("Распоредот е успешно изменет!");
            fetchRasporedi();
            onClose();
        } catch (error) {
            alert("Настана грешка при ажурирање: " + error.message);
        }
    };
    
    if (!isOpen) {
        return null;
      }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{raspored ? "Измени Распоред" : "Додај Распоред"}</h3>
                <form>
                    <table >
                        <tbody>
                            <tr>
                                <td><label>Име на распоред:</label></td>
                                <td>
                                    <input
                                        style={{width: 150 + "px", float: "right"}}
                                        type="text"
                                        name="RasporedIme"
                                        placeholder="Име на Распоред"
                                        value={formData.RasporedIme || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Понеделник: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Ponedelnik"
                                        value={formData.Ponedelnik || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Вторник: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Vtornik"
                                        value={formData.Vtornik || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Среда: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Sreda"
                                        value={formData.Sreda || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Четврток: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Cetvrtok"
                                        value={formData.Cetvrtok || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Петок: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Petok"
                                        value={formData.Petok || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Сабота: </label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="Sabota"
                                        value={formData.Sabota || ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td><label>Работно време</label></td>
                                <td>
                                    <input
                                        style={{width: 100 + "px", float: "right"}}
                                        type="time"
                                        name="RabotnoVreme"
                                        value={formData.RabotnoVreme || ""}
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
                                        name="PauzaPocetok"
                                        value={formData.PauzaPocetok || ""}
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
                                        name="PauzaKraj"
                                        value={formData.PauzaKraj || ""}
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
                                        name="PauzaVreme"
                                        value={formData.PauzaVreme|| ""}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <button type="submit" className="btn-add" onClick={raspored ? handleIzmeniRaspored : handleDodadiRaspored}>Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RasporedModal;
