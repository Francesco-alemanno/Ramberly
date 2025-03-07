import { db } from "../initDB.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET = "" } = process.env;

export const registrazione = async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  const userExist = await db.oneOrNone(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userExist) {
    res.status(409).json({ message: "L'utente è già registrato" });
  } else {
    try {
      const user = await db.one(
        `INSERT INTO users (nome, cognome, email, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id`,
        [nome, cognome, email, password]
      );

      res
        .status(201)
        .json({ message: "Utente creato con successo", userId: user.id });
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      res.status(500).json({ message: "Errore durante la registrazione" });
    }
  }
};

export const aggiornaCaratteristiche = async (req, res) => {
  const { sesso, peso, eta, attivita, monitoraggio, gruppo, sfide } = req.body;
  const { userId } = req.params;

  try {
    await db.none(
      `UPDATE users 
       SET sesso=$1, peso=$2, eta=$3, attivita=$4, monitoraggio=$5, gruppo=$6, sfide=$7 
       WHERE id=$8`,
      [sesso, peso, eta, attivita, monitoraggio, gruppo, sfide, userId]
    );

    res.status(200).json({ message: "Dati aggiornati con successo" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};

export const sportPreferito = async (req, res) => {
  const { running, escursione, biking, camminata } = req.body;
  const { userId } = req.params;

  try {
    await db.none(
      `UPDATE users 
       SET running=$1, escursione=$2, biking=$3, camminata=$4
       WHERE id=$5`,
      [running, escursione, biking, camminata, userId]
    );

    res.status(200).json({ message: "Dati aggiornati con successo" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dei dati" });
  }
};

export const scegliAvatar = async (req, res) => {
  const { userId } = req.params;
  const { img } = req.body;

  try {
    await db.none(
      `UPDATE users 
       SET img=$1
       WHERE id=$2`,
      [img, userId]
    );

    res.status(200).json({ message: "Avatar aggiornato con successo" });
  } catch (error) {
    console.error("Errore aggiornamento avatar:", error);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dell'avatar." });
  }
};

// flusso login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (!user && !user.password === password) {
      return res
        .status(400)
        .json({ message: "credenziali errate o user non esistente" });
    } else {
      const payload = { id: user.id, email };
      const token = jwt.sign(payload, SECRET);
      await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
      res.status(200).json({ id: user.id, email, token });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//flusso home
export const getLoggedUser = async (req, res) => {
  try {
    const userId = req.user.id; // Ottieni l'ID utente dal token
    const userLogged = await db.oneOrNone(
      "SELECT id, nome, email, img, livello, sesso, peso, eta, attivita, monitoraggio, gruppo, sfide e FROM users WHERE id = $1",
      [userId]
    );
    if (userLogged) {
      return res.status(200).json(userLogged);
    }
    return res.status(404).json({ message: "utente non trovato" });
  } catch (error) {
    res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.many(`SELECT * FROM users`);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await db.many(`SELECT * FROM eventi`);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "errore nella richiesta", error });
  }
};

export const updateEventUser = async (req, res) => {
  const { id, event_id } = req.body;
  console.log("id", id, "event", event_id);
  try {
    const partecipantiEvento = await db.manyOrNone(
      `SELECT partecipanti FROM eventi WHERE id_evento=$1`,
      [event_id]
    );
    const exist = partecipantiEvento[0].partecipanti.some((x) => x === id);
    if (exist) {
      return res.status(409).json({ message: `Utente gia partecipa` });
    }
    console.log(partecipantiEvento[0].partecipanti);

    partecipantiEvento[0].partecipanti.push(id);
    await db.none(`UPDATE eventi  SET partecipanti=$1  WHERE id_evento=$2`, [
      partecipantiEvento[0].partecipanti,
      event_id,
    ]);
    return res.status(200).json({ message: `utente aggiunto correttamente` });
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const deleteEventUser = async (req, res) => {
  const { id, event_id } = req.body;
  try {
    await db.none(
      `UPDATE eventi  SET partecipanti=array_remove(partecipanti, $1)  WHERE id_evento=$2`,
      [id, event_id]
    );

    return res.status(200).json({ message: `eliminato con successo` });
  } catch (error) {
    return res.status(500).json({ message: `errore nella richiesta`, error });
  }
};

export const logout = async (req, res) => {
  const user = req.user;
  try {
    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user?.id, null]);
    res.status(200).json({ message: "logout successfull" });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
