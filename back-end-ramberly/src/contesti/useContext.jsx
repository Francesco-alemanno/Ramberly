import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { createContext } from "react";
import persone from "../database";
import eventiArr from "../databaseEventi";

export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null); // aggiornamento stato id
  const [userIdLogged, setUserIdLogged] = useState(null);

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const [user, setUser] = useState({});

  const [pers, setPers] = useState(persone);
  // const [eventi, setEventi] = useState(eventiArr);
  const [personeRandom, setPersoneRandom] = useState(() => {
    const data = localStorage.getItem("personeRandom");
    return data ? JSON.parse(data) : [];
  });

  // chiamata fetch
  useEffect(() => {
    const fetchUserLogged = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/home/${userIdLogged}`
        );
        if (!response.ok) throw new Error("Errore nella risposta");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Errore nel fetching dati:", error);
      }
    };
    fetchUserLogged();
  }, [userIdLogged]);

  // logica randomizzazione post utenti home e preferiti

  // useEffect(() => {
  //   localStorage.setItem("eventi", JSON.stringify(eventi));
  //   const events = localStorage.getItem("eventi");
  //   const parseEvents = JSON.parse(events);
  //   const utentiPostCasuali = parseEvents.map(() => {
  //     const indiceCasuale = Math.floor(Math.random() * pers.length);
  //     return pers[indiceCasuale];
  //   });
  //   setPersoneRandom(utentiPostCasuali);
  //   localStorage.setItem("personeRandom", JSON.stringify(utentiPostCasuali));
  // }, []);

  // fetch users dal database
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users`);
      if (!response.ok) {
        throw new Error("Errore nella risposta");
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error({ message: "errore nel fetching", error });
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("users", JSON.stringify(pers));

  //   const users = localStorage.getItem("users");
  //   const parseUsers = JSON.parse(users);

  //   setPers((pre) => [...pre, parseUsers]);
  //   localStorage.setItem("users", JSON.stringify(pers)); //pers è un array non è una persona singola
  // }, []);

  // fetch eventi dal database
  // useEffect(() => {
  //   localStorage.setItem("eventi", JSON.stringify(eventi));
  //   const events = localStorage.getItem("eventi");
  //   const parseEvents = JSON.parse(events);

  //   setEventi((prec) => [...prec, parseEvents]);
  //   localStorage.setItem("eventi", JSON.stringify(eventi));
  // }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5001/events`);
      if (!response.ok) {
        throw new Error("Errore nella risposta");
      }
      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (error) {
      console.error({ message: "errore nel fetching", error });
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <UserContext.Provider
      value={{
        pers,
        personeRandom,
        setUserId,
        userId,
        userIdLogged,
        setUserIdLogged,

        users,
        events,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
