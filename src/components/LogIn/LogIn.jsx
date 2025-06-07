import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios'; 
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const Login = () => {
  const [Email, setEmail] = useState('');
  const [Lozinka, setLozinka] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

 // const login_api = "https://rabotnovreme.infinityfreeapp.com/php/login.php";
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(login_api, {
        Lozinka,
        Email,
      });

      console.log("data", response.data.najaven);

      console.log('SektorID', response.data.najaven.SektorID);
      console.log('RasporedID', response.data.najaven.RasporedID);

      if (response.data.success) {
        alert('Login successful!');
        localStorage.setItem('ImePrezime', response.data.najaven.ImePrezime);
      //  localStorage.setItem('Religija', response.data.najaven.Religija);
        localStorage.setItem('Nacionalnost', response.data.najaven.Nacionalnost);
        localStorage.setItem('SektorID', response.data.najaven.SektorID);  
        localStorage.setItem('RasporedID', response.data.najaven.RasporedID);
        localStorage.setItem('CardID', response.data.najaven.CardID);
        localStorage.setItem('Aktiven', response.data.najaven.Aktiven);
      //  localStorage.setItem('user', JSON.stringify(response.data.najaven.ImePrezime)); 
        
        navigate('/home');
      } else {
        setErrorMessage("Погрешен маил или лозинка");
      }
  
    } catch {
      alert("Погрешен маил или лозинк");
    }
  };
  

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Лозинка</label>
          <input
            type="password"
            value={Lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Најави се</button>
        <a onClick={() => navigate('/SingUp')} >Направете регистрација</a>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;
