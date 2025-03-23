import React, { useState } from "react";
import "./MainPages.css";

const Sektor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
{/* Vidi go css i proveri kako da se stavi vi poseben folder */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Додај нов сектор</h3>
            <form>
              <input
                type="text"
                placeholder="Име на сектор"
                required
              />
              <textarea
                placeholder="Опис на сектор"
                rows="3"
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-add"
                  onClick={closeModal}
                >
                  Зачувај
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={closeModal}
                >
                  Откажи
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sektor;
