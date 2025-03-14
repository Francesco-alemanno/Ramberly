import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PotrestiConoscere() {
  const [seguendo, setSeguendo] = useState([]);

  const navTo = useNavigate();
  const scegliAvatar = () => {
    navTo("/scegliavatar");
  };
  const scegliereSport = () => {
    navTo("/sceglieresport");
  };

  const users = localStorage.getItem("users");
  const profiles = JSON.parse(users);

  const handleAddProfile = (profile) => {
    const user = localStorage.getItem("user");
    const parseUser = JSON.parse(user);

    if (!parseUser.seguiti) {
      parseUser.seguiti = [];
    }

    // Verifica se l'utente è già nei seguiti
    const utentiSeguiti = parseUser.seguiti.findIndex(
      (utente) => utente.email === profile.email
    );

    if (utentiSeguiti === -1) {
      parseUser.seguiti.push({
        nome: profile.nome,
        email: profile.email,
      });
      setSeguendo([...seguendo, { nome: profile.nome, email: profile.email }]);
    } else {
      parseUser.seguiti.splice(utentiSeguiti, 1);
      setSeguendo(seguendo.filter((utente) => utente.email !== profile.email));
    }

    localStorage.setItem("user", JSON.stringify(parseUser));
    console.log("Utente aggiornato:", parseUser);
  };

  return (
    <div className="main-container">
     <img src="src/assets/loghi/logo.svg" width={110} style={{marginBottom:'10px'}} alt="logo" />

      <img src="src/assets/icons/step3.svg" width={310} style={{marginBottom:'10px'}} alt="" />

      <div className="form">
        <div className="title-potresti-consoscere">
          <a
            href="/sceglieresport"
            className="link-class"
            onClick={scegliereSport}
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

          <h3 className="link-h3-class">Potresti conoscere:</h3>

        </div>
        <div className="list-container">
          <ul>
            {profiles.map((profile) => (
              <li key={profile.id} className="user-item">
                <div className="user-avatar">
                  <img src={profile.img} alt={`Profile ${profile.nome}`} />
                </div>
                <div className="user-info">
                  <span className="user-name"> {profile.nome}</span>
                  <span className="user-lev">
                    livello:{` ${profile.livello}`}{" "}
                  </span>
                </div>
                <button onClick={() => handleAddProfile(profile)}>
                  {seguendo.some((utente) => utente.email === profile.email)
                    ? "👤-"
                    : "👤+"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button className="prosegui" onClick={scegliAvatar}>
          Avanti
        </button>
      </div>
    </div>
  );
}
