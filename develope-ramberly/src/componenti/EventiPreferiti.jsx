import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../contesti/useContext";

export function EventiPreferiti() {
  const { personeRandom } = useUserContext();

  // metodo per trovare eventi preferiti
  const parseUsers = JSON.parse(localStorage.getItem("users"));
  const findUser = parseUsers.find((user) => user.eventi_preferiti);
  console.log(findUser);
  const navTo = useNavigate();
  // ----------------------------------

  const [eventiPreferiti, setEventiPreferiti] = useState(
    findUser ? findUser.eventi_preferiti : []
  );

  function handleRemoveEvento(eventoId) {
    const updatedEventi = eventiPreferiti.filter(
      (evento) => evento.id !== eventoId
    );

    setEventiPreferiti(updatedEventi);

    findUser.eventi_preferiti = updatedEventi;
    localStorage.setItem("users", JSON.stringify(parseUsers));
  }

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

      {eventiPreferiti.length > 0 ? (
        eventiPreferiti.map((evento, index) => (
          <div className="eventi-preferiti" key={evento.id}>
            <div className="utente-titolo">
              <img
                id="post-avatar"
                src={personeRandom[index].img}
                alt="user-icon"
              />
              <div className="post-info-container">
                <div className="post-user-info">
                  <h3>{personeRandom[index].nome}</h3>
                  <h5>Amici</h5>
                  <a>
                    <img
                      id="post-settings-icon"
                      src="\friends-svgrepo-com.svg"
                      alt="post settings"
                    />
                  </a>
                </div>
                <h5>Livello {personeRandom[index].livello}</h5>
              </div>
              <p>{evento.nome_evento}</p>
            </div>
            <div>
              <p>{evento.start}</p>
              <p>{evento.finish}</p>
            </div>

            <div className="info-evento-preferiti">
              <div className="map-preferiti">
                <img
                  src={evento.img}
                  width={150}
                  alt="Mappa"
                  className="mappa"
                />
              </div>
              <div className="box-dati-preferiti">
                <div className="km-preferiti">
                  <img
                    src="src\assets\icons\kilometers.svg"
                    alt="distanza"
                    width={25}
                  />
                  <p>{evento.distanza}</p>
                </div>
                <div className="orario-preferiti">
                  <img
                    src="src\assets\icons\clock.svg"
                    alt="orario"
                    width={25}
                  />
                  <p>{evento.orario}</p>
                </div>
                <div className="data-preferiti">
                  <img
                    src="src\assets\icons\calendar.svg"
                    alt="data"
                    width={25}
                  />
                  <p>{evento.data}</p>
                </div>
              </div>
            </div>
            <div className="btn-eventi-preferiti">
              <button className="btn-facile">Facile</button>
              <button
                onClick={() => handleRemoveEvento(evento.id)}
                className="red-btn"
              >
                Rimuovi
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Non ci sono eventi preferiti</p>
      )}
    </>
  );
}
