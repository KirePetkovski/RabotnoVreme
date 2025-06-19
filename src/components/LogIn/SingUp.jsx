import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios'; 
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const SingUp = () => {
  const navigate = useNavigate();
  const [CardID, setCardID] = useState("");
  const [ImePrezime, setImePrezime] = useState("");
  const [VrabotenID, setVrabotenID] = useState("");
  const [Email, setEmail] = useState("");
  const [Lozinka, setLozinka] = useState("");
  const [Potvrdi, setPotvrdi]  = useState("");
  const [found, setFound] = useState(false);
  const [error, setError] = useState("");
  // const Uloga = "Korisnik";


 // const singup_api = "https://rabotnovreme.infinityfreeapp.com/php/singup.php";
  //const korisnici_api = "https://rabotnovreme.infinityfreeapp.com/php/korisnici.php";


  const handleProveriCardID = async () => {
    var prodolzi=true;
    try{
      const response = await axios.get(korisnici_api + '?CardID=' + CardID );
      console.log(response.data);
      prodolzi= response.data.prodolzi;

    }catch {
      setError("Ве молам обидете се повторно.");
    }
   if(!prodolzi){
    setFound(false);
    setError("Не вие прва најава. Доколку сте ја заборавиле лозинката, обратете се кај администраторот.");
   }else{
    try {
      const response = await axios.get(singup_api + '?CardID=' + CardID );
      if (response.data.success) {
        console.log(response.data);
        setImePrezime(response.data.ImePrezime);
        setVrabotenID(response.data.VrabotenID);
        setFound(true);
        setError("");
      } else {
        setFound(false);
        setImePrezime("");
        setError("CardID не е внесена во системот");
      }
    } catch {
      setError("Ве молам обидете се повторно.");
    }
  }
  
  };
  

  const handleSignup = async () => {

    if (Lozinka !== Potvrdi) {
      setError("Лозинките не се совпаѓаат.");

    } else {

      if (Lozinka.length < 8) {
        setError("Лозинката мора да има 8 карактери.");
      } else {
        try {
          const response = await axios.post(singup_api, {
            Lozinka,
            Uloga: "Vraboten",
            Email,
            VrabotenID,
            CardID,
          });
          alert(response.data.message || "Успешно сте регистрирани во системот. Најсвете се за да влезете во системот");
          navigate('/');
        } catch {
          alert("Грешка при регистрирањето");
        }
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Регистрација / нова картичка</h2>

      <div className="form-group">
        <label>Внесете го кодот од CardID</label>
        <input
          type="text"
          value={CardID}
          onChange={(e) => setCardID(e.target.value)}
          placeholder="CardID"
        />
      </div>

      <div className="form-group">
        <button className="login-button" onClick={handleProveriCardID}>
          Наредно
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {found && (
        <>
          <div className="form-group">
            <label>Пронајдено име</label>
            <input type="text" value={ImePrezime} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Внесете го службениот маил"
            />
          </div>

          <div className="form-group">
            <label>Лозинка</label>
            <input
              type="password"
              value={Lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              placeholder="Внесете лозинка"
            />
          </div>

          <div className="form-group">
            <label>Потврди</label>
            <input
              type="password"
              value={Potvrdi}
              onChange={(e) => setPotvrdi(e.target.value)}
              placeholder="Потврдија лозинката"
            />
          </div>

          <div className="form-group">
            <button className="login-button" onClick={handleSignup}>
               Регистрирај се
            </button>
          </div>
        </>
      )}
      <a onClick={() => navigate('/')}>Вратете се назад / најава во системот</a>

    </div>
  );
};

export default SingUp;
