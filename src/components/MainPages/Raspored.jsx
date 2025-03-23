import React from 'react';

const raspored = () => {

  return (
    <div>
      <div className="header">
        <h2>Распоред</h2>
        <p><i>Razlicno da se presmetuva rabonoto vreme. Primer za Administracija koja raboti od 8 do 16 razlicno da se presmetuva za higienicari koi rabotat od 6 do 14. </i></p>
        <button className="btn-add">
          Додај Распоред
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име</th>
            <th>Уреди</th>
            <th>Острани</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  )};

export default raspored;