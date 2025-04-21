import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { mk } from 'date-fns/locale';
import "./MainPages.css"; 
import styles from './kalendar.module.css';
import KalendarModal from "../Modals/KalendarModal";
import axios from "axios";


const Kalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const praznici_api = "https://rabotnovreme.infinityfreeapp.com/php/praznici.php";
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = () => {
    axios
      .get(praznici_api)
      .then((response) => {
        const holidayData = Array.isArray(response.data) ? response.data : [];
        setHolidays(holidayData);
        console.log(holidayData);
      })
      .catch((error) => console.error('Failed to fetch holidays:', error));
  };

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
  
    const getHolidayForDate = (day) => {
      const holidayDate = format(new Date(date.getFullYear(), date.getMonth(), day), 'yyyy-MM-dd');
      return holidays.find((holiday) => holiday.Datum === holidayDate);
    };
  
    return (
      <div>
        <div className={styles.header}>
          <button className={styles.navButton} onClick={handlePreviousMonth}>
            &lt; Претходен
          </button>
          <h2 className={styles.monthHeader}>{format(date, 'LLLL yyyy', { locale: mk })}</h2>
          <button className={styles.navButton} onClick={handleNextMonth}>
            Следен &gt;
          </button>
        </div>
        <table className={styles.calendarTable}>
          <thead>
            <tr>
              {daysOfWeek.map((day, index) => (
                <th key={index} className={styles.dayHeader}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
                  const holiday = day ? getHolidayForDate(day) : null;
  
                  return (
                    <td
                      key={colIndex}
                      className={`${styles.cell} ${day === date.getDate() ? styles.selected : ''} ${
                        holiday ? styles.holiday : ''
                      }`}
                      title={holiday ? holiday.description : ''}
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
      <div className={styles.yearView}>
        <div className={styles.header}>
          <button className={styles.navButton} onClick={handlePreviousYear}>
            &lt; Претходна година
          </button>
          <h2 className={styles.monthHeader}>{date.getFullYear()}</h2>
          <button className={styles.navButton} onClick={handleNextYear}>
            Следна година &gt;
          </button>
        </div>
        <div className={styles.yearGrid}>
          {months.map((month, index) => {
            const monthDays = getMonthDays(month.getFullYear(), month.getMonth());

            return (
              <div
                key={index}
                className={styles.monthContainer}
                onClick={() => {
                  setDate(month);
                  setView('month');
                }}
              >
                <h3 className={styles.monthName}>{format(month, 'LLLL', { locale: mk })}</h3>
                <table className={styles.calendarTable}>
                  <thead>
                    <tr>
                      {daysOfWeek.map((day, idx) => (
                        <th key={idx} className={styles.cellSmall}>
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil(monthDays.length / 7) }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {monthDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => (
                          <td key={colIndex} className={styles.cellSmall}>
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
    <div className="KalendarTabela">
      <div className="header">
      <h2>Календар</h2>
      <button className="btn-add" onClick={openModal}>Додај нов празник</button>
      </div>
    
      <button onClick={() => setView(view === 'month' ? 'year' : 'month')}>
        {view === 'month' ? 'Преглед на година' : 'Преглед на месец'}
      </button>
      {view === 'month' ? renderMonthView() : renderYearView()}

      <KalendarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
 
};

export default Kalendar;
