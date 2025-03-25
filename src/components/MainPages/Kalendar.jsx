import React, { useState } from "react";
import { format } from 'date-fns';
import { mk } from 'date-fns/locale';
import "./MainPages.css"; 


const Kalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const daysOfWeek = ['Пон', 'Вто', 'Сре', 'Чет', 'Пет', 'Саб', 'Нед'];

  const getMonthDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handlePreviousYear = () => {
    setDate(new Date(date.getFullYear() - 1, date.getMonth(), 1));
  };

  const handleNextYear = () => {
    setDate(new Date(date.getFullYear() + 1, date.getMonth(), 1));
  };

  const renderMonthView = () => {
    const days = getMonthDays(date.getFullYear(), date.getMonth());
  
    return (
      <div>
        <div>
          <button onClick={handlePreviousMonth}>
            &lt; Претходен  
            {/* &lt; ova oznacuva strelka < */}
          </button>
          <h2>{format(date, 'LLLL yyyy', { locale: mk })}</h2>
          <button onClick={handleNextMonth}>
            Следен &gt;
          </button>
        </div>
        <table  className="testCalendar">
          <thead>
            <tr>
              {daysOfWeek.map((day, index) => (
                <th key={index}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
  
                  return (
                    <td
                      key={colIndex}
                      onClick={() => day && setDate(new Date(date.getFullYear(), date.getMonth(), day))}
                    >
                      {day || ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(date.getFullYear(), i, 1));

    return (
      <div>
        <div>
          <button onClick={handlePreviousYear}>
            &lt; Претходна година
          </button>
          <h2>{date.getFullYear()}</h2>
          <button onClick={handleNextYear}>
            Следна година &gt;
          </button>
        </div>
        <div>
          {months.map((month, index) => {
            const monthDays = getMonthDays(month.getFullYear(), month.getMonth());

            return (
              <div
                key={index}
                onClick={() => {
                  setDate(month);
                  setView('month');
                }}
              >
                <h3>{format(month, 'LLLL', { locale: mk })}</h3>
                <table  className="testCalendar">
                  <thead>
                    <tr>
                      {daysOfWeek.map((day, idx) => (
                        <th key={idx}>
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil(monthDays.length / 7) }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {monthDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => (
                          <td key={colIndex}>
                            {day || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="header">
      <h2>Календар</h2>
      <button onClick={() => setShowModal(true)} className="btn-add">Додај нов празник</button>
      </div>
    
      <button onClick={() => setView(view === 'month' ? 'year' : 'month')}>
        {view === 'month' ? 'Преглед на година' : 'Преглед на месец'}
      </button>
      {view === 'month' ? renderMonthView() : renderYearView()}
    </div>
  );
 
};

export default Kalendar;
