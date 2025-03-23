import { BrowserRouter as Routes, Route } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import Login from "./components/LogIn/Login";
import HomePage from "./components/SideComponents/home";
import SidebarMenu from "./components/SideComponents/SidebarMenu";
import Prisustva from "./components/MainPages/Prisustva";
import Vraboteni from "./components/MainPages/Vraboteni";
import Sektori from "./components/MainPages/Sektori";
import Izveshtai from "./components/MainPages/Izveshtai";
import Raspored from "./components/MainPages/Raspored";
import Kalendar from "./components/MainPages/Kalendar";
import Otsustva from "./components/MainPages/Otsustva";
import Kontroleri from "./components/MainPages/Kontroleri";
import Korisnici from "./components/MainPages/Korisnici";

function App() {
  return (
    <Router basename="/RabotnoVreme">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <HomePage />
              </div>
            </div>
          }
        />
        <Route
          path="/prisustva"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Prisustva />
              </div>
            </div>
          }
        />
        <Route
          path="/vraboteni"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Vraboteni />
              </div>
            </div>
          }
        />
        <Route
          path="/sektori"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Sektori />
              </div>
            </div>
          }
        />
        <Route
          path="/izveshtai"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Izveshtai />
              </div>
            </div>
          }
        />
        <Route
          path="/raspored"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Raspored />
              </div>
            </div>
          }
        />
        <Route
          path="/kalendar"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Kalendar />
              </div>
            </div>
          }
        />
        <Route
          path="/otsustva"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Otsustva />
              </div>
            </div>
          }
        />
        <Route
          path="/kontroleri"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Kontroleri />
              </div>
            </div>
          }
        />
        <Route
          path="/korisnici"
          element={
            <div className="app-container">
              <SidebarMenu />
              <div className="main-content">
                <Korisnici />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

