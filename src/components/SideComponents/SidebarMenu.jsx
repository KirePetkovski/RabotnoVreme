import React from 'react';
import './SidebarMenu.css';

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu">
      <ul>
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
            <li>Додади отсутство</li>
        </a>
        <a href="/#/kontroleri">
            <li>Контролери</li>
        </a>
        <a href="/#/korisnici">
            <li>Корисници</li>
        </a>
      </ul>
    </div>
  );
};

export default SidebarMenu;
