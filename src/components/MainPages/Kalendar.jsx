import React, { useState, useEffect, useMemo } from "react";
import { format } from 'date-fns';
import { mk } from 'date-fns/locale';
import "./MainPages.css"; 
import styles from './kalendar.module.css';
import KalendarModal from "../Modals/KalendarModal";
import axios from "axios";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const Kalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [holidays, setHolidays] = useState([]);
  const [osustvo, setOsustvo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const localStorage_Aktiven = localStorage.getItem("Aktiven");
  const localStorage_CardID = localStorage.getItem("CardID");

  // const osustva_api = "https://rabotnovreme.infinityfreeapp.com/php/osustva.php";
  // const praznici_api = "https://rabotnovreme.infinityfreeapp.com/php/praznici.php";
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    fetchHolidays();
    fetchOsustva();
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

  const fetchOsustva = async () => {
    try {
      const response = await axios.get(osustva_api);
      setOsustvo(response.data);
    } catch (error) {
      console.error("Грешпа при зимање на осуства: ", error);
    }
  };

  const absenceDates = useMemo(() => {
    const filtered = osustvo.filter(o => String(o.CardID) === String(localStorage_CardID) && String(o.Status) === "1");
  
    return filtered.flatMap(item => {
      const start = new Date(item.OdDen);
      const end = new Date(item.DoDen);
      const dates = [];
  
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push({
          Datum: format(new Date(d), 'yyyy-MM-dd'),
          description: item.Pricina || "Одобрено отсуство",
          type: "absence"
        });
      }
      return dates;
    });
  }, [osustvo, localStorage_CardID]);
  

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
      
    const getOsustvoDate = (day) => {
      const dateStr = format(new Date(date.getFullYear(), date.getMonth(), day), 'yyyy-MM-dd');
      return absenceDates.find(abs => abs.Datum === dateStr);
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
                  const holiday = (day ? getHolidayForDate(day) : null)||(day ? getOsustvoDate(day) : null);
  
                  return (
                    <td
                      key={colIndex}
                      className={`${styles.cell} ${day === date.getDate() ? styles.selected : ''} ${
                        holiday?.type === 'absence' ? styles.absence : holiday ? styles.holiday : ''
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
        {localStorage_Aktiven === "1" &&
          <button className="btn-add" onClick={openModal}>Додај нов празник</button>
        }
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
