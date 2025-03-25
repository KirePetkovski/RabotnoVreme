import React from 'react';

const osustva = () => {
  return (
    <div>
      <div>
        <div className="header">
          <h2>Осуства</h2>
          <p><i>Прифати и одби го гледа администратор. Копчето Побарај осуство го гледа вработениот</i></p>
          <button className="btn-add">
            Побарај осуство
          </button>
        </div>

        <table className="main-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Поднесено</th>
              <th>Од ден</th>
              <th>До ден</th>
              <th>Денови</th>
              <th>Причина</th>
              <th>Статус</th>
              <th>Прифати</th>
              <th>Одби</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default osustva;