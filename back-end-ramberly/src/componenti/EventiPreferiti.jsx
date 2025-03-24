import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";
import { calculateDifficultyLevel } from "../algoritmi/calculateDifficultyLevel.js";
export function EventiPreferiti() {
  const { user, participatedEvents, handleDeletePartecipa, eventsAvatar } =
    useUserContext();
  const navTo = useNavigate();

  return (
    <>
      <div className="title-preferiti">
        <a className="link-class" onClick={() => navTo("/home")}>
          <svg
            width="20"
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
        <div>
          <h3>EVENTI PREFERITI</h3>
        </div>
      </div>

      {participatedEvents.filter((evento) => evento.partecipa).length > 0 ? (
        participatedEvents
          .filter((evento) => evento.partecipa)
          .map((evento, index) => {
            const eventoAvatar = eventsAvatar?.find(
              (e) => e.id_evento === evento.id_evento
            );

            return (
              <div className="eventi-preferiti" key={index}>
                <div className="utente-titolo">
                  <img
                    id="post-avatar"
                    src={
                      eventoAvatar
                        ? `data:image/png;base64,${eventoAvatar.user_avatar_base64}`
                        : "src/assets/default-avatar.png"
                    }
                    alt="user-icon"
                  />
                  <div className="post-info-container">
                    <div className="post-user-info">
                      <h3>{evento.nome}</h3>
                      <h5>Amici</h5>
                      <a>
                        <img
                          id="post-settings-icon"
                          src="\friends-svgrepo-com.svg"
                          alt="post settings"
                        />
                      </a>
                    </div>
                    <h5>Livello {evento.livello}</h5>
                  </div>
                  <p style={{ fontFamily: 'Avenir-Medium', fontSize:'14px' }}>
                    {evento.nome_evento.toUpperCase()}
                  </p>
                </div>
                <div className="info-start-finish">
                  <div>
                    <p style={{fontFamily: 'Avenir-Heavy'}}>Start:</p>
                    <p> {evento.start}</p>
                  </div>

                  <hr />
                  <div>
                    <p style={{fontFamily: 'Avenir-Heavy'}}>Finish:</p>
                    <p>{evento.finish}</p>
                  </div>
                </div>

                <div className="info-evento-preferiti">
                  <div className="map-preferiti">
                    <img
                      src={
                        evento.map_img_base64
                          ? `data:image/png;base64,${evento.map_img_base64}`
                          : "src/assets/placeholder.png"
                      }
                      alt="Mappa"
                      className="mappa"
                    />
                  </div>

                  <div className="box-dati-preferiti">
                    <div className="info-data-icons">
                      <img
                        src="src\assets\icons\kilometers.svg"
                        alt="distanza"
                        width={25}
                      />
                      <p>{evento.distanza}</p>
                    </div>
                    <div className="info-data-icons">
                      <img
                        src="src\assets\icons\clock.svg"
                        alt="orario"
                        width={25}
                      />
                      <p>{evento.orario.slice(0, -3)}</p>
                    </div>
                    <div className="info-data-icons">
                      <img
                        src="src\assets\icons\calendar.svg"
                        alt="data"
                        width={25}
                      />
                      <p>{new Date(evento.data).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="btn-eventi-preferiti">
                  <button
                    className="btn-difficolta"
                    style={{
                      backgroundColor:
                        calculateDifficultyLevel(user, evento.distanza)
                          .level === "Facile"
                          ? "#4CAF50"
                          : calculateDifficultyLevel(user, evento.distanza)
                              .level === "Intermedio"
                          ? "#FFC107"
                          : "#F44336",
                    }}
                  >
                    {calculateDifficultyLevel(user, evento.distanza).level ===
                    "Facile"
                      ? "Facile"
                      : calculateDifficultyLevel(user, evento.distanza)
                          .level === "Intermedio"
                      ? "Intermedio"
                      : "Difficile"}
                  </button>
                  <button
                    onClick={() =>
                      handleDeletePartecipa(user.id, evento.id_evento)
                    }
                    className="btn-difficolta"
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            );
          })
      ) : (
        <p>Non ci sono eventi preferiti</p>
      )}
    </>
  );
}
