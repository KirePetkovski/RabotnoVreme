import React, { useState, useEffect } from "react";
import axios from "axios";

const OsustvaModal = ({ isOpen, onClose, fetchOsustva, osustva }) => {
  const [OdDen, setOdDen] = useState("");
  const [DoDen, setDoDen] = useState("");
  const [Pricina, setPricina] = useState("");
  const [CardID, setCardID] = useState("");
  const [VrabotenID, setVrabotenID] = useState("");

  useEffect(() => {
    setVrabotenID(localStorage.getItem("VrabotenID") || "");
    setCardID(localStorage.getItem("CardID") || "");
  }, []);
  

  const osustva_api = "https://rabotnovreme.infinityfreeapp.com/php/osustva.php";

  // useEffect(() => {
  //     if (osustva) {
  //       setOdDen(osustva.OdDen || "");
  //       setDoDen(osustva.DoDen || "");
  //       setPricina(osustva.Pricina || "");
  //       setVrabotenID(osustva.VrabotenID || "8");
  //     } else {
  //       setOdDen("");
  //       setDoDen("");
  //       setPricina("");
  //       setVrabotenID("8");
  //     }
  //   }, [osustva, isOpen]);

  const handleDodadiOsustvo = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        osustva_api,
        { OdDen, DoDen, Pricina, VrabotenID, CardID},
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      fetchOsustva();
      onClose(); 
    } catch (error) {
      console.error("Error adding sector:", error);
      alert("Грешка при додавање на осуство!"); 
    }
  };

  // const handleIzmeniOsustvo = async (e) => {
  //   e.preventDefault();
  
  //   if (!osustvo?.OsustvoID) {
  //     alert("Грешка: ID на осуство недостасува!");
  //     return;
  //   }
  
  //   try {
  //     await axios.put(`${osustva_api}?id=${Osustva.osustvoID}`, {
  //       OdDen: osustva.OdDen,
  //       DoDen: osustva.DoDen,
  //       Pricina: osustva.Pricina,
  //       VrbotenID: osustva.VrabotenID
  //     });
  
  //     alert("Осуството е успешно изменетo!");
  //     onClose();
  //   } catch (error) {
  //     alert("Настана грешка при ажурирање: " + error.message);
  //   }
  // };
  
  if (!isOpen) {
    return null;
  }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* <h3>Побарај осуство</h3> */}
        <h3>{osustva ? "Измениги осуство" : "Побарај осуство"}</h3>
        <form>
          <label>Од ден:</label>
          <input
            type="date"
            value={OdDen}
            onChange={(e) => setOdDen(e.target.value)}
            required />

          <label>До ден:</label>
          <input 
           type="date"
           value={DoDen}
           onChange={(e) => setDoDen(e.target.value)}
           required />

          <label>Причина:</label>
          <textarea 
            rows="3" 
            placeholder="Внесете ја причината..." 
            value={Pricina}
            onChange={(e) => setPricina(e.target.value)}
            required />

          <div>
          {/* <button type="button" className="btn-add" onClick={osustva ? handleIzmeniOsustvo : handleDodadiOsustvo}> */}
            <button type="button" className="btn-add" onClick={handleDodadiOsustvo}>
              Побарај
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

export default OsustvaModal;
