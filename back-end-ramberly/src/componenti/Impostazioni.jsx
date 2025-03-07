import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";
import { useEffect, useState } from "react";

export function Impostazioni() {
  const navTo = useNavigate();
  const [message, setMessage] = useState("");
  const { user } = useUserContext();
  const token = sessionStorage.getItem("token");
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Passa il token nel header
        },
      });
      if (response.ok) {
        sessionStorage.removeItem("token");
        navTo("/login");
      }
    } catch (error) {
      setMessage(error.message);
      console.error(error.message);
    }
  };
  return (
    <div>
      <div className="titolo-impostazioni">
        <a className="link-class" onClick={() => navTo("/home")}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 28"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <h4>Impostazioni account</h4>
      </div>
      <div className="impostazioni">
        <div className="gestione-account">
          <em>Informazioni personali</em>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Nome:</p>
          <p>{user.nome}</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Cognome:</p>
          <p>{user.cognome}</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Email: </p>
          <p>{user.email}</p>
        </div>
        <hr />
        <div className="privacy">
          <em>PRIVACY</em>

          <p style={{ fontFamily: "Avenir-Heavy" }}>Visibilità:</p>
          <p>pubblica</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Utenti Bloccati: </p>
          <p>0</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>
            Autenticazione a due fattori(2A):
          </p>
          <p>Si</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>
            Autorizzazzione di condivisione:
          </p>
          <p>Si</p>
        </div>
        <hr />

        <div className="amici-seguaci">
          <em>AMICI</em>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Gestisci amici</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Lista di amici</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Lista di amici privata</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Segnala utenti</p>
        </div>
        <hr />
        <div className="logout">
          <em>LOGOUT E ASSISTENZA</em>
          <p onClick={handleLogout} style={{ fontFamily: "Avenir-Heavy" }}>
            Logout
          </p>
          {message && <p>{message}</p>}
          <p style={{ fontFamily: "Avenir-Heavy" }}>Centro Assistenza</p>
          <p style={{ fontFamily: "Avenir-Heavy" }}>Contattaci</p>
        </div>
      </div>
    </div>
  );
}
