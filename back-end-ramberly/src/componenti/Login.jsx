import { useState } from "react";
import { useUserContext } from "../contesti/useContext";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const { fetchUserLogged } = useUserContext();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [messaggio, setMessaggio] = useState("");

  const navToDashboard = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let responseData;
      try {
        responseData = await response.json();

        const { token } = responseData; // Il backend restituisce il token
        sessionStorage.setItem("token", token); // Salva il token
        await fetchUserLogged();
      } catch (error) {
        throw new Error(error.message);
      }
      if (!response.ok) {
        setMessaggio("credenziali errate o utente non esistente");
      } else {
        setMessaggio("login effettuato con successo");
        navToDashboard("/home");
      }
    } catch (error) {
      setMessaggio(error.message);
    }
  };

  return (
    <div className="main-container">
      <img
        className="logo-img"
        src="src\assets\loghi\logo.svg"
        width={250}
        alt="logo ramberly"
      />
      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="">Email:</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Inserisci la tua Email..."
          required
        />
        <label htmlFor="">Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Inserisci la tua Password..."
          required
        />

        <button type="submit">Login</button>
        <p>
          Non sei registrato?{" "}
          <Link to="/registrazione" style={{ color: "#F7A441" }}>
            Registrati
          </Link>
        </p>
        {messaggio && (
          <p className="err-msg" style={{ textAlign: "center" }}>
            {messaggio}
          </p>
        )}
      </form>
      <img src="src\assets\loghi\freccia.svg" alt="freccia" />
    </div>
  );
}
