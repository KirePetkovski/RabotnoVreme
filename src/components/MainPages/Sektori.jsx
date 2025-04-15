import React, { useState, useEffect } from "react";
import "./MainPages.css";
import SektorModal from "../Modals/SektorModal";
import axios from "axios";

const Sektor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IzmeniSektor, setIzmeniSektor] = useState(null);
  const [sektori, setSektori] = useState([]);
  const [vraboteni, setVraboteni] = useState([]);

  const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
  const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php";

  useEffect(() => {
    fetchSektori();
    fetchVraboteni();
  }, []);

  const fetchSektori = async () => {
    try {
      const response = await axios.get(sektori_api);
      setSektori(response.data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };
  const fetchVraboteni = async () => {
    try {
      const response = await axios.get(vraboteni_api);
      setVraboteni(response.data);
    } catch (error) {
      console.error("Error fetching vraboteni:", error);
    }
  };

  const IzmeniModal = (sektor) => {
    setIzmeniSektor(sektor);
    setIsModalOpen(true);
  };

  const vraboteniPoSektor = (SektorID) =>{
    return vraboteni.filter(v => v.SektorID === SektorID).length;
  }
  
  const deleteSektor = async (id) => {
    if (!window.confirm("Дали сте сигурни дека сакате да го избришете овој сектор?")) return;
    
    try {
      //await axios.delete(`${sektori_api}?id=${id}`);
      await axios.post(sektori_api, {
        action: 'delete',
        SektorID: id
      });
      setSektori(sektori.filter(sektor => sektor.SektorID !== id));
    } catch (error) {
      console.error("Error deleting sector:", error);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Сите сектори</h1>
        <button className="btn-add" onClick={() => { setIzmeniSektor(null); setIsModalOpen(true); }}>
          Додај сектор
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име на сектор</th>
            <th>Број на вработени</th>
            <th>Опис</th>
            <th>Избриши</th>
            <th>Измени</th>
          </tr>
        </thead>
        <tbody>
          {sektori.length > 0 ? (
            sektori.map((sektor, index) => (
              <tr key={sektor.SektorID}>
                <td>{index + 1}</td>
                <td>{sektor.SektorIme}</td>
                <td>{vraboteniPoSektor(sektor.SektorID)}</td>
                <td>{sektor.Opis}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteSektor(sektor.SektorID)}>
                    Избриши
                  </button>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => IzmeniModal(sektor)}>Измени</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Нема податоци</td>
            </tr>
          )}
        </tbody>
      </table>

      <SektorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchSektori={fetchSektori} 
        sektor={IzmeniSektor}
      />
    </div>
  );
};

export default Sektor;
