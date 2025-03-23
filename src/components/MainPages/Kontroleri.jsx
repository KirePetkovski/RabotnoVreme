import React, { useState, useEffect } from "react";
import "./MainPages.css";

const Kontroleri = () => {

  return (
    <div>
      <div className="header">
        <h2>Контролери</h2>
        <button className="btn-add">
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
    </div>
  );
};

export default Kontroleri;