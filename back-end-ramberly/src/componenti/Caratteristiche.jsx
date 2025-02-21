import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Caratteristiche() {
  const users = localStorage.getItem("users");
  const parseUsers = JSON.parse(users);

  const user = localStorage.getItem("user");
  const parseUser = JSON.parse(user);

  const [caratteristiche, setCaratteristiche] = useState({
    sesso: "",
    peso: "",
    attivita: "",
    monitoraggio: "",
    gruppo: "",
    sfide: "",
  });

  const navTo = useNavigate();

  const navToRegistrazione = () => {
    navTo("/registrazione");
  };

  const navToScegliSport = () => {
    navTo("/sceglieresport");
  };

  function handleChange(event) {
    const { id, value } = event.target;

    setCaratteristiche((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const userIdExist = parseUsers.find((x) => x.id === caratteristiche.id);
    console.log(userIdExist);

    // userIdExist.push(caratteristiche)
    // ;

    const userUpdated = { ...parseUser, ...caratteristiche };
    console.log(userUpdated);

    localStorage.setItem("user", JSON.stringify(userUpdated));

    navToScegliSport();
  };

  return (
    <div className="main-container">
      <div className="caratteristiche-title">
        <a
          href="/registrazione"
          className="link-class"
          onClick={navToRegistrazione}
        >
          <svg
            width="10"
            height="20"
            viewBox="0 0 18 28"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="Icon__StyledSVG-sc-lm07h6-0 rBpBu Chevronstyles__ChevronIcon-sc-1qql32m-0 gxjmBc GlobalBannerstyles__ControlIcon-sc-adnc4-6 llnoGO"
          >
            <path
              d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <h3 className="link-h3-class">Le tue caratteristiche!</h3>
        <img src="src/assets/loghi/logo.svg" width={60} alt="logo" />
      </div>
<img src="src/assets/icons/step1.svg" width={350} style={{marginBottom:'10px'}} alt="step1" />
      <form className="form" onSubmit={handleSubmit}>
       
        <label>Sesso:</label>
        <select id="sesso" required onChange={handleChange}>
          Scegli un opzione:
          <option value="">Seleziona</option>
          <option value="uomo">Uomo</option>
          <option value="donna">Donna</option>
        </select>
        <p style={{ color: "red", fontSize: "12px" }}>
          * l'informazione riguardo il sesso è determinante per stabilire i
          livelli di difficoltà in base alla differenza del corpo femminile da
          quello maschile
        </p>

        <label>Inserisci il tuo peso</label>
        <input
          type="number"
          required
          id="peso"
          min={35}
          max={180}
          onChange={handleChange}
        />

        <label> Inserisci la tua età!</label>
        <input
          type="number"
          required
          id="eta"
          min={16}
          max={100}
          onChange={handleChange}
        />

        <label>Quanto spesso fai attività fisica?</label>
        <select id="attivita" required onChange={handleChange}>
          Scegli un opzione:
          <option value="">Seleziona</option>
          <option value="0">Quasi mai</option>
          <option value="2">1-2 volte a settimana</option>
          <option value="4">3-4 volte a settimana</option>
          <option value="5">Più di 5 volte a settimana</option>
        </select>

        <label>
          Hai esperienza con il monitoraggio delle attività fisiche?
        </label>
        <select id="monitoraggio" required onChange={handleChange}>
          Scegli un opzione:
          <option value="">Seleziona</option>
          <option value="si">Si</option>
          <option value="no">No</option>
        </select>

        <label>Ti piace allenarti da solo o in gruppo?</label>
        <select id="gruppo" required onChange={handleChange}>
          Scegli un opzione:
          <option value="">Seleziona</option>
          <option value="solo">Solo</option>
          <option value="gruppo">Gruppo</option>
          <option value="entrambi">Entrambi</option>
        </select>

        <label>
          Ti piacerebbe partecipare partecipare a sfide o gare tramite l'app?
        </label>
        <select id="sfide" required onChange={handleChange}>
          Scegli un opzione:
          <option value="">Seleziona</option>
          <option value="si">Si</option>
          <option value="no">No</option>
        </select>

        <button type="submit" className="prosegui">
          Avanti
        </button>
      </form>
    </div>
  );
}
