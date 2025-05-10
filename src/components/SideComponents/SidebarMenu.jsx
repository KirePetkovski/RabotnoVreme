import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu = () => {
    const navigate = useNavigate();
    const localStorage_Aktiven = localStorage.getItem("Aktiven");

    function LogOut() {
        localStorage.removeItem('ImePrezime');
        localStorage.removeItem('Religija');
        localStorage.removeItem('Nacionalnost');
        localStorage.removeItem('SektorID');
        localStorage.removeItem('RasporedID');
        localStorage.removeItem('CardID');
        localStorage.removeItem('Aktiven');

        navigate('/');


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

                {localStorage_Aktiven === "1" &&
                    <a href="/#/vraboteni">
                        <li>Вработени</li>
                    </a>
                }
                {localStorage_Aktiven === "1" &&
                    <a href="/#/sektori">
                        <li>Сектори</li>
                    </a>
                }
                {localStorage_Aktiven === "1" &&
                    <a href="/#/izveshtai">
                        <li>Извештај</li>
                    </a>
                }
                {localStorage_Aktiven === "1" &&
                    <a href="/#/raspored">
                        <li>Распоред</li>
                    </a>
                }
                <a href="/#/kalendar">
                    <li>Календар</li>
                </a>
                <a href="/#/otsustva">
                    <li>Отсутство</li>
                </a>
                {localStorage_Aktiven === "1" &&
                    <a href="/#/kontroleri">
                        <li>Контролери</li>
                    </a>
                }
                {localStorage_Aktiven === "1" &&
                    <a href="/#/korisnici">
                        <li>Корисници</li>
                    </a>
                }
                <h2>
                    {localStorage.getItem('ImePrezime')}
                    <button onClick={LogOut}>Одјавете се</button>
                </h2>
            </ul>
        </div>
    );
};

export default SidebarMenu;
