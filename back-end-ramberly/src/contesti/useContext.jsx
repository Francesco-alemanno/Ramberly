import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import persone from "../database";
import eventiArr from "../databaseEventi";

export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null); // aggiornamento stato id
  const [userIdLogged, setUserIdLogged] = useState(null);

  const [userLogged, setUserLogged] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });
  const [isLogged, setIsLogged] = useState(false);
  const [pers, setPers] = useState(persone);
  const [eventi, setEventi] = useState(eventiArr);
  const [personeRandom, setPersoneRandom] = useState(() => {
    const data = localStorage.getItem("personeRandom");
    return data ? JSON.parse(data) : [];
  });

  // logica randomizzazione post utenti home e preferiti

  useEffect(() => {
    localStorage.setItem("eventi", JSON.stringify(eventi));
    const events = localStorage.getItem("eventi");
    const parseEvents = JSON.parse(events);
    const utentiPostCasuali = parseEvents.map(() => {
      const indiceCasuale = Math.floor(Math.random() * pers.length);
      return pers[indiceCasuale];
    });
    setPersoneRandom(utentiPostCasuali);
    localStorage.setItem("personeRandom", JSON.stringify(utentiPostCasuali));
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(pers));

    const users = localStorage.getItem("users");
    const parseUsers = JSON.parse(users);

    setPers((pre) => [...pre, parseUsers]);
    localStorage.setItem("users", JSON.stringify(pers)); //pers è un array non è una persona singola
  }, []);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUserLogged(user);
    setIsLogged(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUserLogged(null);
    setIsLogged(false);
  };

  useEffect(() => {
    localStorage.setItem("eventi", JSON.stringify(eventi));
    const events = localStorage.getItem("eventi");
    const parseEvents = JSON.parse(events);

    setEventi((prec) => [...prec, parseEvents]);
    localStorage.setItem("eventi", JSON.stringify(eventi));
  }, []);

  return (
    <UserContext.Provider
      value={{
        login,
        logout,
        userLogged,
        isLogged,
        setIsLogged,
        pers,
        personeRandom,
        setUserId,
        userId,
        userIdLogged,
        setUserIdLogged,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
