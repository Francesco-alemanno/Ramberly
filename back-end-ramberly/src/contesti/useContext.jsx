import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { getEventsAvatar } from "../server/controllers/controllers";


export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null); // aggiornamento stato id
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState(
    events.map((evento) => ({
      ...evento,
      partecipa: evento.partecipanti.includes(user.id), // Se l'utente partecipa, true; altrimenti false
    }))
  );
  const [avatar, setAvatar] = useState(null);
  const [eventsAvatar, setEventsAvatar] = useState();
  const [usersAvatar, setUsersAvatar] = useState();

  useEffect(() => {
    const updatedEvents = events.map((evento) => ({
      ...evento,
      partecipa: evento.partecipanti.includes(user.id),
    }));
    setParticipatedEvents(updatedEvents);
  }, [events]);

  // fetch login utente
  const fetchUserLogged = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5001/home", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Passa il token nel header
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero utente");

      const userData = await response.json();
      setUser(userData); // Salva l'utente nello stato globale
    } catch (error) {
      console.error("Errore nel fetching dati:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchUserLogged(); // Se c'è un token, carica i dati dell'utente
    }
  }, []);

  useEffect(() => {
    async function fetchAvatar(userId) {
      try {
        const response = await fetch(`http://localhost:5001/avatar/${userId}`);
        const data = await response.json();

        if (data.img) {
          setAvatar(data.img);
        }
      } catch (error) {
        console.error("Errore nel recupero dell'avatar:", error);
      }
    }
    if (user?.id) {
      fetchAvatar(user.id);
    }
  }, [user]);

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

  //fetch avatar di tutti gli utenti dal database
  useEffect(() => {
    async function getUsersAvatar() {
      try {
        const response = await fetch("http://localhost:5001/usersAvatar");
        if (response.ok) {
          const responseData = await response.json();
          setUsersAvatar(responseData);
        } else {
          throw new Error("Errore nel recupero degli Avatar degli utenti");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUsersAvatar();
  }, []);

  // fetch utenti dal database
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

  // fetch nomi utenti partecipanti per evento
  const fetchEventParticipants = async (idEvento) => {
    try {
      const response = await fetch(`http://localhost:5001/events/${idEvento}`);
      if (!response.ok) {
        throw new Error("Errore nel recupero partecipanti");
      }
      const data = await response.json();
      return data.map((partecipante) => partecipante.nome);
    } catch (error) {
      console.error({ message: "errore nel fetching", error });
    }
  };
  // funzioni di aggiunta e rimozione eventi preferiti
  async function handlePartecipa(idUser, idEvento) {
    const jsonData = JSON.stringify({ id: idUser, event_id: idEvento });

    try {
      const response = await fetch("http://localhost:5001/events", {
        method: "PUT",
        body: jsonData,
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setParticipatedEvents((prevEvents) =>
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
        setParticipatedEvents((prevEvents) =>
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

  useEffect(() => {
    async function getEventsAvatars() {
      try {
        const response = await fetch("http://localhost:5001/eventsAvatar");
        if (response.ok) {
          const responseData = await response.json();
          setEventsAvatar(responseData);
        } else {
          throw new Error("Errore nel recupero degli Avatar degli eventi");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getEventsAvatars();
  }, []);

  return (
    <UserContext.Provider
      value={{
        setUserId,
        userId,
        users,
        events,
        user,
        fetchUserLogged,
        fetchEventParticipants,
        handleDeletePartecipa,
        handlePartecipa,
        participatedEvents,
        avatar,
        setParticipatedEvents,
        eventsAvatar,
        usersAvatar,
        fetchAllEvents,
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
