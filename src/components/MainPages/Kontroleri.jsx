import React, { useState, useEffect } from "react";
import "./MainPages.css";
import KontroleriModal from "../Modals/KontroleriModal";
import axios from "axios";
import { pingKontroler_api, sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const Kontroleri = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [kontroleri, setKontroleri] = useState([]);
  
   //const kontroleri_api = "https://rabotnovreme.infinityfreeapp.com/php/kontroleri.php";

  //  useEffect(() => {
  //   fetchKontroleri();
 // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchKontroleri();
      axios.get(pingKontroler_api);
      console.log("Aktiven = 0");
    }, 30000); // every 1 min

    fetchKontroleri();
    return () => clearInterval(interval);
  }, []);
  

  const fetchKontroleri = async () => {
    try {
      const response = await axios.get(kontroleri_api);
      setKontroleri(response.data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  // const handleOvozmozi = async (KontrolerID, Ovozmozi) => {
  //   try {
    
  //     const newStatus = Number(Ovozmozi) === 1 ? 0 : 1;
  //     await axios.post(
  //       kontroleri_api,
  //       {
  //         action: "update",
  //         KontrolerID: KontrolerID, 
  //         Ovozmozi: newStatus, 
  //       },
  //       {
  //         headers: { "Content-Type": "application/json" }
  //       });
  //     fetchKontroleri();
  //   } catch (error) {
  //     console.error("Error updating kontroler status:", error);
  //   }
  // };


      const openModal = () => {
        setIsModalOpen(true);
      };

  return (
    <div>
      <div className="header">
        <h2>Контролери</h2>
        <button className="btn-add"  onClick={()=>setIsModalOpen(true)}>
          Додај контролер
        </button>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>IP Адреса</th>
            <th>Активен</th>
            {/* <th>Овозможен</th> */}
            <th>Избриши</th>
          </tr>
        </thead>
        <tbody>
          {kontroleri.length > 0 ?(
            kontroleri.map((kontroler, index) => (
              <tr  key={kontroler.KontrolerID}>
                 <td>{index + 1}</td>
                 <td>{kontroler.IPAdress}</td>
                 <td
                    // style={{
                    //   //ostaj dve zagradi
                    //   width: "60%",
                    //   // height: "20px",
                    //   backgroundColor: kontroler.Aktiven ? "green" : "red",
                    //   borderRadius: "3px",
                    //   margin: "0 auto",
                    // }}

                    
  style={{
    backgroundColor: kontroler.Aktiven ? "green" : "red",
    color: "white",
    borderRadius: "5px",
    padding: "5px 10px",
    textAlign: "center",
    fontWeight: "bold",
  }}>
  {kontroler.Aktiven ? "Активен" : "Не активен"}
</td>

                 {/* <td>
                      <button className="btn-edit" onClick={() => handleOvozmozi(kontroler.KontrolerID, kontroler.Ovozmozi)}>Измени</button>
                 </td> */}
                 <td>
                    <button className="btn-delete" >
                       Избриши
                    </button>
                 </td>
              </tr>
            ))

          ) : (
            <tr>
              <td colSpan="4">Нема податоци</td>
            </tr>
          )}
          
        </tbody>
      </table>
      <KontroleriModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </div>
  );
};

export default Kontroleri;