import React, { useState } from "react";
import "./MainPages.css"; 

const Vraboteni = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Иван Иванов",
      dob: "1990-01-15",
      department: "ИТ",
      position: "Програмер",
      schedule: "Пон-Пет, 9:00-17:00",
      cardNumber: "123456",
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    nationality: "",
    religion: "",
    department: "",
    schedule: "",
    cardNumber: "",
  });

  const handleAddEmployeeClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = employees.length + 1;
    setEmployees([...employees, { ...newEmployee, id: newId, active: true }]);
    setShowModal(false);
    setNewEmployee({
      name: "",
      dob: "",
      nacionality: "",
      religion: "",
      department: "",
      schedule: "",
      cardNumber: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="vraboteni-page">
      <div className="header">
        <h2>Сите вработени</h2>
        <button className="btn-add" onClick={handleAddEmployeeClick}>
          Додај вработен
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Вкупен број</h2>
          <p>24</p>
        </div>
        <div className="stat-card">
          <h2>Активни</h2>
          <p>20</p>
        </div>
        <div className="stat-card">
          <h2>Деактивирани</h2>
          <p>4</p>
        </div>
       
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име и Презиме</th>
            <th>Националност</th>
            <th>Религија</th>
            <th>Сектор</th>
            <th>Распоред</th>
            <th>Број на карта</th>
            <th>Деактивирај</th>
            <th>Избриши</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.nacionality}</td>
              <td>{employee.religion}</td>
              <td>{employee.department}</td>
              <td>{employee.schedule}</td>
              <td>{employee.cardNumber}</td>
              <td>
                <button className="btn-edit" disabled={!employee.active}>
                  {employee.active ? "Деактивирај" : "Активирај"}
                </button>
              </td>
              <td>
                <button className="btn-delete">Избриши</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal - Tuka fali religija i sektorite treba da mi bidat ponudeni*/}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Додај Нов Вработен</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Име и Презиме"
                value={newEmployee.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="nacionality"
                placeholder="Националност"
                value={newEmployee.nacionality}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Сектор"
                value={newEmployee.department}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="schedule"
                placeholder="Распоред"
                value={newEmployee.schedule}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Број на карта"
                value={newEmployee.cardNumber}
                onChange={handleInputChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="add-employee-btn">
                  Зачувај
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
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

export default Vraboteni;
