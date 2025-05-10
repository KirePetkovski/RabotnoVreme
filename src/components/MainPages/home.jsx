import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainPages.css";


const HomePage = () => {

  const [Sektor, setSektor] = useState([]);
  const [Raspored, setRaspored] = useState([]);
  const [Prisustvo, setPrisustvo] = useState([]);

  const days = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok", "Sabota", "Ponedelnik"];
  const utreshenDen = days[new Date().getDay()];

  const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
  const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";
  const prisustvo_api = "https://rabotnovreme.infinityfreeapp.com/php/prisustvo.php";

  useEffect(() => {
    
   // console.log("Login najaven object:", localStorage);
    fetchAllData();
  }, []);
  const fetchAllData = async () => {
    const localStorage_SektorID = localStorage.getItem('SektorID');
    const localStorage_RasporedID = localStorage.getItem('RasporedID');
    const localStorage_CardID = JSON.parse(localStorage.getItem('CardID'));


    try {
      const [prisustvoRes, sektoriRes, rasporedRes] = await Promise.all([
        axios.get(prisustvo_api),
        axios.get(sektori_api),
        axios.get(raspored_api),
      ]);

      const prisustvoData = prisustvoRes.data || [];
      const sektoriData = sektoriRes.data || [];
      const rasporedData = rasporedRes.data || [];
      console.log("sektoriData", sektoriData);
      console.log("localStorage_SektorID", localStorage_SektorID);

      console.log("rasporedData", rasporedData);
      console.log("localStorage_RasporedID", localStorage_RasporedID);

      const pom_sektor = sektoriData.find((s) => String(s.SektorID) === String(localStorage_SektorID));
      const pom_raspored = rasporedData.find((r) => {
        return String(r.RasporedID) === String( localStorage_RasporedID); 
      });
      //vaka e samo za eden zapis    
      //const pom_prisustvo = prisustvoData.find((p) => String(p.CardID) === String(localStorage_CardID));
        const today = new Date().toISOString().split("T")[0];

        const userPrisustvo = prisustvoData.filter(p => {
          return String(p.CardID) === String(localStorage_CardID) && p.Vreme.startsWith(today);
        });

        const pom_prisustvo = {};
        userPrisustvo.forEach((entry) => {
          const current = pom_prisustvo[entry.TipAkcija];
          if (!current || new Date(entry.Vreme) > new Date(current.Vreme)) {
            pom_prisustvo[entry.TipAkcija] = entry;
          }
        });

      // console.log("pom_sektor", pom_sektor);
      // console.log("pom_raspored", pom_raspored);
      console.log("pom_prisustvo", pom_prisustvo);

      
      setSektor(pom_sektor);
      setRaspored(pom_raspored);
      setPrisustvo(pom_prisustvo);

      console.log("prisustvoData", prisustvoData);
    } catch (error) {
      console.error("Error merging data:", error);
    }
  };

  function PresmetajPauza(start, end) {
    if (!start || !end) return null;

    console.log("START-END", start, end);
    start = String(start).trim();
    end = String(end).trim();
    console.log("TRIM", start, end);
    const startDate = new Date(`2025-01-01T${start}`);
    const endDate = new Date(`2025-01-01T${end}`);
    console.log("DATE", startDate, endDate);
    const diffMs = endDate - startDate;
    const diffMins = Math.floor(diffMs / 60000);
  
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return (

    <div className="stats-container">
    <div className="stat-card">
      <h2>Име Презиме</h2>
      <h2>{localStorage.getItem('ImePrezime') || "Не сте најавени"}</h2>
    </div>
    <div className="stat-card">
      <h2>Сектор</h2>
      <h2>{Sektor?.SektorIme || "Не сте најавени"}</h2>
    </div>
  
    <div className="stat-card">
      <h2>Влез</h2>
      <h2>{Prisustvo["Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Излез</h2>
      <h2>{Prisustvo["Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Пауза Излез</h2>
      <h2>{Prisustvo["Pauza_Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Пауза Влез</h2>
      <h2>{Prisustvo["Pauza_Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Пауза</h2>
      <h2>{PresmetajPauza(
            Prisustvo["Pauza_Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16),
            Prisustvo["Pauza_Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16)
          ) || "Нема податок"}</h2>
    </div>
    <div></div>
    <div className="stat-card">
      <h2>Приватен излез</h2>
      <h2>{Prisustvo["Privaten_Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Приватен влез</h2>
      <h2>{Prisustvo["Privaten_Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Службен излез</h2>
      <h2>{Prisustvo["Sluzben_Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Службен Влез</h2>
      <h2>{Prisustvo["Sluzben_Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
    </div>
    <div className="stat-card">
      <h2>Изработени часови за оваа недела</h2>
      <p>{""}</p>
    </div>
    <div className="stat-card">
      <h2>Потребно е да се изработат уште</h2>
      <p>{""}</p>
    </div>
    <div className="stat-card">
      <h2>Следен не работен ден</h2>
      <p>{""}</p>
    </div>
    <div className="stat-card">
      <h2>Утре почнувате во</h2>
      <h2>{Raspored?.[utreshenDen] || "Не сте најавени"}</h2>
    </div>
    <div>
      <h2>Нотификации</h2>
      <p>{""}</p>
    </div>
  </div>
  

    // <div>
    //   <p>HOME PAGE</p>
    //   <br />
    //   <br />
    //   <p>Administratorot - pregled na prisustvo, pauzi, otsustvo, sluzbeni izlezi, prakja notifikacija za saati koj treba da se dorabotat, prakja mail izvestuvanje i gleda ushte koj funkcionalnosti koj kje gi dodadam niz stranive</p>
    //   <br />
    //   <br />
    //   <p>Vraboten - gleda koga se kucnal, kojku saat ima raboteno na mesecno nivo, gleda notifikacii, i moze ushte nekoja funkcionalnost da dodam tuka</p>
    // </div>
  );
};

export default HomePage;
