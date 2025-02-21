import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contesti/useContext";

export function Registrazione() {
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });
  const [errore, setErrore] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const { setIsLogged } = useContext(UserContext);

  setIsLogged(true);

  const navToCaratteristiche = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "password") {
      if (
        value.length < 6 ||
        !/\d/.test(value) ||
        !/[!@#$%^&*()]/.test(value)
      ) {
        setErrore(
          "La password deve contenere almeno sei caratteri di cui almeno un carattere speciale e una lettera maiuscola"
        );
      } else {
        setErrore("");
      }
    }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errore) return;

    const existData = localStorage.getItem("users");
    let utentiRegistrati = [];

    if (existData) {
      utentiRegistrati = JSON.parse(existData);
    }

    const existEmail = utentiRegistrati.some((x) => x.email === data.email);

    if (existEmail) {
      setErrorEmail("Email già registrata");
      return;
    }

    const newIdUser = {
      ...data,
      id: utentiRegistrati.length + 1,
    };

    localStorage.setItem("user", JSON.stringify(data));

    localStorage.setItem("users", JSON.stringify(utentiRegistrati));

    setData({
      nome: "",
      cognome: "",
      email: "",
      password: "",
    });

    navToCaratteristiche("/caratteristiche");
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
        {errore && <p className="err-msg"> {errore}</p>}
        {errorEmail && <p className="err-msg"> {errorEmail}</p>}
        <button
          className="prosegui"
          disabled={errore ? true : false}
          type="submit"
        >
          Avanti
        </button>
        <p>
          Hai già un account? <Link to="/login" style={{color:'#F7A441'}}>Login</Link>
        </p>
      </form>
      <img src="src\assets\loghi\freccia.svg" style={{position:'absolute', top:'695px', zIndex:'-1'}} alt="freccia trasparente" />
    </div>
  );
}
