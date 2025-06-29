import React, { useState, useEffect } from "react";
import "./MainPages.css";
import RasporedModal from '../Modals/RasporedModal';
import axios from "axios";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const raspored = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IzmeniRaspored, setIzmeniRaspored] = useState(null);
  const [rasporedi, setRasporedi] = useState([]);
  

  //const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";

  useEffect(() => {
    fetchRasporedi();
  }, []);

  const fetchRasporedi = async () => {
    try {
      const response = await axios.get(raspored_api);
      setRasporedi(response.data);
    } catch (error) {
      console.error("Error fetching rasporedi:", error);
    }
  };

  const IzmeniModal = (raspored) => {
    setIzmeniRaspored(raspored);
    setIsModalOpen(true);
  };

 const deleteRaspored = async (id) => {
  if (!window.confirm("Дали сте сигурни дека сакате да го избришете овој распоред?")) return;
  console.log(id);
    
  try {
    await axios.post(raspored_api, {
      action: 'delete',
      RasporedID: id
    });
    setRasporedi(rasporedi.filter(raspored => raspored.RasporedID !== id));
  } catch (error) {
    console.error("Error deleting raspored:", error);
  }
  
 };

  return (
    <div>
      <div className="header">
        <h2>Распоред</h2>
        <button className="btn-add" onClick={() => {setIzmeniRaspored(null); setIsModalOpen(true)}}>
          Додај Распоред
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име</th>
            <th>Измени</th>
            <th>Избриши</th>
          </tr>
        </thead>
        <tbody>
          {rasporedi.length > 0 ? (
            rasporedi.map((raspored, index) => (
              <tr key={raspored.RasporedID}>
                <td>{index + 1}</td>
                <td>{raspored.RasporedIme}</td>
                <td>
                  <button className="btn-delete" onClick={() =>deleteRaspored(raspored.RasporedID)}>
                    Избриши
                  </button>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => IzmeniModal(raspored)}>Измени</button>
                </td>
              </tr>
            ))
          ): (
            <tr>
              <td colSpan="4">Нема податоци</td>
            </tr>
          )}
        </tbody>
      </table>
      <RasporedModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fetchRasporedi={fetchRasporedi}
        raspored={IzmeniRaspored}/>
    </div>
  )
};

export default raspored;