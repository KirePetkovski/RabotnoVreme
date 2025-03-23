import React, { useState, useEffect } from "react";
import "./MainPages.css"; // Ensure consistent styling

const Korisnici = () => {

  return (
    <div>
      <div className="header">
        <h2>Корисници</h2>
        <button className="btn-add">
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

    </div>
  );
};

export default Korisnici;
