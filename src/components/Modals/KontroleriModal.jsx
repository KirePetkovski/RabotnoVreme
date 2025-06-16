import React, { useState, useEffect } from "react";
import axios from "axios";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const KontroleriModal = ({ isOpen, onClose }) => {
    const [IPAdress, setIPAdress] = useState("");
    const [Aktiven, setAktiven] = useState("");
   // const [Ovozmozi, setOvozmozi] = useState("");

    // const kontroleri_api = "https://rabotnovreme.infinityfreeapp.com/php/kontroleri.php";

    const handleDodadiKontroler = async (e) => {
        e.preventDefault();
        
        try {
            //console.log(IPAdress, Aktiven, Ovozmozi);

          const response = await axios.post(
            kontroleri_api,
            {
              action: "create",
              IPAdress,
              Aktiven,
              //Ovozmozi
            },
            {
              headers: { "Content-Type": "application/json" } 
            }
          );
    
          console.log(response.data);
          onClose(); 
        } catch (error) {
        //  console.error("Error adding sector:", error);
          alert("Грешка при додавање на контролер!"); 
        }
      };

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
                        value={IPAdress}
                        onChange={(e) => setIPAdress(e.target.value)}
                        required
                    />
                    <select name="Aktiven" value={Aktiven} onChange={(e) => setAktiven(e.target.value)}>
                        <option value="1">Активен</option>
                        <option value="0">Неактивен</option>
                    </select>
                    {/* <select name="Ovozmozi" value={Ovozmozi} onChange={(e) => setOvozmozi(e.target.value)}>
                        <option value="1">Овозможен</option>
                        <option value="0">Оневозможен</option>
                    </select> */}
                    <div>
                        <button type="button" className="btn-add" onClick={handleDodadiKontroler}>
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