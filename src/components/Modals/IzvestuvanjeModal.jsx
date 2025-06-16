import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";
import { izvestuvanje_api, sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const izvestuvanjeModal = ({ isOpen, onClose, PratenoOd }) => {

    const [CardID, setCardID] = useState("");
    const [Sodrzina, setSodrzina] = useState("");
    const [korisnici, setKorisnici] = useState([]);
    const [vraboteni, setVraboteni] = useState([]);
    const [Email, setEmail] = useState("");

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


    const handleDodadiIzvestuvanje = async (e) => {
        e.preventDefault();

        if (CardID && Email === "") {
            alert("Вработениот се нема најавено во системот");
        }

        try {
            console.log(CardID, Sodrzina, PratenoOd);

            const response = await axios.post(
                izvestuvanje_api,
                {
                    CardID,
                    Sodrzina,
                    PratenoOd,
                    Email
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log(response.data);
            onClose();
        } catch (error) {
            //  console.error("Error adding sector:", error);
            alert("Грешка при додавање на известување!");
        }


    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Додај новo известување</h3>
                <form >
                    <Select
                        className="modal-content-Select"
                        classNamePrefix="rs"
                        options={vraboteni.map((v) => ({
                            value: v.CardID,
                            label: `${v.ImePrezime}`,
                        }))}
                        onChange={(selectedOption) => {
                            const selectedCardID = selectedOption ? selectedOption.value : "";
                            setCardID(selectedCardID);

                            const selectedKorisnik = korisnici.find(k => k.CardID === selectedCardID);
                            setEmail(selectedKorisnik ? selectedKorisnik.Email : "");
                        }}

                        value={
                            vraboteni
                                .map((v) => ({
                                    value: v.CardID,
                                    label: `${v.ImePrezime}`,
                                }))
                                .find((option) => option.value === CardID) || null
                        }
                        placeholder="Избери вработен"
                        isClearable
                    />

                    <input
                        type="text"
                        name="Email"
                        value={Email}
                        placeholder="Email на вработениот"
                        readOnly
                        className="email-field"
                    />


                    <textarea
                        name="Sodrziva"
                        value={Sodrzina}
                        onChange={(e) => setSodrzina(e.target.value)}
                        placeholder="Внесете текст"
                        required
                        rows={5}
                    />
                    <div>
                        <button type="submit" className="btn-add" onClick={handleDodadiIzvestuvanje}>Зачувај</button>
                        <button type="button" className="btn-delete" onClick={onClose}>Откажи</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default izvestuvanjeModal;