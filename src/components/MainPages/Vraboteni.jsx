import React, { useState, useEffect } from "react";
import "./MainPages.css";
import VraboteniModal from "../Modals/VrabotenModal";
import axios from "axios";

const Vraboteni = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IzmeniVraboteni, setIzmeniVraboteni] = useState(null);
  const [vraboteni, setVraboteni] = useState([]);
  const [sektori, setSektori] = useState([]);
  const [rasporedi, setRasporedi] = useState([]);

  const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php";
  const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
  const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";

  useEffect(() => {
    fetchVraboteni();
    fetchRasporedi();
    fetchSektori();
  }, []);

  const fetchVraboteni = async () => {
    try {
      const response = await axios.get(vraboteni_api);
      setVraboteni(response.data);
    } catch (error) {
      console.error("Error fetching vraboteni:", error);
    }
  };
  const fetchSektori = async () => {
    try {
      const response = await axios.get(sektori_api);
      setSektori(response.data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };
  const fetchRasporedi = async () => {
    try {
      const response = await axios.get(raspored_api);
      setRasporedi(response.data);
    } catch (error) {
      console.error("Error fetching rasporedi:", error);
    }
  };

  const deleteVraboten = async (id) => {
    if (!window.confirm("Дали сте сигурни дека сакате да го избришете овој вработен?")) return;

    try {
      //await axios.delete(`${vraboteni_api}?id=${id}`);
      await axios.post(vraboteni_api, {
        action: 'delete',
        VrabotenID: id
      });
      setVraboteni(vraboteni.filter(vraboten => vraboten.VrabotenID !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleDeaktiviraj = async (VrabotenID, Aktiven) => {
    try {
      console.log("DEAKTIVIRAJ");

      const newStatus = Number(Aktiven) === 1 ? 0 : 1;
      await axios.post(
        vraboteni_api,
        {
          action: "update",
          VrabotenID: VrabotenID, 
          Aktiven: newStatus, 
        },
        {
          headers: { "Content-Type": "application/json" }
        });
      fetchVraboteni();
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  const IzmeniModal = (vraboten) => {
    setIzmeniVraboteni(vraboten);
    setIsModalOpen(true);
  };


  return (
    <div className="vraboteni-page">
      <div className="header">
        <h2>Сите вработени</h2>
        <button className="btn-add" onClick={() => { setIzmeniVraboteni(null); setIsModalOpen(true); }}>
          Додај вработен
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Вкупен број</h2>
          <p>{vraboteni.length}</p>
        </div>
        <div className="stat-card">
          <h2>Активни</h2>
          <p>{vraboteni.filter((v) => !v.Aktiven).length}</p>
        </div>
        <div className="stat-card">
          <h2>Деактивирани</h2>
          <p>{vraboteni.filter((v) => v.Aktiven).length}</p>
        </div>

      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име и Презиме</th>
            <th>Националност</th>
            <th>Религија</th>
            <th>Сектор</th>
            <th>Распоред</th>
            <th>Број на карта</th>
            <th>Деактивирај</th>
            <th>Измени</th>
            <th>Избриши</th>
          </tr>
        </thead>
        <tbody>
          {vraboteni.length > 0 ? (
            vraboteni.map((vraboten, index) => (
              <tr key={vraboten.VrabotenID}>
                <td>{index + 1}</td>
                <td>{vraboten.ImePrezime}</td>
                <td>{vraboten.Nacionalnost}</td>
                <td>{vraboten.Religija}</td>
                <td>
                  {sektori.find(sektor => sektor.SektorID === vraboten.SektorID)?.SektorIme || "Неопределено"}
                </td>
                <td>
                  {rasporedi.find(raspored => raspored.RasporedID === vraboten.RasporedID)?.RasporedIme || "Неопределено"}
                </td>
                <td>{vraboten.CardID}</td>
                <td>
                  <button className="btn-edit" 
                  onClick={() => handleDeaktiviraj(vraboten.VrabotenID, vraboten.Aktiven)}>
                    {vraboten.Aktiven ? "Деактивирај" : "Активирај"}
                  </button>
                </td>
                <td>
                <button className="btn-edit" onClick={() => IzmeniModal(vraboten)}>Измени</button>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => deleteVraboten(vraboten.VrabotenID)}>Избриши</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Нема податоци</td>
            </tr>
          )}
        </tbody>
      </table>
      <VraboteniModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchVraboteni={fetchVraboteni}
        sektori={sektori}
        rasporedi={rasporedi}
        vraboten = {IzmeniVraboteni} 
    />

    </div>
  );
};

export default Vraboteni;
