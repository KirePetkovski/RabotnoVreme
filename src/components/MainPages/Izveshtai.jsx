import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainPages.css";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";

const Izveshtai = () => {
  const [Zapisi, setZapisi] = useState([]);
  const [FiltriraniZapisi, setFiltriraniZapisi] = useState([]); // Vkupnite filtrirani zapisi
  const [vraboteni, setVraboteni] = useState([])
  const [Sektori, setSektori] = useState([])
  const [showFilters, setShowFilters] = useState(true);

  //const sektori_api = "https://rabotnovreme.infinityfreeapp.com/php/sektori.php";
 // const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php";
  //const raspored_api = "https://rabotnovreme.infinityfreeapp.com/php/raspored.php";
  //const prisustvo_api = "https://rabotnovreme.infinityfreeapp.com/php/prisustvo.php";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [prisustvoRes, vrabotenRes, sektoriRes, rasporedRes] = await Promise.all([
          axios.get(prisustvo_api),
          axios.get(vraboteni_api),
          axios.get(sektori_api),
          axios.get(raspored_api),
        ]);
  
        const prisustvoData = prisustvoRes.data || [];
        const vraboteniData = vrabotenRes.data || [];
        const sektoriData = sektoriRes.data || [];
        const rasporedData = rasporedRes.data || [];
  
        setSektori(sektoriData);
  
        // (0 = Sunday, ..., 6 = Saturday)
        //const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        //Vo bazata za Raspored nemam za Nedela pa aplikacijata nema da raboti u nedela
        const days = ["Ponedelnik", "Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok", "Sabota"];
        const todayName = days[new Date().getDay()];
        setVraboteni(vraboteniData);
        const merged = prisustvoData.map((p) => {
          const emp = vraboteniData.find((e) => e.CardID === p.CardID);
          if (!emp) {
            return {
              ...p,
              VrabotenID: null,
              CardID: null,
              SektorID: null,
              RasporedID: null,
              start_time: null,
              end_time: null,
              pauza_start: null,
              pauza_end: null,
              pauza_time: null
            };
          }
  
          const sektor = sektoriData.find((s) => s.SektorID === emp.SektorID); 
          const raspored = rasporedData.find((r) => {
            return String(r.RasporedID) === String(emp.RasporedID); 
          });    
          // console.log("raspored", raspored);
          // console.log("todayName", todayName);
          // console.log("raspored[todayName]", raspored[todayName]);
          // console.log("raspored.RabotnoVreme",  raspored.RabotnoVreme);
        
          let start_time = raspored[todayName];
          let end_time = RabotniSaatizaVraboten(raspored[todayName], raspored.RabotnoVreme);
          let pauza_start = raspored["PauzaPocetok"];
          let pauza_end = raspored["PauzaKraj"];
          let pauza_time = raspored["PauzaVreme"];
          
          return {
            ...p,
            VrabotenID: emp.VrabotenID,
            CardID: emp.CardID,
            SektorID: sektor ? sektor.SektorID : null,
            RasporedID: raspored ? raspored.RasporedID : null,
            start_time,
            end_time,
            pauza_start,
            pauza_end,
            pauza_time,
          };
        });
  
        setZapisi(merged);
        console.log(merged);
      } catch (error) {
        console.error("Error merging data:", error);
      }
    };
  
    fetchAllData();
  }, []);


  //Za chek polinjata
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vraboten: "",
    sektor: "",   
    TipAkcija: [],   
  });

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      FiltrirajZapisi();
    }
  }, [filters.startDate, filters.endDate, filters.sektor, filters.vraboten, filters.TipAkcija]);

  const FiltrirajZapisi = () => {
    if (!filters.startDate || !filters.endDate) return;

    const startDateObj = new Date(filters.startDate);
    const endDateObj = new Date(filters.endDate);
    const dateList = [];
    const tempDate = new Date(startDateObj);
    while (tempDate <= endDateObj) {
      dateList.push(tempDate.toISOString().split("T")[0]);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const groupedData = {};


    Zapisi.forEach((record) => {
      if (filters.sektor) {
        if (parseInt(record.SektorID, 10) !== parseInt(filters.sektor, 10)) {
          return;
        }
      }
    
      const vrabotenObj = vraboteni.find(v => String(v.CardID) === String(record.CardID));
      const fullName = vrabotenObj?.ImePrezime || "";
    
      if (filters.vraboten && !fullName.toLowerCase().includes(filters.vraboten.toLowerCase())) {
        return;
      }
    
      const datePart = record.Vreme.split(" ")[0]; 
      if (datePart < filters.startDate || datePart > filters.endDate) {
        return;
      }
    
      const id = record.CardID;
      const time = new Date(record.Vreme).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    
      if (!groupedData[id]) groupedData[id] = {};
      if (!groupedData[id][datePart]) groupedData[id][datePart] = {};
    
      groupedData[id][datePart][record.TipAkcija] = time;
    });
    
    
    setFiltriraniZapisi({ groupedData, dateList });
  };


  const getDeneshenRaspored = (cardID) => {
    const vraboten = Zapisi.find((zapis) => zapis.CardID.toString() === cardID.toString());

    //console.log("Raspored za vraboten: ", vraboten)
    if (!vraboten) return null; // ako ne e najden 

    return {
        start_time: vraboten.start_time,
        end_time: vraboten.end_time,
        pauza_start: vraboten.pauza_start,
        pauza_end: vraboten.pauza_end,
        pauza_time: vraboten.pauza_time,

    };
};
const toMinutes = (timeStr) => {
  
const dateObj = new Date(timeStr);

const hours = String(dateObj.getHours()).padStart(2, '0');
const minutes = String(dateObj.getMinutes()).padStart(2, '0');

return `${hours}:${minutes}`;
};
  function RabotniSaatizaVraboten(pocnuva, zavrshuva){

    let [PocnuvaCasovi, PocnuvaMinuti] = pocnuva.split(":").map(Number);
    let [RabotiCasovi, RabotiMinuti] = zavrshuva.split(":").map(Number);
  
    let VkupnoMinuti = PocnuvaCasovi * 60 + PocnuvaMinuti + RabotiCasovi * 60 + RabotiMinuti;
  
    let ZavrshuvaSaati = Math.floor(VkupnoMinuti / 60) % 24; 
    let ZavrshuvaMinuti = VkupnoMinuti % 60;
  
    return `${String(ZavrshuvaSaati).padStart(2, '0')}:${String(ZavrshuvaMinuti).padStart(2, '0')}`;
  }
  
  const VremeNaPrisustvo = (vraboten, date, pomZapis) => {
    const vrabotenRaspored = getDeneshenRaspored(vraboten);
    const dnevenZapis = pomZapis[date] || {};
  
    const vlegol = dnevenZapis.Vlez;
    const izlegol = dnevenZapis.Izlez;
    const pauzaIzlez = dnevenZapis.Pauza_Izlez;
    const pauzaVlez = dnevenZapis.Pauza_Vlez;
  
    if (!vlegol || !izlegol) {
      return { rabotel: "0:00", prekuvremeno: "0:00" };
    }
  
    const VremeVlegol = new Date(`2025-01-01T${vlegol}`);
    const VremeIzlegol = new Date(`2025-01-01T${izlegol}`);
    const VremePauzaIzlez = new Date(`2025-01-01T${pauzaIzlez}`);
    const VremePauzaVlez = new Date(`2025-01-01T${pauzaVlez}`);
  
    const RasporedPocetok = new Date(`2025-01-01T${vrabotenRaspored.start_time}`);
    const RasporedKraj = new Date(`2025-01-01T${vrabotenRaspored.end_time}`);
    const RasporedPauzaPocetok = new Date(`2025-01-01T${vrabotenRaspored.pauza_start}`);
    const RasporedPauzaKraj = new Date(`2025-01-01T${vrabotenRaspored.pauza_end}`);
  
  
    // console.log("Vraboten:", vraboten);
    // console.log("Datum:", date);
    // console.log("Dneven zapis:", pomZapis);
    // console.log("Vlegol:",toMinutes(String(VremeVlegol)));
    // console.log("Izlegol:", toMinutes(String(VremeIzlegol)));
    // console.log("Pauza Izlez:", VremePauzaIzlez);
    // console.log("Pauza Vlez:", VremePauzaVlez);
    // console.log("Raspored za vraboteniot:", vrabotenRaspored);
    // console.log("Pocetok:", vlegol);
    // console.log("Kraj:", izlegol);
  
    const timeParts = vrabotenRaspored.pauza_time 
    ? vrabotenRaspored.pauza_time.split(":") : ["0", "00"]; // ako nepostoi go stava 0
    const dozvoleniMinitiPauza = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60;  // ne promenuvaj 60 bidejkji se minuti
  
    let rabotniSaati = (VremeIzlegol - VremeVlegol) / (1000 * 60 * 60); // Convert ms to hours
    let vkupnoRabotniSaati = 0;
    let vkupnoPrekuvremeniSaati = 0;
  
    if (VremeVlegol < RasporedPocetok) vkupnoPrekuvremeniSaati += (RasporedPocetok - VremeVlegol)/ (1000 *60*60);
    if (VremeIzlegol > RasporedKraj) vkupnoPrekuvremeniSaati += (VremeIzlegol - RasporedKraj)/ (1000 *60*60);
  
      // Work counted only within schedule limits
      if (VremeVlegol >= RasporedPocetok && VremeIzlegol <= RasporedKraj) {
        vkupnoRabotniSaati = rabotniSaati;
      } else {
        const overlapStart = Math.max(VremeVlegol, RasporedPocetok);
        const overlapEnd = Math.min(VremeIzlegol, RasporedKraj);
        vkupnoRabotniSaati = Math.max(0,(overlapEnd - overlapStart) / (1000 *60*60));
      }
  
      let pauzaVoSati = (VremePauzaVlez - VremePauzaIzlez) / (1000 * 60 * 60);
      pauzaVoSati = isNaN(pauzaVoSati) ? 0 : pauzaVoSati;
      
      
      let minutiPredVreme = 0, minutiPosleVreme = 0;
      if (VremePauzaIzlez < RasporedPauzaPocetok) {
        minutiPredVreme = (RasporedPauzaPocetok - VremePauzaIzlez) / (1000 * 60);
      }
      if (VremePauzaVlez > RasporedPauzaKraj) {
        minutiPosleVreme = (VremePauzaVlez - RasporedPauzaKraj) / (1000 * 60);
      }
      
      const earlyLateTogether = minutiPredVreme + minutiPosleVreme;
      
      const totalPauseMin = pauzaVoSati * 60;
      const allowedPauseMin = dozvoleniMinitiPauza * 60;
      
      let ekstraPauzaMinuti = Math.max(0, totalPauseMin - allowedPauseMin);
      
      let dodatnoZaKazna = Math.max(0, ekstraPauzaMinuti - earlyLateTogether);
      let minutiZaOdzemanje = earlyLateTogether + dodatnoZaKazna;
      
      vkupnoRabotniSaati = Math.max(0, vkupnoRabotniSaati - (minutiZaOdzemanje / 60));
      
    
    const formatHours = (decimalHours) => {
      let hours = Math.floor(decimalHours);
      let minutes = Math.round((decimalHours - hours) * 60);
      return `${hours}:${String(minutes).padStart(2, '0')}`;
    };
  
    return {
      Saati: formatHours(vkupnoRabotniSaati),
      PrekuvremeniSaati: formatHours(vkupnoPrekuvremeniSaati),
    };
  };
  

  const showPrisustvo = filters.TipAkcija.includes("prisustvo");
  const showOtsustvo = filters.TipAkcija.includes("otsustvo");
  const showPrivateOut = filters.TipAkcija.includes("privateOut");
  const showBusinessOut = filters.TipAkcija.includes("businessOut");
  const showBrakeOut = filters.TipAkcija.includes("brakeOut");
  const showWorkingHours = filters.TipAkcija.includes("workingHours");
  const showOverTimeHours = filters.TipAkcija.includes("overTime")

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReportTypeChange = (type) => {
    setFilters((prev) => {
      const TipAkcija = prev.TipAkcija.includes(type)
        ? prev.TipAkcija.filter((t) => t !== type)
        : [...prev.TipAkcija, type];
      return { ...prev, TipAkcija };
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
        <input 
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange} />
      </td>
      <td><label>До датум:</label></td>
      <td>
        <input 
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange} />
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
        <input
          type="text"
          name="vraboten"
          value={filters.vraboten}
          placeholder="Име на вработен"
          onChange={handleFilterChange} />
      </td>
    </tr>
    <tr>
      <td><label>Сектор:</label></td>
      <td colSpan="3">
        <select 
          name="sektor"
          value={filters.sektor}
          onChange={handleFilterChange}
        >
          <option value="">-- Избери Сектор --</option>
          {Sektori.map((s) => (
                <option key={s.SektorID} value={s.SektorID}>
                  {s.SektorIme}
                </option>
              ))}
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

            {Object.keys(FiltriraniZapisi.groupedData || {}).length > 0 ? (
              Object.keys(FiltriraniZapisi.groupedData).map((pom) => {
                //console.log("FiltriraniZapisi.groupedData =>", FiltriraniZapisi.groupedData);
                //console.log("pom =>", pom);
                //console.log("pomZapis =>", FiltriraniZapisi.groupedData[pom]);
                const pomZapis = FiltriraniZapisi.groupedData[pom] || {};

                const pomData = FiltriraniZapisi.dateList.filter(
                  (date) =>
                    (pomZapis[date]?.Vlez && showPrisustvo) ||
                    (!pomZapis[date]?.Vlez && showOtsustvo)
                );
                //console.log("pomData =>", pomData, " Lenght =>", pomData.length)

                if (pomData.length === 0) return null;

                return pomData.map((date, index) => {
                 const { Saati, PrekuvremeniSaati } = VremeNaPrisustvo(pom, date, pomZapis);

                  return (
                    <tr key={`${pom}-${date}`}>
                      {index === 0 && <td rowSpan={pomData.length}>{vraboteni.find((e) => String(e.CardID) === String(pom))?.ImePrezime || "Unknown"}</td>}
                      <td>{date}</td>
                      <td>{pomZapis[date]?.Vlez || "—"}</td>
                      {showBrakeOut && (
                        <>
                          <td>{pomZapis[date]?.Pauza_Izlez || "—"}</td>
                          <td>{pomZapis[date]?.Pauza_Vlez || "—"}</td>
                        </>
                      )}
                      {showBusinessOut && (
                        <>
                          <td>{pomZapis[date]?.Sluzben_Izlez || "—"}</td>
                          <td>{pomZapis[date]?.Sluzben_Vlez || "—"}</td>
                        </>
                      )}
                      {showPrivateOut && (
                        <>
                          <td>{pomZapis[date]?.Privaten_Izlez || "—"}</td>
                          <td>{pomZapis[date]?.Privaten_Vlez || "—"}</td>
                        </>
                      )}
                      <td>{pomZapis[date]?.Izlez || "—"}</td>
                      {showWorkingHours && <td>{Saati || "—"}</td>}
                      {showOverTimeHours && <td>{PrekuvremeniSaati || "—"}</td>}
                    
                    </tr>
                  );
                });
              })
            ) : (
              <tr>
                <td colSpan="10">Нема податоци</td>
              </tr>
            )}
          
           
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Izveshtai;
