import React, { useState, useEffect } from "react";
import axios from "axios";

const KalendarModal = ({ isOpen, onClose }) => {
    const [PraznikIme, setPraznikIme] = useState("");
    const [Datum, setDatum] = useState("");
    const [TipPraznik, setTipPraznik] = useState("");

    const praznici_api = "https://rabotnovreme.infinityfreeapp.com/php/praznici.php";

    const handleDodadiPraznik = async (e) => {
        e.preventDefault();
        
        try {
            console.log(PraznikIme, Datum, TipPraznik);

          const response = await axios.post(
            praznici_api,
            {
                PraznikIme,
                Datum,
                TipPraznik
            },
            {
              headers: { "Content-Type": "application/json" } 
            }
          );
    
          console.log(response.data);
          onClose(); 
        } catch (error) {
        //  console.error("Error adding sector:", error);
          alert("Грешка при додавање на празник!"); 
        }


    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај нов празник</h3>
                <form >
                    <input
                        type="text"
                        name="PraznikIme"
                        value={PraznikIme}
                        onChange={(e) => setPraznikIme(e.target.value)}
                        placeholder="Име на празник"
                        required
                    />
                    <input
                        type="date"
                        name="Datum"
                        value={Datum}
                        onChange={(e) => setDatum(e.target.value)}
                        required
                    />
                    <select
                        name="TipPraznik"
                        value={TipPraznik}
                        onChange={(e) => setTipPraznik(e.target.value)}
                    >
                        <option value="Државен празник">Државен празник</option>
                        <option value="Христијански">Христијански</option>
                        <option value="Муслимански">Муслимански</option>
                        <option value="Македонски">Македонски</option>
                        <option value="Албански">Албански</option>
                        <option value="Други">Други</option>
                    </select>
                    <div>
                        <button type="submit" className="btn-add" onClick={handleDodadiPraznik}>Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KalendarModal;