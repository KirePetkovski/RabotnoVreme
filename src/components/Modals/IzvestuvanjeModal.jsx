import React, { useState } from "react";
import axios from "axios";
import { izvestuvanje_api, sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const izvestuvanjeModal = ({ isOpen, onClose, PratenoOd}) => {

    const [CardID, setCardID] = useState("");
    const [Sodrzina, setSodrzina] = useState("");
    //const [PratenoOd, setPratenoOd] = useState("");

    const handleDodadiIzvestuvanje = async (e) => {
        e.preventDefault();
        
        try {
            console.log(CardID, Sodrzina, PratenoOd);

          const response = await axios.post(
            izvestuvanje_api,
            {
                CardID,
                Sodrzina,
                PratenoOd
            },
            {
              headers: { "Content-Type": "application/json" } 
            }
          );
    
          console.log(response.data);
          onClose(); 
        } catch (error) {
        //  console.error("Error adding sector:", error);
          alert("Грешка при додавање на известување!"); 
        }


    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај новo известување</h3>
                <form >
                    <input
                        type="text"
                        name="CardID"
                        value={CardID}
                        onChange={(e) => setCardID(e.target.value)}
                        placeholder="Име на вработен"
                        required
                    />
                    <textarea
                        name="Sodrziva"
                        value={Sodrzina}
                        onChange={(e) => setSodrzina(e.target.value)}
                        placeholder="Внесете текст"
                        required
                        rows={5}
                    />
                    <div>
                        <button type="submit" className="btn-add" onClick={handleDodadiIzvestuvanje}>Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default izvestuvanjeModal;