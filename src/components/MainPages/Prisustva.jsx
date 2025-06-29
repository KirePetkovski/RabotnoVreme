import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainPages.css";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


function Prisustva() {
  const [prisustva, setPrisustva] = useState([]);
  const [filteredPrisustva, setFilteredPrisustva] = useState([]);
  const [vraboteni, setVraboteni] = useState([]);
  const [prebarajIme, setPrebarajIme] = useState("");
  const [prebarajDatum, setPrebarajDatum] = useState("");
  const localStorage_Aktiven = localStorage.getItem("Aktiven");
  const localStorage_CardID = localStorage.getItem("CardID");
  const localStorage_ImePrezime = localStorage.getItem("ImePrezime");



  // Stats za momentalnata sostojba
  const [vkupnoVraboteni, setVkupnoVraboteni] = useState(0);
  const [prisutni, setPrisutni] = useState(0);
  const [otsutni, setOsutni] = useState(0);
  const [pauza, setPauza] = useState(0);

  //const prisustvo_api = "https://rabotnovreme.infinityfreeapp.com/php/prisustvo.php";
  //const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php"

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPrebarajDatum(today);

    fetchVraboteni();
  }, []);

  useEffect(() => {
    if (vraboteni.length > 0) {
      fetchPrisustvo();
    }
  }, [vraboteni]);


  const fetchVraboteni = async () => {
    try {
      const response = await axios.get(vraboteni_api);
      setVraboteni(response.data);
    } catch (error) {
      console.error("Error fetching vraboteni:", error);
    }
  };

  const fetchPrisustvo = async () => {
    try {
      const response = await axios.get(prisustvo_api);
      if (Array.isArray(response.data)) {
        setPrisustva(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
        setPrisustva([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPrisustva([]);
    }
  };



  useEffect(() => {
    if (prisustva.length > 0) {
      const filtered = prisustva.filter(datum =>
        datum.Vreme.startsWith(prebarajDatum)
      );

      //calculateStats(filtered);
      //console.log("filtered pred Prebaraj", filtered)
    }

    Prebaraj();
  }, [prebarajDatum, prebarajIme, prisustva])

  const Prebaraj = () => {
    let filtered = prisustva;
    //console.log("prisustva", prisustva);

    if (prebarajIme) {
      const filteredVraboteni = vraboteni.filter(v =>
        v.ImePrezime.toLowerCase().includes(prebarajIme.toLowerCase())
      );

      const matchingCardIDs = filteredVraboteni.map(v => v.CardID);

      filtered = filtered.filter(record =>
        matchingCardIDs.includes(record.CardID)
      );
    }


    filtered = filtered.filter(record =>
      record.Vreme.startsWith(prebarajDatum)
    );

    //console.log("filtered",filtered);
    setFilteredPrisustva(filtered);
  };



  // const calculateStats = (data) => {
  //   let BrojVraboteni = new Set();
  //   let prisutniVraboteni = new Set();
  //   let osutniVraboteni = new Set();
  //   let pauzaVraboteni = new Set();
  //   //let SluzbenoVraboteni = new Set();

  //   data.forEach(record => {
  //     const { VrabotenID, TipAkcija } = record;

  //     BrojVraboteni.add(VrabotenID);
  //     if (TipAkcija === "Vlez") {
  //       prisutniVraboteni.add(VrabotenID);
  //     }
  //     if (TipAkcija === "Privaten_Izlez" && !prisutniVraboteni.has(VrabotenID)) {
  //       osutniVraboteni.add(VrabotenID);
  //     }
  //     if (TipAkcija === "Pauza_Izlez") {
  //       pauzaVraboteni.add(VrabotenID);
  //     }
  //     // if (TipAkcija === "Sluzben_Izlez") {
  //     //   SluzbenoVraboteni.add(VrabotenID);
  //     // }
  //   });
  //   setVkupnoVraboteni(BrojVraboteni.size);
  //   setPrisutni(prisutniVraboteni.size);
  //   setOsutni(osutniVraboteni.size);
  //   setPauza(pauzaVraboteni.size);
  // };



  return (


    <div>
      <header className="header">
        <h1>Преглед на присутност</h1>
      </header>

      {/* {localStorage_Aktiven === "1" &&

        <div className="stats-container">
          <div className="stat-card">
            <h2>Број на вработени</h2>
            <p>{vkupnoVraboteni}</p>
          </div>
          <div className="stat-card">
            <h2>Присутни</h2>
            <p>{prisutni}</p>
          </div>
          <div className="stat-card">
            <h2>Отсуствa / приватни излези</h2>
            <p>{otsutni}</p>
          </div>
          <div className="stat-card">
            <h2>Вкупно приватни излези</h2>
            <p>{pauza}</p>
          </div>
        </div>
      }

      <div className="search">
        {localStorage_Aktiven === "1" &&

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Пребарај вработен"
              value={prebarajIme}
              onChange={(e) => setPrebarajIme(e.target.value)} />
          </div>
        }
      </div>
      */}
        <div className="date-range">
          <label htmlFor="date" className="date-label">Пребарај по датум </label>
          <input
            type="date"
            id="date"
            className="date-input"
            value={prebarajDatum}
            onChange={(e) => setPrebarajDatum(e.target.value)}
          />
        </div>
      <br/>
      <br/>


      <table className="main-table">
        <thead>
          <tr>
            <th>Име и Презиме</th>
            <th>Влез</th>
            <th colSpan="2">Пауза</th>
            <th colSpan="2">Службен излез</th>
            <th colSpan="2">Приватен излез</th>
            <th>Излез</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th>Излез</th>
            <th>Влез</th>
            <th>Излез</th>
            <th>Влез</th>
            <th>Излез</th>
            <th>Влез</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
        
        filteredPrisustva.length > 0 ? (
        Object.values(
    filteredPrisustva.reduce((acc, record) => {
      if (String(localStorage_CardID) === String(record.CardID)) {
        const vraboten = vraboteni.find(v => v.CardID === record.CardID);
        const name = vraboten ? vraboten.ImePrezime : "Непознат";

        if (!acc[name]) {
          acc[name] = { ImePrezime: name };
        }

        acc[name][record.TipAkcija] = new Date(record.Vreme).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      }else{
        const name = localStorage_ImePrezime ? localStorage_ImePrezime: "Непознат";

        if (!acc[name]) {
          acc[name] = { ImePrezime: name };
        }
      }

      return acc; 
    }, {})
          ).map((record, index) => (
            <tr key={index}>
              <td>{record.ImePrezime || ""}</td>
              <td>{record.Vlez || ""}</td>
              <td>{record.Pauza_Izlez || ""}</td>
              <td>{record.Pauza_Vlez || ""}</td>
              <td>{record.Sluzben_Izlez || ""}</td>
              <td>{record.Sluzben_Vlez || ""}</td>
              <td>{record.Privaten_Izlez || ""}</td>
              <td>{record.Privaten_Vlez || ""}</td>
              <td>{record.Izlez || ""}</td>
            </tr>
          )) ) : (
            <tr>
                <td colSpan="9">Нема податоци</td>
              </tr>
          )}

        </tbody>

      </table>
    </div>
  );
}

export default Prisustva;
