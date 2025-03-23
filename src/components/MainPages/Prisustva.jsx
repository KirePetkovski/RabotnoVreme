import React from "react";
import "./MainPages.css";

function Prisustva() {
  return (
    <div>
      <header className="header">
        <h1>Преглед на присутност</h1>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Број на вработени</h2>
          <p>24</p>
        </div>
        <div className="stat-card">
          <h2>Присутни</h2>
          <p>16</p>
        </div>
        <div className="stat-card">
          <h2>Отсуствa / приватни излези</h2>
          <p>2</p>
        </div>
        <div className="stat-card">
          <h2>Вкупно приватни излези</h2>
          <p>9</p>
        </div>
      </div>

      <div className="search">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Пребарај вработен" />
        </div>
        <div className="date-range">
          <label htmlFor="date" className="date-label">Пребарај по датум </label>
          <input type="date" id="date" className="date-input" />
        </div>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>Име и Презиме</th>
            <th>Влез</th>
            <th>Пауза</th>
            <th>Службен излез</th>
            <th>Приватен излез</th>
            <th>Излез</th>
            <th>Измени</th>
          </tr>
        </thead>
        <tbody>
         
        </tbody>
      </table>
    </div>
  );
}

export default Prisustva;
