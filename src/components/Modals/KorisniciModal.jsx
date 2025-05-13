import React, { useState } from "react";
import axios from "axios";
import { sektori_api, raspored_api, prisustvo_api, praznici_api, vraboteni_api, kontroleri_api, korisnici_api, login_api, osustva_api, singup_api } from "../api";


const KorisniciModal = ({ isOpen, onClose, KorisnikID }) => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    //const korisnici_api = "https://rabotnovreme.infinityfreeapp.com/php/korisnici.php";

    console.log(KorisnikID);

    const handleZacuvaj = async (e, KorisnikID) => {
        e.preventDefault();
        if (password !== confirm) {
            console.log(KorisnikID);
            setError("Лозинките не се совпаѓаат.");
            
        } else {
            console.log(KorisnikID);
            try {
                const response = await axios.post(
                    korisnici_api,
                    {
                        action: "update",
                        Lozinka: password,
                        KorisnikID: KorisnikID
                    },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                console.log(response.data);
                setError("");
                onClose();

            } catch (error) {
                //  console.error("Error adding sector:", error);
                alert("Грешка при премена на лозинка!");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Промени лозинка</h3>
                <form>
                    <input
                        type="password"
                        name="password"
                        placeholder="Лозинка"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="confirm"
                        placeholder="Повтори ја лозинката"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div>
                        <button type="button" className="btn-add" onClick={(e) => handleZacuvaj(e, KorisnikID)}>
                            Зачувај
                        </button>
                        <button type="button" className="btn-delete" onClick={onClose}>
                            Откажи
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KorisniciModal;
