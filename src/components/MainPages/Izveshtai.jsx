import React, { useState } from "react";
import "./MainPages.css";

const Izveshtai = () => {
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    // startDate: "",
    // endDate: "",
    // employee: "",
    // department: "",   
    reportTypes: [],   
  });

  const showPrisustvo = filters.reportTypes.includes("prisustvo");
  const showOtsustvo = filters.reportTypes.includes("otsustvo");
  const showPrivateOut = filters.reportTypes.includes("privateOut");
  const showBusinessOut = filters.reportTypes.includes("businessOut");
  const showBrakeOut = filters.reportTypes.includes("brakeOut");
  const showWorkingHours = filters.reportTypes.includes("workingHours");
  const showOverTimeHours = filters.reportTypes.includes("overTime")

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReportTypeChange = (type) => {
    setFilters((prev) => {
      const reportTypes = prev.reportTypes.includes(type)
        ? prev.reportTypes.filter((t) => t !== type)
        : [...prev.reportTypes, type];
      return { ...prev, reportTypes };
    });
  };

  return (
    <div >
      <h2>Извештаи</h2>

      <button
        className="btn-add"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Скриј филтри" : "Прикажи филтри"}
      </button>

      {showFilters && (
        <form className="filters-form">
         <table className="filter-group">
  <tbody>
    <tr>
      <td><label>Од датум:</label></td>
      <td>
        <input type="date" name="startDate" onChange={handleFilterChange} />
      </td>
      <td><label>До датум:</label></td>
      <td>
        <input type="date" name="endDate" onChange={handleFilterChange} />
      </td>
      <td rowSpan="7">
        <div className="report-type-multi">
        <label>Тип на извештај:</label>
          <label>
            <input type="checkbox" checked={showPrisustvo} onChange={() => handleReportTypeChange("prisustvo")} />
            Присуство
          </label>
          <label>
            <input type="checkbox" checked={showOtsustvo} onChange={() => handleReportTypeChange("otsustvo")} />
            Осутни
          </label>
          <label>
            <input type="checkbox" checked={showBrakeOut} onChange={() => handleReportTypeChange("brakeOut")} />
            Пауза
          </label>
          <label>
            <input type="checkbox" checked={showPrivateOut} onChange={() => handleReportTypeChange("privateOut")} />
            Приватно излез
          </label>
          <label>
            <input type="checkbox" checked={showBusinessOut} onChange={() => handleReportTypeChange("businessOut")} />
            Службено излез
          </label>
          <label>
            <input type="checkbox" checked={showWorkingHours} onChange={() => handleReportTypeChange("workingHours")} />
            Работни часови
          </label>
          <label>
            <input type="checkbox" checked={showOverTimeHours} onChange={() => handleReportTypeChange("overTime")} />
            Преку времени часови
          </label>
        </div>
      </td>
    </tr>
    <tr>
      <td><label>Вработен:</label></td>
      <td colSpan="3">
        <input type="text" name="employee" placeholder="Име на вработен" onChange={handleFilterChange} />
      </td>
    </tr>
    <tr>
      <td><label>Сектор:</label></td>
      <td colSpan="3">
        <select name="department" onChange={handleFilterChange}>
          <option value="">-- Избери Сектор --</option>
          <option>Информатички технологии</option>
          <option>Човечки ресурси</option>
        </select>
      </td>
    </tr>
    <tr><td>" "</td><td>" "</td></tr>
    <tr><td>" "</td><td>" "</td></tr>
    <tr><td>" "</td><td>" "</td></tr>
    <tr><td>" "</td><td>" "</td></tr>
  </tbody>
</table>

        </form>
      )}

      <div>
        <table className="main-table">
          <thead>
            <tr>
              <th>Име и Презиме</th>
              <th>Дата</th>
              <th>Влез</th>
              {showBrakeOut && <th colSpan="2">Пауза</th>}
              {showBusinessOut && <th colSpan="2">Службен излез</th>}
              {showPrivateOut && <th colSpan="2">Приватен излез</th>}
              <th>Излез</th>
              {showWorkingHours && <th>Работни часови</th>}
              {showOverTimeHours && <th>Преку времени часови</th>}
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              {showBrakeOut && (
                <>
                  <th>Излез</th>
                  <th>Влез</th>
                </>
              )}
              {showBusinessOut && (
                <>
                  <th>Излез</th>
                  <th>Влез</th>
                </>
              )}
              {showPrivateOut && (
                <>
                  <th>Излез</th>
                  <th>Влез</th>
                </>
              )}
              <th></th>
              {showWorkingHours &&(<th></th>)}
              {showOverTimeHours &&(<th></th>)}
            </tr>
          </thead>
          <tbody>
           
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Izveshtai;
