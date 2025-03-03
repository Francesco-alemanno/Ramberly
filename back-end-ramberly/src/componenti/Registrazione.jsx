
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";

export function Registrazione() {
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });
const {setUserId}=useUserContext()
  const [message, setMessage] = useState("");

  const navToCaratteristiche = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "password") {
      if (
        value.length < 6 ||
        !/\d/.test(value) ||
        !/[!@#$%^&*()]/.test(value)
      ) {
        setMessage(
          "La password deve contenere almeno sei caratteri di cui almeno un carattere speciale e una lettera maiuscola"
        );
      } else {
        setMessage("");
      }
    }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/registrazione`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
        setUserId(responseData.userId)
      } catch (error) {
        throw new Error(error.message);
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || "Errore durante la registrazione."
        );
      }

      setMessage("Registrazione effettuata con successo");
      setData({
        nome: "",
        cognome: "",
        email: "",
        password: "",
      }); // Reset campi
      navToCaratteristiche("/caratteristiche");
    } catch (error) {
      setMessage(`Registrazione fallita: ${error.message}`);
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

      <form className="form registrazione" onSubmit={handleSubmit}>
        <label htmlFor="Nome">Nome:</label>
        <input
          type="text"
          name="nome"
          id="nome"
          placeholder="Nome..."
          onChange={handleChange}
          value={data.nome}
          required
        />
        <label htmlFor="Cognome">Cognome:</label>
        <input
          type="text"
          name="cognome"
          id="cognome"
          placeholder="Cognome..."
          onChange={handleChange}
          value={data.cognome}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
          onChange={handleChange}
          value={data.email}
          required
        />
        <label htmlFor="Password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password..."
          onChange={handleChange}
          value={data.password}
          required
        />

        {message && <p className="err-msg"> {message}</p>}

        <button
          className="prosegui"
          disabled={message ? true : false}
          type="submit"
        >
          Avanti
        </button>
        <p>
          Hai già un account?{" "}
          <Link to="/login" style={{ color: "#F7A441" }}>
            Login
          </Link>
        </p>
      </form>
      <img
        src="src\assets\loghi\freccia.svg"
        style={{ position: "absolute", top: "695px", zIndex: "-1" }}
        alt="freccia trasparente"
      />
    </div>
  );
}
