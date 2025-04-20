import React, { useState, useEffect } from "react";
import "./MainPages.css"
import KorisniciModal from "../Modals/KorisniciModal";
import axios from "axios";


const Korisnici = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [korisnici, setKorisnici] = useState([]);
  const [vraboteni, setVraboteni] = useState([]);
  const [id, setId] = useState();
  const korisnici_api = "https://rabotnovreme.infinityfreeapp.com/php/korisnici.php";
  const vraboteni_api = "https://rabotnovreme.infinityfreeapp.com/php/vraboteni.php"


  useEffect(() => {
   fetchKorisnici();
   fetchVraboteni();
 }, []);

 const fetchVraboteni = async () => {
  try {
    const response = await axios.get(vraboteni_api);
    setVraboteni(response.data);
  } catch (error) {
    console.error("Error fetching vraboteni:", error);
  }
};

 const fetchKorisnici = async () => {
   try {
     const response = await axios.get(korisnici_api);
     setKorisnici(response.data);
   } catch (error) {
     console.error("Error fetching korisnici:", error);
   }
 };

 const openModal = () => {
  setIsModalOpen(true);
};

 const ImePrezime = (VrabotenID) => {
  const vraboten = vraboteni.find(v => v.VrabotenID === VrabotenID);
  const imePrezime= vraboten ? vraboten.ImePrezime : "Непознат";

  return imePrezime;
 }

  

  return (
    <div>
      <div className="header">
        <h2>Корисници</h2>
      </div>

      <table className="main-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Име Презиме</th>
            <th>Е-пошта</th>
            <th>Улога</th>
            <th>Промени лозинка</th>
          </tr>
        </thead>
        <tbody>
          {korisnici.length>0 ? (
            korisnici.map((korisnik, index) => (
              <tr key={korisnik.KorisnikID}>
                <td>{index + 1}</td>
                <td>{ImePrezime(korisnik.VrabotenID)}</td>
                <td>{korisnik.Email}</td>
                <td>{korisnik.Uloga}</td>
                <td>
                    <button className="btn-delete" onClick={()=>{setIsModalOpen(true); setId(korisnik.KorisnikID); console.log("Korisnik ", id)}}>
                       Промени
                    </button>
                </td>
              </tr>
            ))
          ): (
            <tr>
              <td colSpan="5">Нема податоци</td>
            </tr>
          )}          
        </tbody>
      </table>  
      <KorisniciModal
       isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        KorisnikID={id}
        />
    </div>
  );
};

export default Korisnici;
