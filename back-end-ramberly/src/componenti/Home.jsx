import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";

export function Home() {
  const navTo = useNavigate();

  const { events, user } = useUserContext();
  // partecipatedEvents diventa il nuovo array degli eventi relativo all'utente loggato
  const [partecipatedEvents, setPartecipatedEvents] = useState(
    events.map((evento) => ({
      ...evento,
      partecipa: evento.partecipanti.includes(user.id), // Se l'utente partecipa, true; altrimenti false
    }))
  );
  const [partecipanteNome, setPartecipanteNome] = useState("");

  // logica carosello
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < events.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (direction === "right" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  //INIZIALIZZAZIONE CHIAVE PARTECIPA AD OGNI RENDER DEL COMPONENTE

  useEffect(() => {
    const updatedEvents = events.map((evento) => ({
      ...evento,
      partecipa: evento.partecipanti.includes(user.id),
    }));
    setPartecipatedEvents(updatedEvents);
  }, [events]);

  async function handlePartecipa(idUser, idEvento) {
    const jsonData = JSON.stringify({ id: idUser, event_id: idEvento });

    try {
      const response = await fetch("http://localhost:5001/events", {
        method: "PUT",
        body: jsonData,
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setPartecipatedEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id_evento === idEvento ? { ...event, partecipa: true } : event
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeletePartecipa(idUser, idEvento) {
    const jsonData = JSON.stringify({ id: idUser, event_id: idEvento });
    try {
      const response = await fetch("http://localhost:5001/events", {
        method: "DELETE",
        body: jsonData,
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setPartecipatedEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id_evento === idEvento
              ? { ...event, partecipa: false }
              : event
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // recupero id partecipante evento

  // async function getPartecipanteNome(idPartecipante) {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5001/users/${idPartecipante}`
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data.nome;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // }

  // useEffect(() => {
  //   const fetchPartecipanti = async () => {
  //     const updatedEvents = await Promise.all(
  //       events.map(async (evento) => {
  //         if (evento.partecipanti.length > 0) {
  //           const nome = await getPartecipanteNome(evento.partecipanti[0]);
  //           return { ...evento, partecipanteNome: nome };
  //         }
  //         return evento;
  //       })
  //     );
  //     setPartecipatedEvents(updatedEvents);
  //   };

  //   fetchPartecipanti();
  // }, [events]);

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
            src={user.img}
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
          {partecipatedEvents.map((evento, index) => (
            <div key={index} className="home-slide">
              <div className="home">
                <div className="nav-post">
                  <div className="nav-post-user-info">
                    <img id="post-avatar" src={evento.img} alt="user-icon" />
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
                    <button style={{ backgroundColor: "#0B4C3B" }}>Chat</button>
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
                  <h3>{evento.nome_evento.toUpperCase()}</h3>
                  <div className="start-finish-box">
                    <div className="start-finish">
                      <img src="src/assets/icons/start.svg" alt="start-flag" />
                      <span>START</span>
                      <p>{evento.start}</p>
                    </div>
                    <hr />
                    <div className="start-finish">
                      <img src="src/assets/icons/start.svg" alt="start-flag" />
                      <span>FINISH</span>
                      <p>{evento.finish}</p>
                    </div>
                  </div>
                </div>
                <div className="map-container">
                  <img
                    src={evento.img}
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
                    {evento.partecipanti.length > 0
                      ? `${evento.partecipanteNome} e altri ${
                          evento.partecipanti.length - 1
                        } stanno partecipando!`
                      : "Nessun partecipante"}
                  </span>
                </div>
                <div className="info-percorso">
                  <div className="info-box">
                    <img src="src\assets\icons\kilometers.svg" alt="distanza" />
                    <div className="info-box-text">
                      <h3>{evento.distanza}</h3>
                      <span>km</span>
                    </div>
                  </div>
                  <hr />
                  <div className="info-box">
                    <img src="src\assets\icons\clock.svg" alt="orario" />
                    <div className="info-box-text">
                      <h3>{evento.orario.slice(0, -3)}</h3>
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
          ))}
        </div>
      </div>
      <div className="carousel-dots">
        {events.map((_, index) => (
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
