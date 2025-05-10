import React, { useState, useEffect } from "react";
import "./MainPages.css";
import OsustvaModal from '../Modals/OsustvoModal';
import axios from "axios";

const osustva = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [osustvo, setOsustvo] = useState([]);
  const [vraboteni, setVraboteni] = useState([]);

  const osustva_api = "https://rabotnovreme.infinityfreeapp.com/php/osustva.php";
  const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php";
  
  const localStorage_Aktiven = localStorage.getItem("Aktiven");
  const localStorage_CardID = localStorage.getItem("CardID");


  console.log("localStorage_Aktiven", localStorage_Aktiven);
  useEffect(() => {
    fetchOsustva();
    fetchVraboteni();
  }, []);

  const fetchOsustva = async () => {
    try {
      const response = await axios.get(osustva_api);
      setOsustvo(response.data);
    } catch (error) {
      console.error("Грешпа при зимање на осуства: ", error);
    }
  };

  const fetchVraboteni = async () => {
    try {
      const response = await axios.get(vraboteni_api);
      setVraboteni(response.data);
    } catch (error) {
      console.error("Error fetching vraboteni:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.post(osustva_api, {
        action: "update",
        OsustvoID: id,
        Status: status,
      });
      alert("Изменет е статусот");
      fetchOsustva();
    } catch (error) {
      console.error("Грешка при ажурирање на статус:", error);
    }
  };
  

  const getImePrezime = (id) => {
    const vraboten = vraboteni.find(v => String(v.CardID) === id);
    return vraboten ? vraboten.ImePrezime : "Непознат";
  };
  
  const Denovi = (odDen, doDen) => {
    const pocetok = new Date(odDen);
    const kraj = new Date(doDen);

    let count = 0;
    const pom = new Date(pocetok);

  while (pom <= kraj) {
    const dayOfWeek = pom.getDay(); // 0 = Nedela, 6 = Sabota
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    pom.setDate(pom.getDate() + 1);
  }
  return count;
  };

  const OdgovorStatus = (status) => {
    console.log("Status = ", status)
    if (String(status) === "1"){
      return "Прифатено";
    } else {
      return "Одбиено";
    }
  } 
  
  // const deleteOsustva = async (id) => {
  //   if (!window.confirm("Дали сте сигурни дека сакате да го избришете барањето за осуство?")) return;

  //   try {
  //     await axios.delete(`${osustva_api}?id=${id}`);
  //     setOsustvo(osustvo.filter(osustvo => osustvo.OsustvoID !== id));
  //   } catch (error) {
  //     console.error("Грешка при бришење на осуство:", error);
  //   }
  // };
  return (
    <div>
      <div>
        <div className="header">
          <h2>Осуства</h2>
          <p><i>Прифати и одби го гледа администратор. Копчето Побарај осуство го гледа вработениот</i></p>
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            Побарај осуство
          </button>
        </div>

        <table className="main-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Поднесено</th>
              <th>Од ден</th>
              <th>До ден</th>
              <th>Денови</th>
              <th>Причина</th>
              <th>Статус</th>
              {/* direktno od localStorage ide so string */}
              { localStorage_Aktiven === "1" && <th>Прифати</th> }
              { localStorage_Aktiven === "1" && <th>Одби</th> }
            </tr>
          </thead>
          <tbody>
            {console.log("OSUSTVO",osustvo)}
          {console.log("localStorage_CardID",localStorage_CardID)}
          {osustvo.length > 0 ? (
  osustvo
    .filter(osus => localStorage_Aktiven === "1" || String(osus.CardID) === String(localStorage_CardID))
    .map((osus, index) => (

                <tr key={osus.OsustvoID}>
                  <td>{index + 1}</td>
                  <td>{getImePrezime(String(osus.CardID))}</td>
                  <td>{osus.OdDen}</td>
                  <td>{osus.DoDen}</td>
                  <td>{Denovi(osus.OdDen, osus.DoDen)}</td>
                  <td>{osus.Pricina}</td>
                  <td>{OdgovorStatus(osus.Status)}</td>
                  { localStorage_Aktiven === "1" &&
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => updateStatus(osus.OsustvoID, 1)}
                    >
                      Прифати
                    </button>
                  </td>
                  }
                  { localStorage_Aktiven=== "1" &&
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => updateStatus(osus.OsustvoID, 0)}
                    >
                      Одби
                    </button>
                  </td>
                  }
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Нема податоци</td>
              </tr>
            )}
          </tbody>
        </table>
        <OsustvaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fetchOsustva={fetchOsustva}
          osustvo={null} />
      </div>
    </div>
  );
};

export default osustva;