import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";

export function Home() {
  const navTo = useNavigate();

  const [eventParticipants, setEventParticipants] = useState({});

  const {
    user,
    fetchEventParticipants,
    participatedEvents,
    handleDeletePartecipa,
    handlePartecipa,
    avatar,
    eventsAvatar,
    fetchAllEvents,
  } = useUserContext();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // logica carosello
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < participatedEvents.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (direction === "right" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // ad ogni cambiamento degli eventi relativo all'utente loggato, viene creato un oggetto che contiene come chiavi gli id degli eventi e come valori un array con i nomi dei partecipanti
  useEffect(() => {
    async function loadPartecipanti() {
      const partecipantiMap = {};

      for (const evento of participatedEvents) {
        const nomi = await fetchEventParticipants(evento.id_evento);
        partecipantiMap[evento.id_evento] = nomi;
      }
      setEventParticipants(partecipantiMap);
    }
    loadPartecipanti();
  }, [participatedEvents]);
  useEffect(() => {}, [participatedEvents]);

  return (
    <div className="home-container">
      <div className="nav-top-home">
        <div style={{ marginLeft: "10px" }}>
          <img src="src/assets/loghi/logo.svg" width={70} alt="" />
        </div>
        <div className="nav-top-home-info">
          <div>
            <h3>{user.nome}</h3>
            <h5>Livello {user.livello}</h5>
          </div>
          <img
            id="home-user-avatar"
            src={avatar}
            alt="user-icon"
            onClick={() => navTo("/account")}
          />
        </div>
      </div>
      <div className="home-wrapper" {...handlers}>
        <div
          className="home-carousel"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {participatedEvents.map((evento, index) => {
            const eventoAvatar = eventsAvatar?.find(
              (e) => e.id_evento === evento.id_evento
            );

            return (
              <div key={index} className="home-slide">
                <div className="home">
                  <div className="nav-post">
                    <div className="nav-post-user-info">
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
                          <h5 style={{ color: "#f7a441" }}>Amici</h5>
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
                    </div>
                    <div className="icons-container">
                      <button style={{ backgroundColor: "#0B4C3B" }}>
                        Chat
                      </button>
                      <a>
                        <img
                          id="post-settings-icon"
                          src="\dots-horizontal-svgrepo-com.svg"
                          alt="post settings"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="descrizione-evento">
                    <h3>{evento.nome_evento}</h3>
                    <div className="start-finish-box">
                      <div className="start-finish">
                        <img
                          src="src/assets/icons/start.svg"
                          alt="start-flag"
                        />
                        <span>START</span>
                        <p>{evento.start}</p>
                      </div>
                      <hr />
                      <div className="start-finish">
                        <img
                          src="src/assets/icons/start.svg"
                          alt="start-flag"
                        />
                        <span>FINISH</span>
                        <p>{evento.finish}</p>
                      </div>
                    </div>
                  </div>
                  <div className="map-container">
                    <img
                      src={
                        evento.map_img_base64
                          ? `data:image/png;base64,${evento.map_img_base64}`
                          : "src/assets/placeholder.png"
                      }
                      width={290}
                      alt="Mappa"
                      className="mappa"
                    />
                  </div>
                  <div className="container-partecipanti">
                    <button className="red-btn">Difficile</button>
                    <div className="icons-partecipanti">
                      <img
                        src="src\assets\icons\partecipanti.svg"
                        width={70}
                        alt="partecipanti"
                      />
                    </div>
                    <span style={{ fontSize: 12 }}>
                      {eventParticipants[evento.id_evento]?.length > 0
                        ? `${eventParticipants[evento.id_evento][0]} e altri ${
                            eventParticipants[evento.id_evento].length - 1
                          } stanno partecipando!`
                        : "Nessun partecipante"}
                    </span>
                  </div>
                  <div className="info-percorso">
                    <div className="info-box">
                      <img
                        src="src\assets\icons\kilometers.svg"
                        alt="distanza"
                      />
                      <div className="info-box-text">
                        <h3>{evento.distanza}</h3>
                        <span>km</span>
                      </div>
                    </div>
                    <hr />
                    <div className="info-box">
                      <img src="src\assets\icons\clock.svg" alt="orario" />
                      <div className="info-box-text">
                        <h3>
                          {(evento.orario && evento.orario.slice(0, 5)) ||
                            "--:--"}
                        </h3>
                        <span>hr</span>
                      </div>
                    </div>
                    <hr />
                    <div className="info-box">
                      <img src="/src/assets/icons/calendar.svg" alt="data" />
                      <div className="info-box-text">
                        <h3>{new Date(evento.data).toLocaleDateString()}</h3>{" "}
                        {/*Riconvertiamo in sola data*/}
                        <span>data</span>
                      </div>
                    </div>
                  </div>
                  {!evento.partecipa ? (
                    <button
                      onClick={() => handlePartecipa(user.id, evento.id_evento)}
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      Partecipa!
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleDeletePartecipa(user.id, evento.id_evento)
                      }
                      style={{
                        fontSize: "18px",
                        backgroundColor: "red",
                        color: "white",
                      }}
                    >
                      Abbandona
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="carousel-dots">
        {participatedEvents.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* ------------------------------------ */}

      <navbar className="nav-bottom-home">
        <a>
          <img
            onClick={() => navTo("/impostazioni")}
            src="src\assets\navbar\impostazioni.svg"
            alt="impostazioni"
          />
        </a>

        <a>
          <img
            src="src\assets\navbar\preferiti.svg"
            alt="preferiti"
            onClick={() => navTo("/eventipreferiti")}
          />
        </a>
        <a id="nav-bottom-home-addEvent" onClick={() => navTo("/creaevento")}>
          <img src="src\assets\navbar\addEvent.svg" alt="addEvent" />
        </a>
        <a onClick={() => navTo("/account")}>
          <img
            src="src/assets/navbar/utente.svg"
            width={48}
            alt="logo-utente"
          />
        </a>
        <a>
          <img src="src/assets/navbar/cerca.svg" width={48} alt="logo-utente" />
        </a>
      </navbar>
    </div>
  );
}
