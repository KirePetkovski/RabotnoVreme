import React, { useEffect, useState } from "react";
import { format, startOfWeek, addDays, endOfWeek, eachDayOfInterval } from 'date-fns';
import { mk } from 'date-fns/locale';
import axios from "axios";
import "./MainPages.css";
import IzvestuvanjeModal from "../Modals/IzvestuvanjeModal";
import {izvestuvanje_api, sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";



const HomePage = () => {

  const [Sektor, setSektor] = useState([]);
  const [Raspored, setRaspored] = useState([]);
  const [Prisustvo, setPrisustvo] = useState([]);
  const [DenSloboden, setDenSloboden] = useState([]);
  const [izvestuvanja, setIzvestuvanja] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;
  const [brojIzraboteniCasovi, setbrojIzraboteniCasovi] = useState(0);
  const [nedelniSaati, setNedelniSaati] = useState([]);
  const [PrekuvremeniNedela, setPrekuvremeniNedela] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const days = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok", "Sabota", "Ponedelnik"];
  const utreshenDen = days[new Date().getDay()];
  const deneshenDen = new Date().toISOString().split("T")[0];
  const localStorage_ImePrezime = localStorage.getItem('ImePrezime');


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
      const [prisustvoRes, sektoriRes, rasporedRes, prazniciRes, izvestRes] = await Promise.all([
        axios.get(prisustvo_api),
        axios.get(sektori_api),
        axios.get(raspored_api),
        axios.get(praznici_api),
        axios.get(izvestuvanje_api)
      ]);

      const prisustvoData = prisustvoRes.data || [];
      const sektoriData = sektoriRes.data || [];
      const rasporedData = rasporedRes.data || [];
      const prazniciData = prazniciRes.data || [];
      const izvestData = izvestRes.data || [];

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

      const celoPrisustvo = prisustvoData.filter(p => {
        return String(p.CardID) === String(localStorage_CardID);
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
      setIzvestuvanja([...izvestData].reverse());


      //console.log("RASPORED", pom_raspored);
      const result = calculateWeeklyPresence(celoPrisustvo, pom_raspored);
      setNedelniSaati(result.NedelniSaati);
      setPrekuvremeniNedela(result.PrekuvremeniNedela);
      //console.log("NEDELNI SAATI ",result.NedelniSaati, "PREKUVREMENI ", result.PrekuvremeniNedela);

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
    // console.log("praznici", praznici);
    while (today <= endOfYear) {
      const isoDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const isHoliday = praznici.some(p => String(p.Datum) === String(isoDate));

      if (isHoliday) {
        return new Date(today);
      }

      today.setDate(today.getDate() + 1);
    }

    return "/";
  }

  const getDatumiZaCelaNedela = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); //Pocni od Ponedelnik
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
  };

  function NedelniCasovi(praznici) {
    let casovi = 40;
    //console.log("praznici", praznici);
    const weekDates = getDatumiZaCelaNedela();
    //console.log("weekDates", weekDates);
    const prazniciVoNedelata = praznici.filter(p =>
      weekDates.includes(p.Datum)
    );
    casovi -= prazniciVoNedelata.length * 8;
    // console.log("Broj na praznici vo ovaa nedela:", prazniciVoNedelata.length);
    setbrojIzraboteniCasovi(prazniciVoNedelata.length);

    return casovi;
  }

  const calculateWeeklyPresence = (Prisustvo, Raspored) => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const formatMinutes = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}:${String(minutes).padStart(2, '0')}`;
    };

    const getScheduleForDay = (dayOfWeek) => {
      switch (dayOfWeek) {
        case "1": return Raspored.Ponedelnik;
        case "2": return Raspored.Vtornik;
        case "3": return Raspored.Sreda;
        case "4": return Raspored.Cetvrtok;
        case "5": return Raspored.Petok;
        case "6": return Raspored.Sabota;
        case "0": return Raspored.Nedela;
        default: return null;
      }
    };

    let totalMinutesWorked = 0;
    let vkupnoPrekuvremeniSaati = 0;

    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const recordsForDay = Prisustvo.filter(p => p.Vreme.startsWith(dateKey));

      const getTime = (type) =>
        recordsForDay.find(p => p.TipAkcija === type)?.Vreme?.split(' ')[1] || null;

      const vlegol = getTime('Vlez');
      const izlegol = getTime('Izlez');
      const pauzaIzlez = getTime('Pauza_Izlez');
      const pauzaVlez = getTime('Pauza_Vlez');

      if (!vlegol || !izlegol) {
        return { rabotel: "0:00", prekuvremeno: "0:00" };
      }

      // const VremeVlegol = new Date(`2025-01-01T${vlegol}`);
      // const VremeIzlegol = new Date(`2025-01-01T${izlegol}`);
      // const VremePauzaIzlez = new Date(`2025-01-01T${pauzaIzlez}`);
      // const VremePauzaVlez = new Date(`2025-01-01T${pauzaVlez}`);
      // //let workedMinutes = outTime - inTime;

      const dayOfWeek = String(day.getDay());
      const daySchedule = getScheduleForDay(dayOfWeek);
      if (!daySchedule) return;

      const [rasporedStartStr] = daySchedule.split("-");
      const RasporedPocetok = toMinutes(rasporedStartStr);

      const [workH, workM] = Raspored.RabotnoVreme.split(":").map(Number);
      const RasporedKraj = RasporedPocetok + (workH * 60 + workM);



      const minVlegol = toMinutes(vlegol);
      console.log(minVlegol);
      const minIzlegol = toMinutes(izlegol);

      if (minVlegol < RasporedPocetok)
        vkupnoPrekuvremeniSaati += RasporedPocetok - minVlegol;

      if (minIzlegol > RasporedKraj)
        vkupnoPrekuvremeniSaati += minIzlegol - RasporedKraj;

      let overlapStart = Math.max(minVlegol, RasporedPocetok);
      let overlapEnd = Math.min(minIzlegol, RasporedKraj);
      let vkupnoRabotniSaati = Math.max(0, overlapEnd - overlapStart);

      let pauzaVoMin = toMinutes(pauzaVlez) - toMinutes(pauzaIzlez);
      pauzaVoMin = isNaN(pauzaVoMin) ? 0 : pauzaVoMin;

      const dozvoleniMinitiPauza = toMinutes(Raspored.PauzaVreme);
      const RasporedPauzaPocetokMin = toMinutes(Raspored.PauzaPocetok);
      const RasporedPauzaKrajMin = toMinutes(Raspored.PauzaKraj);

      let minutiPredVreme = 0, minutiPosleVreme = 0;
      if (toMinutes(pauzaIzlez) < RasporedPauzaPocetokMin)
        minutiPredVreme = RasporedPauzaPocetokMin - toMinutes(pauzaIzlez);

      if (toMinutes(pauzaVlez) > RasporedPauzaKrajMin)
        minutiPosleVreme = toMinutes(pauzaVlez) - RasporedPauzaKrajMin;

      const earlyLateTogether = minutiPredVreme + minutiPosleVreme;
      const ekstraPauzaMinuti = Math.max(0, pauzaVoMin - dozvoleniMinitiPauza);
      const dodatnoZaKazna = Math.max(0, ekstraPauzaMinuti - earlyLateTogether);
      const minutiZaOdzemanje = earlyLateTogether + dodatnoZaKazna;

      const effectiveMinutes = Math.max(0, vkupnoRabotniSaati - minutiZaOdzemanje);
      totalMinutesWorked += effectiveMinutes;

    });



    return {
      NedelniSaati: formatMinutes(totalMinutesWorked),
      PrekuvremeniNedela: formatMinutes(vkupnoPrekuvremeniSaati)
    };
  };


  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = izvestuvanja.slice(indexOfFirstNotification, indexOfLastNotification);


  return (
    <div>
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
          <h2>Пауза излез</h2>
          <h2>{Prisustvo["Pauza_Izlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
        </div>
        <div className="stat-card">
          <h2>Пауза влез</h2>
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
          <h2>Службен влез</h2>
          <h2>{Prisustvo["Sluzben_Vlez"]?.Vreme?.split("T")[0]?.slice(10, 16) || "Нема податок"}</h2>
        </div>
        <div className="stat-card">
          <h2>Работни часови за тековна недела</h2>
          <p>{nedelniSaati}</p>
        </div>
        <div className="stat-card">
          <h2>Прекувремени часови за тековна недела</h2>
          <p>{PrekuvremeniNedela}</p>
        </div>

        <div className="stat-card">
          <h2>Следен неработен ден</h2>
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
      </div>
      <div className="stat-card-big">
        <div className="header">
          <h1>Известувања</h1>
          <button className="btn-add" onClick={() => { setIsModalOpen(true); }}>
              Додај известување
            </button>
          <div className="Buttons-Izvestuvanja">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Предходни
            </button>
            <i>
            Страна {currentPage} од {Math.ceil(izvestuvanja.length / notificationsPerPage)}
            </i>
            <button
              onClick={() => setCurrentPage(prev => {
                const totalPages = Math.ceil(izvestuvanja.length / notificationsPerPage);
                return Math.min(prev + 1, totalPages);
              })}
              disabled={currentPage === Math.ceil(izvestuvanja.length / notificationsPerPage)}
            >
              Следни
            </button>
          </div>
        </div>
        <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Испратено од</th>
            <th>Известување</th>
            <th>Датум</th>
          </tr>
        </thead>
        <tbody>

        {currentNotifications.length > 0 ? (
          currentNotifications.map((izv, index) => (
            <tr key={izv.IzvetuvanjeID ?? `fallback-${index}`}>
                <td>{index + 1}</td>
                <td>{izv.PratenoOd}</td>
                <td>{izv.Sodrzina}</td>
                <td>{izv.Datum}</td>
            
            </tr>
          ))
        ) : (
          <tr>
          <td colSpan="4">Нема податоци</td>
        </tr>
        )}

</tbody>
</table>

       
      </div>
      <IzvestuvanjeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        PratenoOd = {localStorage_ImePrezime}
      />

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
