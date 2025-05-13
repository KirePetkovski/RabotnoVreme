import React, { useEffect, useState } from "react";
import { format, startOfWeek, addDays, endOfWeek, eachDayOfInterval } from 'date-fns';
import { mk } from 'date-fns/locale';
import axios from "axios";
import "./MainPages.css";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";



const HomePage = () => {

  const [Sektor, setSektor] = useState([]);
  const [Raspored, setRaspored] = useState([]);
  const [Prisustvo, setPrisustvo] = useState([]);
  const [DenSloboden, setDenSloboden] = useState([]);
  const [brojIzraboteniCasovi, setbrojIzraboteniCasovi] = useState(0);


  const days = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok", "Sabota", "Ponedelnik"];
  const utreshenDen = days[new Date().getDay()];

  // const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
  // const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";
  // const prisustvo_api = "https://rabotnovreme.infinityfreeapp.com/php/prisustvo.php";
  // const praznici_api = "https://rabotnovreme.infinityfreeapp.com/php/praznici.php";

  useEffect(() => {
    // console.log("Login najaven object:", localStorage);
    fetchAllData();
  }, []);
  const fetchAllData = async () => {
    const localStorage_SektorID = localStorage.getItem('SektorID');
    const localStorage_RasporedID = localStorage.getItem('RasporedID');
    const localStorage_CardID = JSON.parse(localStorage.getItem('CardID'));


    try {
      const [prisustvoRes, sektoriRes, rasporedRes, prazniciRes] = await Promise.all([
        axios.get(prisustvo_api),
        axios.get(sektori_api),
        axios.get(raspored_api),
        axios.get(praznici_api)
      ]);

      const prisustvoData = prisustvoRes.data || [];
      const sektoriData = sektoriRes.data || [];
      const rasporedData = rasporedRes.data || [];
      const prazniciData = prazniciRes.data || [];

      // console.log("sektoriData", sektoriData);
      // console.log("localStorage_SektorID", localStorage_SektorID);
      // console.log("rasporedData", rasporedData);
      // console.log("localStorage_RasporedID", localStorage_RasporedID);

      const pom_sektor = sektoriData.find((s) => String(s.SektorID) === String(localStorage_SektorID));
      const pom_raspored = rasporedData.find((r) => {
        return String(r.RasporedID) === String(localStorage_RasporedID);
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
      //console.log("pom_prisustvo", pom_prisustvo);


      setSektor(pom_sektor);
      setRaspored(pom_raspored);
      setPrisustvo(pom_prisustvo);
      const sledenDenSloboden = najdiSledenDenZaOdmor(prazniciData);
      setDenSloboden(sledenDenSloboden);
      NedelniCasovi(prazniciData);

      const result = calculateWeeklyPresence(Prisustvo, Raspored);
      console.log(result.NedelniSaati, result.PrekuvremeniNedela);

      //console.log("prisustvoData", prisustvoData);
    } catch (error) {
      console.error("Error merging data:", error);
    }
  };

  function PresmetajPauza(start, end) {
    if (!start || !end) return null;

    //console.log("START-END", start, end);
    start = String(start).trim();
    end = String(end).trim();
    //console.log("TRIM", start, end);
    const startDate = new Date(`2025-01-01T${start}`);
    const endDate = new Date(`2025-01-01T${end}`);
    // console.log("DATE", startDate, endDate);
    const diffMs = endDate - startDate;
    const diffMins = Math.floor(diffMs / 60000);

    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  function najdiSledenDenZaOdmor(praznici) {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st of this year
    console.log("praznici", praznici);
    while (today <= endOfYear) {
      const isoDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const isHoliday = praznici.some(p => String(p.Datum) === String(isoDate));

      if (isHoliday) {
        return new Date(today);
      }

      today.setDate(today.getDate() + 1);
    }

    return "Нема предстоен одмор до крајот на годината";
  }

  const getDatumiZaCelaNedela = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); //Pocni od Ponedelnik
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
  };

  function NedelniCasovi(praznici) {
    let casovi = 40;
    console.log("praznici", praznici);
    const weekDates = getDatumiZaCelaNedela();
    console.log("weekDates", weekDates);
    const prazniciVoNedelata = praznici.filter(p =>
      weekDates.includes(p.Datum)
    );
    casovi -= prazniciVoNedelata.length*8;
    // console.log("Broj na praznici vo ovaa nedela:", prazniciVoNedelata.length);
    setbrojIzraboteniCasovi(prazniciVoNedelata.length);

    return casovi;
  }
const calculateWeeklyPresence = (Prisustvo, Raspored) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const formatHours = (decimalHours) => {
    let hours = Math.floor(decimalHours);
    let minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

  let totalHours = 0;
  let totalOvertime = 0;

  const getScheduleForDay = (dayOfWeek) => {
    switch (dayOfWeek) {
      case 1: return Raspored.Ponedelnik;
      case 2: return Raspored.Vtornik;
      case 3: return Raspored.Sreda;
      case 4: return Raspored.Cetvrtok;
      case 5: return Raspored.Petok;
      case 6: return Raspored.Sabota;
      default: return null;
    }
  };

  days.forEach(day => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const zapis = Prisustvo[dateKey] || {};

    const vlegol = zapis.Vlez;
    const izlegol = zapis.Izlez;
    const pauzaIzlez = zapis.Pauza_Izlez;
    const pauzaVlez = zapis.Pauza_Vlez;

    if (!vlegol || !izlegol) return;

    // parse real clock times
    const VremeVlegol = new Date(`2025-01-01T${vlegol}`);
    const VremeIzlegol = new Date(`2025-01-01T${izlegol}`);
    const VremePauzaIzlez = pauzaIzlez ? new Date(`2025-01-01T${pauzaIzlez}`) : null;
    const VremePauzaVlez = pauzaVlez ? new Date(`2025-01-01T${pauzaVlez}`) : null;

    // Determine schedule based on day
    const dayOfWeek = day.getDay(); // 1 = Monday
    const daySchedule = getScheduleForDay(dayOfWeek);
    if (!daySchedule) return;

    const rasporedStartTime = daySchedule.split("-")[0]; // Example format: "08:00-16:00"
    const rasporedEndTime = daySchedule.split("-")[1];

    const RasporedPocetok = new Date(`2025-01-01T${rasporedStartTime}`);
    const RasporedKraj = new Date(`2025-01-01T${rasporedEndTime}`);

    const RasporedPauzaPocetok = new Date(`2025-01-01T${Raspored.PauzaPocetok}`);
    const RasporedPauzaKraj = new Date(`2025-01-01T${Raspored.PauzaKraj}`);

    const timeParts = Raspored.PauzaVreme ? Raspored.PauzaVreme.split(":") : ["0", "00"];
    const dozvoleniMinitiPauza = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

    // Total work time
    let rabotniSaati = (VremeIzlegol - VremeVlegol) / (1000 * 60 * 60);
    let vkupnoRabotniSaati = 0;
    let vkupnoPrekuvremeniSaati = 0;

    const rasporedSaati = (RasporedKraj - RasporedPocetok) / (1000 * 60 * 60);
    vkupnoRabotniSaati = Math.min(rabotniSaati, rasporedSaati);
    vkupnoPrekuvremeniSaati = Math.max(0, rabotniSaati - rasporedSaati);

    // Pause logic
    let minutiPredVreme = 0, minutiPosleVreme = 0, pauza = 0;

    if (VremePauzaIzlez && VremePauzaVlez) {
      pauza = (VremePauzaVlez - VremePauzaIzlez) / 60000;

      if (VremePauzaIzlez < RasporedPauzaPocetok) {
        minutiPredVreme = Math.round((RasporedPauzaPocetok - VremePauzaIzlez) / 60000);
      }

      if (VremePauzaVlez > RasporedPauzaKraj) {
        minutiPosleVreme = Math.round((VremePauzaVlez - RasporedPauzaKraj) / 60000);
      }
    }

    const povekjeMinuti = Math.max(0, pauza - dozvoleniMinitiPauza - minutiPredVreme - minutiPosleVreme);
    const minutiPauza = minutiPredVreme + minutiPosleVreme + povekjeMinuti;

    vkupnoRabotniSaati -= minutiPauza / 60;
    vkupnoRabotniSaati = Math.max(0, vkupnoRabotniSaati);

    totalHours += vkupnoRabotniSaati;
    totalOvertime += vkupnoPrekuvremeniSaati;
  });

  return {
    NedelniSaati: formatHours(totalHours),
    PrekuvremeniNedela: formatHours(totalOvertime)
  };
};



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
        <h2>Празници во неделата</h2>
        <p>{brojIzraboteniCasovi}</p>
      </div>

      <div className="stat-card">
        <h2>Следен не работен ден</h2>
        <p>
          {DenSloboden instanceof Date
            ? format(DenSloboden, 'eeee, d LLLL yyyy', { locale: mk })
            : DenSloboden}
        </p>
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
