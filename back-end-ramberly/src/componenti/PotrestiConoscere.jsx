import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";

export function PotrestiConoscere() {
  const { users, userId } = useUserContext();
  const [seguendo, setSeguendo] = useState([]);

  const navTo = useNavigate();
  const scegliAvatar = () => {
    navTo("/scegliavatar");
  };
  const scegliereSport = () => {
    navTo("/sceglieresport");
  };

  const handleAddProfile = async (profile) => {
    try {
      const response = await fetch(
        `http://localhost:5001/potrestiConoscere/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            targetUserId: [profile.id],
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setSeguendo([...seguendo, profile]);
      }
    } catch (error) {
      console.error({ message: "errore nel fetching", error });
    }
  };

  return (
    <div className="main-container">
      <img
        src="src/assets/loghi/logo.svg"
        width={110}
        style={{ marginBottom: "10px" }}
        alt="logo"
      />

      <img
        src="src/assets/icons/step3.svg"
        width={310}
        style={{ marginBottom: "10px" }}
        alt=""
      />

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
            {users.map((profile) => (
              <li key={profile.id} className="user-item">
                <div className="user-avatar">
                  <img src={profile.img} alt={`avatar ${profile.nome}`} />
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
