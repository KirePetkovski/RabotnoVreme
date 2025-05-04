import React from 'react';
import './SidebarMenu.css';

const SidebarMenu = () => {

    function LogOut(){
        localStorage.removeItem('ImePrezime');
        localStorage.removeItem('Religija');
        localStorage.removeItem('Nacionalnost');
        localStorage.removeItem('SektorID');
        localStorage.removeItem('RasporedID');
        localStorage.removeItem('CardID');

    }
  return (
    <div className="sidebar-menu">
      <ul>
      <a href="/#/home">
            <li>Преглед</li>
        </a> 
        <a href="/#/prisustva">
            <li>Присуства</li>
        </a> 
        <a href="/#/vraboteni">
            <li>Вработени</li>
        </a>
        <a href="/#/sektori">
            <li>Сектори</li>
        </a>
        <a href="/#/izveshtai">
            <li>Извештај</li>
        </a>
        <a href="/#/raspored">
            <li>Распоред</li>
        </a>
        <a href="/#/kalendar">
            <li>Календар</li>
        </a>
        <a href="/#/otsustva">
            <li>Отсутство</li>
        </a>
        <a href="/#/kontroleri">
            <li>Контролери</li>
        </a>
        <a href="/#/korisnici">
            <li>Корисници</li>
        </a>
        <h2>
            {localStorage.getItem('ImePrezime')}
            {/* <button onClick={LogOut()}>Одјавете се</button> */}
        </h2>
      </ul>
    </div>
  );
};

export default SidebarMenu;
