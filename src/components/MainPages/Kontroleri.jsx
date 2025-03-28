import React, { useState, useEffect } from "react";
import "./MainPages.css";
import KontroleriModal from "../Modals/KontroleriModal";

const Kontroleri = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
    
      const openModal = () => {
        setIsModalOpen(true);
      };

  return (
    <div>
      <div className="header">
        <h2>Контролери</h2>
        <button className="btn-add"  onClick={openModal}>
          Додај контролер
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>IP Адреса</th>
            <th>Активен</th>
            <th>Овозможен</th>
            <th>Избриши</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
      <KontroleriModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </div>
  );
};

export default Kontroleri;