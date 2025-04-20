import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios'; 

const Login = () => {
  const [Email, setEmail] = useState('');
  const [Lozinka, setLozinka] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const login_api = "https://rabotnovreme.infinityfreeapp.com/php/login.php";
  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(login_api, {
        Lozinka,
        Email,
      });
      if(response.data.success){
        alert('Login successful!');
        navigate('/home');
      }else{
        setErrorMessage("Погрешен маил или лозинка");
      }
      
    } catch {
      alert("Sign up failed.");
    }

    // if (email === 'admin' && lozinka === 'admin') {
    //   alert('Login successful!');
    //   navigate('/home'); 
    // } else {
    //   setErrorMessage('Invalid email or lozinka');
    // }
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
        <button type="submit" className="login-button">Log In</button>
        <a onClick={() => navigate('/SingUp')} >Направете регистрација</a>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;
