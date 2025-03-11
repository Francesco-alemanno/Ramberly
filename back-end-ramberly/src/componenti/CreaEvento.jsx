import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MapComponent } from "./MapComponent";
import { useUserContext } from "../contesti/useContext";

export function CreaEvento() {
  const {
    setSuggestions,
    setSuggestionsR,
    clickMap,
    mapRef,
    suggestionsR,
    destination,
    markerR,
    handleSearchR,
    mapContainerRef,
    userLocation,
    marker,
    distance,
    searchQuery,
    searchQueryR,
    setSearchQueryR,
    setSearchQuery,
    suggestions,
    handleMapClick,
    handleSearch,
    handleResetPosition,
    takeScreenshot,
    handleSuggestionSelectR,
    handleSuggestionSelect,
    handleInputChange,
    handleInputChangeR,
    calculateRoute,
    position,
  } = MapComponent();
  const { user, setParticipatedEvents } = useUserContext();
  const [data, setData] = useState({
    nome_evento: "",
    start: "",
    finish: "",
    distanza: "",
    orario: "",
    data: "",
    img: "",
    partecipanti: [],
  });

  const inputRef = useRef(""); // Riferimento all'input

  useEffect(() => {
    if (searchQueryR) {
      setData((prevData) => ({
        ...prevData,
        finish: searchQueryR,
      }));
    }
  }, [searchQueryR]);

  const cerca = () => {
    setTimeout(() => {
      setSuggestions([]);
      setSuggestionsR([]);
    }, 100);
  };

  useEffect(() => {
    if (searchQuery) {
      setData((prevData) => ({
        ...prevData,
        start: searchQuery,
      }));
    }
  }, [searchQuery]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const navTo = useNavigate();

  const userId = user.id;
  const handleSubmitEvent = async (event) => {
    event.preventDefault();

    try {
      const screenshotUrl = await takeScreenshot();

      if (!screenshotUrl) {
        throw new Error("Screenshot non acquisito");
      }

      const newData = {
        ...data,
        id_creatore: user.id,
        distanza: distance,
        map_img: screenshotUrl,
        partecipa: false,
      };

      const response = await fetch(`http://localhost:5001/events/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error("Errore durante la creazione dell'evento");
      }

      console.log("Dati salvati con successo!");
      const updatedEventsResponse = await fetch("http://localhost:5001/events");
      if (!updatedEventsResponse.ok) {
        throw new Error("Errore nel recupero degli eventi aggiornati");
      }

      const updatedEvents = await updatedEventsResponse.json();
      setParticipatedEvents((prevData) => [...prevData, updatedEvents]);

      navTo("/home");
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  };

  return (
    <div>
      <div className="caratteristiche">
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

        <h3 className="link-h3-class">Crea il tuo evento!</h3>
      </div>

      {/* ------------------------------------ */}

      <form className="crea-evento-box" onSubmit={handleSubmitEvent}>
        <div className="cerca-evento"></div>

        {/* ----------------------- */}
        <div className="map-container">
          <div className="map">
            <div>
              <div className="search-location">
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="">Start:</label>
                    <input
                      type="text"
                      placeholder="Luogo Partenza..."
                      name="start"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleInputChange();
                        handleChange(e);
                      }}
                      required
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list suggestions-start ">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              handleSuggestionSelect(suggestion);
                              setSuggestions([]); // Nasconde la lista dopo la selezione
                            }}
                          >
                            {suggestion.place_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="">Finish:</label>
                    <input
                      type="text"
                      placeholder="Luogo arrivo..."
                      name="finish"
                      ref={inputRef}
                      value={searchQueryR}
                      onChange={(e) => {
                        setSearchQueryR(e.target.value);
                        handleInputChangeR();
                        handleChange(e);
                      }}
                      required
                    />
                    {suggestionsR.length > 0 && (
                      <ul className="suggestions-list suggestions-finish">
                        {suggestionsR.map((suggestionR, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              handleSuggestionSelectR(suggestionR);
                              setSuggestionsR([]);
                            }}
                          >
                            {suggestionR.place_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="eventName">
                  <label htmlFor="">Nome evento:</label>
                  <input
                    type="text"
                    name="nome_evento"
                    onChange={handleChange}
                    placeholder="Inserisci nome evento"
                    required
                  />
                </div>
                <button
                  className="btn-search"
                  type="button"
                  onClick={() => {
                    cerca();
                    calculateRoute();
                    handleSearch();
                    handleSearchR();
                  }}
                >
                  Cerca
                </button>
                {/* Mostriamo i suggerimenti sotto il campo di ricerca */}
              </div>

              {userLocation ? (
                <div
                  id="map-box"
                  ref={mapContainerRef}
                  style={{ width: "100%", height: "500px" }}
                />
              ) : (
                <p>Loading map...</p>
              )}
              <div className="maps-button">
                <button
                  className="map-reset-btm"
                  type="button"
                  onClick={handleResetPosition}
                >
                  Reset Position
                </button>
                <button
                  type="button"
                  className="map-add-marker-btm"
                  onClick={() => mapRef.current.on("click", clickMap)}
                >
                  Add Marker
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="event-form">
          <div className="event-details">
            <div className="event-items">
              <label>
                <img
                  className="event-icon"
                  src="src\assets\icons\kilometers.svg"
                  alt="distanza"
                />
                Distanza:
              </label>

              {distance ? <p>{distance}</p> : <p>Inserisci una destinazione</p>}
            </div>

            <div className="event-items">
              <label>
                <img
                  className="event-icon"
                  src="src\assets\icons\clock.svg"
                  alt="orario"
                />
                Orario:
              </label>
              <input
                type="time"
                name="orario"
                onChange={handleChange}
                required
              />
            </div>

            <div className="event-items">
              <label>
                <img
                  className="event-icon"
                  src="/src/assets/icons/calendar.svg"
                  alt="data"
                />
                Data:
              </label>
              <input type="date" name="data" onChange={handleChange} required />
            </div>
          </div>
        </div>
        {/* ------------------------------------ */}

        <div className="event-privacy">
          <label htmlFor="" className="privacy-label">
            Chi può partecipare
          </label>
          <select
            name="partecipanti"
            className="privacy-select"
            onChange={handleChange}
          >
            <option value="solo-amici">Solo amici</option>
            <option value="pubblico">Pubblico</option>
            <option value="privato">Privato</option>
          </select>
        </div>
        {/* ------------------------------------ */}

        <button type="submit" className="prosegui">
          Pubblica evento!
        </button>
      </form>
    </div>
  );
}
