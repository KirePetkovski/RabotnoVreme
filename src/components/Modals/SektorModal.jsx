import React, { useState, useEffect } from "react";
import axios from "axios";

const SectorModal = ({ isOpen, onClose, fetchSektori, sektor }) => {
  const [SektorIme, setSektorIme] = useState("");
  const [Opis, setOpis] = useState("");

  const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
  useEffect(() => {
    if (sektor) {
      setSektorIme(sektor.SektorIme || "");
      setOpis(sektor.Opis || "");
    } else {
      setSektorIme("");
      setOpis("");
    }
  }, [sektor, isOpen]);
  

  const handleDodadiSektor = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        sektori_api,
        {
          SektorIme,
          Opis,
          action: "create" 
        },
        {
          headers: { "Content-Type": "application/json" } 
        }
      );

      console.log(response.data);
      fetchSektori();
      onClose(); 
    } catch (error) {
      console.error("Error adding sector:", error);
      alert("Грешка при додавање на сектор!"); 
    }
  };

  const handleIzmeniSektor = async (e) => {
    e.preventDefault();
  
    if (!sektor?.SektorID) {
      alert("Грешка: ID на сектор недостасува!");
      return;
    }
  
    try {
      await axios.post(
        sektori_api,
        {
          action:"update",
          SektorID: sektor.SektorID,
          SektorIme: SektorIme,
          Opis: Opis,
          headers: { "Content-Type": "application/json" } 
        }
      );
      
      alert("Секторот е успешно изменет!");
      fetchSektori();
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
        <h3>{sektor ? "Измени сектор" : "Додај нов сектор"}</h3>
        <form>
          <input
            type="text"
            placeholder="Име на сектор"
            value={SektorIme}
            onChange={(e) => setSektorIme(e.target.value)}
            required
          />
          <textarea
            placeholder="Опис на сектор"
            rows="3"
            value={Opis}
            onChange={(e) => setOpis(e.target.value)}
          />
          <div>
            <button type="submit" className="btn-add" onClick={sektor ? handleIzmeniSektor : handleDodadiSektor}> 
              {sektor ? "Зачувај измена" : "Зачувај"}
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
