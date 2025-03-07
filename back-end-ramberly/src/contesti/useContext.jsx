import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null); // aggiornamento stato id

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const [user, setUser] = useState({});

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

  return (
    <UserContext.Provider
      value={{
        setUserId,
        userId,
        users,
        events,
        user,
        fetchUserLogged,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
