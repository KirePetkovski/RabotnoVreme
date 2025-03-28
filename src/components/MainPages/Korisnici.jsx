import React, { useState, useEffect } from "react";
import "./MainPages.css"
import KorisniciModal from "../Modals/KorisniciModal";

const Korisnici = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  

  return (
    <div>
      <div className="header">
        <h2>Корисници</h2>
        <button className="btn-add"  onClick={openModal}>
          Додај корисник
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Корисничко име</th>
            <th>Е-пошта</th>
            <th>Улога</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
      <KorisniciModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </div>
  );
};

export default Korisnici;
