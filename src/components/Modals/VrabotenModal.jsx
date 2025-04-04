import React, { useState, useEffect } from "react";
import axios from "axios";

const VraboteniModal = ({ isOpen, onClose, fetchVraboteni, sektori, rasporedi, vraboten }) => {

  const [novVraboten, setNovVraboten] = useState({
    CardID: "",
    ImePrezime: "",
    Nacionalnost: "",
    Religija: "",
    Aktiven: true,
    SektorID: "",
    RasporedID: "",
  });
  //Za promena na vraboten
  useEffect(() => {
    if (vraboten) {
      setNovVraboten({ ...vraboten });
  } else {
      setNovVraboten({});
  }
  }, [vraboten, isOpen]);
  const vraboteni_api = "http://rabotnovreme.infinityfreeapp.com/vraboteni_api.php";

  const handleChange = (e) => {
    setNovVraboten({ ...novVraboten, [e.target.name]: e.target.value || "" });
  };

  const handleDodadiVraboten = async (e) => {
    console.log(novVraboten);
    e.preventDefault();
    try {
      const response = await axios.post(
        vraboteni_api,
        novVraboten,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      fetchVraboteni();
      setNovVraboten({ // Reset form fields
        CardID: "",
        ImePrezime: "",
        Nacionalnost: "",
        Religija: "",
        Aktiven: true,
        SektorID: "",
        RasporedID: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding :", error);
      alert("Грешка при додавање на Vraboten!");
    }
  };
  const handleIzmeniVrraboten = async (e) => {
    e.preventDefault();

    if (!vraboten?.VrabotenID) {
        alert("Грешка: ID на вработен недостасува!");
        return;
    }

    console.log("novVraboten before update:", novVraboten); 

    try {
        await axios.put(`${vraboteni_api}?id=${vraboten.VrabotenID}`, novVraboten, {
            headers: { "Content-Type": "application/json" }
        });

        alert("Вработен е успешно изменет!");
        fetchVraboteni();
        onClose();
    } catch (error) {
        alert("Настана грешка при ажурирање: " + error.message);
    }
};

  if (!isOpen) {
    return null;
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{vraboten ? "Измени вработен" : "Додај нов вработен"}</h3>
        <form>
          <input
            type="text"
            placeholder="Име и Презиме"
            name="ImePrezime"
            value={novVraboten.ImePrezime || ""}
            onChange={handleChange}
            required />
          <input
            type="text"
            placeholder="Националност"
            name="Nacionalnost"
            value={novVraboten.Nacionalnost || ""}
            onChange={handleChange}
            required />
          <input
            type="text"
            placeholder="Религија"
            name="Religija"
            value={novVraboten.Religija || ""}
            onChange={handleChange}
            required />
          <input
            type="text"
            placeholder="Број на карта"
            name="CardID"
            value={novVraboten.CardID || ""}
            onChange={handleChange}
            required />
          <select name="SektorID" value={novVraboten.SektorID} onChange={handleChange} required>
            <option value="">-- Избери Сектор --</option>
            {sektori.map((sektor) => (
              <option key={sektor.SektorID} value={sektor.SektorID}>
                {sektor.SektorIme}
              </option>
            ))}
          </select>

          <select name="RasporedID" value={novVraboten.RasporedID} onChange={handleChange} required>
            <option value="">-- Избери Распоред --</option>
            {rasporedi.map((raspored) => (
              <option key={raspored.RasporedID} value={raspored.RasporedID}>
                {raspored.RasporedIme}
              </option>
            ))}
          </select>

          <div>
            <button type="button" className="btn-add" onClick={vraboten ? handleIzmeniVrraboten : handleDodadiVraboten}>
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

export default VraboteniModal;
