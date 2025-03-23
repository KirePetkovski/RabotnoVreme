import React from 'react';
import './SidebarMenu.css';

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu">
      <ul>
        <a href="/RabotnoVreme/prisustva">
            <li>Присуства</li>
        </a> 
        <a href="/RabotnoVreme/vraboteni">
            <li>Вработени</li>
        </a>
        <a href="/RabotnoVreme/sektori">
            <li>Сектори</li>
        </a>
        <a href="/RabotnoVreme/izveshtai">
            <li>Извештај</li>
        </a>
        <a href="/RabotnoVreme/raspored">
            <li>Распоред</li>
        </a>
        <a href="/RabotnoVreme/kalendar">
            <li>Календар</li>
        </a>
        <a href="/RabotnoVreme/otsustva">
            <li>Додади отсутство</li>
        </a>
        <a href="/RabotnoVreme/kontroleri">
            <li>Контролери</li>
        </a>
        <a href="/RabotnoVreme/korisnici">
            <li>Корисници</li>
        </a>
      </ul>
    </div>
  );
};

export default SidebarMenu;
