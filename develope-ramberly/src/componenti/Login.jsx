import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../contesti/useContext";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [messaggio, setMessaggio] = useState("");
  const { login } = useContext(UserContext);

  const navToDashboard = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = (event) => {
    event.preventDefault();
    const users = localStorage.getItem("users");
    const parseUsers = JSON.parse(users);
    const userExist = parseUsers.find(
      (x) => x.email === data.email && x.password === data.password
    );

    if (userExist) {
      setMessaggio("login effettuato con successo");
      login(userExist);
      navToDashboard("/home");
    } else {
      setMessaggio("credenziali errate");
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
          Non sei registrato? <Link to="/registrazione" style={{color:'#F7A441'}} >Registrati</Link>
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
