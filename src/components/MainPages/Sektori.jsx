import React, { useState } from "react";
import "./MainPages.css";
import SectorModal from "../Modals/SectorModal";

const Sektor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  return (
    <div>
      <div className="header">
        <h1>Сите сектори</h1>
        <button className="btn-add" onClick={openModal}>
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
          <tr>
            <td>1</td>
            <td>ИТ</td>
            <td>15</td>
            <td>Одговорен за техничка поддршка</td>
            <td>
              <button className="btn-delete">Избриши</button>
            </td>
            <td>
              <button className="btn-edit">Измени</button>
            </td>
          </tr>
        </tbody>
      </table>
      <SectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Sektor;
